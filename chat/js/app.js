/* ==========================================================================
 1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
 ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile,
    deleteUser 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, collection, addDoc, query, 
    orderBy, limit, onSnapshot, serverTimestamp, deleteDoc,
    where, getDocs, increment, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
    getDatabase, ref, set, onValue, onDisconnect, serverTimestamp as rtdbTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { firebaseConfig } from "./config.js";

// İnfrastrukturun başladılması
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const IMGBB_API_KEY = "5437281cb3fb0c2e28ca265eefa6eaf7";
const DEFAULT_AVATAR = "https://kinoflix.github.io/chat/img/avatar.jpg";

/* ==========================================================================
 2. QLOBAL DƏYİŞƏNLƏR VƏ DOM ELEMENTLƏRİ
 ========================================================================== */
let currentUser = null;
let currentUserData = { role: 'user', displayName: '', photoURL: DEFAULT_AVATAR, isBanned: false };
let activeRoomId = 'global_room';
let activeRoomIsDM = false;

// Canlı dinləyicilərin (Unsubscribe) idarəetmə dəyişənləri
let unsubscribeGeneralMessages = null;
let unsubscribePrivateMessages = null;
let unsubscribeUsers = null;
let unsubscribeRooms = null;
let unsubscribeTyping = null;
let unsubscribeSelfDestruct = null;
let typingTimeout = null;

let currentUsersList = [];
let currentStatuses = {};
let currentRooms = {};
let userRolesMap = {};

// DOM Elementləri
const authScreen = document.getElementById('authScreen');
const chatScreen = document.getElementById('chatScreen');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');

const logoutBtn = document.getElementById('logoutBtn');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsModal = document.getElementById('settingsModal');
const profileSettingsForm = document.getElementById('profileSettingsForm');

const usersSidebar = document.getElementById('usersSidebar');
const mobileUsersToggleBtn = document.getElementById('mobileUsersToggleBtn');

const usersList = document.getElementById('usersList');
const btnGlobalRoom = document.getElementById('btnGlobalRoom');
const themeToggle = document.getElementById('themeToggle');
const siteLogo = document.getElementById('siteLogo');

// Məqsədli Çat Sahələri DOM-ları
const generalChatArea = document.getElementById('generalChatArea');
const chatMessagesArea = document.getElementById('chatMessagesArea'); // Ümumi mesajlar
const messageInputField = document.getElementById('messageInputField');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatFileInput = document.getElementById('chatFileInput');

const privateChatArea = document.getElementById('privateChatArea'); // Əvəzləyici Layer
const privateChatHeader = document.getElementById('privateChatHeader');
const privateRoomTitle = document.getElementById('privateRoomTitle');
const privateMessagesArea = document.getElementById('privateMessagesArea'); // Şəxsi mesajlar
const privateInputField = document.getElementById('privateInputField');
const sendPrivateMessageBtn = document.getElementById('sendPrivateMessageBtn');
const privateFileInput = document.getElementById('privateFileInput');

const getRoleLevel = (role) => {
    if (role === 'super_admin') return 4;
    if (role === 'admin') return 3;
    if (role === 'moderator') return 2;
    return 1;
};

function getRoleStarsHtml(role) {
    let starCount = 0;
    if (role === 'super_admin') starCount = 3;
    else if (role === 'admin') starCount = 2;
    else if (role === 'moderator') starCount = 1;
    if (starCount === 0) return '';
    let starsHtml = '';
    for (let i = 0; i < starCount; i++) {
        starsHtml += `<i class="fa-solid fa-star" style="color: #f1c40f; font-size: 11px; margin-left: 4px;" title="${role}"></i>`;
    }
    return starsHtml;
}

/* ==========================================================================
 2B. MÜASİR AZƏRBAYCAN DİLİNDƏ TOAST BİLDİRİŞ SİSTEMİ (Modern Alert UI)
 ========================================================================== */
