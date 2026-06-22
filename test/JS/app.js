/* ==========================================================================
 1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
 ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile,
    deleteUser, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider,
    updateEmail, updatePassword
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
let currentUserData = {
    role: 'user',
    displayName: '',
    photoURL: DEFAULT_AVATAR,
    isBanned: false,
    username: '',
    firstName: '',
    lastName: ''
};
let activeRoomId = 'global_room';
let activeRoomIsDM = false;
let currentIgnoreList = [];

let unsubscribeGeneralMessages = null;
let unsubscribePrivateMessages = null;
let unsubscribeUsers = null;
let unsubscribeRooms = null;
let unsubscribeTyping = null;
let unsubscribeSelfDestruct = null;
let typingTimeout = null;
let unsubscribePresenceConnected = null;
let unsubscribePresenceList = null;
let isRegistering = false;

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

// Qeydiyyat DOM-ları
const regUsername = document.getElementById('regUsername');
const regFirstName = document.getElementById('regFirstName');
const regLastName = document.getElementById('regLastName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regPasswordConfirm = document.getElementById('regPasswordConfirm');
const usernameCheckMsg = document.getElementById('usernameCheckMsg');
const passwordCheckMsg = document.getElementById('passwordCheckMsg');

// Login DOM-ları
const loginEmailOrUsername = document.getElementById('loginEmailOrUsername');
const loginPassword = document.getElementById('loginPassword');

// Settings DOM-ları
const settingsUsername = document.getElementById('settingsUsername');
const settingsUsernameCheckMsg = document.getElementById('settingsUsernameCheckMsg');
const settingsFirstName = document.getElementById('settingsFirstName');
const settingsLastName = document.getElementById('settingsLastName');
const settingsEmailDisplay = document.getElementById('settingsEmailDisplay');
const settingsAvatarPreview = document.getElementById('settingsAvatarPreview');
const avatarFileInput = document.getElementById('avatarFileInput');
const avatarFileNameDisplay = document.getElementById('avatarFileNameDisplay');
const currentPasswordInput = document.getElementById('currentPasswordInput');
const newPasswordInput = document.getElementById('newPasswordInput');

/* ==========================================================================
 2b. KÖMƏKÇİ FUNKSİYALAR
 ========================================================================== */
const getRoleLevel = (role) => {
    if (role === 'super_admin') return 4;
    if (role === 'admin') return 3;
    if (role === 'moderator') return 2;
    return 1;
};

/* DƏYİŞİKLİK: rol ulduzları - yeni rəng sxemi və sinif əlavəsi */
const getRoleStarsHtml = (role) => {
    let color = '';
    let starClass = '';
    if (role === 'super_admin') {
        color = '#e74c3c';
        starClass = 'super-admin-star';
    } else if (role === 'admin') {
        color = '#3498db';
        starClass = 'admin-star';
    } else if (role === 'moderator') {
        color = '#f1c40f';
        starClass = 'moderator-star';
    } else {
        return '';
    }
    return `<i class="fa-solid fa-star role-star ${starClass}" style="color: ${color}; font-size: 11px; margin-left: 4px;" title="${role}"></i>`;
};

const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

