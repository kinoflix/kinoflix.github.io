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
    where, getDocs, increment, updateDoc, arrayUnion, arrayRemove, runTransaction
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
let currentUserData = { role: 'user', displayName: '', photoURL: DEFAULT_AVATAR, isBanned: false, username: '', firstName: '', lastName: '' };
let activeRoomId = 'global_room';
let activeRoomIsDM = false;
let currentIgnoreList = []; // İgnor edilən istifadəçilərin UID-ləri

// Canlı dinləyicilərin (Unsubscribe) idarəetmə dəyişənləri
let unsubscribeGeneralMessages = null;
let unsubscribeAdminMessages = null;
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
const btnAdminRoom = document.getElementById('btnAdminRoom');
const themeToggle = document.getElementById('themeToggle');
const siteLogo = document.getElementById('siteLogo');

// Başlıq Elementləri
const activeRoomTitle = document.getElementById('activeRoomTitle');
const activeRoomSub = document.getElementById('activeRoomSub');

// Məqsədli Çat Sahələri DOM-ları
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

// Kayıt formu elementleri
const regUsername = document.getElementById('regUsername');
const regFirstName = document.getElementById('regFirstName');
const regLastName = document.getElementById('regLastName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regPasswordConfirm = document.getElementById('regPasswordConfirm');
const regUsernameFeedback = document.getElementById('regUsernameFeedback');
const regFirstNameFeedback = document.getElementById('regFirstNameFeedback');
const regLastNameFeedback = document.getElementById('regLastNameFeedback');
const regPasswordConfirmFeedback = document.getElementById('regPasswordConfirmFeedback');

// Settings elementleri
const settingsUsername = document.getElementById('settingsUsername');
const settingsFirstName = document.getElementById('settingsFirstName');
const settingsLastName = document.getElementById('settingsLastName');
const settingsEmailDisplay = document.getElementById('settingsEmailDisplay');

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
                gap: 6px;
                margin-left: auto;
            }
            
            .role-toggle-btn {
                background: rgba(52,152,219,0.1);
                border: 1px solid rgba(52,152,219,0.25); color: #3498db; cursor: pointer;
                font-size: 12px; width: 28px; height: 28px; border-radius: 8px;
                display: inline-flex; align-items: center; justify-content: center;
                transition: all 0.18s; flex-shrink: 0;
            }
            .role-toggle-btn:hover { background: #3498db; color: #fff; border-color: #3498db; transform: scale(1.08); animation: none !important; }
            
            .admin-ban-btn {
                background: rgba(243,156,18,0.1);
                border: 1px solid rgba(243,156,18,0.25); cursor: pointer;
                font-size: 12px; width: 28px; height: 28px; border-radius: 8px;
                display: inline-flex; align-items: center; justify-content: center;
                transition: all 0.18s; flex-shrink: 0;
            }
            .admin-ban-btn:hover { background: #f39c12; border-color: #f39c12; transform: scale(1.08); animation: none !important; }
            .admin-ban-btn:hover i { color: #fff !important; }

            .admin-user-delete-btn {
                background: rgba(231,76,60,0.1);
                border: 1px solid rgba(231,76,60,0.25); color: #e74c3c; cursor: pointer;
                font-size: 12px; width: 28px; height: 28px; border-radius: 8px;
                display: inline-flex; align-items: center; justify-content: center;
                transition: all 0.18s; flex-shrink: 0;
            }
            .admin-user-delete-btn:hover { background: #e74c3c; color: #fff; border-color: #e74c3c; transform: scale(1.08); animation: none !important; }
            
            .ignore-btn {
                background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.2); color: #94a3b8;
                cursor: pointer; font-size: 12px; width: 28px; height: 28px; border-radius: 8px;
                display: inline-flex; align-items: center; justify-content: center;
                transition: all 0.18s; flex-shrink: 0;
            }
            .ignore-btn:hover { background: rgba(100,116,139,0.25); border-color: rgba(100,116,139,0.4); transform: scale(1.08); }
            .ignore-btn.active { color: #f39c12; background: rgba(243,156,18,0.1); border-color: rgba(243,156,18,0.3); }
            
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
    const myLevel = getRoleLevel(currentUserData.role);
    
    if (myLevel < 3) {
        showToast("Bu əməliyyat üçün ən azı Admin səlahiyyətiniz olmalıdır!", "error");
        return;
    }

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
        if (targetLevel > 2) {
            showToast("Adminlər yalnız 'user' və 'moderator' rollarını dəyişə bilər!", "error");
            return;
        }
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
    if (myLevel < 3) {
        showToast("Hesab banlamaq üçün Admin səlahiyyəti tələb olunur!", "error");
        return;
    }
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
    if (myLevel !== 4) {
        showToast("Hesab silmək üçün yalnız Super Admin yetkilidir!", "error");
        return;
    }
    if (!confirm("DİQQƏT: Bu istifadəçini bazadan tamamilə silmək istədiyinizə əminsiniz? (Geri qaytarıla bilməz)")) return;
    try {
        await deleteDoc(doc(db, 'users', targetUserId));
        showToast("İstifadəçi profili silindi. Sistem onu dərhal kənarlaşdıracaq.", "success");
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
                showToast("Hesabınız sistemdən silindi!", "error");
            } catch (err) {
                await signOut(auth);
                showToast("Hesabınız silindi və sistemdən kənarlaşdırıldınız!", "error");
            }
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
        if (isIgnored) {
            currentIgnoreList.push(targetUserId);
        } else {
            currentIgnoreList = currentIgnoreList.filter(id => id !== targetUserId);
        }
        if (err.code === 'permission-denied' || err.code === 'PERMISSION_DENIED') {
            showToast("İgnor əməliyyatı üçün icazə yoxdur. Firebase Rules-u yoxlayın.", "error");
        } else {
            showToast("İgnor siyahısı yenilənərkən xəta baş verdi: " + err.message, "error");
        }
    }
    renderUsersList();
    loadGeneralMessages();
    if (activeRoomIsDM) {
        loadPrivateMessages();
    }
}

window.adminDeleteUser = adminDeleteUser;
window.changeUserRole = changeUserRole;
window.toggleBanUser = toggleBanUser;
window.toggleIgnoreUser = toggleIgnoreUser;

/* ==========================================================================
 2b. USERNAME KURALLARI VƏ DOĞRULAMA
 ========================================================================== */
function isValidUsername(username) {
    if (username.length < 3 || username.length > 10) return false;
    if (!/^[A-Za-z0-9_.]+$/.test(username)) return false;
    if (username.startsWith('.') || username.endsWith('.')) return false;
    if (username.includes('..')) return false;
    return true;
}

async function isUsernameAvailable(username) {
    if (!isValidUsername(username)) return false;
    try {
        const q = query(collection(db, 'users'), where('username', '==', username));
        const snap = await getDocs(q);
        return snap.empty;
    } catch (e) {
        console.error("Username availability check error:", e);
        return false;
    }
}

function isValidNamePart(name) {
    // Yalnız hərflər, boşluq yox, nöqtə, alt xətt, xüsusi simvol yox, emoji yox
    return /^[^\d\W_\.@#!$%&*+\-=]+$/.test(name) && name.length > 0;
}

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

// ---------- QEYDİYYAT ----------
// Username canlı yoxlama
regUsername.addEventListener('input', async () => {
    const val = regUsername.value.trim();
    const feedback = regUsernameFeedback;
    if (val.length === 0) {
        feedback.textContent = '';
        feedback.className = 'field-feedback';
        return;
    }
    if (!isValidUsername(val)) {
        feedback.textContent = 'uyğun deyil (3-10 simvol, A-Z, 0-9, _, .; başda/sonda nöqtə olmaz, ardıcıl nöqtə olmaz)';
        feedback.className = 'field-feedback error';
        return;
    }
    const avail = await isUsernameAvailable(val);
    if (avail) {
        feedback.textContent = 'uyğundur ✅';
        feedback.className = 'field-feedback success';
    } else {
        feedback.textContent = 'uyğun deyil ❌ (bu istifadəçi adı artıq alınıb)';
        feedback.className = 'field-feedback error';
    }
});

// Ad və soyad canlı yoxlama
regFirstName.addEventListener('input', () => {
    const val = regFirstName.value.trim();
    const feedback = regFirstNameFeedback;
    if (val.length === 0) { feedback.textContent = ''; feedback.className = 'field-feedback'; return; }
    if (isValidNamePart(val)) {
        feedback.textContent = 'uyğundur ✅';
        feedback.className = 'field-feedback success';
    } else {
        feedback.textContent = 'uyğun deyil ❌ (yalnız hərflər, emoji və xüsusi simvollar yoxdur)';
        feedback.className = 'field-feedback error';
    }
});
regLastName.addEventListener('input', () => {
    const val = regLastName.value.trim();
    const feedback = regLastNameFeedback;
    if (val.length === 0) { feedback.textContent = ''; feedback.className = 'field-feedback'; return; }
    if (isValidNamePart(val)) {
        feedback.textContent = 'uyğundur ✅';
        feedback.className = 'field-feedback success';
    } else {
        feedback.textContent = 'uyğun deyil ❌ (yalnız hərflər, emoji və xüsusi simvollar yoxdur)';
        feedback.className = 'field-feedback error';
    }
});

// Şifrə təkrarı yoxlama
regPasswordConfirm.addEventListener('input', () => {
    const pass = regPassword.value;
    const confirm = regPasswordConfirm.value;
    const feedback = regPasswordConfirmFeedback;
    if (confirm.length === 0) { feedback.textContent = ''; feedback.className = 'field-feedback'; return; }
    if (pass === confirm) {
        feedback.textContent = 'Şifrələr eynidir! ✅';
        feedback.className = 'field-feedback success';
    } else {
        feedback.textContent = 'Şifrələr eyni deyil! ❌';
        feedback.className = 'field-feedback error';
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = regUsername.value.trim();
    const firstName = regFirstName.value.trim();
    const lastName = regLastName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;
    const passwordConfirm = regPasswordConfirm.value;

    if (!username || !firstName || !lastName || !email || !password || !passwordConfirm) {
        showToast('Bütün sahələri doldurun!', 'warning');
        return;
    }
    if (!isValidUsername(username)) {
        showToast('İstifadəçi adı qaydalara uyğun deyil!', 'error');
        return;
    }
    if (!(await isUsernameAvailable(username))) {
        showToast('Bu istifadəçi adı artıq alınıb!', 'error');
        return;
    }
    if (!isValidNamePart(firstName) || !isValidNamePart(lastName)) {
        showToast('Ad və Soyad yalnız hərflərdən ibarət olmalıdır!', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('Şifrə ən azı 6 simvol olmalıdır!', 'error');
        return;
    }
    if (password !== passwordConfirm) {
        showToast('Şifrələr eyni deyil!', 'error');
        return;
    }

    isRegistering = true;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = `${firstName} ${lastName}`;
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

        // RTDB şifrə
        try {
            await set(ref(rtdb, 'users/' + username), { password });
        } catch (rtdbErr) {
            console.error("RTDB-yə şifrə yazıla bilmədi:", rtdbErr);
        }

        registerForm.reset();
        regUsernameFeedback.textContent = '';
        regFirstNameFeedback.textContent = '';
        regLastNameFeedback.textContent = '';
        regPasswordConfirmFeedback.textContent = '';
        showToast("Qeydiyyat uğurla tamamlandı!", "success");
        isRegistering = false;
        await initializeChatSession(userCredential.user);
    } catch (err) {
        isRegistering = false;
        showToast(localizeFirebaseError(err), "error");
    }
});

// ---------- LOGIN ----------
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!identifier || !password) {
        showToast('Hər iki sahəni doldurun!', 'warning');
        return;
    }
    try {
        let email = identifier;
        // Əgər identifier @ ehtiva etmirsə, username kimi qəbul et
        if (!identifier.includes('@')) {
            const q = query(collection(db, 'users'), where('username', '==', identifier));
            const snap = await getDocs(q);
            if (snap.empty) {
                showToast('Bu istifadəçi adı mövcud deyil.', 'error');
                return;
            }
            email = snap.docs[0].data().email;
        }
        await signInWithEmailAndPassword(auth, email, password);
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
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                username: result.user.displayName?.toLowerCase().replace(/\s/g, '_') || 'user_' + Date.now(),
                firstName: result.user.displayName?.split(' ')[0] || 'Google',
                lastName: result.user.displayName?.split(' ').slice(1).join(' ') || 'User',
                displayName: result.user.displayName || 'Google User',
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
    if(currentUser) set(ref(rtdb, `presence/${currentUser.uid}`), { status: 'offline', lastChanged: rtdbTimestamp() });
    signOut(auth);
    showToast("Hesabdan çıxış edildi.", "info");
});

/* ==========================================================================
 4b. ŞİFRƏ GÖSTƏR/GİZLƏT VƏ ŞİFRƏNİ UNUTDUM
 ========================================================================== */
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
document.getElementById('toggleRegPasswordConfirm').addEventListener('click', () => {
    const input = document.getElementById('regPasswordConfirm');
    const icon = document.querySelector('#toggleRegPasswordConfirm i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
});

document.getElementById('forgotPasswordBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginIdentifier').value.trim();
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
    unsubscribePresenceConnected = onValue(ref(rtdb, '.info/connected'), (snap) => {
        if (snap.val() === true) {
            onDisconnect(statusRef).set({ status: 'offline', lastChanged: rtdbTimestamp(), typingTo: null }).then(() => {
                set(statusRef, { status: 'online', lastChanged: rtdbTimestamp(), typingTo: null });
            });
        }
    });
    let idleTimer;
    let isAway = false;
    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        if (isAway) {
            isAway = false;
            set(statusRef, { status: 'online', lastChanged: rtdbTimestamp(), typingTo: null });
        }
        idleTimer = setTimeout(() => {
            isAway = true;
            set(statusRef, { status: 'away', lastChanged: rtdbTimestamp(), typingTo: null });
        }, 5 * 60 * 1000);
    };
    resetIdleTimer();
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

        const roleButtonHtml = (myLevel === 4 || (myLevel === 3 && targetLevel <= 2))
            ? `<button class="role-toggle-btn" onclick="event.stopPropagation(); changeUserRole('${user.uid}', '${user.role || 'user'}')" title="Rolu idarə et (Hazırda: ${user.role || 'user'})"><i class="fa-solid fa-user-gear"></i></button>`
            : '';

        const canBan = (myLevel === 4) || (myLevel === 3 && targetLevel <= 2);
        const banIcon = isTargetBanned
            ? `<i class="fa-solid fa-user-check" style="color:#2ecc71"></i>`
            : `<i class="fa-solid fa-user-slash" style="color:#f39c12"></i>`;
        const banButtonHtml = canBan
            ? `<button class="admin-ban-btn" onclick="event.stopPropagation(); toggleBanUser('${user.uid}', ${isTargetBanned})" title="${isTargetBanned ? 'Banı qaldır' : 'Hesabı banla'}">${banIcon}</button>`
            : '';

        const adminDeleteHtml = (myLevel === 4)
            ? `<button class="admin-user-delete-btn" onclick="event.stopPropagation(); adminDeleteUser('${user.uid}')" title="İstifadəçini bazadan sil"><i class="fa-solid fa-user-minus"></i></button>`
            : '';

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
                <span class="username" style="${nameStyle}">${escapeHTML(user.displayName)}<span class="user-username">@${escapeHTML(user.username || '')}</span>${roleStarsHtml}</span>
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
 7. OTAQLAR ARASI KEÇİD (Şəxsi, Ümumi, Admin)
 ========================================================================== */
btnGlobalRoom.addEventListener('click', () => {
    closePrivateRoom();
    closeAdminRoom();
    usersSidebar.classList.remove('mobile-open');
});

btnAdminRoom.addEventListener('click', () => {
    if (!currentUserData || getRoleLevel(currentUserData.role) < 2) {
        showToast("Bu otağa giriş icazəniz yoxdur.", "error");
        return;
    }
    closePrivateRoom();
    openAdminRoom();
    usersSidebar.classList.remove('mobile-open');
});

function closePrivateRoom() {
    activeRoomIsDM = false;
    if (activeRoomId === 'global_room' || activeRoomId === 'admin_room') return;
    activeRoomId = 'global_room';
    btnGlobalRoom.classList.add('active');
    btnAdminRoom.classList.remove('active');
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
    btnAdminRoom.classList.remove('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Şəxsi yazışma";
    if (activeRoomSub) activeRoomSub.innerText = `@${targetUser.username || ''} · ${targetUser.displayName}`;
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

function openAdminRoom() {
    activeRoomIsDM = false;
    activeRoomId = 'admin_room';
    btnGlobalRoom.classList.remove('active');
    btnAdminRoom.classList.add('active');
    if (activeRoomTitle) activeRoomTitle.innerText = "Rəhbərlik otağı";
    if (activeRoomSub) activeRoomSub.innerText = "Yalnız moderator, admin və super admin";
    privateChatArea.classList.remove('active');
    privateChatArea.classList.add('hidden');
    generalChatArea.classList.remove('hidden');
    generalChatArea.classList.add('active');
    loadAdminMessages();
    renderUsersList();
}

function closeAdminRoom() {
    if (activeRoomId === 'admin_room') {
        activeRoomId = 'global_room';
        btnGlobalRoom.classList.add('active');
        btnAdminRoom.classList.remove('active');
        if (activeRoomTitle) activeRoomTitle.innerText = "Ümumi Çat";
        if (activeRoomSub) activeRoomSub.innerText = "Son 50 mesaj göstərilir";
        if (unsubscribeAdminMessages) unsubscribeAdminMessages();
        loadGeneralMessages();
    }
}

/* ==========================================================================
 7b. MESAJ YÜKLƏMƏ FONKSİYALARI
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
        markMessagesRead('global_room');
    });
}

function loadAdminMessages() {
    if (unsubscribeAdminMessages) unsubscribeAdminMessages();
    const msgQuery = query(collection(db, 'rooms', 'admin_room', 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribeAdminMessages = onSnapshot(msgQuery, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        messages.reverse();
        chatMessagesArea.innerHTML = '';
        messages.forEach(msg => {
            if (currentIgnoreList.includes(msg.senderId)) return;
            chatMessagesArea.appendChild(createMessageElement(msg, 'admin_room'));
        });
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        markMessagesRead('admin_room');
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
        markMessagesRead(activeRoomId);
    });
}

// Mesajları okundu olarak işaretle (status -> 'read')
function markMessagesRead(roomId) {
    if (!currentUser) return;
    const msgs = document.querySelectorAll(`#${roomId === 'global_room' || roomId === 'admin_room' ? 'chatMessagesArea' : 'privateMessagesArea'} .message-wrapper`);
    msgs.forEach(wrapper => {
        const msgId = wrapper.dataset.msgId;
        if (!msgId) return;
        const isMe = wrapper.classList.contains('me');
        if (!isMe) {
            // Sadece başkalarının mesajlarını okundu olarak işaretle
            const statusEl = wrapper.querySelector('.message-status');
            if (statusEl && statusEl.textContent.trim() !== 'oxundu') {
                updateDoc(doc(db, 'rooms', roomId, 'messages', msgId), { status: 'read' }).catch(() => {});
            }
        }
    });
}

/* ==========================================================================
 8. MESAJ ELEMENTİ YARADAN FUNKSİYA
 ========================================================================== */
function createMessageElement(msg, roomIdContext) {
    const isMe = msg.senderId === currentUser.uid;
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`;
    wrapper.dataset.msgId = msg.id;

    const myLevel = getRoleLevel(currentUserData.role);
    const senderLevel = getRoleLevel(userRolesMap[msg.senderId] || 'user');

    let canDelete = false;
    if (isMe) canDelete = true;
    else if (myLevel === 4) canDelete = true;
    else if (myLevel === 3 && senderLevel <= 2) canDelete = true;
    else if (myLevel === 2 && senderLevel === 1) canDelete = true;

    const deleteBtnHtml = canDelete ? `<button class="delete-msg-btn" data-id="${msg.id}" title="Mesajı sil"><i class="fa-solid fa-trash"></i></button>` : '';

    // Mention işleme: @username'i bold yeşil yap
    let textHtml = escapeHTML(msg.text || '');
    const mentionRegex = /@(\w+)/g;
    textHtml = textHtml.replace(mentionRegex, (match, username) => {
        return `<span class="mention">@${escapeHTML(username)}</span>`;
    });

    let contentHtml = `<p>${textHtml}</p>`;
    if (msg.fileURL) contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Şəkil" onclick="window.open('${msg.fileURL}')">`;

    // Yanıtlanmış mesaj varsa göster
    let replyHtml = '';
    if (msg.replyTo) {
        // replyTo mesajının metnini çekmek için ayrı bir sorgu gerekir, ama burada basitçe gösterelim
        replyHtml = `<div class="reply-preview"><span class="reply-sender">${escapeHTML(msg.replySenderName || '')}:</span> ${escapeHTML(msg.replyText || '')}</div>`;
    }

    const statusIcon = msg.status === 'read' ? '✓✓' : '✓';
    const statusClass = msg.status === 'read' ? 'read' : '';
    const statusHtml = `<span class="message-status ${statusClass}">${statusIcon}</span>`;

    // Tepkiler
    let reactionsHtml = '';
    if (msg.reactions) {
        const reactionMap = msg.reactions;
        for (const [emoji, users] of Object.entries(reactionMap)) {
            const count = users.length;
            reactionsHtml += `<span class="reaction-badge" data-emoji="${emoji}">${emoji} <span class="reaction-count">${count}</span></span>`;
        }
    }

    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "...";
    const roleStars = getRoleStarsHtml(userRolesMap[msg.senderId] || 'user');

    wrapper.innerHTML = `
        <img src="${msg.senderAvatar || DEFAULT_AVATAR}" class="msg-avatar" alt="">
        <div class="message-bubble">
            <span class="sender-name">${escapeHTML(msg.senderName)}${roleStars} ${deleteBtnHtml}</span>
            ${replyHtml}
            ${contentHtml}
            <div class="message-actions">
                <button class="action-btn reply-btn" title="Cavabla"><i class="fa-regular fa-reply"></i></button>
                <button class="action-btn forward-btn" title="Yönləndir"><i class="fa-regular fa-share"></i></button>
                <button class="action-btn reaction-btn" title="Reaksiya əlavə et"><i class="fa-regular fa-face-smile"></i></button>
                ${statusHtml}
            </div>
            ${reactionsHtml ? `<div class="reactions-container">${reactionsHtml}</div>` : ''}
            <span class="timestamp">${time}</span>
        </div>
    `;

    // Olayları bağla
    const replyBtn = wrapper.querySelector('.reply-btn');
    if (replyBtn) {
        replyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = roomIdContext === 'global_room' || roomIdContext === 'admin_room' ? messageInputField : privateInputField;
            if (input) {
                input.value = `> ${msg.senderName}: ${msg.text}\n`;
                input.focus();
                // replyTo bilgisini saklamak için global bir değişkene at
                window._replyToMsgId = msg.id;
                window._replyToSender = msg.senderName;
                window._replyToText = msg.text;
            }
        });
    }

    const forwardBtn = wrapper.querySelector('.forward-btn');
    if (forwardBtn) {
        forwardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Basit: mesaj metnini kopyala ve kullanıcıya yapıştırmasını söyle
            navigator.clipboard.writeText(`[Yönləndirildi] ${msg.senderName}: ${msg.text}`).then(() => {
                showToast('Mesaj kopyalandı, istədiyiniz otağa yapışdıra bilərsiniz.', 'info');
            }).catch(() => {
                showToast('Kopyalama uğursuz oldu.', 'error');
            });
        });
    }

    const reactionBtn = wrapper.querySelector('.reaction-btn');
    if (reactionBtn) {
        reactionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Basit: emoji seçimi için prompt
            const emoji = prompt('Reaksiya emojisini daxil edin (məsələn 😀)', '😀');
            if (emoji) {
                addReaction(msg.id, roomIdContext, emoji);
            }
        });
    }

    // Tepki badge'lerine tıkla (kaldır)
    wrapper.querySelectorAll('.reaction-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const emoji = badge.dataset.emoji;
            removeReaction(msg.id, roomIdContext, emoji);
        });
    });

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