function showToast(message, type = 'info') {
    if (!document.getElementById('flix-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'flix-toast-styles';
        style.innerHTML = `
            .flix-toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
            .flix-toast { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); color: #1a1a1a; padding: 14px 22px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); font-family: 'Segoe UI', sans-serif; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 12px; transform: translateX(120%); animation: flixSlideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; border-left: 5px solid #ccc; max-width: 360px; pointer-events: auto; }
            [data-theme="dark"] .flix-toast { background: rgba(28, 28, 30, 0.9); color: #ffffff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35); }
            .flix-toast.success { border-left-color: #2ecc71; }
            .flix-toast.error { border-left-color: #e74c3c; }
            .flix-toast.warning { border-left-color: #f39c12; }
            .flix-toast.info { border-left-color: #3498db; }
            .unread-badge { background-color: #e74c3c; color: white; border-radius: 20px; padding: 2px 8px; font-size: 11px; font-weight: bold; margin-left: auto; min-width: 18px; text-align: center; box-shadow: 0 2px 6px rgba(231, 76, 60, 0.4); animation: flixPulse 1.5s infinite; }
            .user-actions { display: flex; align-items: center; gap: 6px; margin-left: auto; }
            .role-toggle-btn { background: none; border: none; color: #3498db; cursor: pointer; font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s; }
            .role-toggle-btn:hover { opacity: 1; }
            .admin-ban-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s; }
            .admin-ban-btn:hover { opacity: 1; }
            .admin-user-delete-btn { background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s; }
            .admin-user-delete-btn:hover { opacity: 1; }
            @keyframes flixSlideIn { to { transform: translateX(0); } }
            @keyframes flixFadeOut { to { opacity: 0; transform: translateY(-15px); } }
            @keyframes flixPulse { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
        `;
        document.head.appendChild(style);
    }
    let container = document.querySelector('.flix-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flix-toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `flix-toast ${type}`;
    let icon = '💡';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'flixFadeOut 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function localizeFirebaseError(err) {
    switch(err.code) {
        case "auth/email-already-in-use": return "Bu e-poçt ünvanı ilə artıq qeydiyyatdan keçilib.";
        case "auth/invalid-credential": return "E-poçt ünvanı və ya şifrə yanlışdır.";
        case "auth/weak-password": return "Şifrə çox zəifdir. Ən azı 6 simvoldan ibarət olmalıdır.";
        case "auth/invalid-email": return "Daxil etdiyiniz e-poçt strukturu düzgün deyil.";
        case "auth/user-disabled": return "Sizin hesabınız admin tərəfindən ban edilib!";
        default: return err.message || "Gözlənilməz texniki xəta baş verdi.";
    }
}

/* ==========================================================================
 2C. IMGBB API ÜZƏRİNDƏN ŞƏKİL YÜKLƏMƏ MÜHƏRRİKİ
 ========================================================================== */
async function uploadImageToImgBB(file) {
    if (!file.type.startsWith('image/')) {
        throw new Error("Sistem yalnız şəkil fayllarını (JPG, PNG, WEBP, GIF) dəstəkləyir.");
    }
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
    if (!response.ok) {
        throw new Error("Şəkil serverə yüklənərkən xəta baş verdi.");
    }
    const resData = await response.json();
    return resData.data.url; 
}

/* ==========================================================================
 2D. IERARXIYAYA UYGUN IDARƏETMƏ MEXANİZMLƏRİ (Ban, Sil, Rol Ver/Al)
 ========================================================================== */
async function deleteAccount() {
    const user = auth.currentUser;
    if (!user) {
        showToast("Silmək üçün daxil olmuş hesab tapılmadı.", "error");
        return;
    }
    const confirmFirst = confirm("Hesabınızı və bütün profil məlumatlarınızı silmək istədiyinizdən əminsiniz?");
    if (!confirmFirst) return;
    const confirmSecond = confirm("Son xəbərdarlıq: Bu əməliyyat geri qaytarıla bilməz! Çat siyahısından tamamilə silinəcəksiniz. Razısınız?");
    if (!confirmSecond) return;
    try {
        await deleteDoc(doc(db, 'users', user.uid));
        await deleteUser(user);
        showToast("Hesabınız uğurla silindi. Sağlıqla qalın!", "success");
        setTimeout(() => { window.location.reload(); }, 2000);
    } catch (err) {
        console.error("Hesab silinərkən xəta:", err);
        if (err.code === "auth/requires-recent-login") {
            showToast("Hesabınızı silmək üçün təhlükəsizlik baxımından yenidən çıxış edib giriş etməlisiniz!", "warning");
        } else {
            showToast("Hesab silinərkən xəta baş verdi: " + err.message, "error");
        }
    }
}

async function changeUserRole(userId, currentRole) {
    if (currentUserData.role !== 'super_admin') {
        showToast("Bu əməliyyat üçün Super Admin səlahiyyətiniz olmalıdır!", "error");
        return;
    }
    const newRole = prompt(`İstifadəçinin yeni rolunu daxil edin:\n(super_admin, admin, moderator, user)\n\nHazırki rol: ${currentRole}`, currentRole);
    if (!newRole) return; 
    const validRoles = ['super_admin', 'admin', 'moderator', 'user'];
    const targetRoleClean = newRole.trim().toLowerCase();
    if (!validRoles.includes(targetRoleClean)) {
        showToast("Yanlış rol daxil edilib! Sistem yalnız: super_admin, admin, moderator, user rollarını dəstəkləyir.", "warning");
        return;
    }
    try {
        await updateDoc(doc(db, 'users', userId), { role: targetRoleClean });
        showToast("İstifadəçinin rolu uğurla yeniləndi!", "success");
    } catch (error) {
        console.error("Rol dəyişərkən xəta:", error);
        showToast("Xəta baş verdi! Rol dəyişdirilə bilmədi.", "error");
    }
}

async function toggleBanUser(targetUserId, isCurrentlyBanned) {
    const myLevel = getRoleLevel(currentUserData.role);
    try {
        const targetDoc = await getDoc(doc(db, 'users', targetUserId));
        if (!targetDoc.exists()) return;
        const targetData = targetDoc.data();
        const targetLevel = getRoleLevel(targetData.role);

        if (myLevel === 4 || (myLevel === 3 && targetLevel < 3)) {
            const actionText = isCurrentlyBanned ? "banını qaldırmaq" : "banlamaq (sistemdən tam kənarlaşdırmaq)";
            const confirmAction = confirm(`Bu istifadəçinin ${actionText} istədiyinizdən əminsiniz?`);
            if (!confirmAction) return;
            await updateDoc(doc(db, 'users', targetUserId), { isBanned: !isCurrentlyBanned });
            showToast(`İstifadəçi uğurla ${isCurrentlyBanned ? 'banı qaldırıldı' : 'banlandı'}!`, "success");
        } else {
            showToast("Səlahiyyətiniz çatmır! Bu istifadəçi üzərində ban əməliyyatı edə bilməzsiniz.", "error");
        }
    } catch (err) {
        console.error("Ban xətası:", err);
        showToast("Əməliyyat yerinə yetirilmədi: " + err.message, "error");
    }
}

async function adminDeleteUser(targetUserId) {
    if (getRoleLevel(currentUserData.role) !== 4) {
        showToast("Bu hesabı kökündən silmək üçün yalnız Super Admin yetkilidir!", "error");
        return;
    }
    const confirmDelete = confirm("DİQQƏT: Bu istifadəçini çatdan və verilənlər bazasından tamamilə silmək istədiyinizə əminsiniz? (Geri qaytarıla bilməz)");
    if (!confirmDelete) return;
    try {
        await deleteDoc(doc(db, 'users', targetUserId));
        showToast("İstifadəçi profili silindi. Sistem onu dərhal tamamilə kənarlaşdıracaq.", "success");
    } catch (err) {
        console.error("Admin silmə xətası:", err);
        showToast("İstifadəçini silmək mümkün olmadı: " + err.message, "error");
    }
}

function startSelfDestructListener(currentUserObj) {
    if (!currentUserObj) return;
    const myDocRef = doc(db, 'users', currentUserObj.uid);
    let isInitialLoad = true;
    unsubscribeSelfDestruct = onSnapshot(myDocRef, async (snapshot) => {
        if (isInitialLoad) { isInitialLoad = false; return; }
        if (!snapshot.exists()) {
            try { 
                await deleteUser(currentUserObj); 
                showToast("Hesabınız Super Admin tərəfindən silindi!", "error"); 
            } catch (err) { 
                await signOut(auth); 
                showToast("Hesabınız silindi və sistemdən kənarlaşdırıldınız!", "error"); 
            }
            setTimeout(() => { window.location.reload(); }, 2000);
            return;
        }
        const data = snapshot.data();
        if (data && data.isBanned) {
            showToast("Sizin hesabınız rəhbərlik tərəfindən ban edilmişdir!", "error");
            await signOut(auth);
            setTimeout(() => { window.location.reload(); }, 2000);
        }
    });
}

window.adminDeleteUser = adminDeleteUser;
window.changeUserRole = changeUserRole;
window.toggleBanUser = toggleBanUser;

/* ==========================================================================
 3. MÖVZU ENGINI
 ========================================================================== */
function updateThemeUI(theme) {
    const isDark = theme === 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    const logoColor = isDark ? 'white' : 'black';
    siteLogo.src = `../FILES/IMG/logos/${logoColor}.png`;
    siteLogo.onerror = function() { this.src = `FILES/IMG/logos/${logoColor}.png`; this.onerror = null; };
}
themeToggle.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('flix-theme', newTheme);
    updateThemeUI(newTheme);
});
const savedTheme = localStorage.getItem('flix-theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
updateThemeUI(savedTheme);

/* ==========================================================================
 4. AUTENTİFİKASİYA İDARƏETMƏSİ
 ========================================================================== */
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value;
    
    const submitBtn = registerForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Qeydiyyat aparılır...";
    submitBtn.disabled = true;

    try {
        const nameSnap = await getDocs(query(collection(db, 'users'), where('displayName', '==', name)));
        if (!nameSnap.empty) {
            showToast('Bu istifadəçi adı artıq alınıb.', 'warning');
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name, photoURL: DEFAULT_AVATAR });
        await setDoc(doc(db, 'users', userCredential.user.uid), { 
            uid: userCredential.user.uid, 
            displayName: name, 
            email: email, 
            photoURL: DEFAULT_AVATAR, 
            role: 'user', 
            isBanned: false, 
            createdAt: serverTimestamp() 
        });
        registerForm.reset();
        showToast('Qeydiyyat uğurla tamamlandı!', 'success');
    } catch (err) {
        showToast(localizeFirebaseError(err), 'error');
    } Executive: {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    
    const submitBtn = loginForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Giriş edilir...";
    submitBtn.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        showToast('Xoş gəldiniz!', 'success');
        loginForm.reset();
    } catch (err) {
        showToast(localizeFirebaseError(err), 'error');
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

logoutBtn.addEventListener('click', async () => {
    if (currentUser) {
        const userStatusRef = ref(rtdb, `presence/${currentUser.uid}`);
        await set(userStatusRef, { state: 'offline', lastChanged: rtdbTimestamp, typingIn: null });
        await signOut(auth);
        showToast('Sistemdən çıxış edildi.', 'info');
    }
});

/* ==========================================================================
 5. REAL-TIME PRESENCE (İSTİFADƏÇİ STATUSU MÜHƏRRİKİ)
 ========================================================================== */
function setupPresence(user) {
    const userStatusRef = ref(rtdb, `presence/${user.uid}`);
    const isOfflineForDatabase = { state: 'offline', lastChanged: rtdbTimestamp, typingIn: null };
    const isOnlineForDatabase = { state: 'online', lastChanged: rtdbTimestamp, typingIn: null };
    const connectedRef = ref(rtdb, '.info/connected');
    onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === false) return;
        onDisconnect(userStatusRef).set(isOfflineForDatabase).then(() => {
            set(userStatusRef, isOnlineForDatabase);
        });
    });
}

