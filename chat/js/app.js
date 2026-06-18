/* ==========================================================================
 1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
 ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile,
    deleteUser, sendPasswordResetEmail, reauthenticateWithCredential, updatePassword,
    updateEmail, EmailAuthProvider 
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

const activeRoomTitle = document.getElementById('activeRoomTitle');
const activeRoomSub = document.getElementById('activeRoomSub');

const generalChatArea = document.getElementById('generalChatArea');
const chatMessagesArea = document.getElementById('chatMessagesArea');
const messageInputField = document.getElementById('messageInputField');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatFileInput = document.getElementById('chatFileInput');

const privateChatArea = document.getElementById('privateChatArea');
const privateChatHeader = document.getElementById('privateChatHeader');
const privateRoomTitle = document.getElementById('privateRoomTitle');
const privateMessagesArea = document.getElementById('privateMessagesArea');
const privateInputField = document.getElementById('privateInputField');
const sendPrivateMessageBtn = document.getElementById('sendPrivateMessageBtn');
const privateFileInput = document.getElementById('privateFileInput');

// Dinamik fayl paneli DOM elementləri
const generalFileIndicator = document.getElementById('generalFileIndicator');
const generalFileName = document.getElementById('generalFileName');
const clearGeneralFileBtn = document.getElementById('clearGeneralFileBtn');

const privateFileIndicator = document.getElementById('privateFileIndicator');
const privateFileName = document.getElementById('privateFileName');
const clearPrivateFileBtn = document.getElementById('clearPrivateFileBtn');

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

function showToast(message, type = "info") {
    if (!document.getElementById("flix-toast-styles")) {
        const style = document.createElement("style");
        style.id = "flix-toast-styles";
        style.innerHTML = `
            .flix-toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
            .flix-toast { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); color: #1a1a1a; padding: 14px 22px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); font-family: 'Segoe UI', sans-serif; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 12px; transform: translateX(120%); animation: flixSlideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; border-left: 5px solid #ccc; max-width: 360px; pointer-events: auto; }
            [data-theme="dark"] .flix-toast { background: rgba(28, 28, 30, 0.9); color: #ffffff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35); }
            .flix-toast.success { border-left-color: #2ecc71; }
            .flix-toast.error { border-left-color: #e74c3c; }
            .flix-toast.warning { border-left-color: #f39c12; }
            .flix-toast.info { border-left-color: #3498db; }
            @keyframes flixSlideIn { to { transform: translateX(0); } }
            @keyframes flixFadeOut { to { opacity: 0; transform: translateY(-15px); } }
        `;
        document.head.appendChild(style);
    }

    let container = document.querySelector(".flix-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "flix-toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `flix-toast ${type}`;
    
    let icon = "💡";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = "flixFadeOut 0.4s forwards";
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
        case "auth/wrong-password": return "Daxil etdiyiniz cari şifrə yanlışdır.";
        default: return err.message || "Gözlənilməz texniki xəta baş verdi.";
    }
}

async function uploadImageToImgBB(file) {
    if (!file.type.startsWith("image/")) {
        throw new Error("Sistem yalnız şəkil fayllarını (JPG, PNG, WEBP, GIF) dəstəkləyir.");
    }
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error("Şəkil serverə yüklənərkən xəta baş verdi.");
    const resData = await response.json();
    return resData.data.url; 
}

// MODERASİYA FUNKSİYALARI
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
        console.error(err);
        if (err.code === "auth/requires-recent-login") {
            showToast("Hesabınızı silmək üçün təhlükəsizlik baxımından yenidən çıxış edib giriş etməlisiniz!", "warning");
        } else {
            showToast("Hesab silinərkən xəta baş verdi: " + err.message, "error");
        }
    }
}

async function changeUserRole(userId, currentRole) {
    if (currentUserData.role !== "super_admin") {
        showToast("Bu əməliyyat üçün Super Admin səlahiyyətiniz olmalıdır!", "error");
        return;
    }
    const newRole = prompt(`İstifadəçinin yeni rolunu daxil edin:\n(super_admin, admin, moderator, user)\n\nHazırki rol: ${currentRole}`, currentRole);
    if (!newRole) return; 
    const validRoles = ["super_admin", "admin", "moderator", "user"];
    const targetRoleClean = newRole.trim().toLowerCase();
    if (!validRoles.includes(targetRoleClean)) { 
        showToast("Yanlış rol daxil edilib! Sistem yalnız: super_admin, admin, moderator, user rollarını dəstəkləyir.", "warning"); 
        return; 
    }
    try {
        await updateDoc(doc(db, 'users', userId), { role: targetRoleClean });
        showToast("İstifadəçinin rolu uğurla yeniləndi!", "success");
    } catch (error) { 
        showToast("Xəta baş verdi! Rol dəyişdirilə bilmədi.", "error"); 
    }
}

async function toggleBanUser(targetUserId, isCurrentlyBanned) {
    const myLevel = getRoleLevel(currentUserData.role);
    try {
        const targetDoc = await getDoc(doc(db, 'users', targetUserId));
        if (!targetDoc.exists()) return;
        const targetLevel = getRoleLevel(targetDoc.data().role);
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
        showToast("İstifadəçini silmək mümkün olmadı: " + err.message, "error"); 
    }
}

function startSelfDestructListener(currentUserObj) {
    if (!currentUserObj) return;
    let isInitialLoad = true;
    unsubscribeSelfDestruct = onSnapshot(doc(db, 'users', currentUserObj.uid), async (snapshot) => {
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
        if (snapshot.data()?.isBanned) {
            showToast("Sizin hesabınız admin tərəfindən ban edildi!", "error");
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
 4. AUTENTİFİKASİYA İDARƏETMƏSİ VƏ YENİ FUNKSİYALAR
 ========================================================================== */
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    loginForm.classList.add('active'); registerForm.classList.remove('active');
});
tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active'); tabLogin.classList.remove('active');
    registerForm.classList.add('active'); loginForm.classList.remove('active');
});

