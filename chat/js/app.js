// ==========================================================================
// 1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
// ==========================================================================
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

// Müstəqil konfiqurasiya faylının importu (Firebase Storage silindi)
import { firebaseConfig } from "./config.js";

// İnfrastrukturun başladılması
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// IMGBB VƏ GLOBAL DEFAULT AVATAR KONFİQURASİYASI
const IMGBB_API_KEY = "5437281cb3fb0c2e28ca265eefa6eaf7";
const DEFAULT_AVATAR = "https://kinoflix.github.io/chat/img/avatar.jpg";

// ==========================================================================
// 2. QLOBAL DƏYİŞƏNLƏR VƏ DOM ELEMENTLƏRİ
// ==========================================================================
let currentUser = null;
let currentUserData = { role: "user", displayName: "", photoURL: DEFAULT_AVATAR, isBanned: false };
let activeRoomId = "global_room";
let activeRoomIsDM = false;

// Canlı dinləyicilərin (Unsubscribe) idarəetmə dəyişənləri
let unsubscribeMessages = null;
let unsubscribeUsers = null;
let unsubscribeRooms = null;
let unsubscribeTyping = null;
let unsubscribeSelfDestruct = null;
let typingTimeout = null;

// Reaktiv status, rollar və mesaj idarəetməsi üçün keş dəyişənləri
let currentUsersList = [];
let currentStatuses = {};
let currentRooms = {};
let userRolesMap = {}; // Çat daxilində rolların ani yoxlanılması üçün: { uid: role }

// DOM Elementləri
const authScreen = document.getElementById("authScreen");
const chatScreen = document.getElementById("chatScreen");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const logoutBtn = document.getElementById("logoutBtn");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const settingsModal = document.getElementById("settingsModal");
const profileSettingsForm = document.getElementById("profileSettingsForm");
const messageInputField = document.getElementById("messageInputField");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const chatMessagesArea = document.getElementById("chatMessagesArea");
const usersList = document.getElementById("usersList");
const btnGlobalRoom = document.getElementById("btnGlobalRoom");
const activeRoomTitle = document.getElementById("activeRoomTitle");
const themeToggle = document.getElementById("themeToggle");
const siteLogo = document.getElementById("siteLogo");

// Rol İerarxiyasının Səviyyə Qiymətləri (Yoxlamaları asanlaşdırmaq üçün)
const getRoleLevel = (role) => {
    if (role === 'super_admin') return 4;
    if (role === 'admin') return 3;
    if (role === 'moderator') return 2;
    return 1; // Standart user
};

// Rola görə qızılı ulduzların HTML kodunu (addan sonra yerləşdirmək üçün) qaytaran funksiya
function getRoleStarsHtml(role) {
    let starCount = 0;
    if (role === 'super_admin') starCount = 3;
    else if (role === 'admin') starCount = 2;
    else if (role === 'moderator') starCount = 1;

    if (starCount === 0) return ''; // Adi istifadəçidirsə ulduz yoxdur

    let starsHtml = '';
    for (let i = 0; i < starCount; i++) {
        starsHtml += `<i class="fa-solid fa-star" style="color: #f1c40f; font-size: 11px; margin-left: 4px;" title="${role}"></i>`;
    }
    return starsHtml;
}

// ==========================================================================
// 2B. MÜASİR AZƏRBAYCAN DİLİNDƏ TOAST BİLDİRİŞ SİSTEMİ (Modern Alert UI)
// ==========================================================================
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
                background: none;
                border: none; color: #3498db; cursor: pointer;
                font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s;
            }
            .role-toggle-btn:hover { opacity: 1; }
            
            .admin-ban-btn {
                background: none;
                border: none; cursor: pointer;
                font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s;
            }
            .admin-ban-btn:hover { opacity: 1; }

            .admin-user-delete-btn {
                background: none;
                border: none; color: #e74c3c; cursor: pointer;
                font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s;
            }
            .admin-user-delete-btn:hover { opacity: 1; }
            
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
        default: return err.message || "Gözlənilməz texniki xəta baş verdi.";
    }
}