function listenUsersAndPresence() {
    if (unsubscribeUsers) unsubscribeUsers();
    unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        currentUsersList = [];
        userRolesMap = {};
        snapshot.forEach(doc => {
            const u = doc.data();
            currentUsersList.push(u);
            userRolesMap[u.uid] = u.role || 'user';
        });
        renderUsersList();
    });
    onValue(ref(rtdb, 'presence'), (snapshot) => {
        currentStatuses = snapshot.val() || {};
        renderUsersList();
    });
}

function renderUsersList() {
    if (!currentUser) return;
    usersList.innerHTML = '';
    const sortedUsers = [...currentUsersList].sort((a, b) => {
        const aOn = currentStatuses[a.uid]?.state === 'online' ? 1 : 0;
        const bOn = currentStatuses[b.uid]?.state === 'online' ? 1 : 0;
        if (aOn !== bOn) return bOn - aOn;
        return getRoleLevel(b.role) - getRoleLevel(a.role);
    });
    sortedUsers.forEach(user => {
        if (user.uid === currentUser.uid) return;
        const statusData = currentStatuses[user.uid] || { state: 'offline' };
        const isOnline = statusData.state === 'online';
        const isTyping = statusData.typingIn === activeRoomId;
        let statusText = isOnline ? 'çevrimiçi' : 'çevrimdışı';
        if (isTyping) statusText = 'yazır...';

        const myLevel = getRoleLevel(currentUserData.role);
        const targetLevel = getRoleLevel(user.role);
        const isTargetBanned = user.isBanned === true;
        const roleStarsHtml = getRoleStarsHtml(user.role);
        
        const roleButtonHtml = (myLevel === 4) ? `<button class="role-toggle-btn" onclick="event.stopPropagation(); changeUserRole('${user.uid}', '${user.role || 'user'}')" title="Rolu idarə et (Hazırda: ${user.role || 'user'})"><i class="fa-solid fa-user-gear"></i></button>` : '';
        const banButtonHtml = (myLevel === 4 || (myLevel === 3 && targetLevel < 3)) ? `<button class="admin-ban-btn" style="color: ${isTargetBanned ? '#2ecc71' : '#f39c12'}" onclick="event.stopPropagation(); toggleBanUser('${user.uid}', ${isTargetBanned})" title="${isTargetBanned ? 'Banı Qaldır' : 'Banla'}"><i class="fa-solid ${isTargetBanned ? 'fa-user-check' : 'fa-user-slash'}"></i></button>` : '';
        const deleteButtonHtml = (myLevel === 4) ? `<button class="admin-user-delete-btn" onclick="event.stopPropagation(); adminDeleteUser('${user.uid}')" title="Hesabı Kökündən Sil"><i class="fa-solid fa-user-xmark"></i></button>` : '';

        const userActionsHtml = `<div class="user-actions">${roleButtonHtml}${banButtonHtml}${deleteButtonHtml}</div>`;
        const dmRoomId = currentUser.uid < user.uid ? `${currentUser.uid}_${user.uid}` : `${user.uid}_${currentUser.uid}`;
        const roomData = currentRooms[dmRoomId];
        const unreadCount = roomData ? (roomData[`unread_${currentUser.uid}`] || 0) : 0;
        const badgeHtml = unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : '';

        const li = document.createElement('li');
        li.className = `user-item ${activeRoomId === dmRoomId ? 'active' : ''}`;
        li.innerHTML = `
            <div class="avatar-container">
                <img src="${user.photoURL || DEFAULT_AVATAR}" alt="Avatar" class="user-avatar">
                <span class="status-indicator ${isOnline ? 'online' : 'offline'}"></span>
            </div>
            <div class="user-info-meta">
                <div class="user-name-wrapper"><span class="user-item-name">${escapeHTML(user.displayName)}</span>${roleStarsHtml}</div>
                <span class="user-item-status ${isTyping ? 'typing' : ''}">${statusText}</span>
            </div>
            ${badgeHtml}
            ${userActionsHtml}
        `;
        li.addEventListener('click', () => openPrivateRoom(user));
        usersList.appendChild(li);
    });
}