// Şifrə Göstər / Gizlət Düyməsinin İdarə Edilməsi
const toggleLoginPasswordBtn = document.getElementById('toggleLoginPasswordBtn');
const loginPasswordInput = document.getElementById('loginPassword');
toggleLoginPasswordBtn.addEventListener('click', () => {
    if (loginPasswordInput.type === 'password') {
        loginPasswordInput.type = 'text';
        toggleLoginPasswordBtn.classList.remove('fa-eye');
        toggleLoginPasswordBtn.classList.add('fa-eye-slash');
    } else {
        loginPasswordInput.type = 'password';
        toggleLoginPasswordBtn.classList.remove('fa-eye-slash');
        toggleLoginPasswordBtn.classList.add('fa-eye');
    }
});

// Şifrəni Unutdunuzmu Mexanizmi
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const currentEmailVal = document.getElementById('loginEmail').value.trim();
    let email = currentEmailVal;
    if (!email) {
        email = prompt("Şifrə sıfırlama linki göndəriləcək e-poçt ünvanınızı daxil edin:");
        if (email) email = email.trim();
    }
    if (!email) {
        showToast("Davam etmək üçün e-poçt ünvanı mütləqdir!", "warning");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        showToast("Şifrə sıfırlama e-poçtu uğurla göndərildi. Zəhmət olmasa gələnlər qutusunu (və spam qovluğunu) yoxlayın.", "success");
    } catch (err) {
        console.error(err);
        showToast("Sıfırlama linki göndərilərkən xəta: " + localizeFirebaseError(err), "error");
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value;
    try {
        const nameSnap = await getDocs(query(collection(db, 'users'), where('displayName', '==', name)));
        if (!nameSnap.empty) { showToast("Bu istifadəçi adı artıq başqası tərəfindən alınıb. Fərqli ad seçin.", "warning"); return; }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name, photoURL: DEFAULT_AVATAR });
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            displayName: name,
            photoURL: DEFAULT_AVATAR,
            role: 'user',
            isBanned: false
        });
        showToast("Qeydiyyat uğurla tamamlandı!", "success");
    } catch (err) {
        showToast(localizeFirebaseError(err), "error");
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists() && userDoc.data().isBanned) {
            await signOut(auth);
            showToast("Sizin hesabınız admin tərəfindən ban edilib!", "error");
            return;
        }
        showToast("Sistemə uğurla giriş etdiniz!", "success");
    } catch (err) {
        showToast(localizeFirebaseError(err), "error");
    }
});

logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        showToast("Sistemdən çıxış olundu.", "info");
    });
});

/* ==========================================================================
 5. AKTİV İSTİFADƏÇİLƏRİN DİNAMİK SİYAHISI VƏ SIK SIRALAMA ALQORİTMİ
 ========================================================================== */
mobileUsersToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    usersSidebar.classList.toggle('mobile-open');
});
document.addEventListener('click', (e) => {
    if (!usersSidebar.contains(e.target) && !mobileUsersToggleBtn.contains(e.target)) {
        usersSidebar.classList.remove('mobile-open');
    }
});

function listenUsersAndPresence() {
    if (unsubscribeUsers) unsubscribeUsers();
    if (unsubscribeRooms) unsubscribeRooms();
    unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        currentUsersList = [];
        userRolesMap = {};
        if (currentUser && currentUserData) userRolesMap[currentUser.uid] = currentUserData.role || 'user';
        snapshot.forEach(doc => {
            const uData = doc.data();
            userRolesMap[uData.uid] = uData.role || 'user';
            if (uData.uid !== currentUser.uid) currentUsersList.push(uData);
        });
        renderUsersList();
    });
    onValue(ref(rtdb, 'presence'), (snap) => {
        currentStatuses = snap.val() || {};
        renderUsersList();
    });
    unsubscribeRooms = onSnapshot(query(collection(db, 'rooms'), where('participants', 'array-contains', currentUser.uid)), (snapshot) => {
        currentRooms = {};
        snapshot.forEach(doc => currentRooms[doc.id] = doc.data());
        renderUsersList();
    });
}

