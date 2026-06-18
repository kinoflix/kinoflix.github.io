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
let currentIgnoreList = []; // İgnor edilən istifadəçilərin UID-ləri

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

// Başlıq Elementləri
const activeRoomTitle = document.getElementById('activeRoomTitle');
const activeRoomSub = document.getElementById('activeRoomSub');

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

// TOAST BILDIRIŞ SİSTEMİ (OLDapp.js-dən inteqrasiya edilib)
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
            
            .unread-badge {
                background-color: #e74c3c;
                color: white; border-radius: 20px;
                padding: 2px 8px; font-size: 11px; font-weight: bold;
                margin-left: auto; min-width: 18px; text-align: center;
                box-shadow: 0 2px 6px rgba(231, 76, 60, 0.4); animation: flixPulse 1.5s infinite;
            }
            
            .user-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }
            
            .role-toggle-btn {
                background: none;
                border: 1px solid transparent; color: #3498db; cursor: pointer;
                font-size: 13px; padding: 5px 7px; border-radius: 6px; opacity: 0.75; transition: all 0.2s;
            }
            .role-toggle-btn:hover { opacity: 1; background: rgba(52,152,219,0.15); border-color: rgba(52,152,219,0.3); }
            
            .admin-ban-btn {
                background: none;
                border: 1px solid transparent; cursor: pointer;
                font-size: 13px; padding: 5px 7px; border-radius: 6px; opacity: 0.75; transition: all 0.2s;
            }
            .admin-ban-btn:hover { opacity: 1; background: rgba(243,156,18,0.15); border-color: rgba(243,156,18,0.3); }

            .admin-user-delete-btn {
                background: none;
                border: 1px solid transparent; color: #e74c3c; cursor: pointer;
                font-size: 13px; padding: 5px 7px; border-radius: 6px; opacity: 0.75; transition: all 0.2s;
            }
            .admin-user-delete-btn:hover { opacity: 1; background: rgba(231,76,60,0.15); border-color: rgba(231,76,60,0.3); }
            
            .ignore-btn {
                background: none; border: 1px solid transparent; color: #94a3b8;
                cursor: pointer; font-size: 13px; padding: 5px 7px; border-radius: 6px; opacity: 0.75; transition: all 0.2s;
            }
            .ignore-btn:hover { opacity: 1; background: rgba(100,116,139,0.15); border-color: rgba(100,116,139,0.3); }
            .ignore-btn.active { color: #f39c12; opacity: 1; }
            
            @keyframes flixSlideIn { to { transform: translateX(0); } }
            @keyframes flixFadeOut { to { opacity: 0; transform: translateY(-15px); } }
            @keyframes flixPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.08); }
                100% { transform: scale(1); }
            }
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
        case "auth/wrong-password": return "Şifrəniz yanlışdır. Zəhmət olmasa yenidən cəhd edin.";
        case "auth/too-many-requests": return "Çox sayda uğursuz cəhd. Bir qədər gözləyin.";
        case "auth/requires-recent-login": return "Bu əməliyyat üçün yenidən giriş etməlisiniz.";
        case "auth/email-already-exists": return "Bu e-poçt ünvanı artıq istifadə edilir.";
        default: return err.message || "Gözlənilməz texniki xəta baş verdi.";
    }
}

// IMGBB
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

// MODERASİYA FUNKSİYALARI (BAN, SİL, ROL)
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
        console.error("Rol dəyişərkən xəta:", error);
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

async function toggleIgnoreUser(targetUserId, targetName) {
    const isIgnored = currentIgnoreList.includes(targetUserId);
    if (isIgnored) {
        currentIgnoreList = currentIgnoreList.filter(id => id !== targetUserId);
        showToast(`${escapeHTML(targetName)} artıq ignor siyahınızdan çıxarıldı.`, "info");
    } else {
        currentIgnoreList.push(targetUserId);
        showToast(`${escapeHTML(targetName)} uğurla ignor edildi. Onun mesajları sizə görünməyəcək.`, "info");
    }
    try {
        await setDoc(doc(db, 'ignore_lists', currentUser.uid), { ignored: currentIgnoreList }, { merge: true });
    } catch (err) {
        showToast("İgnor siyahısı yenilənərkən xəta baş verdi.", "error");
    }
    renderUsersList();
    // Ümumi çatı yenilə ki gizlənmiş mesajlar dərhal tətbiq olunsun
    loadGeneralMessages();
}

