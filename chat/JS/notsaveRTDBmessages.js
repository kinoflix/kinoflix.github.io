async function submitMessage(isDMContext) {
    const textInput = isDMContext ? privateInputField : messageInputField;
    const fileInput = isDMContext ? privateFileInput : chatFileInput;
    const text = textInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) return;

    // Şəxsi çatda: qarşı tərəf bizi ignor etdisə göndərməyi blokla
    if (isDMContext) {
        const targetUserId = activeRoomId.split('_').find(id => id !== currentUser.uid);
        if (targetUserId) {
            try {
                const theirIgnoreDoc = await getDoc(doc(db, 'ignore_lists', targetUserId));
                if (theirIgnoreDoc.exists()) {
                    const theirIgnored = theirIgnoreDoc.data().ignored || [];
                    if (theirIgnored.includes(currentUser.uid)) {
                        showToast("Bu şəxs tərəfindən ignor edildiniz.", "error");
                        return;
                    }
                }
            } catch (e) { /* Firestore rules səbəbindən oxuna bilməsə keç */ }
        }
    }

    textInput.value = ''; fileInput.value = '';
    // Fayl önizləmə barını sıfırla
    const previewBar = isDMContext ? document.getElementById('privateFilePreviewBar') : document.getElementById('chatFilePreviewBar');
    const nameSpan = isDMContext ? document.getElementById('privateFileNameDisplay') : document.getElementById('chatFileNameDisplay');
    if (previewBar) { previewBar.classList.add('hidden'); }
    if (nameSpan) { nameSpan.textContent = ''; }

    let fileURL = null; let fileType = null;
    if (file) {
        try { fileURL = await uploadImageToImgBB(file); fileType = file.type; } 
        catch (err) { showToast(err.message, "error"); return; }
    }

    try {
        // Mesaj RTDB-yə yazılmasın (const docRef sətrini tam sil) : await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
            const docRef = await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
            senderId: currentUser.uid, senderName: currentUserData.displayName || 'Anonim',
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR, text: text,
            fileURL: fileURL, fileType: fileType, createdAt: serverTimestamp()
        });

      // 📨 Mesajı RTDB-yə yazan kodlar: 📨
        try {
            // Əgər DM (şəxsi) çattdırsa private qovluğuna, deyilsə global qovluğuna yazır
            const rtdbPath = isDMContext 
                ? `messages/private/${activeRoomId}/${docRef.id}` 
                : `messages/global/${docRef.id}`;

            await set(ref(rtdb, rtdbPath), {
                senderId: currentUser.uid,
                senderName: currentUserData.displayName || 'Anonim',
                senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
                text: text,
                fileURL: fileURL,
                fileType: fileType,
                // RTDB üçün import etdiyimiz 'rtdbTimestamp' funksiyasından istifadə edirik
                createdAt: rtdbTimestamp() 
            });
        } catch (rtdbErr) {
            console.error("Mesaj RTDB-yə sinxronizasiya oluna bilmədi:", rtdbErr);
        }
        // 📨 Mesajı RTDB-yə yazan kodlar-Son 📨

        if (isDMContext) {
            const targetUserId = activeRoomId.split('_').find(id => id !== currentUser.uid);
            await setDoc(doc(db, 'rooms', activeRoomId), { 
                lastMessageAt: serverTimestamp(), [`unread_${targetUserId}`]: increment(1)
            }, { merge: true });
        } else {
            await setDoc(doc(db, 'rooms', 'global_room'), { lastMessageAt: serverTimestamp() }, { merge: true });
        }
     } catch (err) { 
        if (err.code === 'permission-denied') {
            // 1. Sərt alert yerinə yumşaq toast bildirişi göstəririk (Kodu dondurmur)
            showToast("Bu əməliyyat üçün icazəniz yoxdur. Hesabınız silinib!", "error");
            
            // 2. Auth silinmə dərhal arxa fonda başlayır
            auth.currentUser.delete().catch(() => {});
            
            // 3. 1.5 saniyə (1500 milisaniyə) gözləyirik ki, istifadəçi toast bildirişini oxuya bilsin,
            // sonra səhifəni avtomatik yeniləyib onu qovuruq (Heç bir OK düyməsinə ehtiyac qalmır)
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            return;
        }
        showToast("Mesaj göndərilərkən xəta: " + err.message, "error"); 
    }
}