// ==========================================================================
// 2C. IMGBB API ÜZƏRİNDƏN ŞƏKİL YÜKLƏMƏ MÜHƏRRİKİ
// ==========================================================================
async function uploadImageToImgBB(file) {
    if (!file.type.startsWith("image/")) {
        throw new Error("Sistem yalnız şəkil fayllarını (JPG, PNG, WEBP, GIF) dəstəkləyir.");
    }

    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
    });
    if (!response.ok) {
        throw new Error("Şəkil serverə yüklənərkən xəta baş verdi.");
    }

    const resData = await response.json();
    return resData.data.url; 
}

// ==========================================================================
// 2D. IERARXIYAYA UYGUN IDARƏETMƏ MEXANİZMLƏRİ (Ban, Sil, Rol Ver/Al)
// ==========================================================================
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
        const userDocRef = doc(db, "users", user.uid);
        await deleteDoc(userDocRef);
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

// Rol Verilməsi və Alınması (Yalnız Super Admin hər kəsə tətbiq edə bilər)
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
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: targetRoleClean });
        showToast("İstifadəçinin rolu uğurla yeniləndi!", "success");
    } catch (error) {
        console.error("Rol dəyişərkən xəta:", error);
        showToast("Xəta baş verdi! Rol dəyişdirilə bilmədi.", "error");
    }
}

// Hesabların Banlanması (Super Admin hər kəsi, Admin isə yalnız moderator və user-i banlaya bilər)
async function toggleBanUser(targetUserId, isCurrentlyBanned) {
    const myLevel = getRoleLevel(currentUserData.role);
    try {
        const targetDoc = await getDoc(doc(db, "users", targetUserId));
        if (!targetDoc.exists()) return;
        const targetData = targetDoc.data();
        const targetLevel = getRoleLevel(targetData.role);

        // İerarxiya Yoxlanışı
        if (myLevel === 4 || (myLevel === 3 && targetLevel < 3)) {
            const actionText = isCurrentlyBanned ?
                "banını qaldırmaq" : "banlamaq (sistemdən tam kənarlaşdırmaq)";
            const confirmAction = confirm(`Bu istifadəçinin ${actionText} istədiyinizdən əminsiniz?`);
            if (!confirmAction) return;
            const userRef = doc(db, "users", targetUserId);
            await updateDoc(userRef, { isBanned: !isCurrentlyBanned });
            showToast(`İstifadəçi uğurla ${isCurrentlyBanned ? 'banı qaldırıldı' : 'banlandı'}!`, "success");
        } else {
            showToast("Səlahiyyətiniz çatmır! Bu istifadəçi üzərində ban əməliyyatı edə bilməzsiniz.", "error");
        }
    } catch (err) {
        console.error("Ban xətası:", err);
        showToast("Əməliyyat yerinə yetirilmədi: " + err.message, "error");
    }
}

// Hesabların Tamamilə Silinməsi (Yalnız Super Admin hər kəsi silə bilər)
async function adminDeleteUser(targetUserId) {
    if (getRoleLevel(currentUserData.role) !== 4) {
        showToast("Bu hesabı kökündən silmək üçün yalnız Super Admin yetkilidir!", "error");
        return;
    }

    const confirmDelete = confirm("DİQQƏT: Bu istifadəçini çatdan və verilənlər bazasından tamamilə silmək istədiyinizə əminsiniz? (Geri qaytarıla bilməz)");
    if (!confirmDelete) return;

    try {
        const targetDocRef = doc(db, "users", targetUserId);
        await deleteDoc(targetDocRef);
        showToast("İstifadəçi profili silindi. Sistem onu dərhal tamamilə kənarlaşdıracaq.", "success");
    } catch (err) {
        console.error("Admin silmə xətası:", err);
        showToast("İstifadəçini silmək mümkün olmadı: " + err.message, "error");
    }
}