window.adminDeleteUser = adminDeleteUser;
window.changeUserRole = changeUserRole;
window.toggleBanUser = toggleBanUser;
window.toggleIgnoreUser = toggleIgnoreUser;

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
    tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    loginForm.classList.add('active'); registerForm.classList.remove('active');
});
tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active'); tabLogin.classList.remove('active');
    registerForm.classList.add('active'); loginForm.classList.remove('active');
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
            uid: userCredential.user.uid, displayName: name, email: email, photoURL: DEFAULT_AVATAR, role: 'user', isBanned: false, createdAt: serverTimestamp()
        });
        registerForm.reset();
        showToast("Qeydiyyat uğurla tamamlandı!", "success");
    } catch (err) { showToast(localizeFirebaseError(err), "error"); }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try { 
        await signInWithEmailAndPassword(auth, document.getElementById('loginEmail').value.trim(), document.getElementById('loginPassword').value); 
        loginForm.reset(); 
        showToast("Xoş gəldiniz!", "success");
    } catch (err) { showToast(localizeFirebaseError(err), "error"); }
});

document.getElementById('googleAuthBtn').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid, displayName: result.user.displayName || 'Anonim', email: result.user.email, photoURL: result.user.photoURL || DEFAULT_AVATAR, role: 'user', isBanned: false, createdAt: serverTimestamp()
            });
        }
        showToast("Google ilə uğurla giriş edildi!", "success");
    } catch (err) { showToast(localizeFirebaseError(err), "error"); }
});

logoutBtn.addEventListener('click', () => {
    if(currentUser) set(ref(rtdb, `presence/${currentUser.uid}`), { status: 'offline', lastChanged: rtdbTimestamp() });
    signOut(auth);
    showToast("Hesabdan çıxış edildi.", "info");
});

/* ==========================================================================
 4b. ŞİFRƏ GÖSTƏR/GİZLƏT VƏ ŞİFRƏNİ UNUTDUM
 ========================================================================== */
// Şifrə göstər/gizlət - Login
document.getElementById('toggleLoginPassword').addEventListener('click', () => {
    const input = document.getElementById('loginPassword');
    const icon = document.querySelector('#toggleLoginPassword i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
});

// Şifrə göstər/gizlət - Register
document.getElementById('toggleRegPassword').addEventListener('click', () => {
    const input = document.getElementById('regPassword');
    const icon = document.querySelector('#toggleRegPassword i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
});

// Şifrəni unutdum
document.getElementById('forgotPasswordBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showToast("Zəhmət olmasa əvvəlcə e-poçt ünvanınızı daxil edin.", "warning");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        showToast("Şifrə sıfırlama linki e-poçt ünvanınıza göndərildi. Zəhmət olmasa gələn qutunuzu yoxlayın.", "success");
    } catch (err) {
        showToast(localizeFirebaseError(err), "error");
    }
});

// Fayl önizləmə barı - Ümumi çat
document.getElementById('chatFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const bar = document.getElementById('chatFilePreviewBar');
    const nameSpan = document.getElementById('chatFileNameDisplay');
    if (file) {
        nameSpan.textContent = file.name;
        bar.classList.remove('hidden');
    } else {
        nameSpan.textContent = '';
        bar.classList.add('hidden');
    }
});
document.getElementById('chatFileClearBtn').addEventListener('click', () => {
    document.getElementById('chatFileInput').value = '';
    document.getElementById('chatFileNameDisplay').textContent = '';
    document.getElementById('chatFilePreviewBar').classList.add('hidden');
});

// Fayl önizləmə barı - Şəxsi çat
document.getElementById('privateFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const bar = document.getElementById('privateFilePreviewBar');
    const nameSpan = document.getElementById('privateFileNameDisplay');
    if (file) {
        nameSpan.textContent = file.name;
        bar.classList.remove('hidden');
    } else {
        nameSpan.textContent = '';
        bar.classList.add('hidden');
    }
});
document.getElementById('privateFileClearBtn').addEventListener('click', () => {
    document.getElementById('privateFileInput').value = '';
    document.getElementById('privateFileNameDisplay').textContent = '';
    document.getElementById('privateFilePreviewBar').classList.add('hidden');
});

/* ==========================================================================
 5. CANLI STATUS SİSTEMİ
 ========================================================================== */