/* ==========================================================================
 6. MULTI-ROOM & DUAL CHAT SWITCHING LOGIC
 ========================================================================== */
function openPrivateRoom(targetUser) {
    activeRoomIsDM = true;
    const dmRoomId = currentUser.uid < targetUser.uid ? `${currentUser.uid}_${targetUser.uid}` : `${targetUser.uid}_${currentUser.uid}`;
    activeRoomId = dmRoomId;
    btnGlobalRoom.classList.remove('active');
    generalChatArea.classList.add('hidden');
    privateChatArea.classList.remove('hidden');
    privateRoomTitle.innerText = targetUser.displayName;
    setDoc(doc(db, 'rooms', dmRoomId), { isDM: true, users: [currentUser.uid, targetUser.uid] }, { merge: true });
    loadPrivateMessages(dmRoomId);
    if (window.innerWidth <= 768) usersSidebar.classList.remove('active');
    renderUsersList();
}

function closePrivateRoom() {
    activeRoomIsDM = false;
    activeRoomId = 'global_room';
    btnGlobalRoom.classList.add('active');
    generalChatArea.classList.remove('hidden');
    privateChatArea.classList.add('hidden');
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    loadGeneralMessages();
    renderUsersList();
}

btnGlobalRoom.addEventListener('click', closePrivateRoom);