// Real-vaxtda Hesabın Durumunu (Silinmə/Ban) izləyən dinləyici
function startSelfDestructListener(currentUserObj) {
    if (!currentUserObj) return;
    const myDocRef = doc(db, "users", currentUserObj.uid);
    let isInitialLoad = true;
    unsubscribeSelfDestruct = onSnapshot(myDocRef, async (snapshot) => {
        if (isInitialLoad) {
            isInitialLoad = false;
            return;
        }

        // Əgər Super Admin tərəfindən baza sənədi SİLİNİBSƏ
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

        // Əgər Admin/Super Admin tərəfindən BAN EDİLİBSƏ
        const data = snapshot.data();
        if (data && data.isBanned === true) {
            showToast("Sizin hesabınız admin tərəfindən ban edildi!", "error");
            await signOut(auth);
            setTimeout(() => { window.location.reload(); }, 2000);
        }
    });
}

window.adminDeleteUser = adminDeleteUser;
window.changeUserRole = changeUserRole;
window.toggleBanUser = toggleBanUser;

// ==========================================================================
// 3. MÖVZU ENGINI (Theme Toggle Logic)
// ==========================================================================
function updateThemeUI(theme) {
    const isDark = theme === 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    const logoColor = isDark ? 'white' : 'black';
    siteLogo.src = `../FILES/IMG/logos/${logoColor}.png`;
    siteLogo.onerror = function() { 
        this.src = `FILES/IMG/logos/${logoColor}.png`;
        this.onerror = null; 
    };
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

// ==========================================================================
// 4. AUTENTİFİKASİYA İDARƏETMƏSİ (Auth Logic)
// ==========================================================================
tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active"); tabRegister.classList.remove("active");
    loginForm.classList.add("active"); registerForm.classList.remove("active");
});
tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active"); tabLogin.classList.remove("active");
    registerForm.classList.add("active"); loginForm.classList.remove("active");
});
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value;

    try {
        const nameQuery = query(collection(db, "users"), where("displayName", "==", name));
        const nameSnap = await getDocs(nameQuery);
        if (!nameSnap.empty) {
            showToast("Bu istifadəçi adı artıq başqası tərəfindən alınıb. Fərqli ad seçin.", "warning");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name, photoURL: DEFAULT_AVATAR });
        
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid, displayName: name, email: email,
            photoURL: DEFAULT_AVATAR, role: "user", isBanned: false, createdAt: serverTimestamp()
        });
        registerForm.reset();
        showToast("Qeydiyyat uğurla tamamlandı!", "success");
    } catch (err) { showToast(localizeFirebaseError(err), "error"); }
});
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;
    try { 
        await signInWithEmailAndPassword(auth, email, pass); 
        loginForm.reset(); 
        showToast("Xoş gəldiniz!", "success");
    } 
    catch (err) { showToast(localizeFirebaseError(err), "error"); }
});
document.getElementById("googleAuthBtn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid, 
                displayName: user.displayName || "Anonim", 
                email: user.email,
                photoURL: user.photoURL || DEFAULT_AVATAR, 
                role: "user", 
                isBanned: false,
                createdAt: serverTimestamp()
            });
        }
        showToast("Google ilə uğurla giriş edildi!", "success");
    } catch (err) { showToast(localizeFirebaseError(err), "error"); }
});
logoutBtn.addEventListener("click", () => {
    if(currentUser) set(ref(rtdb, `/presence/${currentUser.uid}`), { status: "offline", lastChanged: rtdbTimestamp() });
    signOut(auth);
    showToast("Hesabdan çıxış edildi.", "info");
});