function renderUsersList() {
    if (!currentUser || !currentUserData) return;
    usersList.innerHTML = '';
    const myLevel = getRoleLevel(currentUserData.role);

    // Filter out banned users for users who do not have ban/admin permissions (level < 3)
    let sortedAndFiltered = currentUsersList.filter(user => {
        if (user.isBanned && myLevel < 3) return false;
        return true;
    });

    // İerarxiyaya uyğun mükəmməl sıralama tətbiqi
    sortedAndFiltered.sort((a, b) => {
        const aStatus = currentStatuses[a.uid]?.status || 'offline';
        const bStatus = currentStatuses[b.uid]?.status || 'offline';

        // Müvafiq kateqoriya dərəcələri təyin edilir
        // 1 - Rolu olanlar (super_admin, admin, moderator) və banlanmamış olanlar
        // 2 - Banlanmamış sadə onlayn istifadəçilər
        // 3 - Banlanmamış sadə oflayn istifadəçilər
        // 4 - Banlanmış olan istifadəçilər (yalnız yetkililərə açılır)
        let aCat = 3;
        if (a.isBanned) aCat = 4;
        else if (a.role === 'super_admin' || a.role === 'admin' || a.role === 'moderator') aCat = 1;
        else if (aStatus === 'online') aCat = 2;

        let bCat = 3;
        if (b.isBanned) bCat = 4;
        else if (b.role === 'super_admin' || b.role === 'admin' || b.role === 'moderator') bCat = 1;
        else if (bStatus === 'online') bCat = 2;

        if (aCat !== bCat) return aCat - bCat;

        // Eyni kateqoriya daxili nizam qaydaları
        if (aCat === 1) {
            let aLevel = getRoleLevel(a.role);
            let bLevel = getRoleLevel(b.role);
            if (aLevel !== bLevel) return bLevel - aLevel; // Rol ierarxiyası üstünlük təşkil edir
            if (aStatus === 'online' && bStatus !== 'online') return -1; // Onlayn olan hər zaman yuxarıda
            if (aStatus !== 'online' && bStatus === 'online') return 1;
            return (a.displayName || '').localeCompare(b.displayName || '', 'az'); // Əlifba sırası
        }
        if (aCat === 2 || aCat === 3) {
            return (a.displayName || '').localeCompare(b.displayName || '', 'az'); // Əlifba sırası
        }
        if (aCat === 4) {
            let aLevel = getRoleLevel(a.role);
            let bLevel = getRoleLevel(b.role);
            if (aLevel !== bLevel) return bLevel - aLevel; // Ban siyahısında da yüksək rolu olan yuxarıda
            return (a.displayName || '').localeCompare(b.displayName || '', 'az'); // Əlifba sırası
        }
        return 0;
    });

    sortedAndFiltered.forEach(user => {
        const userStatus = currentStatuses[user.uid]?.status || 'offline';
        
        const li = document.createElement('li');
        li.className = `user-item ${activeRoomId.includes(user.uid) && activeRoomIsDM ? 'active' : ''}`;
        if (user.isBanned) li.classList.add('banned-user-item');

        let actionButtonsHtml = '';
        if (myLevel >= 3) {
            actionButtonsHtml += `<div class="user-actions">`;
            if (myLevel === 4) {
                actionButtonsHtml += `
                    <button class="role-toggle-btn" title="Rolu dəyiş" onclick="event.stopPropagation(); window.changeUserRole('${user.uid}', '${user.role || 'user'}')">
                        <i class="fa-solid fa-user-gear"></i>
                    </button>
                `;
            }
            const targetLevel = getRoleLevel(user.role);
            if (myLevel === 4 || (myLevel === 3 && targetLevel < 3)) {
                actionButtonsHtml += `
                    <button class="admin-ban-btn ${user.isBanned ? 'banned' : ''}" title="${user.isBanned ? 'Banı qaldır' : 'Banla'}" onclick="event.stopPropagation(); window.toggleBanUser('${user.uid}', ${user.isBanned || false})">
                        <i class="fa-solid ${user.isBanned ? 'fa-user-check' : 'fa-user-slash'}"></i>
                    </button>
                `;
            }
            if (myLevel === 4) {
                actionButtonsHtml += `
                    <button class="admin-user-delete-btn" title="İstifadəçini bazadan sil" onclick="event.stopPropagation(); window.adminDeleteUser('${user.uid}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
            }
            actionButtonsHtml += `</div>`;
        }

        const starsHtml = getRoleStarsHtml(user.role);
        const statusClass = userStatus === 'online' ? 'text-success' : 'text-muted';
        const statusDot = user.isBanned ? '<i class="fa-solid fa-ban" style="color: #d94f5c; font-size: 11px;"></i>' : `<i class="fa-solid fa-circle ${statusClass}"></i>`;

        li.innerHTML = `
            <div style="position: relative; display: flex; align-items: center;">
                <img src="${user.photoURL || DEFAULT_AVATAR}" alt="Avatar" class="avatar">
                <span style="position: absolute; bottom: -2px; right: -2px; background: var(--surface); border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">
                    ${statusDot}
                </span>
            </div>
            <div class="user-info">
                <span class="name">${escapeHTML(user.displayName || 'İstifadəçi')}${starsHtml}</span>
                <span class="role-badge" style="font-size: 10px;">${user.isBanned ? 'Banlanıb' : (user.role || 'user')}</span>
            </div>
            ${actionButtonsHtml}
        `;
        
        li.addEventListener('click', () => openPrivateRoom(user));
        usersList.appendChild(li);
    });
}

/* ==========================================================================
 6. OTAQLARIN AÇILMASI VƏ BAĞLANMASI
 ========================================================================== */
function closePrivateRoom() {
    activeRoomIsDM = false;
    activeRoomId = 'global_room';
    btnGlobalRoom.classList.add('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Ümumi Çat";
    if (activeRoomSub) activeRoomSub.innerText = "Son 50 mesaj göstərilir";
    privateChatArea.classList.remove('active');
    privateChatArea.classList.add('hidden');
    generalChatArea.classList.remove('hidden');
    generalChatArea.classList.add('active');
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    renderUsersList();
}

function openPrivateRoom(targetUser) {
    activeRoomIsDM = true;
    activeRoomId = [currentUser.uid, targetUser.uid].sort().join('_');
    privateRoomTitle.innerText = targetUser.displayName;
    btnGlobalRoom.classList.remove('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Şəxsi yazışma";
    if (activeRoomSub) activeRoomSub.innerText = targetUser.displayName;
    generalChatArea.classList.remove('active');
    generalChatArea.classList.add('hidden');
    privateChatArea.classList.remove('hidden');
    privateChatArea.classList.add('active');
    
    setDoc(doc(db, 'rooms', activeRoomId), {
        id: activeRoomId,
        participants: [currentUser.uid, targetUser.uid],
        lastActivity: serverTimestamp()
    }, { merge: true });

    loadPrivateMessages();
}

btnGlobalRoom.addEventListener('click', closePrivateRoom);
privateChatHeader.addEventListener('click', closePrivateRoom);

/* ==========================================================================
 7. MESAJLARIN PROSESİ VƏ DOSYA ADLARININ IDARƏEDILMƏSİ
 ========================================================================== */
function loadGeneralMessages() {
    if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
    const q = query(collection(db, 'rooms', 'global_room', 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribeGeneralMessages = onSnapshot(q, (snapshot) => {
        chatMessagesArea.innerHTML = '';
        const msgs = [];
        snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
        msgs.reverse().forEach(msg => {
            chatMessagesArea.appendChild(createMessageElement(msg, 'global_room'));
        });
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    });
}

function loadPrivateMessages() {
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    const q = query(collection(db, 'rooms', activeRoomId, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribePrivateMessages = onSnapshot(q, (snapshot) => {
        privateMessagesArea.innerHTML = '';
        const msgs = [];
        snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
        msgs.reverse().forEach(msg => {
            privateMessagesArea.appendChild(createMessageElement(msg, activeRoomId));
        });
        privateMessagesArea.scrollTop = privateMessagesArea.scrollHeight;
    });
}

function createMessageElement(msg, roomIdContext) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${msg.senderId === currentUser.uid ? 'me' : 'other'}`;
    
    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    
    let contentHtml = `<p class="text-content">${escapeHTML(msg.text)}</p>`;
    if (msg.fileURL) {
        contentHtml = `<img src="${msg.fileURL}" alt="Şəkil" class="chat-shared-image" style="max-width: 220px; border-radius: 8px; margin-top: 5px; cursor: pointer;" onclick="window.open('${msg.fileURL}', '_blank')">`;
    }

    let deleteBtnHtml = '';
    if (msg.senderId === currentUser.uid || currentUserData.role === 'super_admin' || currentUserData.role === 'admin') {
        deleteBtnHtml = `<button class="delete-msg-btn" style="background:none; border:none; color:var(--danger); font-size:11px; cursor:pointer; margin-left:8px;"><i class="fa-solid fa-trash"></i></button>`;
    }

    wrapper.innerHTML = `
        <img src="${msg.senderAvatar || DEFAULT_AVATAR}" alt="Avatar" class="avatar">
        <div class="message-bubble" style="background: ${msg.senderId === currentUser.uid ? 'var(--me-bubble)' : 'var(--other-bubble)'}; color: white; padding: 10px 14px; border-radius: 12px; max-width: 70%;">
            <span class="sender-name" style="font-size: 11px; color: var(--muted); display: block; margin-bottom: 4px;">${escapeHTML(msg.senderName)} ${deleteBtnHtml}</span>
            ${contentHtml}
            <span class="timestamp" style="font-size: 9px; color: var(--text-muted); display: block; text-align: right; margin-top: 4px;">${time}</span>
        </div>
    `;

    const delBtn = wrapper.querySelector('.delete-msg-btn');
    if (delBtn) {
        delBtn.addEventListener('click', async () => {
            if (confirm("Bu mesajı silmək istədiyinizdən əminsiniz?")) {
                await deleteDoc(doc(db, 'rooms', roomIdContext, 'messages', msg.id));
                showToast("Mesaj uğurla silindi.", "info");
            }
        });
    }
    return wrapper;
}

async function submitMessage(isDMContext) {
    const textInput = isDMContext ? privateInputField : messageInputField;
    const fileInput = isDMContext ? privateFileInput : chatFileInput;
    const indicator = isDMContext ? privateFileIndicator : generalFileIndicator;
    const text = textInput.value.trim();
    const file = fileInput.files[0];
    
    if (!text && !file) return;
    
    textInput.value = '';
    fileInput.value = '';
    indicator.classList.add('hidden'); // Fayl indikatorunu sıfırlayırıq
    
    let fileURL = null;
    let fileType = null;
    if (file) {
        try {
            fileURL = await uploadImageToImgBB(file);
            fileType = file.type;
        } catch (err) {
            showToast(err.message, "error");
            return;
        }
    }
    try {
        await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || 'Anonim',
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
            text: text,
            fileURL: fileURL,
            fileType: fileType,
            createdAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'rooms', activeRoomId), { lastActivity: serverTimestamp() });
    } catch (err) {
        showToast("Xəta baş verdi: " + err.message, "error");
    }
}

sendMessageBtn.addEventListener('click', () => submitMessage(false));
messageInputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitMessage(false); });
sendPrivateMessageBtn.addEventListener('click', () => submitMessage(true));
privateInputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitMessage(true); });

