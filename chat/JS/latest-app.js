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
let lastPublicRoom = 'global';

let unsubscribeGeneralMessages = null;
let unsubscribePrivateMessages = null;
let unsubscribeUsers = null;
let unsubscribeRooms = null;
let unsubscribeTyping = null;
let unsubscribeSelfDestruct = null;
let unsubscribeAdminMessages = null;
let typingTimeout = null;
let unsubscribePresenceConnected = null;
let unsubscribePresenceList = null;
let isRegistering = false;

let currentUsersList = [];
let currentStatuses = {};
let currentRooms = {};
let userRolesMap = {};
let userDataMap = {};

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
const btnAdminRoom = document.getElementById('btnAdminRoom');
const themeToggle = document.getElementById('themeToggle');
const siteLogo = document.getElementById('siteLogo');

const activeRoomTitle = document.getElementById('activeRoomTitle');
const activeRoomSub = document.getElementById('activeRoomSub');

const generalChatArea = document.getElementById('generalChatArea');
const chatMessagesArea = document.getElementById('chatMessagesArea');
const messageInputField = document.getElementById('messageInputField');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatFileInput = document.getElementById('chatFileInput');

const adminChatArea = document.getElementById('adminChatArea');
const adminMessagesArea = document.getElementById('adminMessagesArea');
const adminInputField = document.getElementById('adminInputField');
const sendAdminMessageBtn = document.getElementById('sendAdminMessageBtn');
const adminFileInput = document.getElementById('adminFileInput');
const adminFilePreviewBar = document.getElementById('adminFilePreviewBar');
const adminFileNameDisplay = document.getElementById('adminFileNameDisplay');
const adminFileClearBtn = document.getElementById('adminFileClearBtn');
const adminEmojiBtn = document.getElementById('adminEmojiBtn');
const adminEmojiPicker = document.getElementById('adminEmojiPicker');
const adminTypingIndicator = document.getElementById('adminTypingIndicator');

const privateChatArea = document.getElementById('privateChatArea');
const privateChatHeader = document.getElementById('privateChatHeader');
const privateRoomTitle = document.getElementById('privateRoomTitle');
const privateRoomUsername = document.getElementById('privateRoomUsername');
const privateChatAvatar = document.getElementById('privateChatAvatar');
const privateMessagesArea = document.getElementById('privateMessagesArea');
const privateInputField = document.getElementById('privateInputField');
const sendPrivateMessageBtn = document.getElementById('sendPrivateMessageBtn');
const privateFileInput = document.getElementById('privateFileInput');