// ==========================================================================
// 5. CANLI STATUS SİSTEMİ (Presence Engine)
// ==========================================================================
function setupPresence(user) {
    const statusRef = ref(rtdb, `/presence/${user.uid}`);
    const connectedRef = ref(rtdb, ".info/connected");

    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            onDisconnect(statusRef).set({
                status: "offline", lastChanged: rtdbTimestamp(), typingTo: null
            }).then(() => {
                set(statusRef, { status: "online", lastChanged: rtdbTimestamp(), typingTo: null });
            });
        }
    });

    let idleTimer;
    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        set(statusRef, { status: "online", lastChanged: rtdbTimestamp(), typingTo: null });
        idleTimer = setTimeout(() => {
            set(statusRef, { status: "away", lastChanged: rtdbTimestamp(), typingTo: null });
        }, 5 * 60 * 1000);
    };
    window.onmousemove = resetIdleTimer;
    window.onkeypress = resetIdleTimer;
}

// ==========================================================================
// 6. İSTİFADƏÇİ SİYAHISININ RENDERİ, LİSTENERİ VƏ DM KEÇİDLƏRİ
// ==========================================================================
function listenUsersAndPresence() {
    if (unsubscribeUsers) unsubscribeUsers();
    if (unsubscribeRooms) unsubscribeRooms();

    // 1. Firestore: Bütün istifadəçilərin canlı siyahısı və rolların lokal keşi
    unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        currentUsersList = [];
        userRolesMap = {};

        // Cari istifadəçinin rolunu keçə daxil edirik
        if (currentUser && currentUserData) {
            userRolesMap[currentUser.uid] = currentUserData.role || "user";
        }

        snapshot.forEach(doc => {
            const uData = doc.data();
            userRolesMap[uData.uid] = uData.role || "user"; // Rolları UID üzərindən xəritələyirik
            
            if (uData.uid !== currentUser.uid) {
                currentUsersList.push(uData);
            }
        });
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
    });

    // 2. Realtime DB: İstifadəçilərin On/Off statusları
    onValue(ref(rtdb, "presence"), (snap) => {
        currentStatuses = snap.val() || {};
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
    });

    // 3. Firestore: Şəxsi otaqlar və bildiriş dataları
    const roomsQuery = query(collection(db, "rooms"), where("participants", "arrayContains", currentUser.uid));
    unsubscribeRooms = onSnapshot(roomsQuery, (snapshot) => {
        currentRooms = {};
        snapshot.forEach(doc => {
            currentRooms[doc.id] = doc.data();
        });
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
    });
}