// Tepki ekleme
async function addReaction(msgId, roomId, emoji) {
    if (!currentUser) return;
    try {
        const msgRef = doc(db, 'rooms', roomId, 'messages', msgId);
        await runTransaction(db, async (transaction) => {
            const msgSnap = await transaction.get(msgRef);
            if (!msgSnap.exists()) return;
            const data = msgSnap.data();
            const reactions = data.reactions || {};
            if (!reactions[emoji]) reactions[emoji] = [];
            if (!reactions[emoji].includes(currentUser.uid)) {
                reactions[emoji].push(currentUser.uid);
            }
            transaction.update(msgRef, { reactions });
        });
    } catch (e) {
        console.error('Reaksiya əlavə edilə bilmədi:', e);
    }
}

async function removeReaction(msgId, roomId, emoji) {
    if (!currentUser) return;
    try {
        const msgRef = doc(db, 'rooms', roomId, 'messages', msgId);
        await runTransaction(db, async (transaction) => {
            const msgSnap = await transaction.get(msgRef);
            if (!msgSnap.exists()) return;
            const data = msgSnap.data();
            const reactions = data.reactions || {};
            if (reactions[emoji]) {
                reactions[emoji] = reactions[emoji].filter(uid => uid !== currentUser.uid);
                if (reactions[emoji].length === 0) delete reactions[emoji];
                transaction.update(msgRef, { reactions });
            }
        });
    } catch (e) {
        console.error('Reaksiya silinə bilmədi:', e);
    }
}