function setupPresence(user) {
    const statusRef = ref(rtdb, `presence/${user.uid}`);
    onValue(ref(rtdb, '.info/connected'), (snap) => {
        if (snap.val() === true) {
            onDisconnect(statusRef).set({ status: 'offline', lastChanged: rtdbTimestamp(), typingTo: null }).then(() => {
                set(statusRef, { status: 'online', lastChanged: rtdbTimestamp(), typingTo: null });
            });
        }
    });
    let idleTimer;
    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        set(statusRef, { status: 'online', lastChanged: rtdbTimestamp(), typingTo: null });
        idleTimer = setTimeout(() => {
            set(statusRef, { status: 'away', lastChanged: rtdbTimestamp(), typingTo: null });
        }, 5 * 60 * 1000);
    };
    window.onmousemove = resetIdleTimer; window.onkeypress = resetIdleTimer;
}

/* ==========================================================================
 6. MOBİL MENU VƏ SİYAHI
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
        currentUsersList = []; userRolesMap = {};
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
    const canSeeBanned = myLevel >= 3; // admin və super_admin ban siyahısını görür

    // İstifadəçiləri qruplara ayır
    const roledUsers = [];   // Rolu olanlar (moderator+)
    const onlineUsers = [];  // Rolu olmayan, onlayn
    const offlineUsers = []; // Rolu olmayan, oflayn
    const bannedUsers = [];  // Banlananlar

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

    // Sıralama funksiyaları
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

        const roleButtonHtml = (myLevel === 4) ? `<button class="role-toggle-btn" onclick="event.stopPropagation(); changeUserRole('${user.uid}', '${user.role}')" title="Rolu idarə et (Hazırda: ${user.role || 'user'})"><i class="fa-solid fa-user-gear"></i></button>` : '';
        const canBan = (myLevel === 4) || (myLevel === 3 && targetLevel < 3);
        const banButtonHtml = canBan ? `<button class="admin-ban-btn" onclick="event.stopPropagation(); toggleBanUser('${user.uid}', ${isTargetBanned})" title="${isTargetBanned ? 'Banı qaldır' : 'Hesabı banla'}"><i class="fa-solid ${isTargetBanned ? 'fa-user-check' : 'fa-user-slash'}" style="color: ${isTargetBanned ? '#2ecc71' : '#f39c12'}"></i></button>` : '';
        const adminDeleteHtml = (myLevel === 4) ? `<button class="admin-user-delete-btn" onclick="event.stopPropagation(); adminDeleteUser('${user.uid}')" title="İstifadəçini tamamilə sil"><i class="fa-solid fa-user-minus"></i></button>` : '';
        const ignoreButtonHtml = `<button class="ignore-btn ${isIgnored ? 'active' : ''}" onclick="event.stopPropagation(); toggleIgnoreUser('${user.uid}', '${escapeHTML(user.displayName)}')" title="${isIgnored ? 'İgnoru qaldır' : 'İstifadəçini ignor et'}"><i class="fa-solid ${isIgnored ? 'fa-eye-slash' : 'fa-eye'}"></i></button>`;

        const li = document.createElement('li');
        li.className = `user-item ${activeRoomId.includes(user.uid) ? 'active' : ''}`;
        const nameStyle = isTargetBanned ? 'text-decoration: line-through; opacity: 0.5;' : (isIgnored ? 'opacity: 0.5;' : '');

        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${user.photoURL || DEFAULT_AVATAR}" class="avatar" alt="">
                <span class="status-indicator ${isTargetBanned ? 'offline' : userStatus}"></span>
            </div>
            <div>
                <span class="username" style="${nameStyle}">${escapeHTML(user.displayName)}${roleStarsHtml}</span>
                <span class="typing-notify ${isTyping ? '' : 'hidden'}">yazır...</span>
                ${badgeHtml}
                <div class="user-actions">${ignoreButtonHtml}${roleButtonHtml}${banButtonHtml}${adminDeleteHtml}</div>
            </div>
        `;
        li.addEventListener('click', () => {
            if (isIgnored) {
                showToast("Bu istifadəçini ignor etdiniz. Söhbət başlatmaq üçün əvvəlcə ignoru qaldırın.", "warning");
                return;
            }
            usersSidebar.classList.remove('mobile-open');
            openPrivateRoom(user);
        });
        usersList.appendChild(li);
    });
}

/* ==========================================================================
 7. OTAQLAR ARASI KEÇİD (Şəxsi və Ümumi Sahələri Dəyişdir)
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
    
    // Ümumi çat başlığını ilkin vəziyyətinə qaytarır
    if (activeRoomTitle) activeRoomTitle.innerText = "Ümumi Çat";
    if (activeRoomSub) activeRoomSub.innerText = "Son 50 mesaj göstərilir";
    
    // Şəxsi otağı gizlədib ümumini açır
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
    
    // TƏLƏB OLUNAN DƏYİŞİKLİK BURADIR:
    if (activeRoomTitle) activeRoomTitle.innerText = "Şəxsi yazışma"; // Başlıq artıq "Şəxsi yazışma" olaraq sabit qalır
    if (activeRoomSub) activeRoomSub.innerText = targetUser.displayName; // Alt başlıqda isə seçilən istifadəçinin adı göstərilir
    
    // Ümumi otağı gizlədib şəxsi sahəni açır
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

function loadGeneralMessages() {
    if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
    const msgQuery = query(collection(db, 'rooms', 'global_room', 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribeGeneralMessages = onSnapshot(msgQuery, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        messages.reverse();
        chatMessagesArea.innerHTML = '';
        messages.forEach(msg => {
            // İgnor edilən istifadəçinin mesajlarını ümumi çatda gizlət
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
        messages.forEach(msg => privateMessagesArea.appendChild(createMessageElement(msg, activeRoomId)));
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
    else if (myLevel === 3 && senderLevel < 3) canDelete = true;
    else if (myLevel === 2 && senderLevel === 1) canDelete = true;

    const deleteBtnHtml = canDelete ? `<button class="delete-msg-btn" data-id="${msg.id}"><i class="fa-solid fa-trash"></i></button>` : '';
    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`;
    if (msg.fileURL) contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Şəkil" onclick="window.open('${msg.fileURL}')">`;

    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "...";
    wrapper.innerHTML = `
        <img src="${msg.senderAvatar || DEFAULT_AVATAR}" class="msg-avatar" alt="">
        <div class="message-bubble">
            <span class="sender-name">${escapeHTML(msg.senderName)} ${deleteBtnHtml}</span>
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
        await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
            senderId: currentUser.uid, senderName: currentUserData.displayName || 'Anonim',
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR, text: text,
            fileURL: fileURL, fileType: fileType, createdAt: serverTimestamp()
        });

        if (isDMContext) {
            const targetUserId = activeRoomId.split('_').find(id => id !== currentUser.uid);
            await setDoc(doc(db, 'rooms', activeRoomId), { 
                lastMessageAt: serverTimestamp(), [`unread_${targetUserId}`]: increment(1)
            }, { merge: true });
        } else {
            await setDoc(doc(db, 'rooms', 'global_room'), { lastMessageAt: serverTimestamp() }, { merge: true });
        }
    } catch (err) { showToast("Mesaj göndərilərkən xəta: " + err.message, "error"); }
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
 8. PROFİL MODALININ IDARƏEDİLMƏSİ
 ========================================================================== */