function renderUsersList(users, statuses, rooms) {
    if (!currentUser || !currentUserData) return;
    usersList.innerHTML = "";

    const myLevel = getRoleLevel(currentUserData.role);
    users.forEach(user => {
        const userStatus = statuses[user.uid] ? statuses[user.uid].status : "offline";
        const isTyping = statuses[user.uid] && statuses[user.uid].typingTo === activeRoomId;
        const userAvatar = user.photoURL || DEFAULT_AVATAR;

        const roomId = [currentUser.uid, user.uid].sort().join("_");
        const roomData = rooms[roomId];
        const unreadCount = roomData ? (roomData[`unread_${currentUser.uid}`] || 0) : 0;
        const badgeHtml = unreadCount > 0 ? 
            `<span class="unread-badge">${unreadCount}</span>` : '';

        // Rol İerarxiyasına Görə Dinamik Ulduzların Alınması
        const roleStarsHtml = getRoleStarsHtml(user.role);

        const targetLevel = getRoleLevel(user.role);
        const isTargetBanned = user.isBanned === true;

        // Rol vermə və alma düyməsi (Yalnız Super Admin görə bilər)
        const roleButtonHtml = (myLevel === 4) 
            ? `<button class="role-toggle-btn" onclick="event.stopPropagation();
                 changeUserRole('${user.uid}', '${user.role || 'user'}')" title="Rolu idarə et (Hazırda: ${user.role || 'user'})">
                 <i class="fa-solid fa-user-gear"></i>
               </button>` 
            : '';

        // Ban Düyməsi: Super Admin hamını, Admin isə yalnız moderator və user-ləri banlaya bilər
        const canBan = (myLevel === 4) || (myLevel === 3 && targetLevel < 3);
        const banButtonHtml = canBan 
            ? `<button class="admin-ban-btn" onclick="event.stopPropagation();
                 toggleBanUser('${user.uid}', ${isTargetBanned})" title="${isTargetBanned ? 'Banı qaldır' : 'Hesabı banla'}">
                 <i class="fa-solid ${isTargetBanned ?
                 'fa-user-check' : 'fa-user-slash'}" style="color: ${isTargetBanned ? '#2ecc71' : '#f39c12'}"></i>
               </button>`
            : '';

        // Kökündən Silmə düyməsi (Yalnız Super Admin hər kəsi silə bilər)
        const adminDeleteHtml = (myLevel === 4) 
            ? `<button class="admin-user-delete-btn" onclick="event.stopPropagation();
                 adminDeleteUser('${user.uid}')" title="İstifadəçini tamamilə sil">
                 <i class="fa-solid fa-user-minus"></i>
               </button>` 
            : '';

        const li = document.createElement("li");
        li.className = `user-item ${activeRoomId.includes(user.uid) ? 'active' : ''}`;
        
        // Ban olunmuşların adının üzərindən xətt çəkilsin
        const nameStyle = isTargetBanned ? 'text-decoration: line-through; opacity: 0.5;' : '';

        // Ulduz addan SONRA yerləşir
        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${userAvatar}" class="avatar" alt="">
                <span class="status-indicator ${isTargetBanned ?
                'offline' : userStatus}"></span>
            </div>
            <span class="username" style="${nameStyle}">${escapeHTML(user.displayName)}${roleStarsHtml}</span>
            <span class="typing-notify ${isTyping ?
            '' : 'hidden'}">yazır...</span>
            ${badgeHtml}
            <div class="user-actions">
                ${roleButtonHtml}
                ${banButtonHtml}
                ${adminDeleteHtml}
            </div>
        `;
     
        li.addEventListener("click", () => startDirectMessage(user));
        usersList.appendChild(li);
    });
}

function startDirectMessage(targetUser) {
    activeRoomIsDM = true;
    activeRoomId = [currentUser.uid, targetUser.uid].sort().join("_");
    activeRoomTitle.innerText = targetUser.displayName;
    document.getElementById("activeRoomSub").innerText = "Şəxsi Məxfi Söhbət";
    btnGlobalRoom.classList.remove("active");
    
    setDoc(doc(db, "rooms", activeRoomId), {
        roomId: activeRoomId, isDM: true, participants: [currentUser.uid, targetUser.uid],
        lastMessageAt: serverTimestamp(),
        [`unread_${currentUser.uid}`]: 0
    }, { 
        merge: true });
    loadMessages();
}

btnGlobalRoom.addEventListener("click", () => {
    activeRoomIsDM = false;
    activeRoomId = "global_room";
    activeRoomTitle.innerText = "Ümumi Çat";
    document.getElementById("activeRoomSub").innerText = "Son 50 mesaj göstərilir";
    btnGlobalRoom.classList.add("active");
    loadMessages();
});

// ==========================================================================
// 7. REAL-VAXT MESAJ AXINI (Messaging Core)
// ==========================================================================
function loadMessages() {
    if (unsubscribeMessages) unsubscribeMessages();
    chatMessagesArea.innerHTML = "";
    const msgQuery = query(
        collection(db, "rooms", activeRoomId, "messages"),
        orderBy("createdAt", "desc"),
        limit(50)
    );
    unsubscribeMessages = onSnapshot(msgQuery, (snapshot) => {
        let messages = [];
        snapshot.forEach(doc => { messages.push({ id: doc.id, ...doc.data() }); });
        messages.reverse();
        
        chatMessagesArea.innerHTML = "";
        messages.forEach(msg => appendMessageElement(msg));
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;

        if (activeRoomIsDM && currentRooms[activeRoomId]?.[`unread_${currentUser.uid}`] > 0) {
            setDoc(doc(db, "rooms", activeRoomId), { [`unread_${currentUser.uid}`]: 0 }, { merge: true });
        }
    });
}

function appendMessageElement(msg) {
    const isMe = msg.senderId === currentUser.uid;
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`;

    // IERARXIYAYA UYGUN MESAJ SİLMƏ PARADİQMASI
    const myLevel = getRoleLevel(currentUserData.role);
    const senderRole = userRolesMap[msg.senderId] || "user";
    const senderLevel = getRoleLevel(senderRole);

    let canDelete = false;
    if (isMe) {
        canDelete = true; // Hər kəs öz mesajını hər zaman silə bilər
    } else {
        if (myLevel === 4) {
            canDelete = true; // Super Admin istənilən şəxsin mesajını silə bilər
        } else if (myLevel === 3 && senderLevel < 3) {
            canDelete = true; // Admin yalnız moderator və user-lərin mesajını silə bilər
        } else if (myLevel === 2 && senderLevel === 1) {
            canDelete = true; // Moderator yalnız standart user-lərin mesajını silə bilər
        }
    }

    const deleteBtnHtml = canDelete ?
        `<button class="delete-msg-btn" data-id="${msg.id}"><i class="fa-solid fa-trash"></i></button>` : '';

    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`;
    if (msg.fileURL) {
        contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Paylaşılan Şəkil" onclick="window.open('${msg.fileURL}')">`;
    }

    const msgAvatar = msg.senderAvatar || DEFAULT_AVATAR;
    const time = msg.createdAt ?
        new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "...";

    wrapper.innerHTML = `
        <img src="${msgAvatar}" class="msg-avatar" alt="">
        <div class="message-bubble">
            <span class="sender-name">${escapeHTML(msg.senderName)} ${deleteBtnHtml}</span>
            ${contentHtml}
            <span class="timestamp">${time}</span>
        </div>
    `;
    const delBtn = wrapper.querySelector(".delete-msg-btn");
    if(delBtn) {
        delBtn.addEventListener("click", async () => {
            if(confirm("Bu mesajı silmək istədiyinizdən əminsiniz?")) {
                await deleteDoc(doc(db, "rooms", activeRoomId, "messages", msg.id));
                showToast("Mesaj uğurla silindi.", "info");
            }
        });
    }

    chatMessagesArea.appendChild(wrapper);
}