/* ==========================================================================
 9. MESAJ GÖNDƏRMƏ
 ========================================================================== */
async function submitMessage(isDMContext) {
    const textInput = isDMContext ? privateInputField : messageInputField;
    const fileInput = isDMContext ? privateFileInput : chatFileInput;
    let text = textInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) return;

    // Reply bilgisi varsa
    let replyTo = null;
    let replySender = null;
    let replyText = null;
    if (window._replyToMsgId) {
        replyTo = window._replyToMsgId;
        replySender = window._replyToSender;
        replyText = window._replyToText;
        // Temizle
        window._replyToMsgId = null;
        window._replyToSender = null;
        window._replyToText = null;
    }

    // DM'de kontrol
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
            } catch (e) {}
        }
    }

    textInput.value = ''; fileInput.value = '';
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
        const docRef = await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || 'Anonim',
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
            text: text,
            fileURL: fileURL,
            fileType: fileType,
            createdAt: serverTimestamp(),
            status: 'sent',
            reactions: {},
            replyTo: replyTo,
            replySenderName: replySender,
            replyText: replyText
        });

        // RTDB'ye yaz
        try {
            const rtdbPath = isDMContext 
                ? `messages/private/${activeRoomId}/${docRef.id}` 
                : `messages/${activeRoomId}/${docRef.id}`;
            await set(ref(rtdb, rtdbPath), {
                senderId: currentUser.uid,
                senderName: currentUserData.displayName || 'Anonim',
                senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
                text: text,
                fileURL: fileURL,
                fileType: fileType,
                createdAt: rtdbTimestamp(),
                status: 'sent'
            });
        } catch (rtdbErr) {
            console.error("RTDB yazma xətası:", rtdbErr);
        }

        if (isDMContext) {
            const targetUserId = activeRoomId.split('_').find(id => id !== currentUser.uid);
            await setDoc(doc(db, 'rooms', activeRoomId), { 
                lastMessageAt: serverTimestamp(), [`unread_${targetUserId}`]: increment(1)
            }, { merge: true });
        } else {
            await setDoc(doc(db, 'rooms', activeRoomId), { lastMessageAt: serverTimestamp() }, { merge: true });
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

/* ==========================================================================
 10. TYPING INDICATOR
 ========================================================================== */
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
 11. PROFİL MODALININ IDARƏEDİLMƏSİ
 ========================================================================== */
openSettingsBtn.addEventListener('click', () => {
    settingsUsername.value = currentUserData.username || '';
    settingsFirstName.value = currentUserData.firstName || '';
    settingsLastName.value = currentUserData.lastName || '';
    settingsEmailDisplay.value = currentUser.email || '';
    document.getElementById('settingsAvatarPreview').src = currentUserData.photoURL || DEFAULT_AVATAR;
    document.getElementById('avatarFileNameDisplay').innerHTML = '';
    const cpInput = document.getElementById('currentPasswordInput');
    const npInput = document.getElementById('newPasswordInput');
    if (cpInput) cpInput.value = '';
    if (npInput) npInput.value = '';
    settingsModal.classList.add('active');
});

document.getElementById('avatarFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const display = document.getElementById('avatarFileNameDisplay');
    if (file) {
        display.innerHTML = `
            <button type="button" id="avatarFileClearBtn" title="Seçimi ləğv et" style="margin-right: 8px; background: none; border: none; cursor: pointer; color: var(--danger); font-size: 14px; transition: transform 0.2s; padding: 0;">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <span class="file-name-text">${escapeHTML(file.name)}</span>
        `;
        document.getElementById('avatarFileClearBtn').addEventListener('click', () => {
            document.getElementById('avatarFileInput').value = '';
            display.innerHTML = '';
            document.getElementById('settingsAvatarPreview').src = currentUserData.photoURL || DEFAULT_AVATAR;
        });
        const reader = new FileReader();
        reader.onload = (ev) => { document.getElementById('settingsAvatarPreview').src = ev.target.result; };
        reader.readAsDataURL(file);
    } else {
        display.innerHTML = '';
    }
});

closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));

document.querySelectorAll('.settings-eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const inputId = btn.getAttribute('data-target');
        const input = document.getElementById(inputId);
        const icon = btn.querySelector('i');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fa-solid fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fa-solid fa-eye';
        }
    });
});

profileSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = settingsUsername.value.trim();
    const newFirstName = settingsFirstName.value.trim();
    const newLastName = settingsLastName.value.trim();
    const avatarFile = document.getElementById('avatarFileInput').files[0];
    const currentPass = document.getElementById('currentPasswordInput').value;
    const newPass = document.getElementById('newPasswordInput').value;
    const newEmail = settingsEmailDisplay.value.trim();

    const emailChanged = newEmail && newEmail !== currentUser.email;
    const passChanged = newPass.length > 0;

    if ((emailChanged || passChanged) && !currentPass) {
        showToast("E-poçt və ya şifrəni dəyişmək üçün cari şifrənizi daxil edin.", "warning");
        return;
    }
    if (passChanged && newPass.length < 6) {
        showToast("Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır.", "warning");
        return;
    }

    // Username doğrulama
    if (!isValidUsername(newUsername)) {
        showToast("İstifadəçi adı qaydalara uyğun deyil!", "error");
        return;
    }
    if (newUsername !== currentUserData.username) {
        const avail = await isUsernameAvailable(newUsername);
        if (!avail) {
            showToast("Bu istifadəçi adı artıq alınıb!", "error");
            return;
        }
    }

    const submitBtn = profileSettingsForm.querySelector("button[type='submit']");
    submitBtn.textContent = 'Yüklənir...'; submitBtn.disabled = true;

    let newAvatarUrl = currentUserData.photoURL || DEFAULT_AVATAR;

    if (avatarFile) {
        try { newAvatarUrl = await uploadImageToImgBB(avatarFile); }
        catch (err) {
            showToast(err.message, "error");
            submitBtn.textContent = 'Dəyişiklikləri Yadda Saxla'; submitBtn.disabled = false; return;
        }
    }

    if ((emailChanged || passChanged) && currentPass) {
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
            await reauthenticateWithCredential(currentUser, credential);
        } catch (err) {
            showToast(localizeFirebaseError(err), "error");
            submitBtn.textContent = 'Dəyişiklikləri Yadda Saxla'; submitBtn.disabled = false; return;
        }
    }

    try {
        const displayName = `${newFirstName} ${newLastName}`;
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
        currentUserData.firstName = newFirstName;
        currentUserData.lastName = newLastName;
        currentUserData.displayName = displayName;
        currentUserData.photoURL = newAvatarUrl;
        document.getElementById('currentUserName').innerHTML = escapeHTML(displayName) + getRoleStarsHtml(currentUserData.role);
        document.getElementById('currentUserAvatar').src = newAvatarUrl;

        document.getElementById('currentPasswordInput').value = '';
        document.getElementById('newPasswordInput').value = '';
        settingsEmailDisplay.value = currentUser.email || newEmail;

        showToast("Dəyişikliklər uğurla yadda saxlandı!", "success");
        settingsModal.classList.remove('active');
    } catch (err) {
        showToast("Sistem xətası: " + localizeFirebaseError(err), "error");
    } finally {
        submitBtn.textContent = 'Dəyişiklikləri Yadda Saxla'; submitBtn.disabled = false;
    }
});
document.getElementById('deleteAccBtn').addEventListener('click', deleteAccount);