function showToast(message, type = "info") {
    if (!document.getElementById("flix-toast-styles")) {
        const style = document.createElement("style");
        style.id = "flix-toast-styles";
        style.innerHTML = `
            .flix-toast-container {
                position: fixed;
                top: 20px; right: 20px; z-index: 9999;
                display: flex; flex-direction: column; gap: 10px;
            }
            .flix-toast {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                color: #1a1a1a; padding: 14px 22px; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 12px;
                transform: translateX(120%);
                animation: flixSlideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                border-left: 5px solid #ccc; max-width: 360px; pointer-events: auto;
            }
            [data-theme="dark"] .flix-toast {
                background: rgba(28, 28, 30, 0.9);
                color: #ffffff;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            }
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
        case "auth/user-disabled": return "Sizin hesabınız rəhbərlik tərəfindən deaktiv edilib!";
        case "auth/wrong-password": return "Şifrəniz yanlışdır. Zəhmət olmasa yenidən cəhd edin.";
        case "auth/too-many-requests": return "Çox sayda uğursuz cəhd. Bir qədər gözləyin.";
        case "auth/requires-recent-login": return "Bu əməliyyat üçün yenidən giriş etməlisiniz.";
        case "auth/email-already-exists": return "Bu e-poçt ünvanı artıq istifadə edilir.";
        case "auth/user-not-found": return "Daxil etdiyiniz e-poçt mövcud deyil.";
        case "auth/cancelled-popup-request": return "Google ilə giriş əməliyyatı dayandırılır.";
        case "auth/popup-closed-by-user": return "Google ilə giriş əməliyyatı dayandırıldı.";
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

/* ==========================================================================
 3. USERNAME VALİDASİYASI (case-insensitive)
 ========================================================================== */
function isValidUsername(str) {
    if (!str) return false;
    const regex = /^[A-Za-z0-9](?!.*\.\.)[A-Za-z0-9._]{1,8}[A-Za-z0-9]$/;
    return regex.test(str);
}

function isValidName(str) {
    if (!str) return false;
    return /^[\p{L}]+(?:[\s][\p{L}]+)*$/u.test(str.trim());
}

function namesAreValid(first, last) {
    return isValidName(first) && isValidName(last);
}

function normalizeUsername(str) {
    return str.toLowerCase().trim();
}

/* ==========================================================================
 4. QEYDİYYAT - DİNAMİK YOXLAMALAR
 ========================================================================== */
let usernameCheckTimeout = null;
let settingsUsernameCheckTimeout = null;

async function checkUsernameAvailability(username) {
    if (!username) return null;
    const normalized = normalizeUsername(username);
    if (!isValidUsername(normalized)) return false;
    try {
        const q = query(collection(db, 'users'), where('username', '==', normalized));
        const snap = await getDocs(q);
        return snap.empty;
    } catch {
        return null;
    }
}

// Qeydiyyat username yoxlaması
regUsername.addEventListener('input', () => {
    clearTimeout(usernameCheckTimeout);
    const val = regUsername.value.trim();
    const normalized = normalizeUsername(val);
    if (!val) {
        usernameCheckMsg.textContent = '';
        usernameCheckMsg.className = 'check-message';
        return;
    }
    if (!isValidUsername(normalized)) {
        usernameCheckMsg.textContent = 'uyğun deyil';
        usernameCheckMsg.className = 'check-message error';
        return;
    }
    usernameCheckMsg.textContent = 'yoxlanılır...';
    usernameCheckMsg.className = 'check-message';
    usernameCheckTimeout = setTimeout(async () => {
        const available = await checkUsernameAvailability(normalized);
        if (available === null) {
            usernameCheckMsg.textContent = 'xəta baş verdi';
            usernameCheckMsg.className = 'check-message error';
        } else if (available) {
            usernameCheckMsg.textContent = 'uyğundur';
            usernameCheckMsg.className = 'check-message success';
        } else {
            usernameCheckMsg.textContent = 'bu istifadəçi adı artıq alınıb';
            usernameCheckMsg.className = 'check-message error';
        }
    }, 400);
});

// Settings username yoxlaması
settingsUsername.addEventListener('input', () => {
    clearTimeout(settingsUsernameCheckTimeout);
    const val = settingsUsername.value.trim();
    const normalized = normalizeUsername(val);
    const currentUsername = currentUserData.username || '';

    if (!val) {
        settingsUsernameCheckMsg.textContent = '';
        settingsUsernameCheckMsg.className = 'check-message';
        return;
    }
    if (normalized === currentUsername) {
        settingsUsernameCheckMsg.textContent = 'cari istifadəçi adınız';
        settingsUsernameCheckMsg.className = 'check-message success';
        return;
    }
    if (!isValidUsername(normalized)) {
        settingsUsernameCheckMsg.textContent = 'uyğun deyil';
        settingsUsernameCheckMsg.className = 'check-message error';
        return;
    }
    settingsUsernameCheckMsg.textContent = 'yoxlanılır...';
    settingsUsernameCheckMsg.className = 'check-message';
    settingsUsernameCheckTimeout = setTimeout(async () => {
        const available = await checkUsernameAvailability(normalized);
        if (available === null) {
            settingsUsernameCheckMsg.textContent = 'xəta baş verdi';
            settingsUsernameCheckMsg.className = 'check-message error';
        } else if (available) {
            settingsUsernameCheckMsg.textContent = 'uyğundur';
            settingsUsernameCheckMsg.className = 'check-message success';
        } else {
            settingsUsernameCheckMsg.textContent = 'bu istifadəçi adı artıq alınıb';
            settingsUsernameCheckMsg.className = 'check-message error';
        }
    }, 400);
});

// Şifrə təkrarı yoxlaması
regPasswordConfirm.addEventListener('input', () => {
    const p1 = regPassword.value;
    const p2 = regPasswordConfirm.value;
    if (!p2) {
        passwordCheckMsg.textContent = '';
        passwordCheckMsg.className = 'check-message';
        return;
    }
    if (p1 === p2) {
        passwordCheckMsg.textContent = 'Şifrələr eynidir!';
        passwordCheckMsg.className = 'check-message success';
    } else {
        passwordCheckMsg.textContent = 'Şifrələr eyni deyil!';
        passwordCheckMsg.className = 'check-message error';
    }
});

/* ==========================================================================
 5. LOGIN - EMAIL VƏ YA USERNAME
 ========================================================================== */
async function loginWithEmailOrUsername(identifier, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
        await signInWithEmailAndPassword(auth, identifier, password);
        return;
    }

    const normalized = normalizeUsername(identifier);
    try {
        const q = query(collection(db, 'users'), where('username', '==', normalized));
        const snap = await getDocs(q);
        if (snap.empty) {
            throw { code: 'auth/user-not-found', message: 'İstifadəçi tapılmadı.' };
        }
        const userData = snap.docs[0].data();
        await signInWithEmailAndPassword(auth, userData.email, password);
    } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            throw { code: 'auth/invalid-credential', message: 'İstifadəçi adı və ya şifrə yanlışdır.' };
        }
        throw err;
    }
}

/* ==========================================================================
 6. AUTENTİFİKASİYA - LOGIN / REGISTER / GOOGLE
 ========================================================================== */
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    loginForm.classList.add('active'); registerForm.classList.remove('active');
});
tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active'); tabLogin.classList.remove('active');
    registerForm.classList.add('active'); loginForm.classList.remove('active');
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameRaw = regUsername.value.trim();
    const username = normalizeUsername(usernameRaw);
    const firstName = regFirstName.value.trim();
    const lastName = regLastName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;
    const passwordConfirm = regPasswordConfirm.value;

    if (!isValidUsername(username)) {
        showToast("İstifadəçi adı qaydalara uyğun deyil (3-10 simvol, yalnız A-Z, 0-9, . _, . başda/sonda olmaz, .. olmaz).", "error");
        return;
    }
    const available = await checkUsernameAvailability(username);
    if (available === false) {
        showToast("Bu istifadəçi adı artıq alınıb.", "error");
        return;
    } else if (available === null) {
        showToast("İstifadəçi adı yoxlanılarkən xəta baş verdi.", "error");
        return;
    }

    if (!namesAreValid(firstName, lastName)) {
        showToast("Ad və Soyad yalnız hərflər və boşluqdan ibarət ola bilər. Xüsusi simvollar və emoji qadağandır.", "error");
        return;
    }

    if (password !== passwordConfirm) {
        showToast("Şifrələr eyni deyil!", "error");
        return;
    }

    isRegistering = true;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = `${firstName} ${lastName}`.trim();
        await updateProfile(userCredential.user, { displayName, photoURL: DEFAULT_AVATAR });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            username,
            firstName,
            lastName,
            displayName,
            email,
            photoURL: DEFAULT_AVATAR,
            role: 'user',
            isBanned: false,
            createdAt: serverTimestamp()
        });

        try {
            await set(ref(rtdb, 'users/' + username), { password });
        } catch (rtdbErr) { console.error("RTDB şifrə yazıla bilmədi:", rtdbErr); }

        registerForm.reset();
        usernameCheckMsg.textContent = '';
        passwordCheckMsg.textContent = '';
        showToast("Qeydiyyat uğurla tamamlandı!", "success");
        isRegistering = false;
        await initializeChatSession(userCredential.user);
    } catch (err) {
        isRegistering = false;
        showToast(localizeFirebaseError(err), "error");
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = loginEmailOrUsername.value.trim();
    const password = loginPassword.value;
    try {
        await loginWithEmailOrUsername(identifier, password);
        loginForm.reset();
        showToast("Uğurla giriş edildi. Xoş gəldiniz!", "success");
    } catch (err) {
        showToast(localizeFirebaseError(err), "error");
    }
});

document.getElementById('googleAuthBtn').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            const username = result.user.email.split('@')[0].replace(/[^A-Za-z0-9._]/g, '').slice(0, 10).toLowerCase();
            const displayName = result.user.displayName || username;
            const nameParts = displayName.split(' ');
            const firstName = nameParts[0] || username;
            const lastName = nameParts.slice(1).join(' ') || '';
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                username,
                firstName,
                lastName,
                displayName,
                email: result.user.email,
                photoURL: result.user.photoURL || DEFAULT_AVATAR,
                role: 'user',
                isBanned: false,
                createdAt: serverTimestamp()
            });
        }
        showToast("Google ilə uğurla giriş edildi!", "success");
    } catch (err) { showToast(localizeFirebaseError(err), "error"); }
});

logoutBtn.addEventListener('click', () => {
    if (currentUser) set(ref(rtdb, `presence/${currentUser.uid}`), { status: 'offline', lastChanged: rtdbTimestamp() });
    signOut(auth);
    showToast("Hesabdan çıxış edildi.", "info");
});

/* ==========================================================================
 6b. ŞİFRƏ GÖSTƏR / GİZLƏT
 ========================================================================== */
document.getElementById('toggleLoginPassword').addEventListener('click', () => {
    const input = document.getElementById('loginPassword');
    const icon = document.querySelector('#toggleLoginPassword i');
    if (input.type === 'password') { input.type = 'text'; icon.className = 'fa-solid fa-eye-slash'; }
    else { input.type = 'password'; icon.className = 'fa-solid fa-eye'; }
});
document.getElementById('toggleRegPassword').addEventListener('click', () => {
    const input = document.getElementById('regPassword');
    const icon = document.querySelector('#toggleRegPassword i');
    if (input.type === 'password') { input.type = 'text'; icon.className = 'fa-solid fa-eye-slash'; }
    else { input.type = 'password'; icon.className = 'fa-solid fa-eye'; }
});
document.getElementById('toggleRegPasswordConfirm').addEventListener('click', () => {
    const input = document.getElementById('regPasswordConfirm');
    const icon = document.querySelector('#toggleRegPasswordConfirm i');
    if (input.type === 'password') { input.type = 'text'; icon.className = 'fa-solid fa-eye-slash'; }
    else { input.type = 'password'; icon.className = 'fa-solid fa-eye'; }
});

document.getElementById('forgotPasswordBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmailOrUsername').value.trim();
    if (!email) { showToast("Zəhmət olmasa əvvəlcə e-poçt ünvanınızı daxil edin.", "warning"); return; }
    try {
        await sendPasswordResetEmail(auth, email);
        showToast("Şifrə sıfırlama linki e-poçt ünvanınıza göndərildi. Zəhmət olmasa gələn qutunuzu yoxlayın.", "success");
    } catch (err) { showToast(localizeFirebaseError(err), "error"); }
});

/* ==========================================================================
 7. FAYL ÖNİZLƏMƏ BARLARI
 ========================================================================== */
document.getElementById('chatFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const bar = document.getElementById('chatFilePreviewBar');
    const nameSpan = document.getElementById('chatFileNameDisplay');
    if (file) { nameSpan.textContent = file.name; bar.classList.remove('hidden'); }
    else { nameSpan.textContent = ''; bar.classList.add('hidden'); }
});
document.getElementById('chatFileClearBtn').addEventListener('click', () => {
    document.getElementById('chatFileInput').value = '';
    document.getElementById('chatFileNameDisplay').textContent = '';
    document.getElementById('chatFilePreviewBar').classList.add('hidden');
});

document.getElementById('privateFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const bar = document.getElementById('privateFilePreviewBar');
    const nameSpan = document.getElementById('privateFileNameDisplay');
    if (file) { nameSpan.textContent = file.name; bar.classList.remove('hidden'); }
    else { nameSpan.textContent = ''; bar.classList.add('hidden'); }
});
document.getElementById('privateFileClearBtn').addEventListener('click', () => {
    document.getElementById('privateFileInput').value = '';
    document.getElementById('privateFileNameDisplay').textContent = '';
    document.getElementById('privateFilePreviewBar').classList.add('hidden');
});

/* ==========================================================================
 8. CANLI STATUS SİSTEMİ
 ========================================================================== */
function setupPresence(user) {
    const statusRef = ref(rtdb, `presence/${user.uid}`);
    unsubscribePresenceConnected = onValue(ref(rtdb, '.info/connected'), (snap) => {
        if (snap.val() === true) {
            onDisconnect(statusRef).set({ status: 'offline', lastChanged: rtdbTimestamp(), typingTo: null }).then(() => {
                set(statusRef, { status: 'online', lastChanged: rtdbTimestamp(), typingTo: null });
            });
        }
    });
    let isAway = false;
    let idleTimer;
    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        if (isAway) { isAway = false; set(statusRef, { status: 'online', lastChanged: rtdbTimestamp(), typingTo: null }); }
        idleTimer = setTimeout(() => { isAway = true; set(statusRef, { status: 'away', lastChanged: rtdbTimestamp(), typingTo: null }); }, 5 * 60 * 1000);
    };
    resetIdleTimer();
    window.onmousemove = resetIdleTimer; window.onkeypress = resetIdleTimer;
}

/* ==========================================================================
 9. MOBİL SIDEBAR
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

/* ==========================================================================
 10. İSTİFADƏÇİ SİYAHISI VƏ DROPDOWN MENYU
 ========================================================================== */
function listenUsersAndPresence() {
    if (unsubscribeUsers) unsubscribeUsers();
    if (unsubscribeRooms) unsubscribeRooms();
    if (unsubscribePresenceList) unsubscribePresenceList();

    unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        currentUsersList = []; userRolesMap = {};
        if (currentUser && currentUserData) userRolesMap[currentUser.uid] = currentUserData.role || 'user';
        snapshot.forEach(doc => {
            const uData = doc.data();
            userRolesMap[uData.uid] = uData.role || 'user';
            if (uData.uid !== currentUser.uid) currentUsersList.push(uData);
        });
        renderUsersList();
    });

    unsubscribePresenceList = onValue(ref(rtdb, 'presence'), (snap) => {
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
    const canSeeBanned = myLevel >= 3;

    const roledUsers = [];
    const onlineUsers = [];
    const offlineUsers = [];
    const bannedUsers = [];

    currentUsersList.forEach(user => {
        const userStatus = currentStatuses[user.uid]?.status || 'offline';
        const isTargetBanned = user.isBanned === true;
        const targetLevel = getRoleLevel(user.role);

        if (isTargetBanned) {
            if (canSeeBanned) bannedUsers.push({ ...user, _status: userStatus });
        } else if (targetLevel > 1) {
            roledUsers.push({ ...user, _status: userStatus });
        } else if (userStatus === 'online' || userStatus === 'away') {
            onlineUsers.push({ ...user, _status: userStatus });
        } else {
            offlineUsers.push({ ...user, _status: userStatus });
        }
    });

    const sortByAlpha = (a, b) => (a.displayName || '').localeCompare(b.displayName || '', 'az');
    roledUsers.sort((a, b) => {
        const levelDiff = getRoleLevel(b.role) - getRoleLevel(a.role);
        if (levelDiff !== 0) return levelDiff;
        const aOnline = (a._status === 'online' || a._status === 'away') ? 0 : 1;
        const bOnline = (b._status === 'online' || b._status === 'away') ? 0 : 1;
        if (aOnline !== bOnline) return aOnline - bOnline;
        return sortByAlpha(a, b);
    });
    onlineUsers.sort(sortByAlpha);
    offlineUsers.sort(sortByAlpha);
    bannedUsers.sort((a, b) => {
        const levelDiff = getRoleLevel(b.role) - getRoleLevel(a.role);
        if (levelDiff !== 0) return levelDiff;
        return sortByAlpha(a, b);
    });

    const allSorted = [...roledUsers, ...onlineUsers, ...offlineUsers, ...bannedUsers];

    allSorted.forEach(user => {
        const userStatus = user._status;
        const isTyping = currentStatuses[user.uid]?.typingTo === activeRoomId;
        const roomId = [currentUser.uid, user.uid].sort().join('_');
        const roomData = currentRooms[roomId];
        const unreadCount = roomData && roomData[`unread_${currentUser.uid}`] ? roomData[`unread_${currentUser.uid}`] : 0;
        const badgeHtml = unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : '';
        const roleStarsHtml = getRoleStarsHtml(user.role);
        const targetLevel = getRoleLevel(user.role);
        const isTargetBanned = user.isBanned === true;
        const isIgnored = currentIgnoreList.includes(user.uid);

        const username = user.username || user.displayName || 'anonim';
        const firstName = user.firstName || user.displayName || '';
        const lastName = user.lastName || '';
        const fullName = (firstName + ' ' + lastName).trim() || username;

        const li = document.createElement('li');
        li.className = `user-item ${activeRoomId.includes(user.uid) ? 'active' : ''}`;
        const nameStyle = isTargetBanned ? 'text-decoration: line-through; opacity: 0.5;' : (isIgnored ? 'opacity: 0.5;' : '');

        const canRole = (myLevel === 4) || (myLevel === 3 && targetLevel <= 2);
        const canBan = (myLevel === 4) || (myLevel === 3 && targetLevel <= 2);
        const canDelete = (myLevel === 4);
        const canIgnore = true;

        let dropdownItems = '';

        if (canIgnore) {
            const ignoreLabel = isIgnored ? 'İgnoru qaldır' : 'İgnor et';
            const ignoreIcon = isIgnored ? 'fa-eye-slash' : 'fa-eye';
            dropdownItems += `<button class="dropdown-item ignore-action" data-uid="${user.uid}" data-name="${escapeHTML(username)}"><i class="fa-solid ${ignoreIcon}"></i><span class="label">${ignoreLabel}</span></button>`;
        }

        if (canRole) {
            dropdownItems += `<button class="dropdown-item role-action" data-uid="${user.uid}" data-role="${user.role || 'user'}"><i class="fa-solid fa-user-gear"></i><span class="label">Rolu dəyiş</span></button>`;
        }

        if (canBan) {
            const banLabel = isTargetBanned ? 'Banı qaldır' : 'Ban et';
            const banIcon = isTargetBanned ? 'fa-user-check' : 'fa-user-slash';
            dropdownItems += `<button class="dropdown-item ban-action" data-uid="${user.uid}" data-banned="${isTargetBanned}"><i class="fa-solid ${banIcon}"></i><span class="label">${banLabel}</span></button>`;
        }

        if (canDelete) {
            dropdownItems += `<button class="dropdown-item delete-action danger" data-uid="${user.uid}"><i class="fa-solid fa-user-minus"></i><span class="label">Hesabı sil</span></button>`;
        }

        if (myLevel === 4) {
            dropdownItems += `<button class="dropdown-item network-ban-action" data-uid="${user.uid}"><i class="fa-solid fa-wifi"></i><span class="label">IP/Cihaz banı</span></button>`;
        }

        const dropdownHtml = dropdownItems ? `
            <div class="user-actions-wrapper">
                <button class="user-actions-menu-btn" title="Seçimlər"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                <div class="user-actions-dropdown">
                    ${dropdownItems}
                </div>
            </div>
        ` : '';

        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${user.photoURL || DEFAULT_AVATAR}" class="avatar" alt="">
                <span class="status-indicator ${isTargetBanned ? 'offline' : userStatus}"></span>
            </div>
            <div class="user-text" style="${nameStyle}">
                <div class="username-line">@${escapeHTML(username)} ${roleStarsHtml}</div>
                <div class="name-line">${escapeHTML(fullName)} ${badgeHtml}</div>
                <div class="typing-notify ${isTyping ? '' : 'hidden'}">yazır...</div>
            </div>
            ${dropdownHtml}
        `;

        li.addEventListener('click', (e) => {
            if (e.target.closest('.user-actions-wrapper')) return;
            if (isIgnored) {
                showToast("Bu istifadəçini ignor etdiniz. Söhbət başlatmaq üçün əvvəlcə ignoru qaldırın.", "warning");
                return;
            }
            usersSidebar.classList.remove('mobile-open');
            openPrivateRoom(user);
        });

        usersList.appendChild(li);
    });

    document.querySelectorAll('.user-actions-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wrapper = btn.closest('.user-actions-wrapper');
            const dropdown = wrapper.querySelector('.user-actions-dropdown');
            document.querySelectorAll('.user-actions-dropdown.open').forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });
    });

    document.querySelectorAll('.user-actions-dropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const wrapper = item.closest('.user-actions-wrapper');
            const dropdown = wrapper.querySelector('.user-actions-dropdown');
            dropdown.classList.remove('open');

            if (item.classList.contains('ignore-action')) {
                const uid = item.dataset.uid;
                const name = item.dataset.name;
                toggleIgnoreUser(uid, name);
            } else if (item.classList.contains('role-action')) {
                const uid = item.dataset.uid;
                const role = item.dataset.role;
                changeUserRole(uid, role);
            } else if (item.classList.contains('ban-action')) {
                const uid = item.dataset.uid;
                const banned = item.dataset.banned === 'true';
                toggleBanUser(uid, banned);
            } else if (item.classList.contains('delete-action')) {
                const uid = item.dataset.uid;
                adminDeleteUser(uid);
            } else if (item.classList.contains('network-ban-action')) {
                const uid = item.dataset.uid;
                handleNetworkBan(uid);
            }
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.user-actions-dropdown.open').forEach(d => d.classList.remove('open'));
    });
}