const regUsername = document.getElementById('regUsername');
const regFirstName = document.getElementById('regFirstName');
const regLastName = document.getElementById('regLastName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regPasswordConfirm = document.getElementById('regPasswordConfirm');
const usernameCheckMsg = document.getElementById('usernameCheckMsg');
const passwordCheckMsg = document.getElementById('passwordCheckMsg');

const loginEmailOrUsername = document.getElementById('loginEmailOrUsername');
const loginPassword = document.getElementById('loginPassword');

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

// Temp ban modal elementləri
const tempBanModal = document.getElementById('tempBanModal');
const closeTempBanBtn = document.getElementById('closeTempBanBtn');
const confirmTempBanBtn = document.getElementById('confirmTempBanBtn');
const tempBanTargetName = document.getElementById('tempBanTargetName');
const tempBanDurationGroup = document.getElementById('tempBanDurationGroup');
const removeTempBanBtn = document.getElementById('removeTempBanBtn');

/* ==========================================================================
 2b. KÖMƏKÇİ FUNKSİYALAR
 ========================================================================== */
const getRoleLevel = (role) => {
    if (role === 'super_admin') return 4;
    if (role === 'admin') return 3;
    if (role === 'moderator') return 2;
    return 1;
};

const getRoleStarsHtml = (role) => {
    let color = '';
    let starClass = '';
    if (role === 'super_admin') {
        color = '#f1c40f';
        starClass = 'super-admin-star';
    } else if (role === 'admin') {
        color = '#e74c3c';
        starClass = 'admin-star';
    } else if (role === 'moderator') {
        color = '#3498db';
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
        case "auth/invalid-credential": return "İstifadəçi adı, e-poçt və ya şifrə yanlışdır.";
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
    const regex = /^[A-Za-z0-9](?!.*\.\.)[A-Za-z0-9._]{1,28}[A-Za-z0-9]$/;
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
        showToast("İstifadəçi adı qaydalara uyğun deyil (3-30 simvol, yalnız A-Z, 0-9, . _, . başda/sonda olmaz, .. olmaz).", "error");
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
// 👮 === POLİS KOD 4: QEYDIYYAT ANINDA ŞƏBƏKƏ YOXLAMASI === 👮
// Network Ban edilmiş IP/cihazın yeni hesab yaratmasını bloklayır.
try {
    let regIp = null;
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
        if (ipRes.ok) { const ipData = await ipRes.json(); regIp = ipData.ip; }
    } catch (_) {}

    const regInfo = navigator.userAgent + navigator.language + screen.width + screen.height;
    let regHash = 0;
    for (let i = 0; i < regInfo.length; i++) { regHash = ((regHash << 5) - regHash) + regInfo.charCodeAt(i); regHash |= 0; }
    const regDeviceId = 'dev_' + Math.abs(regHash);

    const checks = [];
    if (regIp) checks.push(getDoc(doc(db, 'blacklist', regIp)));
    checks.push(getDoc(doc(db, 'blacklist', regDeviceId)));
    const results = await Promise.all(checks);

    if (results.some(r => r.exists())) {
        showToast("Bu cihaz və ya şəbəkədən qeydiyyat qadağandır!", "error");
        return;
    }
} catch (_) {}
// =========================================================
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
     
        // 🔐 Şifrələri RTDB-yə yaz. 🔐
        try {
            await set(ref(rtdb, 'users/' + username), { password });
        } catch (rtdbErr) { console.error("RTDB şifrə yazıla bilmədi:", rtdbErr); }
        // 🔐 Şifrələri RTDB-yə yaz. -SON 🔐

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
 isRegistering = true;
    try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            const username = result.user.email.split('@')[0].replace(/[^A-Za-z0-9._]/g, '').slice(0, 30).toLowerCase();
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
     isRegistering = false;
        showToast("Google ilə uğurla giriş edildi!", "success");
     await initializeChatSession(result.user);
    } catch (err) {isRegistering = false; showToast(localizeFirebaseError(err), "error"); }
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

adminFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) { adminFileNameDisplay.textContent = file.name; adminFilePreviewBar.classList.remove('hidden'); }
    else { adminFileNameDisplay.textContent = ''; adminFilePreviewBar.classList.add('hidden'); }
});
adminFileClearBtn.addEventListener('click', () => {
    document.getElementById('adminFileInput').value = '';
    adminFileNameDisplay.textContent = '';
    adminFilePreviewBar.classList.add('hidden');
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
        currentUsersList = [];
        userRolesMap = {};
        userDataMap = {};
        if (currentUser && currentUserData) {
            userRolesMap[currentUser.uid] = currentUserData.role || 'user';
            userDataMap[currentUser.uid] = {
                username: currentUserData.username || '',
                displayName: currentUserData.displayName || '',
                firstName: currentUserData.firstName || '',
                lastName: currentUserData.lastName || '',
                photoURL: currentUserData.photoURL || DEFAULT_AVATAR,
                role: currentUserData.role || 'user'
            };
        }
        snapshot.forEach(doc => {
            const uData = doc.data();
            userRolesMap[uData.uid] = uData.role || 'user';
            userDataMap[uData.uid] = {
                username: uData.username || '',
                displayName: uData.displayName || '',
                firstName: uData.firstName || '',
                lastName: uData.lastName || '',
                photoURL: uData.photoURL || DEFAULT_AVATAR,
                role: uData.role || 'user',
                isBanned: uData.isBanned || false,
                banExpires: uData.banExpires || null,
                networkBanned: uData.networkBanned || false
            };
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
    const canSeeBanned = myLevel >= 2;

    const roledUsers = [];
    const onlineUsers = [];
    const offlineUsers = [];
    const bannedUsers = [];

    currentUsersList.forEach(user => {
        const userStatus = currentStatuses[user.uid]?.status || 'offline';
        const isTargetBanned = user.isBanned === true || user.networkBanned === true;
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
        const isTargetBanned = user.isBanned === true || user.networkBanned === true;
        const isIgnored = currentIgnoreList.includes(user.uid);
        const isNetworkBanned = user.networkBanned === true;

        // ===== YENİ: həm normal/temp ban, həm də network ban üçün üstü xətt və solğunluq =====
        const isBannedOrNetworkBanned = isTargetBanned || isNetworkBanned;

        const username = user.username || user.displayName || 'anonim';
        const firstName = user.firstName || user.displayName || '';
        const lastName = user.lastName || '';
        const fullName = (firstName + ' ' + lastName).trim() || username;

        const li = document.createElement('li');
        li.className = `user-item ${activeRoomId.includes(user.uid) ? 'active' : ''}`;
        const nameStyle = isBannedOrNetworkBanned ? 'text-decoration: line-through; opacity: 0.5;' : (isIgnored ? 'opacity: 0.5;' : '');

        const canRole = (myLevel === 4) || (myLevel === 3 && targetLevel <= 2);
        const canBan = (myLevel === 4) || (myLevel === 3 && targetLevel <= 2);
        const canDelete = (myLevel === 4);
        const canIgnore = true;
        const canWhois = (myLevel === 4);
        const canTempBan = (myLevel >= 2 && (myLevel === 4 || targetLevel < myLevel));

        let dropdownItems = '';

        // ==========================================================================
        // BAN QAYDALARI (TƏKMİL MƏNTİQ)
        // ==========================================================================
        //
        // 1. NETWORK BAN (IP/Cihaz)
        //    - Yalnız "IP/Cihaz banını qaldır" düyməsi ilə qaldırılır.
        //    - Normal ban və temp ban düymələri GÖSTƏRİLMİR.
        //    - Rol dəyişmə və hesab silmə düymələri GÖSTƏRİLİR.
        //    - Network ban tətbiq edilərkən aktiv normal ban və ya temp ban varsa,
        //      onlar avtomatik LƏĞV EDİLİR və yalnız network ban keçərli olur.
        //
        // 2. NORMAL BAN
        //    - Yalnız "Banı qaldır" düyməsi ilə qaldırılır.
        //    - Temp ban düyməsi GÖSTƏRİLMİR.
        //    - Network ban (əgər super admin varsa) GÖSTƏRİLƏ BİLƏR.
        //    - Normal ban tətbiq edilərkən aktiv temp ban varsa, o LƏĞV EDİLİR.
        //    - Aktiv network ban varsa, normal ban düyməsi artıq görünmədiyi üçün
        //      normal ban tətbiq edilə bilməz.
        //    - Rol dəyişmə və hesab silmə GÖSTƏRİLİR.
        //
        // 3. TEMP BAN (Vaxt ilə qov)
        //    - Yalnız "Vaxt banını qaldır" düyməsi ilə qaldırılır.
        //    - Network ban və normal ban (icazə varsa) GÖSTƏRİLƏ BİLƏR.
        //    - Aktiv network ban və ya normal ban varsa, temp ban düyməsi GÖSTƏRİLMİR
        //      (çünki daha ağır ban növü aktivdir).
        //    - Rol dəyişmə və hesab silmə GÖSTƏRİLİR.
        //
        // ==========================================================================
        // QEYD: Bütün ban növlərində "Rol dəyişmə" və "Hesabı sil" düymələri
        //       həmişə göstərilir (əgər icazə varsa), çünki bu əməliyyatlar
        //       istifadəçinin ban statusundan asılı olmayaraq icra oluna bilər.
        // ==========================================================================
        const isNormalBan = isTargetBanned && !user.banExpires;
        const isTempBan = isTargetBanned && user.banExpires;

        
        // BİRİNCİ HİSSƏ: SSENARİLƏRƏ GÖRƏ BAN BUTONLARI
        // Ssenari 1: Əgər network ban aktivdirsə:
        if (isNetworkBanned) {
        if (myLevel === 4) {
            dropdownItems += `<button class="dropdown-item network-ban-action network-banned" data-uid="${user.uid}">
                <i class="fa-solid fa-wifi"></i>
                <span class="label">IP və Cihazının banını aç</span>
            </button>`;
        }
        }
        // Ssenari 2: Əgər Temp ban aktivdirsə:
        else if (isTempBan && canTempBan) {
            dropdownItems += `<button class="dropdown-item temp-ban-action temp-ban-active" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                <i class="fa-solid fa-clock"></i>
                <span class="label">Müddətli banını aç</span>
            </button>`;
            // Temp ban olan şəxsə admin "Ban et" edə bilər (normal ban tətbiq etmək üçün)
            if (canBan) {
                dropdownItems += `<button class="dropdown-item ban-action" data-uid="${user.uid}" data-banned="false">
                    <i class="fa-solid fa-user-slash"></i>
                    <span class="label">Müddətsiz ban et</span>
                </button>`;
            }
            // Super admin "IP/Cihaz banı" tətbiq edə bilər
            if (myLevel === 4) {
                dropdownItems += `<button class="dropdown-item network-ban-action" data-uid="${user.uid}">
                    <i class="fa-solid fa-wifi"></i>
                    <span class="label">IP və Cihazını ban et</span>
                </button>`;
            }
        }
        // Ssenari 3: Əgər Normal ban aktivdirsə:
        else if (isNormalBan && canBan) {
            dropdownItems += `<button class="dropdown-item ban-action ban-active" data-uid="${user.uid}" data-banned="true">
                <i class="fa-solid fa-user-check"></i>
                <span class="label">Müddətsiz banını aç</span>
            </button>`;
            // Super admin "IP/Cihaz banı" tətbiq edə bilər
            if (myLevel === 4) {
                dropdownItems += `<button class="dropdown-item network-ban-action" data-uid="${user.uid}">
                    <i class="fa-solid fa-wifi"></i>
                    <span class="label">IP və Cihazını ban et</span>
                </button>`;
            }
        }
        // Ssenari 4: Heç bir ban yoxdursa:
        else if (!isTargetBanned && !isNetworkBanned) {
            if (canTempBan) {
                dropdownItems += `<button class="dropdown-item temp-ban-action" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                    <i class="fa-solid fa-clock"></i>
                    <span class="label">Müddətli ban et</span>
                </button>`;
            }
         
            if (canBan) {
                dropdownItems += `<button class="dropdown-item ban-action" data-uid="${user.uid}" data-banned="false">
                    <i class="fa-solid fa-user-slash"></i>
                    <span class="label">Müddətsiz ban et</span>
                </button>`;
            }
            
            if (myLevel === 4) {
                dropdownItems += `<button class="dropdown-item network-ban-action" data-uid="${user.uid}">
                    <i class="fa-solid fa-wifi"></i>
                    <span class="label">IP və Cihazını ban et</span>
                </button>`;
            }
        }
        // İKİNCİ HİSSƏ: MÜSTƏQİL-ŞƏRTSİZ BUTONLAR
        // 1. Hesabı silmə – yalnız super admin üçün

       if (canDelete) {
            dropdownItems += `<button class="dropdown-item delete-action danger" data-uid="${user.uid}">
                <i class="fa-solid fa-user-minus"></i>
                <span class="label">Hesabı sil</span>
            </button>`;
        }

        // 2. Rol dəyişmə – bütün hallarda (əgər icazə varsa)
       if (canRole) {
            dropdownItems += `<button class="dropdown-item role-action" data-uid="${user.uid}" data-role="${user.role || 'user'}">
                <i class="fa-solid fa-user-gear"></i>
                <span class="label">Rolu dəyiş</span>
            </button>`;
        }

        // 3. İgnor – hər kəs üçün
        if (canIgnore) {
            const ignoreLabel = isIgnored ? 'İgnoru qaldır' : 'İgnor et';
            const ignoreIcon = isIgnored ? 'fa-eye-slash' : 'fa-eye';
            dropdownItems += `<button class="dropdown-item ignore-action" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                <i class="fa-solid ${ignoreIcon}"></i>
                <span class="label">${ignoreLabel}</span>
            </button>`;
        }

        // 4. Whois – yalnız super admin üçün
        if (canWhois) {
            dropdownItems += `<button class="dropdown-item whois-action" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                <i class="fa-solid fa-circle-info"></i>
                <span class="label">Whois</span>
            </button>`;
        }

        const dropdownHtml = dropdownItems ? `
            <div class="user-actions-wrapper">
                <button class="user-actions-menu-btn" title="Seçimlər"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                <div class="user-actions-dropdown">
                    ${dropdownItems}
                </div>
            </div>
        ` : '';

        // ===== YENİ: status indicator da network ban üçün offline =====
        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${user.photoURL || DEFAULT_AVATAR}" class="avatar" alt="">
                <span class="status-indicator ${isBannedOrNetworkBanned ? 'offline' : userStatus}"></span>
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
            } else if (item.classList.contains('whois-action')) {
                const uid = item.dataset.uid;
                showWhois(uid);
            } else if (item.classList.contains('temp-ban-action')) {
                const uid = item.dataset.uid;
                const name = item.dataset.name;
                // Normal ban yoxlaması (təhlükəsizlik üçün)
                const targetUser = userDataMap[uid];
                if (targetUser?.isBanned && !targetUser?.banExpires) {
                    showToast("Bu hesab normal ban edilib! Vaxt ilə ban etmək mümkün deyil.", "error");
                    return;
                }
                showTempBanModal(uid, name);
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
function switchToGlobalRoom() {
    activeRoomId = 'global_room';
    activeRoomIsDM = false;
    lastPublicRoom = 'global';
    btnGlobalRoom.classList.add('active');
    btnAdminRoom.classList.remove('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Ümumi Çat";
    if (activeRoomSub) activeRoomSub.innerText = "Son 50 mesaj göstərilir";
    generalChatArea.classList.remove('hidden');
    generalChatArea.classList.add('active');
    adminChatArea.classList.remove('active');
    adminChatArea.classList.add('hidden');
    privateChatArea.classList.remove('active');
    privateChatArea.classList.add('hidden');
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    if (unsubscribeAdminMessages) { unsubscribeAdminMessages(); unsubscribeAdminMessages = null; }
    loadGeneralMessages();
    renderUsersList();
}

function switchToAdminRoom() {
    activeRoomId = 'admin_room';
    activeRoomIsDM = false;
    lastPublicRoom = 'admin';
    btnAdminRoom.classList.add('active');
    btnGlobalRoom.classList.remove('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Rəhbərlik otağı";
    if (activeRoomSub) activeRoomSub.innerText = "Yalnız moderator, admin və super admin";
    adminChatArea.classList.remove('hidden');
    adminChatArea.classList.add('active');
    generalChatArea.classList.remove('active');
    generalChatArea.classList.add('hidden');
    privateChatArea.classList.remove('active');
    privateChatArea.classList.add('hidden');
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    if (unsubscribeGeneralMessages) { unsubscribeGeneralMessages(); unsubscribeGeneralMessages = null; }
    loadAdminMessages();
    renderUsersList();
}

btnGlobalRoom.addEventListener('click', () => {
    switchToGlobalRoom();
    usersSidebar.classList.remove('mobile-open');
});

btnAdminRoom.addEventListener('click', () => {
    switchToAdminRoom();
    usersSidebar.classList.remove('mobile-open');
});

function closePrivateRoom() {
    activeRoomIsDM = false;
    if (lastPublicRoom === 'admin') {
        switchToAdminRoom();
    } else {
        switchToGlobalRoom();
    }
}

privateChatHeader.addEventListener('click', closePrivateRoom);

function openPrivateRoom(targetUser) {
    activeRoomIsDM = true;
    activeRoomId = [currentUser.uid, targetUser.uid].sort().join('_');
    const displayName = targetUser.displayName || targetUser.username || 'İstifadəçi';
    const username = targetUser.username || '';
    const avatar = targetUser.photoURL || DEFAULT_AVATAR;
    const targetRole = targetUser.role || 'user';
    const roleStars = getRoleStarsHtml(targetRole);

    privateChatAvatar.src = avatar;
    privateRoomTitle.innerHTML = escapeHTML(displayName) + roleStars;
    privateRoomUsername.textContent = `@${escapeHTML(username)}`;

    btnGlobalRoom.classList.remove('active');
    btnAdminRoom.classList.remove('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Şəxsi yazışma";
    if (activeRoomSub) activeRoomSub.innerText = displayName;
    generalChatArea.classList.remove('active');
    generalChatArea.classList.add('hidden');
    adminChatArea.classList.remove('active');
    adminChatArea.classList.add('hidden');
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

function loadAdminMessages() {
    if (unsubscribeAdminMessages) unsubscribeAdminMessages();
    const msgQuery = query(collection(db, 'rooms', 'admin_room', 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribeAdminMessages = onSnapshot(msgQuery, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        messages.reverse();
        adminMessagesArea.innerHTML = '';
        messages.forEach(msg => {
            if (currentIgnoreList.includes(msg.senderId)) return;
            adminMessagesArea.appendChild(createMessageElement(msg, 'admin_room'));
        });
        adminMessagesArea.scrollTop = adminMessagesArea.scrollHeight;
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

    let senderUsername = '';
    if (msg.senderUsername) {
        senderUsername = msg.senderUsername;
    } else {
        const userData = userDataMap[msg.senderId];
        if (userData && userData.username) {
            senderUsername = userData.username;
        }
    }

    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`;
    if (msg.fileURL) contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Şəkil" onclick="window.open('${msg.fileURL}')">`;

    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "...";
    
    const senderRole = userRolesMap[msg.senderId] || 'user';
    const roleStars = getRoleStarsHtml(senderRole);
    const senderNameHtml = escapeHTML(msg.senderName) + roleStars;

    const usernameHtml = senderUsername ? `<span class="sender-username">@${escapeHTML(senderUsername)}</span>` : '';

    wrapper.innerHTML = `
        <img src="${msg.senderAvatar || DEFAULT_AVATAR}" class="msg-avatar" alt="">
        <div class="message-bubble">
            <span class="sender-name">${senderNameHtml} ${deleteBtnHtml}</span>
            ${usernameHtml}
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
    let textInput, fileInput, targetRoom;
    if (isDMContext) {
        textInput = privateInputField;
        fileInput = privateFileInput;
        targetRoom = activeRoomId;
    } else if (activeRoomId === 'admin_room') {
        textInput = adminInputField;
        fileInput = adminFileInput;
        targetRoom = 'admin_room';
    } else {
        textInput = messageInputField;
        fileInput = chatFileInput;
        targetRoom = 'global_room';
    }

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
    if (activeRoomId === 'admin_room') {
        adminFileNameDisplay.textContent = '';
        adminFilePreviewBar.classList.add('hidden');
    } else if (isDMContext) {
        document.getElementById('privateFileNameDisplay').textContent = '';
        document.getElementById('privateFilePreviewBar').classList.add('hidden');
    } else {
        document.getElementById('chatFileNameDisplay').textContent = '';
        document.getElementById('chatFilePreviewBar').classList.add('hidden');
    }

    let fileURL = null; let fileType = null;
    if (file) {
        try { fileURL = await uploadImageToImgBB(file); fileType = file.type; }
        catch (err) { showToast(err.message, "error"); return; }
    }

    const senderUsername = currentUserData.username || '';

    try {
        const docRef = await addDoc(collection(db, 'rooms', targetRoom, 'messages'), {
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || 'Anonim',
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
            senderUsername: senderUsername,
            text: text,
            fileURL: fileURL,
            fileType: fileType,
            createdAt: serverTimestamp()
        });

        try {
            const rtdbPath = isDMContext ? `messages/private/${activeRoomId}/${docRef.id}` : `messages/${targetRoom}/${docRef.id}`;
            await set(ref(rtdb, rtdbPath), {
                senderId: currentUser.uid,
                senderName: currentUserData.displayName || 'Anonim',
                senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
                senderUsername: senderUsername,
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
            await setDoc(doc(db, 'rooms', targetRoom), { lastMessageAt: serverTimestamp() }, { merge: true });
        }
    } catch (err) {
     // 👮 === POLİS KOD 2: MESAJ YAZAN ZAMANI SƏNƏD YOXLAMASI === 👮
     // permission-denied → sənəd yoxdur → sil + reload → POLİS KOD 1 tələsi işə düşür.
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
sendAdminMessageBtn.addEventListener('click', () => submitMessage(false));
adminInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitMessage(false); });
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
        const indicator = activeRoomId === 'global_room' ? document.getElementById('typingIndicator') : 
                          activeRoomId === 'admin_room' ? document.getElementById('adminTypingIndicator') : null;
        if (indicator) {
            if (someoneTyping && !activeRoomIsDM) indicator.classList.remove('hidden');
            else indicator.classList.add('hidden');
        }
    });
}

function handleTypingEvent() {
    set(ref(rtdb, `presence/${currentUser.uid}/typingTo`), activeRoomId);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => { set(ref(rtdb, `presence/${currentUser.uid}/typingTo`), null); }, 1800);
}
messageInputField.addEventListener('input', handleTypingEvent);
adminInputField.addEventListener('input', handleTypingEvent);
privateInputField.addEventListener('input', handleTypingEvent);

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

    if (usernameChanged) {
        if (!isValidUsername(newUsername)) {
            showToast("İstifadəçi adı qaydalara uyğun deyil (3-30 simvol, yalnız A-Z, 0-9, . _, . başda/sonda olmaz, .. olmaz).", "error");
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

        if (userDataMap[currentUser.uid]) {
            userDataMap[currentUser.uid].username = newUsername;
            userDataMap[currentUser.uid].displayName = displayName;
            userDataMap[currentUser.uid].firstName = newFirstName;
            userDataMap[currentUser.uid].lastName = newLastName;
            userDataMap[currentUser.uid].photoURL = newAvatarUrl;
        }

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
        await updateDoc(doc(db, 'users', targetUserId), {
        isBanned: !isCurrentlyBanned,
        banExpires: null  // normal ban zamanı temp ban qalıqları silinir
});
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
    loadAdminMessages();
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
            await setDoc(doc(db, "users", targetUid), { isBanned: false, networkBanned: false, banExpires: null }, { merge: true });
            showToast("Şəbəkə və hesab banı tamamilə ləğv edildi!", "success");
        } else {
            if (!confirm("DİQQƏT: Bu istifadəçini IP, Cihaz və Hesab olaraq tam bloklamaq istəyirsiniz?")) return;
            const data = netDoc.exists() ? netDoc.data() : {};
            const banPayload = { banned: true, reason: "Super Admin IP/Cihaz Banı", timestamp: new Date().toISOString() };
            if (data.lastIp) await setDoc(doc(db, "blacklist", data.lastIp), banPayload);
            if (data.lastDevice) await setDoc(doc(db, "blacklist", data.lastDevice), banPayload);
            await setDoc(doc(db, "blacklist", targetUid), banPayload);
            await setDoc(doc(db, "users", targetUid), { isBanned: false, networkBanned: true, banExpires: null }, { merge: true });
            showToast("İstifadəçi şəbəkə səviyyəsində uğurla banlandı!", "success");
        }
        renderUsersList();
    } catch (err) {
        showToast("Xəta: " + err.message, "error");
    }
}

/* ==========================================================================
   NETWORK BAN - GİRİŞ YOXLAMASI
 ========================================================================== */
(function () {
    let networkBanChecked = false;

    async function fetchIP() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch { return null; }
    }

    function getDeviceId() {
        const info = navigator.userAgent + navigator.language + screen.width + screen.height;
        let hash = 0;
        for (let i = 0; i < info.length; i++) { hash = ((hash << 5) - hash) + info.charCodeAt(i); hash |= 0; }
        return 'dev_' + Math.abs(hash);
    }

    function showBanPage(message) {
        document.body.innerHTML = `

            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; height:100dvh; background: radial-gradient(circle at center, #1a0b12 0%, #08101a 100%); color:#e74c3c; font-family:'Varela Round', sans-serif; text-align:center; padding:20px; box-sizing:border-box; overflow:hidden;">

                <div style="background: rgba(231, 76, 60, 0.05); border: 1px solid rgba(231, 76, 60, 0.2); padding: 40px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); max-width: 450px; width: 100%; backdrop-filter: blur(10px);">

                    <div style="width: 80px; height: 80px; background: rgba(231, 76, 60, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 2px solid rgba(231,76,60,0.5);">

                        <i class="fa-solid fa-network-wired" style="font-size: 32px; color: #e74c3c;"></i>

                    </div>

                    <h2 style="margin: 0 0 15px 0; font-size: 24px; letter-spacing: 1px; color: #fff;">GİRİŞ QADAĞANDIR</h2>

                    <p style="color:#94a3b8; margin: 0; font-size: 15px; line-height: 1.6;">Sizin IP ünvanınız və cihazınız KINOFLIX istifadə qaydalarını pozduğuna görə sistemdən <strong style="color:#e74c3c;">tamamilə uzaqlaşdırılıb</strong>.</p>

                </div>

            </div>

        `;

    }

    async function checkNetworkBan(user) {
        if (networkBanChecked) return;
        networkBanChecked = true;

        const ip = await fetchIP();
        const deviceId = getDeviceId();

        try {
            const checks = [getDoc(doc(db, "blacklist", user.uid))];
            if (ip) checks.push(getDoc(doc(db, "blacklist", ip)));
            checks.push(getDoc(doc(db, "blacklist", deviceId)));
            const results = await Promise.all(checks);

            if (results.some(r => r.exists())) {
                showBanPage("Sizin IP ünvanınız və ya cihazınız icma qaydalarını pozduğuna görə sistemdən <strong style='color:#e74c3c;'>tamamilə uzaqlaşdırılıb</strong>.");
                await signOut(auth).catch(() => {});
            }
        } catch (e) { /* səssiz xəta */ }
    }

    // Auth state dəyişdikdə yoxla
    onAuthStateChanged(auth, (user) => {
        if (user) {
            networkBanChecked = false; // hər yeni giriş üçün sıfırla
            setTimeout(() => checkNetworkBan(user), 2000); // user_network yazılsın deyə gözlə
        }
    });
})();

// Temp ban qaldırma funksiyası
async function removeTempBan(targetUid, targetName) {
    if (!confirm(`@${escapeHTML(targetName)} üçün vaxt banını qaldırmaq istədiyinizə əminsiniz?`)) return;
    try {
        await updateDoc(doc(db, 'users', targetUid), {
            isBanned: false,
            banExpires: null
        });
        showToast(`@${escapeHTML(targetName)} üçün vaxt banı uğurla qaldırıldı!`, "success");
        renderUsersList();
    } catch (err) {
        console.error("Temp ban qaldırma xətası:", err);
        showToast("Əməliyyat uğursuz oldu: " + err.message, "error");
    }
}

window.adminDeleteUser = adminDeleteUser;
window.changeUserRole = changeUserRole;
window.toggleBanUser = toggleBanUser;
window.toggleIgnoreUser = toggleIgnoreUser;
window.handleNetworkBan = handleNetworkBan;
window.removeTempBan = removeTempBan;

/* ==========================================================================
 15. SELF-DESTRUCT
 ========================================================================== */
// 👮 === POLİS KOD 3: REAL-TİME İZLƏMƏ - ANİ SƏNƏD YOXLAMASI === 👮
// Chat açıq ikən sənəd silinərsə dərhal tutur → deleteUser → reload.
function startSelfDestructListener(currentUserObj) {
    if (!currentUserObj) return;
    let isFirstSnapshot = true;
    unsubscribeSelfDestruct = onSnapshot(doc(db, 'users', currentUserObj.uid), async (snapshot) => {
        const wasFirst = isFirstSnapshot;
        isFirstSnapshot = false;

        if (!snapshot.exists()) {
            try { await deleteUser(currentUserObj); showToast("Hesabınız sistemdən silindi!", "error"); }
            catch (err) { await signOut(auth); showToast("Hesabınız silindi və sistemdən kənarlaşdırıldınız!", "error"); }
            setTimeout(() => { window.location.reload(); }, 2000);
            return;
        }
        const data = snapshot.data();

        // Ban yoxdursa ilk snapshot-u keç — initializeChatSession artıq yoxlayıb
        if (wasFirst && !data.isBanned && !data.networkBanned) return;

        if (data.isBanned && data.banExpires) {
            const expires = data.banExpires.toDate ? data.banExpires.toDate() : new Date(data.banExpires);
            if (expires <= new Date()) {
                await updateDoc(doc(db, 'users', currentUserObj.uid), {
                    isBanned: false,
                    banExpires: null
                });
                showToast("Ban müddətiniz bitdi, artıq daxil ola bilərsiniz.", "success");
                return;
            } else {
                showToast(`Siz ${formatDuration(Math.round((expires - new Date()) / 60000))} müddətinə banlandınız!`, "error");
                await signOut(auth);
                setTimeout(() => { window.location.reload(); }, 2000);
                return;
            }
        } else if (data.isBanned || data.networkBanned) {
            showToast("Hesabınız ban edildi!", "error");
            await signOut(auth);
            setTimeout(() => { window.location.reload(); }, 2000);
            return;
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
 17. SESSİYA BAŞLATMA (YENİLƏNİB - Sənəd yoxdursa avtomatik yaradılır)
 ========================================================================== */
async function initializeChatSession(user) {
    currentUser = user;

    // Loader-i göstər ki, ban yoxlaması zamanı UI flash olmasın
    document.getElementById('appLoader')?.classList.remove('hidden');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
        currentUserData = userDoc.data();

        if (currentUserData.isBanned && currentUserData.banExpires) {
            const expires = currentUserData.banExpires.toDate ? currentUserData.banExpires.toDate() : new Date(currentUserData.banExpires);
            if (expires <= new Date()) {
                await updateDoc(doc(db, 'users', user.uid), {
                    isBanned: false,
                    banExpires: null
                });
                currentUserData.isBanned = false;
                currentUserData.banExpires = null;
                showToast("Ban müddətiniz bitdi, artıq daxil ola bilərsiniz.", "success");
            } else {
                showToast(`Siz ${formatDuration(Math.round((expires - new Date()) / 60000))} müddətinə banlandınız!`, "error");
                await signOut(auth);
                document.getElementById('appLoader')?.classList.add('hidden');
                return;
            }
        } else if (currentUserData.isBanned || currentUserData.networkBanned) {
            showToast("Sistemə daxil olmağa icazəniz yoxdur. Sizin hesabınız ban edilib!", "error");
            await signOut(auth);
            document.getElementById('appLoader')?.classList.add('hidden');
            return;
        }
    } else {
        // ✅ Sənəd yoxdursa – avtomatik yarat (Google və ya başqa üsulla gələn istifadəçi üçün)
        const username = user.email
            ? user.email.split('@')[0].replace(/[^A-Za-z0-9._]/g, '').slice(0, 30).toLowerCase()
            : 'user';
        const displayName = user.displayName || username;
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || username;
        const lastName = nameParts.slice(1).join(' ') || '';

        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            username,
            firstName,
            lastName,
            displayName,
            email: user.email || '',
            photoURL: user.photoURL || DEFAULT_AVATAR,
            role: 'user',
            isBanned: false,
            createdAt: serverTimestamp()
        });

        currentUserData = {
            uid: user.uid,
            username,
            firstName,
            lastName,
            displayName,
            email: user.email || '',
            photoURL: user.photoURL || DEFAULT_AVATAR,
            role: 'user',
            isBanned: false
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

    const myLevel = getRoleLevel(currentUserData.role);
    if (myLevel >= 2) {
        btnAdminRoom.classList.remove('hidden');
    } else {
        btnAdminRoom.classList.add('hidden');
    }

    logoutBtn.classList.remove('hidden'); openSettingsBtn.classList.remove('hidden');
    authScreen.classList.remove('active'); chatScreen.classList.add('active');
    document.getElementById('appLoader')?.classList.add('hidden');

    setupPresence(user);
    listenUsersAndPresence();
    checkActiveRoomTyping();
    switchToGlobalRoom();

    if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    startSelfDestructListener(user);

    updateUserNetwork().catch(() => {});
    startBanCleanup();
}

/* ==========================================================================
 18. AUTH OBSERVER (YENİLƏNİB - Gözləmə mexanizmi əlavə edildi)
 ========================================================================== */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (isRegistering) return;
// 👮 === POLİS KOD 1: GİRİŞ/SƏHIFƏ YENİLƏMƏ - SƏNƏD YOXLAMASI === 👮
// Sənəd yoxdursa → sil. Köhnə sessiya → signOut + login ekranı.
        try {
            let userDoc = await getDoc(doc(db, 'users', user.uid));
            // ✅ Sənəd yoxdursa, 2 saniyə gözlə (Firestore yazması tamamlansın)
            if (!userDoc.exists()) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                userDoc = await getDoc(doc(db, 'users', user.uid));
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
            }
        } catch (error) {
            if (error.code === 'permission-denied') {
                // Permission denied halında da sənədi təkrar yoxla
                try {
                    const userDocRetry = await getDoc(doc(db, 'users', user.uid));
                    if (!userDocRetry.exists()) {
                        await user.delete();
                        window.location.reload();
                        return;
                    }
                } catch (_) {
                    await user.delete();
                    window.location.reload();
                    return;
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
        if (unsubscribeAdminMessages) { unsubscribeAdminMessages(); unsubscribeAdminMessages = null; }

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
setupEmojiButton(document.getElementById('adminEmojiBtn'), document.getElementById('adminEmojiPicker'), adminInputField);

document.addEventListener('click', () => {
    document.querySelectorAll('.emoji-picker-panel').forEach(p => p.classList.add('hidden'));
});



/* ==========================================================================
 GHOST HESABLARIN AVTOMATİK TƏMİZLƏNMƏSİ (PATCH) — v4
 --------------------------------------------------------------------------
 1) Hər istifadəçi öz heartbeat-ini yazır (presence-dən AYRI node-da)
 2) Admin/super_admin hər 5 dəqiqədə presence+heartbeat müqayisə edib
    stale (heartbeat-i kəsilmiş) hesabları offline edir
 3) Ban olunma anında (Firestore isBanned: true) presence DƏRHAL offline
    edilir — toggleBanUser() və ya network-ban koduna TOXUNMADAN, sadəcə
    isBanned dəyişikliyini canlı dinləməklə
 4) __cleanLegacyGhosts() — patch-dən əvvəlki heartbeat-siz qeydlər üçün
    bir dəfəlik əl ilə təmizləmə (konsoldan)
 5) "Toplu offlayn et" düyməsi — yalnız admin+ görür, sağ alt küncdə üzən
    düymə, eyni təmizləməni saytın özündən, konsolsuz işə salır
 ========================================================================== */
(function () {
    const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000;
    const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
    const STALE_THRESHOLD_MS = 6 * 60 * 1000;
    const FIRST_HEARTBEAT_DELAY_MS = 3 * 1000;
    const FIRST_SWEEP_DELAY_MS = 20 * 1000;

    let sweepRunning = false;

    // --- 1) HƏR İSTİFADƏÇİ: öz heartbeat-ini yazır ---
    function sendHeartbeat() {
        if (!currentUser) {
            console.log('[heartbeat] currentUser yoxdur, yazılmadı');
            return;
        }
        set(ref(rtdb, `heartbeats/${currentUser.uid}`), rtdbTimestamp())
            .then(() => console.log('[heartbeat] yazıldı:', currentUser.uid))
            .catch((err) => console.error('[heartbeat] XƏTA:', err.code || err.message));
    }
    setTimeout(sendHeartbeat, FIRST_HEARTBEAT_DELAY_MS);
    setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    window.__debugSendHeartbeat = sendHeartbeat;

    // --- 2) ADMIN/SUPER_ADMIN: presence + heartbeats müqayisəsi ---
    function readOnce(path) {
        return new Promise((resolve, reject) => {
            onValue(
                ref(rtdb, path),
                (snap) => resolve(snap.val() || {}),
                (err) => reject(err),
                { onlyOnce: true }
            );
        });
    }

    async function sweepGhostAccounts() {
        console.log('--- [ghost-sweep] başladı ---');
        console.log('[ghost-sweep] currentUser:', currentUser?.uid, '| role:', currentUserData?.role);

        if (!currentUser || !currentUserData) { console.log('[ghost-sweep] dayandı: login yoxdur'); return; }
        if (typeof getRoleLevel !== 'function') { console.log('[ghost-sweep] dayandı: getRoleLevel tapılmadı'); return; }
        if (getRoleLevel(currentUserData.role) < 3) { console.log('[ghost-sweep] dayandı: admin+ deyil'); return; }
        if (sweepRunning) { console.log('[ghost-sweep] dayandı: artıq işləyir'); return; }
        sweepRunning = true;

        try {
            const presenceData = await readOnce('presence');
            console.log('[ghost-sweep] presence oxundu, uid sayı:', Object.keys(presenceData).length, presenceData);

            const heartbeatData = await readOnce('heartbeats');
            console.log('[ghost-sweep] heartbeats oxundu, uid sayı:', Object.keys(heartbeatData).length, heartbeatData);

            const now = Date.now();
            let ghostCount = 0;

            for (const uid of Object.keys(presenceData)) {
                const p = presenceData[uid];
                const lastBeat = heartbeatData[uid];
                const ageSec = lastBeat ? Math.round((now - lastBeat) / 1000) : null;

                console.log(
                    `[ghost-sweep] uid=${uid} status=${p?.status} heartbeat=${lastBeat ? new Date(lastBeat).toLocaleTimeString() : 'YOXDUR'} yaş=${ageSec !== null ? ageSec + 's' : '-'}`
                );

                if (!p || (p.status !== 'online' && p.status !== 'away')) continue;
                if (!lastBeat) { console.log(`[ghost-sweep]   -> keçir: heartbeat yoxdur (köhnə klient ola bilər)`); continue; }

                if (now - lastBeat > STALE_THRESHOLD_MS) {
                    ghostCount++;
                    console.log(`[ghost-sweep]   -> GHOST aşkarlandı, offline edilir: ${uid}`);
                    set(ref(rtdb, `presence/${uid}`), {
                        status: 'offline',
                        lastChanged: rtdbTimestamp(),
                        typingTo: null
                    })
                    .then(() => console.log(`[ghost-sweep]   -> YAZILDI (offline): ${uid}`))
                    .catch((err) => console.error(`[ghost-sweep]   -> YAZIŞ XƏTASI: ${uid}`, err.code || err.message));
                } else {
                    console.log(`[ghost-sweep]   -> hələ stale deyil (threshold: ${STALE_THRESHOLD_MS/1000}s)`);
                }
            }

            console.log(`[ghost-sweep] bitdi. ghost sayı: ${ghostCount}`);
        } catch (e) {
            console.error('[ghost-sweep] ÜMUMİ XƏTA:', e.code || e.message);
        } finally {
            sweepRunning = false;
        }
    }

    setTimeout(sweepGhostAccounts, FIRST_SWEEP_DELAY_MS);
    setInterval(sweepGhostAccounts, SWEEP_INTERVAL_MS);
    window.__debugGhostSweep = sweepGhostAccounts;

    // --- 3) ANINDA REAKSİYA: ban olunan zaman presence-i DƏRHAL offline et ---
    // toggleBanUser() və ya network-ban kodunu wrap/edit etmirik — sadəcə
    // Firestore-da isBanned === true olan istifadəçiləri CANLI dinləyirik.
    // Bir uid bu sorğuya YENİ daxil olduğu an (yəni indicə banlandığı an),
    // onun RTDB presence-i paralel olaraq offline yazılır.
    let banWatcherActive = false;
    function startBanWatcher() {
        if (banWatcherActive) return;
        if (!currentUser || !currentUserData) return;
        if (typeof getRoleLevel !== 'function' || getRoleLevel(currentUserData.role) < 3) return;
        banWatcherActive = true;

        onSnapshot(
            query(collection(db, 'users'), where('isBanned', '==', true)),
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type !== 'added') return; // yalnız TƏZƏ banlananlar
                    const uid = change.doc.id;
                    console.log('[ban-watcher] yeni ban aşkarlandı, presence offline edilir:', uid);
                    set(ref(rtdb, `presence/${uid}`), {
                        status: 'offline',
                        lastChanged: rtdbTimestamp(),
                        typingTo: null
                    })
                    .then(() => console.log('[ban-watcher] YAZILDI (offline):', uid))
                    .catch((err) => console.error('[ban-watcher] yazış xətası:', uid, err.code || err.message));
                });
            },
            (err) => console.error('[ban-watcher] dinləmə xətası:', err.code || err.message)
        );
        console.log('[ban-watcher] aktiv edildi');
    }

    // currentUser/currentUserData asinxron yükləndiyi üçün hazır olana qədər yoxlayırıq
    const banWatcherInit = setInterval(() => {
        if (currentUser && currentUserData) {
            startBanWatcher();
            if (banWatcherActive) clearInterval(banWatcherInit);
        }
    }, 3000);

    // --- 4) BİR DƏFƏLİK TƏMİZLƏMƏ: patch-dən ƏVVƏLKİ heartbeat-siz qeydlər ---
    // Həm konsoldan (__cleanLegacyGhosts()), həm də aşağıdakı düymədən çağırılır
    async function runCleanLegacyGhosts() {
        if (!currentUser || !currentUserData || getRoleLevel(currentUserData.role) < 3) {
            console.log('[clean-legacy] dayandı: admin+ deyil');
            return 0;
        }
        const presenceData = await readOnce('presence');
        const heartbeatData = await readOnce('heartbeats');
        let count = 0;

        for (const uid of Object.keys(presenceData)) {
            const p = presenceData[uid];
            if (!p || (p.status !== 'online' && p.status !== 'away')) continue;
            if (heartbeatData[uid]) continue; // heartbeat varsa - normal sweep-ə həvalə olunub, toxunma

            count++;
            console.log('[clean-legacy] offline edilir:', uid);
            await set(ref(rtdb, `presence/${uid}`), {
                status: 'offline',
                lastChanged: rtdbTimestamp(),
                typingTo: null
            }).catch((err) => console.error('[clean-legacy] xəta:', uid, err.code || err.message));
        }
        console.log(`[clean-legacy] bitdi. ${count} köhnə qeyd offline edildi.`);
        return count;
    }
    window.__cleanLegacyGhosts = runCleanLegacyGhosts;

    // --- 5) ADMİN ÜÇÜN "TOPLU OFFLAYN ET" DÜYMƏSİ (yalnız admin+ görür) ---
    function createBulkOfflineButton() {
        if (document.getElementById('bulkOfflineBtn')) return; // artıq yaradılıb
        if (!currentUserData || getRoleLevel(currentUserData.role) < 3) return;

        const btn = document.createElement('button');
        btn.id = 'bulkOfflineBtn';
        btn.innerHTML = '<i class="fa-solid fa-broom"></i> Toplu offlayn et';
        btn.title = 'Heartbeat-i olmayan köhnə ghost hesabları toplu şəkildə offline edir';
        btn.style.cssText = `
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 16px;
            background: #e74c3c;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.35);
        `;

        btn.addEventListener('click', async () => {
            if (!confirm('Heartbeat-i olmayan bütün köhnə "online/away" hesablar offline ediləcək. Davam edilsin?')) return;
            btn.disabled = true;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = 'İşlənir...';

            const count = await runCleanLegacyGhosts();

            btn.innerHTML = originalHTML;
            btn.disabled = false;

            const msg = `${count} köhnə hesab offline edildi.`;
            if (typeof showToast === 'function') showToast(msg, 'success');
            else alert(msg);
        });

        document.body.appendChild(btn);
    }

    const bulkBtnInit = setInterval(() => {
        if (currentUser && currentUserData) {
            createBulkOfflineButton();
        }
    }, 3000);
})();

/* ==========================================================================
 20b. IP VƏ CİHAZ MƏLUMATLARINI TOPLAMA (YENİ)
 ========================================================================== */

async function updateUserNetwork() {
    if (!currentUser) return;
    try {
        let ip = 'Məlumat yoxdur';
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
            if (ipRes.ok) {
                const ipData = await ipRes.json();
                ip = ipData.ip;
            }
        } catch (_) { /* IP alınmazsa default qalır */ }

        const userAgent = navigator.userAgent || 'Məlumat yoxdur';
        const platform = navigator.platform || 'Məlumat yoxdur';
        const language = navigator.language || 'Məlumat yoxdur';
        const screenRes = `${window.screen.width}x${window.screen.height}`;

        await setDoc(doc(db, 'user_network', currentUser.uid), {
            lastIp: ip,
            lastUserAgent: userAgent,
            lastPlatform: platform,
            lastLanguage: language,
            screenResolution: screenRes,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (err) {
        console.warn('[updateUserNetwork] Xəta:', err.message);
    }
}

/* ==========================================================================
 20c. WHOIS FUNKSİYASI (YENİ)
 ========================================================================== */

async function showWhois(targetUid) {
    const modal = document.getElementById('whoisModal');
    const content = document.getElementById('whoisContent');
    const title = document.getElementById('whoisModalTitle');

    const userData = userDataMap[targetUid];
    const displayName = userData?.displayName || userData?.username || 'İstifadəçi';
    title.textContent = `Whois - ${escapeHTML(displayName)}`;

    content.innerHTML = `<p style="color: var(--text-muted);">Yüklənir...</p>`;
    modal.classList.add('active');

    try {
        const netDoc = await getDoc(doc(db, 'user_network', targetUid));
        if (!netDoc.exists()) {
            content.innerHTML = `<div class="whois-empty">Bu istifadəçi üçün hələ heç bir şəbəkə məlumatı yoxdur.</div>`;
            return;
        }
        const data = netDoc.data();
        const updated = data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleString('az-AZ') : 'Məlumat yoxdur';

        const rows = [
            { label: 'IP Ünvanı', value: data.lastIp || 'Məlumat yoxdur' },
            { label: 'Əməliyyat Sistemi', value: data.lastPlatform || 'Məlumat yoxdur' },
            { label: 'Brauzer / User-Agent', value: data.lastUserAgent || 'Məlumat yoxdur' },
            { label: 'Dil', value: data.lastLanguage || 'Məlumat yoxdur' },
            { label: 'Ekran Həlli', value: data.screenResolution || 'Məlumat yoxdur' },
            { label: 'Son yenilənmə', value: updated }
        ];

        content.innerHTML = rows.map(row => `
            <div class="whois-row">
                <span class="whois-label">${row.label}</span>
                <span class="whois-value">${escapeHTML(row.value)}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error('[whois] Xəta:', err);
        content.innerHTML = `<div class="whois-empty">Məlumat yüklənərkən xəta baş verdi: ${escapeHTML(err.message)}</div>`;
    }
}

document.getElementById('closeWhoisBtn').addEventListener('click', () => {
    document.getElementById('whoisModal').classList.remove('active');
});
document.getElementById('whoisModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('whoisModal').classList.remove('active');
    }
});

/* ==========================================================================
 20d. VAXT İLƏ QOV FUNKSİYASI (YENİ)
 ========================================================================== */

let tempBanTargetUid = null;

function showTempBanModal(uid, name) {
    tempBanTargetUid = uid;
    tempBanTargetName.textContent = `İstifadəçi: @${escapeHTML(name)}`;
    tempBanModal.classList.add('active');

    // Yoxlayırıq ki, istifadəçi artıq temp ban edilibmi?
    const user = userDataMap[uid];
    const isTempBanned = user?.isBanned === true && user?.banExpires;
    if (isTempBanned) {
        // Banı qaldır düyməsini göstər, müddət seçimini gizlət
        tempBanDurationGroup.style.display = 'none';
        confirmTempBanBtn.style.display = 'none';
        removeTempBanBtn.style.display = 'block';
        removeTempBanBtn.dataset.uid = uid;
        removeTempBanBtn.dataset.name = name;
    } else {
        // Yeni temp ban üçün
        tempBanDurationGroup.style.display = 'flex';
        confirmTempBanBtn.style.display = 'block';
        removeTempBanBtn.style.display = 'none';
        // Default olaraq 1 dəqiqə seçilsin
        const defaultRadio = document.querySelector('input[name="tempBanDuration"][value="1"]');
        if (defaultRadio) defaultRadio.checked = true;
    }
}

closeTempBanBtn.addEventListener('click', () => {
    tempBanModal.classList.remove('active');
    tempBanTargetUid = null;
});
tempBanModal.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        tempBanModal.classList.remove('active');
        tempBanTargetUid = null;
    }
});

confirmTempBanBtn.addEventListener('click', async () => {
    const selected = document.querySelector('input[name="tempBanDuration"]:checked');
    if (!selected) {
        showToast("Zəhmət olmasa bir müddət seçin.", "warning");
        return;
    }
    const minutes = parseInt(selected.value, 10);
    if (!tempBanTargetUid) return;
    await applyTempBan(tempBanTargetUid, minutes);
    tempBanModal.classList.remove('active');
    tempBanTargetUid = null;
});

removeTempBanBtn.addEventListener('click', async () => {
    const uid = removeTempBanBtn.dataset.uid;
    const name = removeTempBanBtn.dataset.name;
    if (!uid) return;
    await removeTempBan(uid, name);
    tempBanModal.classList.remove('active');
    tempBanTargetUid = null;
});

async function applyTempBan(targetUid, minutes) {
    const myLevel = getRoleLevel(currentUserData.role);
    if (myLevel < 2) {
        showToast("Bu əməliyyat üçün icazəniz yoxdur.", "error");
        return;
    }

    try {
        const targetDoc = await getDoc(doc(db, 'users', targetUid));
        if (!targetDoc.exists()) {
            showToast("İstifadəçi tapılmadı.", "error");
            return;
        }
        const targetLevel = getRoleLevel(targetDoc.data().role);
        
        if (myLevel !== 4 && targetLevel >= myLevel) {
            showToast("Səlahiyyətiniz çatmır! Öz səviyyənizdən aşağı olanları qova bilərsiniz.", "error");
            return;
        }

        // Normal ban yoxlaması
        const isNormallyBanned = targetDoc.data().isBanned === true && !targetDoc.data().banExpires;
        if (isNormallyBanned) {
            showToast("Bu hesab normal ban edilib! Vaxt ilə ban etmək mümkün deyil.", "error");
            return;
        }

        const now = new Date();
        const expires = new Date(now.getTime() + minutes * 60 * 1000);

        await updateDoc(doc(db, 'users', targetUid), {
            isBanned: true,
            banExpires: expires
        });

        const durationStr = formatDuration(minutes);
        showToast(`İstifadəçi @${escapeHTML(targetDoc.data().username || '')} ${durationStr} müddətinə qovuldu.`, "success");

    } catch (err) {
        console.error("Temp ban xətası:", err);
        showToast("Əməliyyat uğursuz oldu: " + err.message, "error");
    }
}

function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} dəqiqə`;
    if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} saat`;
    }
    if (minutes < 10080) {
        const days = Math.floor(minutes / 1440);
        return `${days} gün`;
    }
    return `${Math.floor(minutes / 10080)} həftə`;
}

let banCleanupInterval = null;

function startBanCleanup() {
    if (banCleanupInterval) clearInterval(banCleanupInterval);
    banCleanupInterval = setInterval(async () => {
        try {
            const now = new Date();
            const q = query(collection(db, 'users'), where('isBanned', '==', true));
            const snap = await getDocs(q);
            let updates = 0;
            for (const docSnap of snap.docs) {
                const data = docSnap.data();
                if (data.banExpires) {
                    const expires = data.banExpires.toDate ? data.banExpires.toDate() : new Date(data.banExpires);
                    if (expires <= now) {
                        await updateDoc(doc(db, 'users', docSnap.id), {
                            isBanned: false,
                            banExpires: null
                        });
                        updates++;
                        if (docSnap.id === currentUser?.uid) {
                            showToast("Ban müddətiniz bitdi, artıq daxil ola bilərsiniz.", "success");
                        }
                    }
                }
            }
            if (updates > 0) {
                console.log(`[BanCleanup] ${updates} istifadəçinin banı avtomatik açıldı.`);
            }
        } catch (err) {
            console.error('[BanCleanup] Xəta:', err);
        }
    }, 30000);
}