async function sendMessage() {
    const text = messageInputField.value.trim();
    const fileInput = document.getElementById("chatFileInput");
    const file = fileInput.files[0];

    if (!text && !file) return;
    
    messageInputField.value = "";
    fileInput.value = "";

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
        await addDoc(collection(db, "rooms", activeRoomId, "messages"), {
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || "Anonim",
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
            text: text,
            fileURL: fileURL, 
            fileType: fileType,
            createdAt: serverTimestamp()
        });
        if (activeRoomIsDM) {
            const targetUserId = activeRoomId.split("_").find(id => id !== currentUser.uid);
            await setDoc(doc(db, "rooms", activeRoomId), { 
                lastMessageAt: serverTimestamp(),
                [`unread_${targetUserId}`]: increment(1)
            }, { merge: true });
        } else {
            await setDoc(doc(db, "rooms", activeRoomId), { lastMessageAt: serverTimestamp() }, { merge: true });
        }
    } catch (err) { showToast("Mesaj göndərilərkən xəta: " + err.message, "error"); }
}

sendMessageBtn.addEventListener("click", sendMessage);
messageInputField.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// ==========================================================================
// 7B. INDIKATOR PROSESI (Dondurmayan Tək Qlobal Dinləyici)
// ==========================================================================
function checkActiveRoomTyping() {
    if (unsubscribeTyping) unsubscribeTyping();
    unsubscribeTyping = onValue(ref(rtdb, "presence"), (snap) => {
        const statuses = snap.val() || {};
        let someoneTyping = false;

        for (let uid in statuses) {
            if (currentUser && uid !== currentUser.uid && statuses[uid].typingTo === activeRoomId) {
                someoneTyping = true;
                break;
            }
        }

        const indicator = document.getElementById("typingIndicator");
        if (indicator) {
            if (someoneTyping) indicator.classList.remove("hidden");
            else indicator.classList.add("hidden");
        }
    });
}