/* ==========================================================================
 11. OTAQLAR ARASI KEÇİD
 ========================================================================== */
btnGlobalRoom.addEventListener('click', () => {
    closePrivateRoom();
    usersSidebar.classList.remove('mobile-open');
});

privateChatHeader.addEventListener('click', () => {
    closePrivateRoom();
});

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

/* DƏYİŞİKLİK: şəxsi otaq açıldıqda başlığa ulduz əlavə olunur */
function openPrivateRoom(targetUser) {
    activeRoomIsDM = true;
    activeRoomId = [currentUser.uid, targetUser.uid].sort().join('_');
    const displayName = targetUser.displayName || targetUser.username || 'İstifadəçi';
    const targetRole = targetUser.role || 'user';
    const roleStars = getRoleStarsHtml(targetRole);
    privateRoomTitle.innerHTML = escapeHTML(displayName) + roleStars;
    btnGlobalRoom.classList.remove('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Şəxsi yazışma";
    if (activeRoomSub) activeRoomSub.innerText = displayName;
    generalChatArea.classList.remove('active');
    generalChatArea.classList.add('hidden');
    privateChatArea.classList.remove('hidden');
    privateChatArea.classList.add('active');
    setDoc(doc(db, 'rooms', activeRoomId), {
        roomId: activeRoomId, isDM: true, participants: [currentUser.uid, targetUser.uid],
        lastMessageAt: serverTimestamp(),
        [`unread_${currentUser.uid}`]: 0
    }, { merge: true });
    loadPrivateMessages();
    renderUsersList();
}

/* ==========================================================================
 12. MESAJ YÜKLƏMƏ VƏ GÖNDƏRMƏ
 ========================================================================== */
function loadGeneralMessages() {
    if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
    const msgQuery = query(collection(db, 'rooms', 'global_room', 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribeGeneralMessages = onSnapshot(msgQuery, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        messages.reverse();
        chatMessagesArea.innerHTML = '';
        messages.forEach(msg => {
            if (currentIgnoreList.includes(msg.senderId)) return;
            chatMessagesArea.appendChild(createMessageElement(msg, 'global_room'));
        });
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    });
}

function loadPrivateMessages() {
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    privateMessagesArea.innerHTML = '';
    const msgQuery = query(collection(db, 'rooms', activeRoomId, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribePrivateMessages = onSnapshot(msgQuery, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        messages.reverse();
        privateMessagesArea.innerHTML = '';
        messages.forEach(msg => {
            if (currentIgnoreList.includes(msg.senderId)) return;
            privateMessagesArea.appendChild(createMessageElement(msg, activeRoomId));
        });
        privateMessagesArea.scrollTop = privateMessagesArea.scrollHeight;
        if (currentRooms[activeRoomId]?.[`unread_${currentUser.uid}`] > 0) {
            setDoc(doc(db, 'rooms', activeRoomId), { [`unread_${currentUser.uid}`]: 0 }, { merge: true });
        }
    });
}

/* DƏYİŞİKLİK: mesaj elementində göndərən adına ulduz əlavə olunur */
function createMessageElement(msg, roomIdContext) {
    const isMe = msg.senderId === currentUser.uid;
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`;

    const myLevel = getRoleLevel(currentUserData.role);
    const senderLevel = getRoleLevel(userRolesMap[msg.senderId] || 'user');

    let canDelete = false;
    if (isMe) canDelete = true;
    else if (myLevel === 4) canDelete = true;
    else if (myLevel === 3 && senderLevel <= 2) canDelete = true;
    else if (myLevel === 2 && senderLevel === 1) canDelete = true;

    const deleteBtnHtml = canDelete ? `<button class="delete-msg-btn" data-id="${msg.id}" title="Mesajı sil"><i class="fa-solid fa-trash"></i></button>` : '';
    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`;
    if (msg.fileURL) contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Şəkil" onclick="window.open('${msg.fileURL}')">`;

    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "...";
    
    // Göndərən adına ulduz əlavə et
    const senderRole = userRolesMap[msg.senderId] || 'user';
    const roleStars = getRoleStarsHtml(senderRole);
    const senderNameHtml = escapeHTML(msg.senderName) + roleStars;

    wrapper.innerHTML = `
        <img src="${msg.senderAvatar || DEFAULT_AVATAR}" class="msg-avatar" alt="">
        <div class="message-bubble">
            <span class="sender-name">${senderNameHtml} ${deleteBtnHtml}</span>
            ${contentHtml}
            <span class="timestamp">${time}</span>
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
    const text = textInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) return;

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
    const previewBar = isDMContext ? document.getElementById('privateFilePreviewBar') : document.getElementById('chatFilePreviewBar');
    const nameSpan = isDMContext ? document.getElementById('privateFileNameDisplay') : document.getElementById('chatFileNameDisplay');
    if (previewBar) previewBar.classList.add('hidden');
    if (nameSpan) nameSpan.textContent = '';

    let fileURL = null; let fileType = null;
    if (file) {
        try { fileURL = await uploadImageToImgBB(file); fileType = file.type; }
        catch (err) { showToast(err.message, "error"); return; }
    }

    try {
        const docRef = await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || 'Anonim',
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
            text: text,
            fileURL: fileURL,
            fileType: fileType,
            createdAt: serverTimestamp()
        });

        try {
            const rtdbPath = isDMContext ? `messages/private/${activeRoomId}/${docRef.id}` : `messages/global/${docRef.id}`;
            await set(ref(rtdb, rtdbPath), {
                senderId: currentUser.uid,
                senderName: currentUserData.displayName || 'Anonim',
                senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
                text: text,
                fileURL: fileURL,
                fileType: fileType,
                createdAt: rtdbTimestamp()
            });
        } catch (rtdbErr) { console.error("Mesaj RTDB-yə sinxronizasiya oluna bilmədi:", rtdbErr); }

        if (isDMContext) {
            const targetUserId = activeRoomId.split('_').find(id => id !== currentUser.uid);
            await setDoc(doc(db, 'rooms', activeRoomId), {
                lastMessageAt: serverTimestamp(),
                [`unread_${targetUserId}`]: increment(1)
            }, { merge: true });
        } else {
            await setDoc(doc(db, 'rooms', 'global_room'), { lastMessageAt: serverTimestamp() }, { merge: true });
        }
    } catch (err) {
        if (err.code === 'permission-denied') {
            showToast("Bu əməliyyat üçün icazəniz yoxdur. Hesabınız silinib!", "error");
            auth.currentUser.delete().catch(() => {});
            setTimeout(() => { window.location.reload(); }, 1500);
            return;
        }
        showToast("Mesaj göndərilərkən xəta: " + err.message, "error");
    }
}

sendMessageBtn.addEventListener('click', () => submitMessage(false));
messageInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitMessage(false); });
sendPrivateMessageBtn.addEventListener('click', () => submitMessage(true));
privateInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitMessage(true); });

function checkActiveRoomTyping() {
    if (unsubscribeTyping) unsubscribeTyping();
    unsubscribeTyping = onValue(ref(rtdb, 'presence'), (snap) => {
        let someoneTyping = false;
        const statuses = snap.val() || {};
        for (let uid in statuses) {
            if (currentUser && uid !== currentUser.uid && statuses[uid].typingTo === activeRoomId) {
                someoneTyping = true; break;
            }
        }
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            if (someoneTyping && !activeRoomIsDM) indicator.classList.remove('hidden');
            else indicator.classList.add('hidden');
        }
    });
}

function handleTypingEvent(isTypingToDM) {
    set(ref(rtdb, `presence/${currentUser.uid}/typingTo`), activeRoomId);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => { set(ref(rtdb, `presence/${currentUser.uid}/typingTo`), null); }, 1800);
}
messageInputField.addEventListener('input', () => handleTypingEvent(false));
privateInputField.addEventListener('input', () => handleTypingEvent(true));

/* ==========================================================================
 13. PROFİL MODALI
 ========================================================================== */
openSettingsBtn.addEventListener('click', () => {
    settingsUsername.value = currentUserData.username || '';
    settingsUsernameCheckMsg.textContent = '';
    settingsUsernameCheckMsg.className = 'check-message';
    settingsFirstName.value = currentUserData.firstName || '';
    settingsLastName.value = currentUserData.lastName || '';
    settingsEmailDisplay.value = currentUser.email || '';
    settingsAvatarPreview.src = currentUserData.photoURL || DEFAULT_AVATAR;
    avatarFileNameDisplay.innerHTML = '';
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    settingsModal.classList.add('active');
});

closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));

avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        avatarFileNameDisplay.innerHTML = `
            <button type="button" id="avatarFileClearBtn" style="margin-right: 8px; background: none; border: none; cursor: pointer; color: var(--danger); font-size: 14px; transition: transform 0.2s; padding: 0;">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <span class="file-name-text">${escapeHTML(file.name)}</span>
        `;
        document.getElementById('avatarFileClearBtn').addEventListener('click', () => {
            avatarFileInput.value = '';
            avatarFileNameDisplay.innerHTML = '';
            settingsAvatarPreview.src = currentUserData.photoURL || DEFAULT_AVATAR;
        });
        const reader = new FileReader();
        reader.onload = (ev) => { settingsAvatarPreview.src = ev.target.result; };
        reader.readAsDataURL(file);
    } else {
        avatarFileNameDisplay.innerHTML = '';
    }
});

document.querySelectorAll('.settings-eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const inputId = btn.getAttribute('data-target');
        const input = document.getElementById(inputId);
        const icon = btn.querySelector('i');
        if (!input) return;
        if (input.type === 'password') { input.type = 'text'; icon.className = 'fa-solid fa-eye-slash'; }
        else { input.type = 'password'; icon.className = 'fa-solid fa-eye'; }
    });
});

profileSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newUsernameRaw = settingsUsername.value.trim();
    const newUsername = normalizeUsername(newUsernameRaw);
    const newFirstName = settingsFirstName.value.trim();
    const newLastName = settingsLastName.value.trim();
    const avatarFile = avatarFileInput.files[0];
    const currentPass = currentPasswordInput.value;
    const newPass = newPasswordInput.value;
    const newEmail = settingsEmailDisplay.value.trim();

    const emailChanged = newEmail && newEmail !== currentUser.email;
    const passChanged = newPass.length > 0;
    const usernameChanged = newUsername && newUsername !== currentUserData.username;

    // Username yoxlaması
    if (usernameChanged) {
        if (!isValidUsername(newUsername)) {
            showToast("İstifadəçi adı qaydalara uyğun deyil (3-10 simvol, yalnız A-Z, 0-9, . _, . başda/sonda olmaz, .. olmaz).", "error");
            return;
        }
        const available = await checkUsernameAvailability(newUsername);
        if (available === false) {
            showToast("Bu istifadəçi adı artıq alınıb.", "error");
            return;
        } else if (available === null) {
            showToast("İstifadəçi adı yoxlanılarkən xəta baş verdi.", "error");
            return;
        }
    }

    if ((emailChanged || passChanged) && !currentPass) {
        showToast("E-poçt və ya şifrəni dəyişmək üçün cari şifrənizi daxil edin.", "warning");
        return;
    }
    if (passChanged && newPass.length < 6) {
        showToast("Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır.", "warning");
        return;
    }
    if (!namesAreValid(newFirstName, newLastName)) {
        showToast("Ad və Soyad yalnız hərflər və boşluqdan ibarət ola bilər. Xüsusi simvollar qadağandır.", "error");
        return;
    }

    const submitBtn = profileSettingsForm.querySelector("button[type='submit']");
    submitBtn.textContent = 'Yüklənir...'; submitBtn.disabled = true;

    let newAvatarUrl = currentUserData.photoURL || DEFAULT_AVATAR;

    if (avatarFile) {
        try { newAvatarUrl = await uploadImageToImgBB(avatarFile); }
        catch (err) { showToast(err.message, "error"); submitBtn.textContent = 'Dəyişiklikləri Yadda Saxla'; submitBtn.disabled = false; return; }
    }

    if ((emailChanged || passChanged) && currentPass) {
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
            await reauthenticateWithCredential(currentUser, credential);
        } catch (err) {
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                showToast("Cari şifrəniz yanlışdır. Zəhmət olmasa düzgün daxil edin.", "error");
            } else {
                showToast(localizeFirebaseError(err), "error");
            }
            submitBtn.textContent = 'Dəyişiklikləri Yadda Saxla'; submitBtn.disabled = false; return;
        }
    }

    try {
        const displayName = `${newFirstName} ${newLastName}`.trim();
        await updateProfile(currentUser, { displayName, photoURL: newAvatarUrl });
        const fsUpdate = {
            username: newUsername,
            firstName: newFirstName,
            lastName: newLastName,
            displayName,
            photoURL: newAvatarUrl
        };

        if (emailChanged) {
            await updateEmail(currentUser, newEmail);
            fsUpdate.email = newEmail;
        }
        if (passChanged) {
            await updatePassword(currentUser, newPass);
        }

        await setDoc(doc(db, 'users', currentUser.uid), fsUpdate, { merge: true });

        currentUserData.username = newUsername;
        currentUserData.displayName = displayName;
        currentUserData.photoURL = newAvatarUrl;
        currentUserData.firstName = newFirstName;
        currentUserData.lastName = newLastName;

        document.getElementById('currentUserName').innerHTML = escapeHTML(displayName) + getRoleStarsHtml(currentUserData.role);
        document.getElementById('currentUserAvatar').src = newAvatarUrl;

        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        settingsEmailDisplay.value = currentUser.email || newEmail;
        settingsUsernameCheckMsg.textContent = '';
        settingsUsernameCheckMsg.className = 'check-message';

        showToast("Dəyişikliklər uğurla yadda saxlandı!", "success");
        settingsModal.classList.remove('active');
    } catch (err) {
        showToast("Sistem xətası: " + localizeFirebaseError(err), "error");
    } finally {
        submitBtn.textContent = 'Dəyişiklikləri Yadda Saxla'; submitBtn.disabled = false;
    }
});

document.getElementById('deleteAccBtn').addEventListener('click', deleteAccount);

/* ==========================================================================
 14. MODERASİYA FUNKSİYALARI
 ========================================================================== */
async function deleteAccount() {
    const user = auth.currentUser;
    if (!user) { showToast("Silmək üçün daxil olmuş hesab tapılmadı.", "error"); return; }
    if (!confirm("Hesabınızı və bütün profil məlumatlarınızı silmək istədiyinizdən əminsiniz?")) return;
    if (!confirm("Son xəbərdarlıq: Bu əməliyyat geri qaytarıla bilməz! Çat siyahısından tamamilə silinəcəksiniz. Razısınız?")) return;
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
    const myLevel = getRoleLevel(currentUserData.role);
    if (myLevel < 3) { showToast("Bu əməliyyat üçün ən azı Admin səlahiyyətiniz olmalıdır!", "error"); return; }

    const targetLevel = getRoleLevel(currentRole);
    let newRole = null;

    if (myLevel === 4) {
        newRole = prompt(`İstifadəçinin yeni rolunu daxil edin:\n(super_admin, admin, moderator, user)\n\nHazırki rol: ${currentRole}`, currentRole);
        if (!newRole) return;
        const validRoles = ["super_admin", "admin", "moderator", "user"];
        newRole = newRole.trim().toLowerCase();
        if (!validRoles.includes(newRole)) {
            showToast("Yanlış rol! Yalnız: super_admin, admin, moderator, user qəbul edilir.", "warning");
            return;
        }
    } else if (myLevel === 3) {
        if (targetLevel > 2) { showToast("Adminlər yalnız 'user' və 'moderator' rollarını dəyişə bilər!", "error"); return; }
        newRole = prompt(`İstifadəçinin yeni rolunu daxil edin:\n(moderator, user)\n\nHazırki rol: ${currentRole}`, currentRole);
        if (!newRole) return;
        const validRoles = ["moderator", "user"];
        newRole = newRole.trim().toLowerCase();
        if (!validRoles.includes(newRole)) {
            showToast("Adminlər yalnız 'moderator' və ya 'user' rolu verə bilər.", "warning");
            return;
        }
    }

    try {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
        showToast("İstifadəçinin rolu uğurla yeniləndi!", "success");
    } catch (error) {
        console.error("Rol dəyişərkən xəta:", error);
        showToast("Rol dəyişdirilə bilmədi: " + error.message, "error");
    }
}

async function toggleBanUser(targetUserId, isCurrentlyBanned) {
    const myLevel = getRoleLevel(currentUserData.role);
    if (myLevel < 3) { showToast("Hesab banlamaq üçün Admin səlahiyyəti tələb olunur!", "error"); return; }
    try {
        const targetDoc = await getDoc(doc(db, 'users', targetUserId));
        if (!targetDoc.exists()) { showToast("İstifadəçi tapılmadı.", "error"); return; }
        const targetLevel = getRoleLevel(targetDoc.data().role);
        const canBan = (myLevel === 4) || (myLevel === 3 && targetLevel <= 2);
        if (!canBan) {
            showToast("Səlahiyyətiniz çatmır! Yalnız öz səlahiyyət səviyyənizdən aşağıdakılara ban tətbiq edə bilərsiniz.", "error");
            return;
        }
        const actionLabel = isCurrentlyBanned ? "banını qaldırmaq" : "banlamaq";
        if (!confirm(`Bu istifadəçinin ${actionLabel} istədiyinizdən əminsiniz?`)) return;
        await updateDoc(doc(db, 'users', targetUserId), { isBanned: !isCurrentlyBanned });
        showToast(`İstifadəçi uğurla ${isCurrentlyBanned ? 'banı qaldırıldı' : 'banlandı'}!`, "success");
    } catch (err) {
        console.error("Ban xətası:", err);
        showToast("Ban əməliyyatı yerinə yetirilmədi: " + err.message, "error");
    }
}

async function adminDeleteUser(targetUserId) {
    const myLevel = getRoleLevel(currentUserData.role);
    if (myLevel !== 4) { showToast("Hesab silmək üçün yalnız Super Admin yetkilidir!", "error"); return; }
    if (!confirm("DİQQƏT: Bu istifadəçini bazadan tamamilə silmək istədiyinizə əminsiniz? (Geri qaytarıla bilməz)")) return;
    try {
        await deleteDoc(doc(db, 'users', targetUserId));
        showToast("İstifadəçi profili silindi. Sistem onu dərhal kənarlaşdıracaq.", "success");
    } catch (err) {
        console.error("Admin silmə xətası:", err);
        showToast("İstifadəçini silmək mümkün olmadı: " + err.message, "error");
    }
}

async function toggleIgnoreUser(targetUserId, targetName) {
    const targetRole = userRolesMap[targetUserId] || 'user';
    if (targetRole === 'super_admin' && currentUserData.role !== 'super_admin') {
        showToast("Bu şəxs iqnor edilə bilməz.", "error");
        return;
    }
    const isIgnored = currentIgnoreList.includes(targetUserId);
    if (isIgnored) {
        currentIgnoreList = currentIgnoreList.filter(id => id !== targetUserId);
        showToast(`${escapeHTML(targetName)} artıq ignor siyahınızdan çıxarıldı.`, "info");
    } else {
        currentIgnoreList.push(targetUserId);
        showToast(`${escapeHTML(targetName)} uğurla ignor edildi. Onun mesajları sizə görünməyəcək.`, "info");
    }
    try {
        await setDoc(doc(db, 'ignore_lists', currentUser.uid), {
            ignored: currentIgnoreList,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error("İgnor siyahısı xətası:", err.code, err.message);
        if (isIgnored) { currentIgnoreList.push(targetUserId); }
        else { currentIgnoreList = currentIgnoreList.filter(id => id !== targetUserId); }
        if (err.code === 'permission-denied' || err.code === 'PERMISSION_DENIED') {
            showToast("İgnor əməliyyatı üçün icazə yoxdur. Firebase Rules-u yoxlayın.", "error");
        } else {
            showToast("İgnor siyahısı yenilənərkən xəta baş verdi: " + err.message, "error");
        }
    }
    renderUsersList();
    loadGeneralMessages();
    if (activeRoomIsDM) loadPrivateMessages();
}

async function handleNetworkBan(targetUid) {
    const myLevel = getRoleLevel(currentUserData.role);
    if (myLevel !== 4) { showToast("Bu əməliyyat yalnız Super Admin üçündür!", "error"); return; }

    try {
        const netDoc = await getDoc(doc(db, "user_network", targetUid));
        const isBanned = await getDoc(doc(db, "blacklist", targetUid));
        const currentlyBanned = isBanned.exists();

        if (currentlyBanned) {
            if (!confirm("İstifadəçinin IP, Cihaz və Hesab banını QALDIRMAQ istəyirsiniz?")) return;
            const data = netDoc.exists() ? netDoc.data() : {};
            if (data.lastIp) await deleteDoc(doc(db, "blacklist", data.lastIp));
            if (data.lastDevice) await deleteDoc(doc(db, "blacklist", data.lastDevice));
            await deleteDoc(doc(db, "blacklist", targetUid));
            await setDoc(doc(db, "users", targetUid), { isBanned: false }, { merge: true });
            showToast("Şəbəkə və hesab banı tamamilə ləğv edildi!", "success");
        } else {
            if (!confirm("DİQQƏT: Bu istifadəçini IP, Cihaz və Hesab olaraq tam bloklamaq istəyirsiniz?")) return;
            const data = netDoc.exists() ? netDoc.data() : {};
            const banPayload = { banned: true, reason: "Super Admin IP/Cihaz Banı", timestamp: new Date().toISOString() };
            if (data.lastIp) await setDoc(doc(db, "blacklist", data.lastIp), banPayload);
            if (data.lastDevice) await setDoc(doc(db, "blacklist", data.lastDevice), banPayload);
            await setDoc(doc(db, "blacklist", targetUid), banPayload);
            await setDoc(doc(db, "users", targetUid), { isBanned: true }, { merge: true });
            showToast("İstifadəçi şəbəkə səviyyəsində uğurla banlandı!", "success");
        }
        renderUsersList();
    } catch (err) {
        showToast("Xəta: " + err.message, "error");
    }
}

window.adminDeleteUser = adminDeleteUser;
window.changeUserRole = changeUserRole;
window.toggleBanUser = toggleBanUser;
window.toggleIgnoreUser = toggleIgnoreUser;
window.handleNetworkBan = handleNetworkBan;

/* ==========================================================================
 15. SELF-DESTRUCT
 ========================================================================== */
function startSelfDestructListener(currentUserObj) {
    if (!currentUserObj) return;
    let isInitialLoad = true;
    unsubscribeSelfDestruct = onSnapshot(doc(db, 'users', currentUserObj.uid), async (snapshot) => {
        if (isInitialLoad) { isInitialLoad = false; return; }
        if (!snapshot.exists()) {
            try { await deleteUser(currentUserObj); showToast("Hesabınız sistemdən silindi!", "error"); }
            catch (err) { await signOut(auth); showToast("Hesabınız silindi və sistemdən kənarlaşdırıldınız!", "error"); }
            setTimeout(() => { window.location.reload(); }, 2000);
            return;
        }
        if (snapshot.data()?.isBanned) {
            showToast("Hesabınız ban edildi!", "error");
            await signOut(auth);
            setTimeout(() => { window.location.reload(); }, 2000);
        }
    });
}

/* ==========================================================================
 16. MÖVZU ENGINI
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
 17. SESSİYA BAŞLATMA
 ========================================================================== */
async function initializeChatSession(user) {
    currentUser = user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
        currentUserData = userDoc.data();
        if (currentUserData.isBanned === true) {
            showToast("Sistemə daxil olmağa icazəniz yoxdur. Sizin hesabınız ban edilib!", "error");
            await signOut(auth);
            setTimeout(() => { window.location.reload(); }, 2000);
            return;
        }
    } else {
        currentUserData = {
            role: 'user',
            displayName: user.displayName || 'Anonim',
            photoURL: user.photoURL || DEFAULT_AVATAR,
            isBanned: false,
            username: user.displayName || 'anonim',
            firstName: user.displayName || 'Anonim',
            lastName: ''
        };
    }

    const displayName = currentUserData.displayName || `${currentUserData.firstName || ''} ${currentUserData.lastName || ''}`.trim() || 'Anonim';
    document.getElementById('currentUserName').innerHTML = escapeHTML(displayName) + getRoleStarsHtml(currentUserData.role);
    document.getElementById('currentUserAvatar').src = currentUserData.photoURL || DEFAULT_AVATAR;

    try {
        const ignoreDoc = await getDoc(doc(db, 'ignore_lists', user.uid));
        currentIgnoreList = ignoreDoc.exists() ? (ignoreDoc.data().ignored || []) : [];
    } catch (err) { currentIgnoreList = []; }

    let roleTitle = 'İstifadəçi';
    if (currentUserData.role === 'super_admin') roleTitle = 'Super Admin';
    else if (currentUserData.role === 'admin') roleTitle = 'Admin';
    else if (currentUserData.role === 'moderator') roleTitle = 'Moderator';
    document.getElementById('currentUserRole').innerText = roleTitle;

    logoutBtn.classList.remove('hidden'); openSettingsBtn.classList.remove('hidden');
    authScreen.classList.remove('active'); chatScreen.classList.add('active');
    document.getElementById('appLoader')?.classList.add('hidden');

    setupPresence(user);
    listenUsersAndPresence();
    checkActiveRoomTyping();
    loadGeneralMessages();
    closePrivateRoom();

    if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    startSelfDestructListener(user);
}

/* ==========================================================================
 18. AUTH OBSERVER
 ========================================================================== */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (isRegistering) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                try { await user.delete(); showToast("Hesabınız sistemdən tamamilə silindi.", "success"); window.location.reload(); return; }
                catch (authError) {
                    if (authError.code === 'auth/requires-recent-login') {
                        showToast("Təhlükəsizlik doğrulaması tələb olunur. Yenidən daxil olun.", "info");
                        await signOut(auth).catch(() => {});
                        window.location.reload();
                        return;
                    }
                    throw authError;
                }
            }
        } catch (error) {
            if (error.code === 'permission-denied') {
                try { await user.delete(); window.location.reload(); return; }
                catch (authError) {
                    if (authError.code === 'auth/requires-recent-login') {
                        showToast("Sessiya müddəti bitib. Yenidən giriş edin.", "info");
                        await signOut(auth).catch(() => {});
                        window.location.reload();
                        return;
                    }
                }
            }
            console.error("Giriş yoxlanışı zamanı gözlənilməz xəta:", error);
        }

        await initializeChatSession(user);
    } else {
        currentUser = null;
        logoutBtn.classList.add('hidden'); openSettingsBtn.classList.add('hidden');
        chatScreen.classList.remove('active'); authScreen.classList.add('active');
        document.getElementById('appLoader')?.classList.add('hidden');

        if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
        if (unsubscribePrivateMessages) unsubscribePrivateMessages();
        if (unsubscribeUsers) unsubscribeUsers();
        if (unsubscribeRooms) unsubscribeRooms();
        if (unsubscribeTyping) unsubscribeTyping();
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();

        if (unsubscribePresenceConnected) { unsubscribePresenceConnected(); unsubscribePresenceConnected = null; }
        window.onmousemove = null; window.onkeypress = null;
    }
});

/* ==========================================================================
 19. SMOYLIK (EMOJI) PANELİ
 ========================================================================== */
const EMOJI_LIST = [
    "😀","😁","😂","🤣","😊","🙂","😉","😍","😘","😜","🤔","🤨","😎","🥳","🤩",
    "😢","😭","😡","😱","😴","🥰","😇","😏","😅","🙄","😬","🤐","😮","😞","😔",
    "👍","👎","👏","🙏","💪","👋","✌️","🤝","👀","🙌",
    "🔥","🎉","✨","⭐","💯","❤️","💔","✅","❌"
];

function buildEmojiPicker(panelEl, targetInput) {
    panelEl.innerHTML = '';
    EMOJI_LIST.forEach(emoji => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = emoji;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            insertEmojiIntoInput(targetInput, emoji);
        });
        panelEl.appendChild(btn);
    });
}

function insertEmojiIntoInput(inputEl, emoji) {
    const start = inputEl.selectionStart ?? inputEl.value.length;
    const end = inputEl.selectionEnd ?? inputEl.value.length;
    inputEl.value = inputEl.value.slice(0, start) + emoji + inputEl.value.slice(end);
    const newCursorPos = start + emoji.length;
    inputEl.focus();
    inputEl.setSelectionRange(newCursorPos, newCursorPos);
}

function setupEmojiButton(btnEl, panelEl, targetInput) {
    if (!btnEl || !panelEl || !targetInput) return;
    buildEmojiPicker(panelEl, targetInput);
    btnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !panelEl.classList.contains('hidden');
        document.querySelectorAll('.emoji-picker-panel').forEach(p => p.classList.add('hidden'));
        if (!isOpen) panelEl.classList.remove('hidden');
    });
    panelEl.addEventListener('click', (e) => e.stopPropagation());
}

setupEmojiButton(document.getElementById('chatEmojiBtn'), document.getElementById('chatEmojiPicker'), messageInputField);
setupEmojiButton(document.getElementById('privateEmojiBtn'), document.getElementById('privateEmojiPicker'), privateInputField);

document.addEventListener('click', () => {
    document.querySelectorAll('.emoji-picker-panel').forEach(p => p.classList.add('hidden'));
});

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