document.getElementById('changeEmailForm').addEventListener('submit', async (e) => { e.preventDefault(); });
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => { e.preventDefault(); });

/* ==========================================================================
 12. SMAYLIK (EMOJI) PANELİ
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
 13. MASTER OBSERVER
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
        currentUserData = { role: 'user', displayName: user.displayName || 'Anonim', photoURL: user.photoURL || DEFAULT_AVATAR, isBanned: false, username: '', firstName: '', lastName: '' };
    }

    document.getElementById('currentUserName').innerHTML = escapeHTML(currentUserData.displayName || 'Anonim') + getRoleStarsHtml(currentUserData.role);
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

    // Admin odası buton görünürlüğü
    if (getRoleLevel(currentUserData.role) >= 2) {
        btnAdminRoom.classList.remove('hidden');
    } else {
        btnAdminRoom.classList.add('hidden');
        if (activeRoomId === 'admin_room') {
            activeRoomId = 'global_room';
        }
    }
    
    logoutBtn.classList.remove('hidden'); openSettingsBtn.classList.remove('hidden');
    authScreen.classList.remove('active'); chatScreen.classList.add('active');
    document.getElementById('appLoader')?.classList.add('hidden');

    setupPresence(user);
    listenUsersAndPresence();
    checkActiveRoomTyping(); 
    
    if (activeRoomId === 'admin_room' && getRoleLevel(currentUserData.role) >= 2) {
        openAdminRoom();
    } else {
        closeAdminRoom();
        loadGeneralMessages();
        closePrivateRoom();
    }
    
    if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    startSelfDestructListener(user);
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (isRegistering) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                try {
                    await user.delete();
                    showToast("Hesabınız sistemdən tamamilə silindi.", "success");
                    window.location.reload();
                    return;
                } catch (authError) {
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
                try {
                    await user.delete();
                    window.location.reload();
                    return;
                } catch (authError) {
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
        if (unsubscribeAdminMessages) unsubscribeAdminMessages();
        if (unsubscribePrivateMessages) unsubscribePrivateMessages();
        if (unsubscribeUsers) unsubscribeUsers();
        if (unsubscribeRooms) unsubscribeRooms();
        if (unsubscribeTyping) unsubscribeTyping();
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();

        if (unsubscribePresenceConnected) { unsubscribePresenceConnected(); unsubscribePresenceConnected = null; }
        window.onmousemove = null; window.onkeypress = null;
    }
});

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ==========================================================================
 14. KINOFLIX ŞƏBƏKƏ (IP & DEVICE) BAN SİSTEMİ (OLDapp.js-dən saxlanıldı)
 ========================================================================== */