messageInputField.addEventListener("input", () => {
    set(ref(rtdb, `/presence/${currentUser.uid}/typingTo`), activeRoomId);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        set(ref(rtdb, `/presence/${currentUser.uid}/typingTo`), null);
    }, 1800);
});

// ==========================================================================
// 8. PROFİL MODALININ IDARƏEDİLMƏSİ (Unikal Ad Dəyişdir Dəstəkli)
// ==========================================================================
openSettingsBtn.addEventListener("click", () => {
    document.getElementById("settingsDisplayName").value = currentUserData.displayName;
    document.getElementById("settingsAvatarPreview").src = currentUserData.photoURL || DEFAULT_AVATAR;
    settingsModal.classList.add("active");
});
closeSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("active"));

profileSettingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = document.getElementById("settingsDisplayName").value.trim();
    const avatarFile = document.getElementById("avatarFileInput").files[0];
    let newAvatarUrl = currentUserData.photoURL || DEFAULT_AVATAR;

    const submitBtn = profileSettingsForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Yüklənir...";
    submitBtn.disabled = true;

    if (newName !== currentUserData.displayName) {
        try {
            const nameQuery = query(collection(db, "users"), where("displayName", "==", newName));
            const nameSnap = await getDocs(nameQuery);
            const isTaken = nameSnap.docs.some(doc => doc.id !== currentUser.uid);
            
            if (isTaken) {
                showToast("Bu istifadəçi adı artıq başqası tərəfindən alınıb. Başqa ad yoxlayın.", "warning");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                return;
            }
        } catch (err) {
            showToast("Yoxlama zamanı xəta baş verdi.", "error");
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            return;
        }
    }

    if (avatarFile) {
        try {
            newAvatarUrl = await uploadImageToImgBB(avatarFile);
        } catch (err) { 
            showToast(err.message, "error");
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            return; 
        }
    }

    try {
        await updateProfile(currentUser, { displayName: newName, photoURL: newAvatarUrl });
        await setDoc(doc(db, "users", currentUser.uid), {
            displayName: newName, photoURL: newAvatarUrl
        }, { merge: true });
        currentUserData.displayName = newName;
        currentUserData.photoURL = newAvatarUrl;
        
        // Ayarlardan ad yenilənəndə də ulduzlar addan SONRA qalır
        document.getElementById("currentUserName").innerHTML = escapeHTML(newName) + getRoleStarsHtml(currentUserData.role);
        document.getElementById("currentUserAvatar").src = newAvatarUrl;

        showToast("Profil məlumatlarınız uğurla yeniləndi!", "success");
        settingsModal.classList.remove("active");
    } catch (err) { 
        showToast("Sistem xətası: " + err.message, "error");
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});
document.getElementById("deleteAccBtn")?.addEventListener("click", deleteAccount);

