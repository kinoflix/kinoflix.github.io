/* ==========================================================================
 20. GHOST HESAB TƏMİZLƏMƏ (Heartbeat sistemi)
 ========================================================================== */
(function () {
    const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000;
    const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
    const STALE_THRESHOLD_MS = 6 * 60 * 1000;
    const FIRST_HEARTBEAT_DELAY_MS = 3 * 1000;
    const FIRST_SWEEP_DELAY_MS = 20 * 1000;

    let sweepRunning = false;

    function sendHeartbeat() {
        if (!currentUser) return;
        set(ref(rtdb, `heartbeats/${currentUser.uid}`), rtdbTimestamp())
            .catch((err) => console.error('[heartbeat] XƏTA:', err.code || err.message));
    }
    setTimeout(sendHeartbeat, FIRST_HEARTBEAT_DELAY_MS);
    setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    window.__debugSendHeartbeat = sendHeartbeat;

    function readOnce(path) {
        return new Promise((resolve, reject) => {
            onValue(ref(rtdb, path), (snap) => resolve(snap.val() || {}), (err) => reject(err), { onlyOnce: true });
        });
    }

    async function sweepGhostAccounts() {
        if (!currentUser || !currentUserData) return;
        if (getRoleLevel(currentUserData.role) < 3) return;
        if (sweepRunning) return;
        sweepRunning = true;

        try {
            const presenceData = await readOnce('presence');
            const heartbeatData = await readOnce('heartbeats');
            const now = Date.now();

            for (const uid of Object.keys(presenceData)) {
                const p = presenceData[uid];
                const lastBeat = heartbeatData[uid];
                if (!p || (p.status !== 'online' && p.status !== 'away')) continue;
                if (!lastBeat) continue;
                if (now - lastBeat > STALE_THRESHOLD_MS) {
                    set(ref(rtdb, `presence/${uid}`), {
                        status: 'offline',
                        lastChanged: rtdbTimestamp(),
                        typingTo: null
                    }).catch((err) => console.error('[ghost-sweep] yazış xətası:', uid, err.code || err.message));
                }
            }
        } catch (e) {
            console.error('[ghost-sweep] XƏTA:', e.code || e.message);
        } finally {
            sweepRunning = false;
        }
    }

    setTimeout(sweepGhostAccounts, FIRST_SWEEP_DELAY_MS);
    setInterval(sweepGhostAccounts, SWEEP_INTERVAL_MS);
    window.__debugGhostSweep = sweepGhostAccounts;

    let banWatcherActive = false;
    function startBanWatcher() {
        if (banWatcherActive) return;
        if (!currentUser || !currentUserData) return;
        if (getRoleLevel(currentUserData.role) < 3) return;
        banWatcherActive = true;

        onSnapshot(query(collection(db, 'users'), where('isBanned', '==', true)), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type !== 'added') return;
                const uid = change.doc.id;
                set(ref(rtdb, `presence/${uid}`), {
                    status: 'offline',
                    lastChanged: rtdbTimestamp(),
                    typingTo: null
                }).catch((err) => console.error('[ban-watcher] yazış xətası:', uid, err.code || err.message));
            });
        }, (err) => console.error('[ban-watcher] dinləmə xətası:', err.code || err.message));
    }

    const banWatcherInit = setInterval(() => {
        if (currentUser && currentUserData) { startBanWatcher(); if (banWatcherActive) clearInterval(banWatcherInit); }
    }, 3000);
})();