// Çat bölməsində fayl seçilən zaman adların göstərilməsinin təmini
chatFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            showToast("Sistem yalnız şəkil fayllarını dəstəkləyir.", "error");
            chatFileInput.value = '';
            generalFileIndicator.classList.add('hidden');
            return;
        }
        generalFileName.innerText = file.name;
        generalFileIndicator.classList.remove('hidden');
    }
});
clearGeneralFileBtn.addEventListener('click', () => {
    chatFileInput.value = '';
    generalFileIndicator.classList.add('hidden');
});

privateFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            showToast("Sistem yalnız şəkil fayllarını dəstəkləyir.", "error");
            privateFileInput.value = '';
            privateFileIndicator.classList.add('hidden');
            return;
        }
        privateFileName.innerText = file.name;
        privateFileIndicator.classList.remove('hidden');
    }
});
clearPrivateFileBtn.addEventListener('click', () => {
    privateFileInput.value = '';
    privateFileIndicator.classList.add('hidden');
});

// Avatar seçilən zaman localda dərhal vizual önizləmənin təmini
const avatarFileInput = document.getElementById('avatarFileInput');
const settingsAvatarPreview = document.getElementById('settingsAvatarPreview');
avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            showToast("Sistem yalnız şəkil fayllarını dəstəkləyir.", "error");
            avatarFileInput.value = '';
            return;
        }
        settingsAvatarPreview.src = URL.createObjectURL(file);
        showToast(`Fayl müvəffəqiyyətlə seçildi: ${file.name}`, "info");
    }
});