openSettingsBtn.addEventListener('click', () => {
    document.getElementById('settingsDisplayName').value = currentUserData.displayName;
    document.getElementById('settingsAvatarPreview').src = currentUserData.photoURL || DEFAULT_AVATAR;
    document.getElementById('avatarFileNameDisplay').textContent = '';
    settingsModal.classList.add('active');
});

document.getElementById('avatarFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const display = document.getElementById('avatarFileNameDisplay');
    if (file) {
        display.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (ev) => { document.getElementById('settingsAvatarPreview').src = ev.target.result; };
        reader.readAsDataURL(file);
    } else {
        display.textContent = '';
    }
});
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));

profileSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = document.getElementById('settingsDisplayName').value.trim();
    const avatarFile = document.getElementById('avatarFileInput').files[0];
    let newAvatarUrl = currentUserData.photoURL || DEFAULT_AVATAR;
    const submitBtn = profileSettingsForm.querySelector("button[type='submit']");
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yüklənir...'; submitBtn.disabled = true;

    if (newName !== currentUserData.displayName) {
        try {
            const nameSnap = await getDocs(query(collection(db, 'users'), where('displayName', '==', newName)));
            if (nameSnap.docs.some(doc => doc.id !== currentUser.uid)) {
                showToast("Bu istifadəçi adı artıq başqası tərəfindən alınıb. Başqa ad yoxlayın.", "warning");
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Yadda Saxla'; submitBtn.disabled = false; return;
            }
        } catch (err) { 
            showToast("Yoxlama zamanı xəta baş verdi.", "error");
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Yadda Saxla'; submitBtn.disabled = false; return; 
        }
    }
    if (avatarFile) {
        try { 
            newAvatarUrl = await uploadImageToImgBB(avatarFile); 
        } catch (err) { 
            showToast(err.message, "error");
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Yadda Saxla'; submitBtn.disabled = false; return; 
        }
    }

    try {
        await updateProfile(currentUser, { displayName: newName, photoURL: newAvatarUrl });
        await setDoc(doc(db, 'users', currentUser.uid), { displayName: newName, photoURL: newAvatarUrl }, { merge: true });
        currentUserData.displayName = newName; currentUserData.photoURL = newAvatarUrl;
        document.getElementById('currentUserName').innerHTML = escapeHTML(newName) + getRoleStarsHtml(currentUserData.role);
        document.getElementById('currentUserAvatar').src = newAvatarUrl;
        showToast("Profil məlumatlarınız uğurla yeniləndi!", "success");
        settingsModal.classList.remove('active');
    } catch (err) { 
        showToast("Sistem xətası: " + err.message, "error"); 
    } finally { 
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Yadda Saxla'; submitBtn.disabled = false; 
    }
});
document.getElementById('deleteAccBtn').addEventListener('click', deleteAccount);