(function() {
    let localBlacklist = new Set();
    let blacklistListenerActive = false;

    async function fetchCurrentIP() {
        try { const res = await fetch('https://api.ipify.org?format=json'); const data = await res.json(); return data.ip; } 
        catch { return null; }
    }

    function getDeviceFingerprint() {
        const info = window.navigator.userAgent + window.navigator.language + window.screen.width + window.screen.height;
        let hash = 0;
        for (let i = 0; i < info.length; i++) { hash = ((hash << 5) - hash) + info.charCodeAt(i); hash |= 0; }
        return 'dev_' + Math.abs(hash);
    }

    function enforceBanUI() {
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; height:100dvh; background: radial-gradient(circle at center, #1a0b12 0%, #08101a 100%); color:#e74c3c; font-family:'Varela Round', sans-serif; text-align:center; padding:20px; box-sizing:border-box; overflow:hidden;">
                <div style="background: rgba(231, 76, 60, 0.05); border: 1px solid rgba(231, 76, 60, 0.2); padding: 40px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); max-width: 450px; width: 100%; backdrop-filter: blur(10px);">
                    <div style="width: 80px; height: 80px; background: rgba(231, 76, 60, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 2px solid rgba(231,76,60,0.5);">
                        <i class="fa-solid fa-network-wired" style="font-size: 32px; color: #e74c3c;"></i>
                    </div>
                    <h2 style="margin: 0 0 15px 0; font-size: 24px; letter-spacing: 1px; color: #fff;">GİRİŞ QADAĞANDIR! IP ADRESİNİZ VƏ YA CİHAZINIZ BAN EDİLİB!</h2>
                    <p style="color:#94a3b8; margin: 0; font-size: 15px; line-height: 1.6;">Sizin IP ünvanınız və ya cihazınız KINOFLIX platformasının qaydalarını pozduğuna görə sistemin <strong style="color:#e74c3c;">qara siyahısına</strong>əlavə edilib!</p>
                </div>
            </div>
        `;
    }

    auth.onAuthStateChanged(async (user) => {
        if(user) {
            const ip = await fetchCurrentIP();
            const deviceId = getDeviceFingerprint();
            try {
                await setDoc(doc(db, 'user_network', user.uid), {
                    userId: user.uid, lastIp: ip, lastDevice: deviceId, updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch(e) {}
            try {
                const ipCheck = await getDoc(doc(db, "blacklist", ip || "none"));
                const devCheck = await getDoc(doc(db, "blacklist", deviceId || "none"));
                const uidCheck = await getDoc(doc(db, "blacklist", user.uid));
                if (ipCheck.exists() || devCheck.exists() || uidCheck.exists()) {
                    auth.signOut().catch(()=>{});
                    enforceBanUI();
                }
            } catch(e) {}
        }
    });

    function initBlacklistListener() {
        if (blacklistListenerActive) return;
        blacklistListenerActive = true;
        onSnapshot(collection(db, 'blacklist'), (snapshot) => {
            localBlacklist.clear();
            snapshot.forEach(doc => localBlacklist.add(doc.id));
            updateNetworkBanButtons(); 
        });
    }

    function updateNetworkBanButtons() {
        if (!currentUserData || currentUserData.role !== 'super_admin') return;
        initBlacklistListener();

        const actionsContainers = document.querySelectorAll('.user-actions');
        actionsContainers.forEach(container => {
            const normalBanBtn = container.querySelector('.admin-ban-btn');
            if (!normalBanBtn) return;
            const onclickCode = normalBanBtn.getAttribute('onclick');
            if(!onclickCode) return;
            const match = onclickCode.match(/toggleBanUser\('([^']+)'/);
            if(!match) return;
            const targetUid = match[1];

            const isNetBanned = localBlacklist.has(targetUid);

            let netBanBtn = container.querySelector('.admin-network-ban-btn');
            if (!netBanBtn) {
                netBanBtn = document.createElement('button');
                netBanBtn.className = 'admin-network-ban-btn';
                normalBanBtn.after(netBanBtn);
            }

            const currentState = netBanBtn.getAttribute('data-status');
            const targetState = isNetBanned ? 'banned' : 'active';

            if (currentState !== targetState) {
                if (isNetBanned) {
                    netBanBtn.innerHTML = '<i class="fa-solid fa-wifi" style="color: #2ecc71;"></i>'; 
                    netBanBtn.title = 'İstifadəçinin IP/Cihaz banını TAM QALDIR';
                    netBanBtn.style.background = 'rgba(46, 204, 113, 0.1)';
                    netBanBtn.style.borderColor = 'rgba(46, 204, 113, 0.4)';
                } else {
                    netBanBtn.innerHTML = '<i class="fa-solid fa-wifi"></i>'; 
                    netBanBtn.title = 'İstifadəçini şəbəkə səviyyəsində qov (IP+Cihaz)';
                    netBanBtn.style.background = '';
                    netBanBtn.style.borderColor = '';
                }
                netBanBtn.setAttribute('data-status', targetState);
            }

            if (!netBanBtn.onclick) {
                netBanBtn.onclick = async (e) => {
                    e.stopPropagation();
                    const currentlyBanned = localBlacklist.has(targetUid);
                    if (currentlyBanned) {
                        if(!confirm("İstifadəçinin IP, Cihaz və Hesab banını QALDIRMAQ istəyirsiniz?")) return;
                        try {
                            const netDoc = await getDoc(doc(db, "user_network", targetUid));
                            if(netDoc.exists()) {
                                const data = netDoc.data();
                                if(data.lastIp) await deleteDoc(doc(db, "blacklist", data.lastIp));
                                if(data.lastDevice) await deleteDoc(doc(db, "blacklist", data.lastDevice));
                            }
                            await deleteDoc(doc(db, "blacklist", targetUid));
                            await setDoc(doc(db, "users", targetUid), { isBanned: false }, { merge: true });
                            if(typeof showToast === "function") showToast("Şəbəkə və hesab banı tamamilə ləğv edildi!", "success");
                        } catch(err) {
                            if(typeof showToast === "function") showToast("Xəta: " + err.message, "error");
                        }
                    } else {
                        if(!confirm("DİQQƏT: Bu istifadəçini IP, Cihaz və Hesab olaraq tam bloklamaq istəyirsiniz?")) return;
                        try {
                            const netDoc = await getDoc(doc(db, "user_network", targetUid));
                            let targetIp = null; let targetDevice = null;
                            if(netDoc.exists()) {
                                targetIp = netDoc.data().lastIp;
                                targetDevice = netDoc.data().lastDevice;
                            }
                            const banPayload = { banned: true, reason: "Super Admin IP/Cihaz Banı", timestamp: new Date().toISOString() };
                            if(targetIp) await setDoc(doc(db, "blacklist", targetIp), banPayload);
                            if(targetDevice) await setDoc(doc(db, "blacklist", targetDevice), banPayload);
                            await setDoc(doc(db, "blacklist", targetUid), banPayload);
                            await setDoc(doc(db, "users", targetUid), { isBanned: true }, { merge: true });
                            if(typeof showToast === "function") showToast("İstifadəçi şəbəkə səviyyəsində uğurla banlandı!", "success");
                        } catch(err) {
                            if(typeof showToast === "function") showToast("Səlahiyyət xətası: " + err.message, "error");
                        }
                    }
                };
            }
        });
    }

    const observer = new MutationObserver(() => updateNetworkBanButtons());

    const startObserver = setInterval(() => {
        const usersListEl = document.getElementById('usersList');
        if (usersListEl) {
            observer.observe(usersListEl, { childList: true, subtree: true });
            clearInterval(startObserver);
        }
    }, 500);
})();
                
/* ==========================================================================
 GHOST HESABLARIN AVTOMATİK TƏMİZLƏNMƏSİ (PATCH) — v4
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
            onValue(
                ref(rtdb, path),
                (snap) => resolve(snap.val() || {}),
                (err) => reject(err),
                { onlyOnce: true }
            );
        });
    }

    async function sweepGhostAccounts() {
        if (!currentUser || !currentUserData) return;
        if (typeof getRoleLevel !== 'function') return;
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
                    }).catch(() => {});
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
        if (typeof getRoleLevel !== 'function' || getRoleLevel(currentUserData.role) < 3) return;
        banWatcherActive = true;

        onSnapshot(
            query(collection(db, 'users'), where('isBanned', '==', true)),
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type !== 'added') return;
                    const uid = change.doc.id;
                    set(ref(rtdb, `presence/${uid}`), {
                        status: 'offline',
                        lastChanged: rtdbTimestamp(),
                        typingTo: null
                    }).catch(() => {});
                });
            },
            (err) => console.error('[ban-watcher] xəta:', err.code || err.message)
        );
    }

    const banWatcherInit = setInterval(() => {
        if (currentUser && currentUserData) {
            startBanWatcher();
            if (banWatcherActive) clearInterval(banWatcherInit);
        }
    }, 3000);

    window.__cleanLegacyGhosts = async function () {
        if (!currentUser || !currentUserData || getRoleLevel(currentUserData.role) < 3) return;
        const presenceData = await readOnce('presence');
        const heartbeatData = await readOnce('heartbeats');
        for (const uid of Object.keys(presenceData)) {
            const p = presenceData[uid];
            if (!p || (p.status !== 'online' && p.status !== 'away')) continue;
            if (heartbeatData[uid]) continue;
            await set(ref(rtdb, `presence/${uid}`), {
                status: 'offline',
                lastChanged: rtdbTimestamp(),
                typingTo: null
            }).catch(() => {});
        }
    };
})();