/* ==========================================================================
 8. MODAL AYARLARIN FORMU VƏ E-POÇT / ŞİFRƏ YENİLƏMƏ
 ========================================================================== */
openSettingsBtn.addEventListener('click', () => {
    document.getElementById('settingsDisplayName').value = currentUserData.displayName || '';
    document.getElementById('settingsEmail').value = auth.currentUser?.email || '';
    document.getElementById('settingsOldPassword').value = '';
    document.getElementById('settingsNewPassword').value = '';
    settingsAvatarPreview.src = currentUserData.photoURL || DEFAULT_AVATAR;
    settingsModal.classList.add('active');
});
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));

profileSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = document.getElementById('settingsDisplayName').value.trim();
    const newEmail = document.getElementById('settingsEmail').value.trim();
    const oldPassword = document.getElementById('settingsOldPassword').value;
    const newPassword = document.getElementById('settingsNewPassword').value;
    const avatarFile = avatarFileInput.files[0];
    const submitBtn = profileSettingsForm.querySelector('.save-settings-btn');
    
    if (!newName) { showToast("Görünən ad boş ola bilməz!", "warning"); return; }
    
    submitBtn.innerText = 'Yüklənir...';
    submitBtn.disabled = true;
    
    try {
        const user = auth.currentUser;
        const isEmailChanged = (newEmail && newEmail !== user.email);
        const isPasswordChanged = (newPassword && newPassword.length > 0);
        
        // Şifrə və ya E-poçt dəyişdikdə köhnə şifrənin məcburiliyi yoxlanılır
        if (isEmailChanged || isPasswordChanged) {
            if (!oldPassword) {
                showToast("E-poçt və ya şifrəni dəyişmək üçün cari (köhnə) şifrənizi daxil etməlisiniz!", "warning");
                submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
                submitBtn.disabled = false;
                return;
            }
            try {
                const credential = EmailAuthProvider.credential(user.email, oldPassword);
                await reauthenticateWithCredential(user, credential);
            } catch (authErr) {
                console.error(authErr);
                showToast("Cari şifrəniz yanlışdır! Doğrulama alınmadı.", "error");
                submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
                submitBtn.disabled = false;
                return;
            }
        }
        
        if (newName !== currentUserData.displayName) {
            const nameSnap = await getDocs(query(collection(db, 'users'), where('displayName', '==', newName)));
            if (nameSnap.docs.some(doc => doc.id !== user.uid)) {
                showToast("Bu istifadəçi adı artıq başqası tərəfindən alınıb. Başqa ad yoxlayın.", "warning");
                submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
                submitBtn.disabled = false;
                return;
            }
        }
        
        let newPhotoURL = currentUserData.photoURL || DEFAULT_AVATAR;
        if (avatarFile) {
            try {
                newPhotoURL = await uploadImageToImgBB(avatarFile);
            } catch (err) {
                showToast("Avatar yüklənərkən xəta: " + err.message, "error");
                submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
                submitBtn.disabled = false;
                return;
            }
        }
        
        if (isEmailChanged) {
            try {
                await updateEmail(user, newEmail);
                showToast("E-poçt ünvanınız uğurla yeniləndi!", "success");
            } catch (err) {
                showToast("E-poçt yenilənərkən xəta baş verdi: " + localizeFirebaseError(err), "error");
                submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
                submitBtn.disabled = false;
                return;
            }
        }
        
        if (isPasswordChanged) {
            if (newPassword.length < 6) {
                showToast("Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır!", "warning");
                submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
                submitBtn.disabled = false;
                return;
            }
            try {
                await updatePassword(user, newPassword);
                showToast("Şifrəniz uğurla yeniləndi!", "success");
            } catch (err) {
                showToast("Şifrə yenilənərkən xəta baş verdi: " + localizeFirebaseError(err), "error");
                submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
                submitBtn.disabled = false;
                return;
            }
        }
        
        await updateProfile(user, { displayName: newName, photoURL: newPhotoURL });
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName: newName,
            photoURL: newPhotoURL,
            role: currentUserData.role || 'user',
            isBanned: currentUserData.isBanned || false
        }, { merge: true });
        
        showToast("Profil tənzimləmələri uğurla yadda saxlanıldı!", "success");
        settingsModal.classList.remove('active');
    } catch (err) {
        showToast("Gözlənilmez xəta baş verdi: " + err.message, "error");
    } finally {
        submitBtn.innerText = 'Dəyişiklikləri Yadda Saxla';
        submitBtn.disabled = false;
    }
});