// E-poçt yeniləmə (cari şifrə məcburi)
document.getElementById('changeEmailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassForEmail = document.getElementById('emailCurrentPasswordInput').value;
    const newEmail = document.getElementById('newEmailInput').value.trim();
    if (!currentPassForEmail || !newEmail) return;
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yüklənir...'; btn.disabled = true;
    try {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassForEmail);
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, newEmail);
        await setDoc(doc(db, 'users', currentUser.uid), { email: newEmail }, { merge: true });
        showToast("E-poçt ünvanınız uğurla yeniləndi!", "success");
        document.getElementById('emailCurrentPasswordInput').value = '';
        document.getElementById('newEmailInput').value = '';
        settingsModal.classList.remove('active');
    } catch (err) {
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            showToast("Cari şifrəniz yanlışdır. Zəhmət olmasa düzgün daxil edin.", "error");
        } else {
            showToast(localizeFirebaseError(err), "error");
        }
    } finally { btn.innerHTML = '<i class="fa-solid fa-check"></i> Yadda Saxla'; btn.disabled = false; }
});

// Şifrə yeniləmə
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPass = document.getElementById('currentPasswordInput').value;
    const newPass = document.getElementById('newPasswordInput').value;
    if (!currentPass || !newPass) return;
    if (newPass.length < 6) {
        showToast("Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır.", "warning");
        return;
    }
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yüklənir...'; btn.disabled = true;
    try {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPass);
        showToast("Şifrəniz uğurla yeniləndi!", "success");
        document.getElementById('currentPasswordInput').value = '';
        document.getElementById('newPasswordInput').value = '';
        settingsModal.classList.remove('active');
    } catch (err) {
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            showToast("Cari şifrəniz yanlışdır. Zəhmət olmasa düzgün daxil edin.", "error");
        } else {
            showToast(localizeFirebaseError(err), "error");
        }
    } finally { btn.innerHTML = '<i class="fa-solid fa-check"></i> Yadda Saxla'; btn.disabled = false; }
});

/* ==========================================================================
 9. MASTER OBSERVER
 ========================================================================== */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
            if (currentUserData.isBanned === true) {
                showToast("Giriş əngəlləndi! Sizin hesabınız ban edilib.", "error");
                await signOut(auth); 
                setTimeout(() => { window.location.reload(); }, 2000);
                return;
            }
        } else {
            currentUserData = { role: 'user', displayName: user.displayName, photoURL: user.photoURL || DEFAULT_AVATAR, isBanned: false };
        }

        document.getElementById('currentUserName').innerHTML = escapeHTML(currentUserData.displayName || 'Anonim') + getRoleStarsHtml(currentUserData.role);
        document.getElementById('currentUserAvatar').src = currentUserData.photoURL || DEFAULT_AVATAR;
        
        // İgnor siyahısını yüklə
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

        setupPresence(user);
        listenUsersAndPresence();
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

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