function listenRooms() {
    if (unsubscribeRooms) unsubscribeRooms();
    const q = query(collection(db, 'rooms'), where('users', 'array-contains', currentUser.uid));
    unsubscribeRooms = onSnapshot(q, (snapshot) => {
        currentRooms = {};
        snapshot.forEach(doc => { currentRooms[doc.id] = doc.data(); });
        renderUsersList();
    });
}

/* ==========================================================================
 7. MESAJ MENECMENTİ VƏ MESAJ SİLİNMƏ PARADİQMASI
 ========================================================================== */
function loadGeneralMessages() {
    if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
    const q = query(collection(db, 'messages'), where('roomId', '==', 'global_room'), orderBy('timestamp', 'desc'), limit(100));
    unsubscribeGeneralMessages = onSnapshot(q, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => { messages.push({ id: doc.id, ...doc.data() }); });
        messages.reverse();
        chatMessagesArea.innerHTML = '';
        messages.forEach(msg => appendMessageElement(msg, false));
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    });
}

function loadPrivateMessages(roomId) {
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    const q = query(collection(db, 'messages'), where('roomId', '==', roomId), orderBy('timestamp', 'desc'), limit(100));
    unsubscribePrivateMessages = onSnapshot(q, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => { messages.push({ id: doc.id, ...doc.data() }); });
        messages.reverse();
        privateMessagesArea.innerHTML = '';
        messages.forEach(msg => appendMessageElement(msg, true));
        privateMessagesArea.scrollTop = privateMessagesArea.scrollHeight;
        if (currentRooms[roomId]?.[`unread_${currentUser.uid}`] > 0) {
            setDoc(doc(db, 'rooms', roomId), { [`unread_${currentUser.uid}`]: 0 }, { merge: true });
        }
    });
}