document.getElementById('deleteAccBtn').addEventListener('click', deleteAccount);

/* ==========================================================================
 9. PRESENCE VƏ AUTH_STATE SINXRONIZASIYASI
 ========================================================================== */
function setupPresence(userObj) {
    const userStatusDatabaseRef = ref(rtdb, '/presence/' + userObj.uid);
    const isOfflineForDatabase = { status: 'offline', lastChanged: rtdbTimestamp, typingTo: null };
    const isOnlineForDatabase = { status: 'online', lastChanged: rtdbTimestamp, typingTo: null };
    
    const connectedRef = ref(rtdb, '.info/connected');
    onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === false) return;
        onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
        });
    });
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists()) {
            currentUserData = userSnap.data();
        } else {
            currentUserData = { role: 'user', displayName: user.displayName || 'Anonim', photoURL: user.photoURL || DEFAULT_AVATAR, isBanned: false };
            await setDoc(userDocRef, currentUserData);
        }

        if (currentUserData.isBanned) {
            showToast("Sizin hesabınız ban edilib!", "error");
            await signOut(auth);
            return;
        }

        document.getElementById('currentUserName').innerText = currentUserData.displayName || 'İstifadəçi';
        document.getElementById('currentUserAvatar').src = currentUserData.photoURL || DEFAULT_AVATAR;
        
        let roleTitle = 'İstifadəçi';
        if (currentUserData.role === 'super_admin') roleTitle = 'Super Admin';
        else if (currentUserData.role === 'admin') roleTitle = 'Admin';
        else if (currentUserData.role === 'moderator') roleTitle = 'Moderator';
        document.getElementById('currentUserRole').innerText = roleTitle;
        
        logoutBtn.classList.remove('hidden'); openSettingsBtn.classList.remove('hidden');
        authScreen.classList.remove('active'); chatScreen.classList.add('active');

        setupPresence(user);
        listenUsersAndPresence();
        
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
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    }
});

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
}