// ==========================================================================
// 9. MASTER OBSERVER (Auth State Monitor)
// ==========================================================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
            
            // Əgər istifadəçi banlanıbsa, proqrama girişini tam əngəlləyirik
            if (currentUserData.isBanned === true) {
                showToast("Giriş əngəlləndi! Sizin hesabınız ban edilib.", "error");
                await signOut(auth);
                setTimeout(() => { window.location.reload(); }, 2000);
                return;
            }
        } else {
            currentUserData = { role: "user", displayName: user.displayName, photoURL: user.photoURL || DEFAULT_AVATAR, isBanned: false };
        }

        // --- XƏTA BURADA DÜZƏLDİLDİ: DEFAULT_AV4TAR -> DEFAULT_AVATAR edildi ---
        document.getElementById("currentUserName").innerHTML = escapeHTML(currentUserData.displayName || "Anonim") + getRoleStarsHtml(currentUserData.role);
        document.getElementById("currentUserAvatar").src = currentUserData.photoURL || DEFAULT_AVATAR;
        
        // UI-da cari rol adının tənzimlənməsi
        let roleTitle = "İstifadəçi";
        if (currentUserData.role === "super_admin") roleTitle = "Super Admin";
        else if (currentUserData.role === "admin") roleTitle = "Admin";
        else if (currentUserData.role === "moderator") roleTitle = "Moderator";
        document.getElementById("currentUserRole").innerText = roleTitle;
        
        logoutBtn.classList.remove("hidden");
        openSettingsBtn.classList.remove("hidden");
        authScreen.classList.remove("active");
        chatScreen.classList.add("active");

        setupPresence(user);
        listenUsersAndPresence();
        checkActiveRoomTyping(); 
        loadMessages();
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
        startSelfDestructListener(user);
    } else {
        currentUser = null;
        logoutBtn.classList.add("hidden");
        openSettingsBtn.classList.add("hidden");
        chatScreen.classList.remove("active");
        authScreen.classList.add("active");
        
        if (unsubscribeMessages) unsubscribeMessages();
        if (unsubscribeUsers) unsubscribeUsers();
        if (unsubscribeRooms) unsubscribeRooms();
        if (unsubscribeTyping) unsubscribeTyping();
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    }
});

// ==========================================================================
// 10. TƏHLÜKƏSİZLİK FUNKSİYALARI (Anti-XSS Protection)
// ==========================================================================
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ==========================================================================
// KINOFLIX MOBİL INTERACTION LOGIC (Online Toggle & Auto Close)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const mobileOnlineToggle = document.getElementById("mobileOnlineToggle");
    const sidebarListContainer = document.getElementById("sidebarListContainer");
    const btnGlobalRoom = document.getElementById("btnGlobalRoom");

    // 1. Online İkonuna basdıqda istifadəçi panelinin açılıb-bağlanması
    if (mobileOnlineToggle && sidebarListContainer) {
        mobileOnlineToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebarListContainer.classList.toggle("mobile-open");
        });
    }

    // 2. Şəxsi mesaj üçün istifadəçi adına vuranda paneli avtomatik bağla
    document.addEventListener("click", (e) => {
        if (e.target.closest(".user-item") || e.target.closest("#usersList li")) {
            if (sidebarListContainer) {
                sidebarListContainer.classList.remove("mobile-open");
            }
        }
    });

    // 3. Ekranda boş və ya kənar yerə vuranda istifadəçilər paneli qapansın
    document.addEventListener("click", (e) => {
        if (sidebarListContainer && 
            !sidebarListContainer.contains(e.target) && 
            e.target !== mobileOnlineToggle && 
            !mobileOnlineToggle.contains(e.target)) {
            sidebarListContainer.classList.remove("mobile-open");
        }
    });

    // 4. Sabit "Ümumi Çat" başlığına təkrar kliklədikdə şəxsi çatı bağlamaq məntiqi
    if (btnGlobalRoom) {
        btnGlobalRoom.addEventListener("click", () => {
            // Əgər app.js daxilində otaq dəyişmə funksiyanız (məsələn changeRoom və ya switchRoom) varsa,
            // Ümumi Çat başlığına klik edildiyi an avtomatik olaraq Qlobal otağa keçid etsin:
            if (typeof changeRoom === "function") {
                changeRoom("global"); // və ya sizin sistemdəki qlobal otaq ID-si
            }
        });
    }
});