function appendMessageElement(msg, isPrivate = false) {
    const targetArea = isPrivate ? privateMessagesArea : chatMessagesArea;
    if (!targetArea) return;
    const isMe = msg.senderId === currentUser.uid;
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`;

    const myLevel = getRoleLevel(currentUserData.role);
    const senderRole = userRolesMap[msg.senderId] || 'user';
    const senderLevel = getRoleLevel(senderRole);
    let canDelete = false;
    if (isMe) canDelete = true;
    else if (myLevel === 4) canDelete = true;
    else if (myLevel === 3 && senderLevel < 3) canDelete = true;
    else if (myLevel === 2 && senderLevel === 1) canDelete = true;

    const deleteBtnHtml = canDelete ? `<button class="msg-delete-btn" title="Mesajı sil"><i class="fa-solid fa-trash-can"></i></button>` : '';
    const timeString = msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const mediaHtml = msg.mediaUrl ? `<div class="message-media"><img src="${msg.mediaUrl}" alt="Media" class="chat-img-preview" onclick="window.open('${msg.mediaUrl}', '_blank')"></div>` : '';
    const textHtml = msg.text ? `<p class="message-text">${escapeHTML(msg.text)}</p>` : '';
    const senderStars = getRoleStarsHtml(senderRole);

    wrapper.innerHTML = `
        <img src="${msg.senderPhoto || DEFAULT_AVATAR}" alt="Avatar" class="chat-avatar">
        <div class="message-content-box">
            <div class="message-header-info">
                <span class="message-author">${escapeHTML(msg.senderName)}</span>${senderStars}
                <span class="message-time">${timeString}</span>
                ${deleteBtnHtml}
            </div>
            ${textHtml}
            ${mediaHtml}
        </div>
    `;

    if (canDelete) {
        wrapper.querySelector('.msg-delete-btn').addEventListener('click', async () => {
            if (!confirm('Bu mesajı silmək istədiyinizdən əminsiniz?')) return;
            try {
                await deleteDoc(doc(db, 'messages', msg.id));
                showToast('Mesaj uğurla silindi.', 'success');
            } catch (err) {
                showToast('Mesaj silinərkən xəta: ' + err.message, 'error');
            }
        });
    }
    targetArea.appendChild(wrapper);
}

async function sendMessage() {
    const text = messageInputField.value.trim();
    const file = chatFileInput.files[0];
    if (!text && !file) return;
    messageInputField.value = '';
    chatFileInput.value = '';
    try {
        let mediaUrl = null;
        if (file) {
            showToast('Şəkil yüklənir...', 'info');
            mediaUrl = await uploadImageToImgBB(file);
        }
        await addDoc(collection(db, 'messages'), {
            roomId: 'global_room',
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || currentUser.displayName,
            senderPhoto: currentUserData.photoURL || currentUser.photoURL || DEFAULT_AVATAR,
            text: text,
            mediaUrl: mediaUrl,
            timestamp: serverTimestamp()
        });
        set(ref(rtdb, `presence/${currentUser.uid}/typingIn`), null);
    } catch (err) {
        showToast('Mesaj göndərilərkən xəta: ' + err.message, 'error');
    }
}

async function sendPrivateMessage() {
    const text = privateInputField.value.trim();
    const file = privateFileInput.files[0];
    if (!text && !file) return;
    privateInputField.value = '';
    privateFileInput.value = '';
    try {
        let mediaUrl = null;
        if (file) {
            showToast('Şəkil yüklənir...', 'info');
            mediaUrl = await uploadImageToImgBB(file);
        }
        const targetUid = activeRoomId.replace(currentUser.uid, '').replace('_', '');
        await addDoc(collection(db, 'messages'), {
            roomId: activeRoomId,
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || currentUser.displayName,
            senderPhoto: currentUserData.photoURL || currentUser.photoURL || DEFAULT_AVATAR,
            text: text,
            mediaUrl: mediaUrl,
            timestamp: serverTimestamp()
        });
        const roomRef = doc(db, 'rooms', activeRoomId);
        await updateDoc(roomRef, { [`unread_${targetUid}`]: increment(1), lastMessageAt: serverTimestamp() });
        set(ref(rtdb, `presence/${currentUser.uid}/typingIn`), null);
    } catch (err) {
        showToast('Şəxsi mesaj göndərilərkən xəta: ' + err.message, 'error');
    }
}

sendMessageBtn.addEventListener('click', sendMessage);
messageInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
sendPrivateMessageBtn.addEventListener('click', sendPrivateMessage);
privateInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendPrivateMessage(); });

/* ==========================================================================
 8. INDIKATOR PROSESI (Yazır... İndikatoru İdarəetməsi)
 ========================================================================== */
function triggerTyping(room) {
    if (!currentUser) return;
    set(ref(rtdb, `presence/${currentUser.uid}/typingIn`), room);
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => { set(ref(rtdb, `presence/${currentUser.uid}/typingIn`), null); }, 2000);
}

messageInputField.addEventListener('input', () => triggerTyping('global_room'));
privateInputField.addEventListener('input', () => triggerTyping(activeRoomId));

function checkActiveRoomTyping() {
    if (unsubscribeTyping) unsubscribeTyping();
    unsubscribeTyping = onValue(ref(rtdb, 'presence'), (snap) => {
        const statuses = snap.val() || {};
        let someoneTyping = false;
        for (let uid in statuses) {
            if (uid !== currentUser.uid && statuses[uid].typingIn === activeRoomId) {
                someoneTyping = true;
                break;
            }
        }
        const globalTypingIndicator = document.getElementById('globalTypingIndicator');
        if (globalTypingIndicator) {
            if (someoneTyping) globalTypingIndicator.classList.remove('hidden');
            else globalTypingIndicator.classList.add('hidden');
        }
    });
}

/* ==========================================================================
 9. PROFİL AYARLARININ YENİLƏNMƏSİ MƏNTİQİ
 ========================================================================== */
openSettingsBtn.addEventListener('click', () => {
    if (!currentUser) return;
    document.getElementById('settingsDisplayName').value = currentUserData.displayName || '';
    document.getElementById('settingsAvatarPreview').src = currentUserData.photoURL || DEFAULT_AVATAR;
    settingsModal.classList.add('active');
});

closeSettingsBtn.addEventListener('click', () => { settingsModal.classList.remove('active'); });

document.getElementById('avatarFileInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => { document.getElementById('settingsAvatarPreview').src = ev.target.result; };
        reader.readAsDataURL(file);
    }
});

profileSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = profileSettingsForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Yadda saxlanılır...";
    submitBtn.disabled = true;

    const newName = document.getElementById('settingsDisplayName').value.trim();
    const avatarFile = document.getElementById('avatarFileInput').files[0];

    try {
        if (!newName) throw new Error("İstifadəçi adı boş ola bilməz.");
        if (newName !== currentUserData.displayName) {
            const nameSnap = await getDocs(query(collection(db, 'users'), where('displayName', '==', newName)));
            if (!nameSnap.empty) {
                showToast('Bu istifadəçi adı artıq alınıb.', 'warning');
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                return;
            }
        }
        let newPhotoUrl = currentUserData.photoURL || DEFAULT_AVATAR;
        if (avatarFile) {
            showToast('Yeni profil şəkli yüklənir...', 'info');
            newPhotoUrl = await uploadImageToImgBB(avatarFile);
        }
        await updateProfile(auth.currentUser, { displayName: newName, photoURL: newPhotoUrl });
        await updateDoc(doc(db, 'users', currentUser.uid), { displayName: newName, photoURL: newPhotoUrl });
        
        currentUserData.displayName = newName;
        currentUserData.photoURL = newPhotoUrl;
        document.getElementById('currentUserAvatar').src = newPhotoUrl;
        document.getElementById('currentUserName').innerText = newName;
        showToast('Profil məlumatlarınız uğurla yeniləndi!', 'success');
        settingsModal.classList.remove('active');
        profileSettingsForm.reset();
    } catch (err) {
        showToast('Ayarlar yenilənərkən xəta: ' + err.message, 'error');
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

document.getElementById('deleteAccBtn')?.addEventListener('click', deleteAccount);

if (mobileUsersToggleBtn) {
    mobileUsersToggleBtn.addEventListener('click', () => { usersSidebar.classList.toggle('active'); });
}

/* ==========================================================================
 10. MASTER OBSERVER (AUTH STATE MONITOR VƏ İNTERFEYS RUTİNQLƏRİ)
 ========================================================================== */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
        } else {
            currentUserData = { uid: user.uid, displayName: user.displayName || 'İstifadəçi', photoURL: user.photoURL || DEFAULT_AVATAR, role: 'user', isBanned: false };
            await setDoc(doc(db, 'users', user.uid), currentUserData);
        }

        if (currentUserData.isBanned) {
            showToast('Sizin hesabınız ban edilib!', 'error');
            await signOut(auth);
            return;
        }

        document.getElementById('currentUserAvatar').src = currentUserData.photoURL || DEFAULT_AVATAR;
        document.getElementById('currentUserName').innerText = currentUserData.displayName;
        
        let roleTitle = 'İstifadəçi';
        if (currentUserData.role === 'super_admin') roleTitle = 'Super Admin';
        else if (currentUserData.role === 'admin') roleTitle = 'Admin';
        else if (currentUserData.role === 'moderator') roleTitle = 'Moderator';
        document.getElementById('currentUserRole').innerText = roleTitle;
        
        logoutBtn.classList.remove('hidden'); openSettingsBtn.classList.remove('hidden');
        authScreen.classList.remove('active'); chatScreen.classList.add('active');

        setupPresence(user);
        listenUsersAndPresence();
        listenRooms();
        checkActiveRoomTyping(); 
        loadGeneralMessages();
        closePrivateRoom();
        
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
        startSelfDestructListener(user);
    } else {
        currentUser = null;
        logoutBtn.classList.add('hidden'); openSettingsBtn.classList.add('hidden');
        chatScreen.classList.remove('active'); authScreen.classList.add('active');
        
        if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
        if (unsubscribePrivateMessages) unsubscribePrivateMessages();
        if (unsubscribeUsers) unsubscribeUsers();
        if (unsubscribeRooms) unsubscribeRooms();
        if (unsubscribeTyping) unsubscribeTyping();
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    }
});

/* ==========================================================================
 11. TƏHLÜKƏSİZLİK FUNKSİYALARI (Anti-XSS Protection)
 ========================================================================== */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
