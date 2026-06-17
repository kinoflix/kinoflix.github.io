// ==========================================================================
// 1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"; [cite: 155]
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile,
    deleteUser 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"; [cite: 156]
import { 
    getFirestore, doc, setDoc, getDoc, collection, addDoc, query, 
    orderBy, limit, onSnapshot, serverTimestamp, deleteDoc,
    where, getDocs, increment, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"; [cite: 157]
import { 
    getDatabase, ref, set, onValue, onDisconnect, serverTimestamp as rtdbTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"; [cite: 158]

// Müstəqil konfiqurasiya faylının importu (Firebase Storage silindi)
import { firebaseConfig } from "./config.js"; [cite: 159]

// İnfrastrukturun başladılması
const app = initializeApp(firebaseConfig); [cite: 159]
const auth = getAuth(app); [cite: 160]
const db = getFirestore(app); [cite: 160]
const rtdb = getDatabase(app); [cite: 160]

// IMGBB VƏ GLOBAL DEFAULT AVATAR KONFİQURASİYASI
const IMGBB_API_KEY = "5437281cb3fb0c2e28ca265eefa6eaf7"; [cite: 161]
const DEFAULT_AVATAR = "https://kinoflix.github.io/chat/img/avatar.jpg"; [cite: 161]

// ==========================================================================
// 2. QLOBAL DƏYİŞƏNLƏR VƏ DOM ELEMENTLƏRİ
// ==========================================================================
let currentUser = null; [cite: 162]
let currentUserData = { role: "user", displayName: "", photoURL: DEFAULT_AVATAR, isBanned: false }; [cite: 163]
let activeRoomId = "global_room"; [cite: 163]
let activeRoomIsDM = false; [cite: 164]

// Canlı dinləyicilərin (Unsubscribe) idarəetmə dəyişənləri
let unsubscribeMessages = null; [cite: 164]
let unsubscribeUsers = null; [cite: 164]
let unsubscribeRooms = null; [cite: 165]
let unsubscribeTyping = null; [cite: 165]
let unsubscribeSelfDestruct = null; [cite: 165]
let typingTimeout = null; [cite: 165]

// Reaktiv status, rollar və mesaj idarəetməsi üçün keş dəyişənləri
let currentUsersList = []; [cite: 166]
let currentStatuses = {}; [cite: 166]
let currentRooms = {}; [cite: 167]
let userRolesMap = {}; // Çat daxilində rolların ani yoxlanılması üçün: { uid: role } [cite: 167]

// DOM Elementləri
const authScreen = document.getElementById("authScreen"); [cite: 167]
const chatScreen = document.getElementById("chatScreen"); [cite: 168]
const loginForm = document.getElementById("loginForm"); [cite: 168]
const registerForm = document.getElementById("registerForm"); [cite: 168]
const tabLogin = document.getElementById("tabLogin"); [cite: 168]
const tabRegister = document.getElementById("tabRegister"); [cite: 168]
const logoutBtn = document.getElementById("logoutBtn"); [cite: 169]
const openSettingsBtn = document.getElementById("openSettingsBtn"); [cite: 169]
const closeSettingsBtn = document.getElementById("closeSettingsBtn"); [cite: 169]
const settingsModal = document.getElementById("settingsModal"); [cite: 169]
const profileSettingsForm = document.getElementById("profileSettingsForm"); [cite: 169]
const messageInputField = document.getElementById("messageInputField"); [cite: 170]
const sendMessageBtn = document.getElementById("sendMessageBtn"); [cite: 170]
const chatMessagesArea = document.getElementById("chatMessagesArea"); [cite: 170]
const usersList = document.getElementById("usersList"); [cite: 170]
const btnGlobalRoom = document.getElementById("btnGlobalRoom"); [cite: 170]
const activeRoomTitle = document.getElementById("activeRoomTitle"); [cite: 171]
const themeToggle = document.getElementById("themeToggle"); [cite: 171]
const siteLogo = document.getElementById("siteLogo"); [cite: 171]

// Rol İerarxiyasının Səviyyə Qiymətləri (Yoxlamaları asanlaşdırmaq üçün)
const getRoleLevel = (role) => {
    if (role === 'super_admin') return 4; [cite: 172]
    if (role === 'admin') return 3; [cite: 173]
    if (role === 'moderator') return 2; [cite: 173]
    return 1; // Standart user [cite: 173]
};

// YENİ: Rola görə qızılı ulduzların HTML kodunu (addan sonra yerləşdirmək üçün) qaytaran funksiya
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
        const style = document.createElement("style"); [cite: 174]
        style.id = "flix-toast-styles"; [cite: 175]
        style.innerHTML = `
            .flix-toast-container {
                position: fixed; [cite: 175]
                top: 20px; right: 20px; z-index: 9999; [cite: 176]
                display: flex; flex-direction: column; gap: 10px; [cite: 176]
            } [cite: 177]
            .flix-toast {
                background: rgba(255, 255, 255, 0.9); [cite: 177]
                backdrop-filter: blur(10px); [cite: 178]
                color: #1a1a1a; padding: 14px 22px; border-radius: 12px; [cite: 178]
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); [cite: 178]
                font-family: 'Segoe UI', sans-serif; [cite: 179]
                font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 12px; [cite: 179]
                transform: translateX(120%); [cite: 179]
                animation: flixSlideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; [cite: 180]
                border-left: 5px solid #ccc; max-width: 360px; pointer-events: auto; [cite: 180]
            } [cite: 181]
            [data-theme="dark"] .flix-toast {
                background: rgba(28, 28, 30, 0.9); [cite: 181]
                color: #ffffff; [cite: 182]
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35); [cite: 182]
            } [cite: 183]
            .flix-toast.success { border-left-color: #2ecc71; } [cite: 183]
            .flix-toast.error { border-left-color: #e74c3c; } [cite: 184]
            .flix-toast.warning { border-left-color: #f39c12; } [cite: 185]
            .flix-toast.info { border-left-color: #3498db; } [cite: 186]
            
            .unread-badge {
                background-color: #e74c3c; [cite: 187]
                color: white; border-radius: 20px; [cite: 188]
                padding: 2px 8px; font-size: 11px; font-weight: bold; [cite: 188]
                margin-left: auto; min-width: 18px; text-align: center; [cite: 188]
                box-shadow: 0 2px 6px rgba(231, 76, 60, 0.4); animation: flixPulse 1.5s infinite; [cite: 189]
            } [cite: 190]
            
            .user-actions {
                display: flex; [cite: 190]
                align-items: center; [cite: 191]
                gap: 6px;
                margin-left: auto;
            }
            
            .role-toggle-btn {
                background: none; [cite: 191]
                border: none; color: #3498db; cursor: pointer; [cite: 192]
                font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s; [cite: 192]
            } [cite: 193]
            .role-toggle-btn:hover { opacity: 1; } [cite: 193]
            
            .admin-ban-btn {
                background: none; [cite: 194]
                border: none; cursor: pointer; [cite: 195]
                font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s; [cite: 195]
            } [cite: 196]
            .admin-ban-btn:hover { opacity: 1; } [cite: 196]

            .admin-user-delete-btn {
                background: none; [cite: 197]
                border: none; color: #e74c3c; cursor: pointer; [cite: 198]
                font-size: 14px; padding: 4px; opacity: 0.6; transition: opacity 0.2s; [cite: 198]
            } [cite: 199]
            .admin-user-delete-btn:hover { opacity: 1; } [cite: 199]
            
            @keyframes flixSlideIn { to { transform: translateX(0); } } [cite: 200]
            @keyframes flixFadeOut { to { opacity: 0; transform: translateY(-15px); } } [cite: 201]
            @keyframes flixPulse {
                0% { transform: scale(1); } [cite: 202]
                50% { transform: scale(1.08); } [cite: 204]
                100% { transform: scale(1); } [cite: 204]
            }
        `;
        document.head.appendChild(style); [cite: 206]
    }

    let container = document.querySelector(".flix-toast-container"); [cite: 206]
    if (!container) {
        container = document.createElement("div"); [cite: 206]
        container.className = "flix-toast-container"; [cite: 207]
        document.body.appendChild(container); [cite: 207]
    }

    const toast = document.createElement("div"); [cite: 207]
    toast.className = `flix-toast ${type}`; [cite: 207]
    
    let icon = "💡"; [cite: 207]
    if (type === "success") icon = "✅"; [cite: 208]
    if (type === "error") icon = "❌"; [cite: 208]
    if (type === "warning") icon = "⚠️"; [cite: 209]

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`; [cite: 209]
    container.appendChild(toast); [cite: 209]
    setTimeout(() => { [cite: 210]
        toast.style.animation = "flixFadeOut 0.4s forwards"; [cite: 210]
        setTimeout(() => toast.remove(), 400); [cite: 210]
    }, 4000); [cite: 210]
}

function localizeFirebaseError(err) {
    switch(err.code) {
        case "auth/email-already-in-use": return "Bu e-poçt ünvanı ilə artıq qeydiyyatdan keçilib."; [cite: 211]
        case "auth/invalid-credential": return "E-poçt ünvanı və ya şifrə yanlışdır."; [cite: 212]
        case "auth/weak-password": return "Şifrə çox zəifdir. Ən azı 6 simvoldan ibarət olmalıdır."; [cite: 212]
        case "auth/invalid-email": return "Daxil etdiyiniz e-poçt strukturu düzgün deyil."; [cite: 213]
        case "auth/user-disabled": return "Sizin hesabınız admin tərəfindən ban edilib!"; [cite: 213]
        default: return err.message || "Gözlənilməz texniki xəta baş verdi."; [cite: 214]
    }
}

// ==========================================================================
// 2C. IMGBB API ÜZƏRİNDƏN ŞƏKİL YÜKLƏMƏ MÜHƏRRİKİ
// ==========================================================================
async function uploadImageToImgBB(file) {
    if (!file.type.startsWith("image/")) {
        throw new Error("Sistem yalnız şəkil fayllarını (JPG, PNG, WEBP, GIF) dəstəkləyir."); [cite: 215]
    }

    const formData = new FormData(); [cite: 216]
    formData.append("image", file); [cite: 216]
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { [cite: 217]
        method: "POST", [cite: 217]
        body: formData [cite: 217]
    }); [cite: 217]
    if (!response.ok) {
        throw new Error("Şəkil serverə yüklənərkən xəta baş verdi."); [cite: 218]
    }

    const resData = await response.json(); [cite: 219]
    return resData.data.url;  [cite: 219]
}

// ==========================================================================
// 2D. IERARXIYAYA UYGUN IDARƏETMƏ MEXANİZMLƏRİ (Ban, Sil, Rol Ver/Al)
// ==========================================================================
async function deleteAccount() {
    const user = auth.currentUser; [cite: 220]
    if (!user) {
        showToast("Silmək üçün daxil olmuş hesab tapılmadı.", "error"); [cite: 221]
        return; [cite: 221]
    }

    const confirmFirst = confirm("Hesabınızı və bütün profil məlumatlarınızı silmək istədiyinizdən əminsiniz?"); [cite: 222]
    if (!confirmFirst) return; [cite: 222]
    const confirmSecond = confirm("Son xəbərdarlıq: Bu əməliyyat geri qaytarıla bilməz! Çat siyahısından tamamilə silinəcəksiniz. Razısınız?"); [cite: 223]
    if (!confirmSecond) return; [cite: 223]
    try {
        const userDocRef = doc(db, "users", user.uid); [cite: 224]
        await deleteDoc(userDocRef); [cite: 224]
        await deleteUser(user); [cite: 224]
        showToast("Hesabınız uğurla silindi. Sağlıqla qalın!", "success"); [cite: 225]
        setTimeout(() => { window.location.reload(); }, 2000); [cite: 251]
    } catch (err) {
        console.error("Hesab silinərkən xəta:", err); [cite: 226]
        if (err.code === "auth/requires-recent-login") {
            showToast("Hesabınızı silmək üçün təhlükəsizlik baxımından yenidən çıxış edib giriş etməlisiniz!", "warning"); [cite: 227]
        } else {
            showToast("Hesab silinərkən xəta baş verdi: " + err.message, "error"); [cite: 228]
        }
    }
}

// 1. Rol Verilməsi və Alınması (Yalnız Super Admin - 4-cü səviyyə hər kəsə tətbiq edə bilər)
async function changeUserRole(userId, currentRole) {
    if (currentUserData.role !== "super_admin") {
        showToast("Bu əməliyyat üçün Super Admin səlahiyyətiniz olmalıdır!", "error"); [cite: 229]
        return; [cite: 230]
    }

    const newRole = prompt(`İstifadəçinin yeni rolunu daxil edin:\n(super_admin, admin, moderator, user)\n\nHazırki rol: ${currentRole}`, currentRole); [cite: 230]
    if (!newRole) return;  [cite: 231]
    
    const validRoles = ["super_admin", "admin", "moderator", "user"]; [cite: 231]
    const targetRoleClean = newRole.trim().toLowerCase(); [cite: 231]
    if (!validRoles.includes(targetRoleClean)) {
        showToast("Yanlış rol daxil edilib! Sistem yalnız: super_admin, admin, moderator, user rollarını dəstəkləyir.", "warning"); [cite: 232]
        return; [cite: 233]
    }

    try {
        const userRef = doc(db, "users", userId); [cite: 233]
        await updateDoc(userRef, { role: targetRoleClean }); [cite: 234]
        showToast("İstifadəçinin rolu uğurla yeniləndi!", "success"); [cite: 234]
    } catch (error) {
        console.error("Rol dəyişərkən xəta:", error); [cite: 235]
        showToast("Xəta baş verdi! Rol dəyişdirilə bilmədi.", "error"); [cite: 236]
    }
}

// 2. Hesabların Banlanması (Super Admin hər kəsi, Admin isə yalnız moderator və user-i banlaya bilər)
async function toggleBanUser(targetUserId, isCurrentlyBanned) {
    const myLevel = getRoleLevel(currentUserData.role); [cite: 236]
    try {
        const targetDoc = await getDoc(doc(db, "users", targetUserId)); [cite: 237]
        if (!targetDoc.exists()) return; [cite: 237]
        const targetData = targetDoc.data(); [cite: 238]
        const targetLevel = getRoleLevel(targetData.role); [cite: 238]

        // İerarxiya Yoxlanışı
        if (myLevel === 4 || (myLevel === 3 && targetLevel < 3)) { [cite: 238]
            const actionText = isCurrentlyBanned ? [cite: 238]
                "banını qaldırmaq" : "banlamaq (sistemdən tam kənarlaşdırmaq)"; [cite: 239]
            const confirmAction = confirm(`Bu istifadəçinin ${actionText} istədiyinizdən əminsiniz?`); [cite: 239]
            if (!confirmAction) return; [cite: 239]
            const userRef = doc(db, "users", targetUserId); [cite: 240]
            await updateDoc(userRef, { isBanned: !isCurrentlyBanned }); [cite: 240]
            showToast(`İstifadəçi uğurla ${isCurrentlyBanned ? 'banı qaldırıldı' : 'banlandı'}!`, "success"); [cite: 241]
        } else {
            showToast("Səlahiyyətiniz çatmır! Bu istifadəçi üzərində ban əməliyyatı edə bilməzsiniz.", "error"); [cite: 241]
        }
    } catch (err) {
        console.error("Ban xətası:", err); [cite: 242]
        showToast("Əməliyyat yerinə yetirilmədi: " + err.message, "error"); [cite: 243]
    }
}

// 3. Hesabların Tamamilə Silinməsi (Yalnız Super Admin - Səviyyə 4 hər kəsi silə bilər)
async function adminDeleteUser(targetUserId) {
    if (getRoleLevel(currentUserData.role) !== 4) { [cite: 243]
        showToast("Bu hesabı kökündən silmək üçün yalnız Super Admin yetkilidir!", "error"); [cite: 243]
        return; [cite: 244]
    }

    const confirmDelete = confirm("DİQQƏT: Bu istifadəçini çatdan və verilənlər bazasından tamamilə silmək istədiyinizə əminsiniz? (Geri qaytarıla bilməz)"); [cite: 244]
    if (!confirmDelete) return; [cite: 245]

    try {
        const targetDocRef = doc(db, "users", targetUserId); [cite: 245]
        await deleteDoc(targetDocRef); [cite: 245]
        showToast("İstifadəçi profili silindi. Sistem onu dərhal tamamilə kənarlaşdıracaq.", "success"); [cite: 246]
    } catch (err) {
        console.error("Admin silmə xətası:", err); [cite: 246]
        showToast("İstifadəçini silmək mümkün olmadı: " + err.message, "error"); [cite: 247]
    }
}

// Real-vaxtda Hesabın Durumunu (Silinmə/Ban) izləyən dinləyici
function startSelfDestructListener(currentUserObj) {
    if (!currentUserObj) return; [cite: 247]
    const myDocRef = doc(db, "users", currentUserObj.uid); [cite: 248]
    let isInitialLoad = true; [cite: 248]
    unsubscribeSelfDestruct = onSnapshot(myDocRef, async (snapshot) => { [cite: 249]
        if (isInitialLoad) {
            isInitialLoad = false; [cite: 249]
            return; [cite: 249]
        }

        // Əgər Super Admin tərəfindən baza sənədi SİLİNİBSƏ
        if (!snapshot.exists()) { [cite: 249]
            try {
                await deleteUser(currentUserObj); [cite: 250]
                showToast("Hesabınız Super Admin tərəfindən silindi!", "error"); [cite: 250]
            } catch (err) {
                await signOut(auth); [cite: 250]
                showToast("Hesabınız silindi və sistemdən kənarlaşdırıldınız!", "error"); [cite: 250]
            }
            setTimeout(() => { window.location.reload(); }, 2000); [cite: 251]
            return; [cite: 251]
        }

        // Əgər Admin/Super Admin tərəfindən BAN EDİLİBSƏ
        const data = snapshot.data(); [cite: 251]
        if (data && data.isBanned === true) { [cite: 251]
            showToast("Sizin hesabınız admin tərəfindən ban edildi!", "error"); [cite: 251]
            await signOut(auth); [cite: 251]
            setTimeout(() => { window.location.reload(); }, 2000); [cite: 252]
        }
    });
}

window.adminDeleteUser = adminDeleteUser; [cite: 253]
window.changeUserRole = changeUserRole; [cite: 253]
window.toggleBanUser = toggleBanUser; [cite: 253]

// ==========================================================================
// 3. MÖVZU ENGINI (Theme Toggle Logic)
// ==========================================================================
function updateThemeUI(theme) {
    const isDark = theme === 'dark'; [cite: 254]
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>'; [cite: 255]
    const logoColor = isDark ? 'white' : 'black'; [cite: 255]
    siteLogo.src = `../FILES/IMG/logos/${logoColor}.png`; [cite: 256]
    siteLogo.onerror = function() { 
        this.src = `FILES/IMG/logos/${logoColor}.png`; [cite: 256]
        this.onerror = null;  [cite: 257]
    };
}

themeToggle.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; [cite: 257]
    document.body.setAttribute('data-theme', newTheme); [cite: 257]
    localStorage.setItem('flix-theme', newTheme); [cite: 257]
    updateThemeUI(newTheme); [cite: 257]
});
const savedTheme = localStorage.getItem('flix-theme') || 'dark'; [cite: 258]
document.body.setAttribute('data-theme', savedTheme); [cite: 258]
updateThemeUI(savedTheme); [cite: 258]

// ==========================================================================
// 4. AUTENTİFİKASİYA İDARƏETMƏSİ (Auth Logic)
// ==========================================================================
tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active"); tabRegister.classList.remove("active"); [cite: 258]
    loginForm.classList.add("active"); registerForm.classList.remove("active"); [cite: 258]
});
tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active"); tabLogin.classList.remove("active"); [cite: 259]
    registerForm.classList.add("active"); loginForm.classList.remove("active"); [cite: 259]
});
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); [cite: 260]
    const name = document.getElementById("regName").value.trim(); [cite: 260]
    const email = document.getElementById("regEmail").value.trim(); [cite: 260]
    const pass = document.getElementById("regPassword").value; [cite: 260]

    try {
        const nameQuery = query(collection(db, "users"), where("displayName", "==", name)); [cite: 260]
        const nameSnap = await getDocs(nameQuery); [cite: 260]
        if (!nameSnap.empty) {
            showToast("Bu istifadəçi adı artıq başqası tərəfindən alınıb. Fərqli ad seçin.", "warning"); [cite: 260]
            return; [cite: 261]
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, pass); [cite: 261]
        const user = userCredential.user; [cite: 261]
        await updateProfile(user, { displayName: name, photoURL: DEFAULT_AVATAR }); [cite: 261]
        
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid, displayName: name, email: email, [cite: 261]
            photoURL: DEFAULT_AVATAR, role: "user", isBanned: false, createdAt: serverTimestamp() [cite: 262]
        });
        registerForm.reset(); [cite: 262]
        showToast("Qeydiyyat uğurla tamamlandı!", "success"); [cite: 263]
    } catch (err) { showToast(localizeFirebaseError(err), "error"); } [cite: 263]
});
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); [cite: 264]
    const email = document.getElementById("loginEmail").value.trim(); [cite: 264]
    const pass = document.getElementById("loginPassword").value; [cite: 264]
    try { 
        await signInWithEmailAndPassword(auth, email, pass);  [cite: 264]
        loginForm.reset();  [cite: 264]
        showToast("Xoş gəldiniz!", "success"); [cite: 264]
    } 
    catch (err) { showToast(localizeFirebaseError(err), "error"); } [cite: 264]
});
document.getElementById("googleAuthBtn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider(); [cite: 265]
    try {
        const result = await signInWithPopup(auth, provider); [cite: 265]
        const user = result.user; [cite: 265]
        const userDocRef = doc(db, "users", user.uid); [cite: 265]
        const userDoc = await getDoc(userDocRef); [cite: 265]
        
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,  [cite: 265]
                displayName: user.displayName || "Anonim",  [cite: 266]
                email: user.email, [cite: 266]
                photoURL: user.photoURL || DEFAULT_AVATAR,  [cite: 266]
                role: "user",  [cite: 266]
                isBanned: false, [cite: 267]
                createdAt: serverTimestamp() [cite: 267]
            });
        }
        showToast("Google ilə uğurla giriş edildi!", "success"); [cite: 267]
    } catch (err) { showToast(localizeFirebaseError(err), "error"); } [cite: 267]
});
logoutBtn.addEventListener("click", () => {
    if(currentUser) set(ref(rtdb, `/presence/${currentUser.uid}`), { status: "offline", lastChanged: rtdbTimestamp() }); [cite: 268]
    signOut(auth); [cite: 268]
    showToast("Hesabdan çıxış edildi.", "info"); [cite: 268]
});

// ==========================================================================
// 5. CANLI STATUS SİSTEMİ (Presence Engine)
// ==========================================================================
function setupPresence(user) {
    const statusRef = ref(rtdb, `/presence/${user.uid}`); [cite: 269]
    const connectedRef = ref(rtdb, ".info/connected"); [cite: 270]

    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            onDisconnect(statusRef).set({
                status: "offline", lastChanged: rtdbTimestamp(), typingTo: null
            }).then(() => {
                set(statusRef, { status: "online", lastChanged: rtdbTimestamp(), typingTo: null }); [cite: 270]
            }); [cite: 271]
        }
    });

    let idleTimer; [cite: 271]
    const resetIdleTimer = () => {
        clearTimeout(idleTimer); [cite: 272]
        set(statusRef, { status: "online", lastChanged: rtdbTimestamp(), typingTo: null }); [cite: 273]
        idleTimer = setTimeout(() => {
            set(statusRef, { status: "away", lastChanged: rtdbTimestamp(), typingTo: null }); [cite: 273]
        }, 5 * 60 * 1000);
    }; [cite: 274]
    window.onmousemove = resetIdleTimer; [cite: 274]
    window.onkeypress = resetIdleTimer; [cite: 274]
}

// ==========================================================================
// 6. İSTİFADƏÇİ SİYAHISININ RENDERİ, LİSTENERİ VƏ DM KEÇİDLƏRİ
// ==========================================================================
function listenUsersAndPresence() {
    if (unsubscribeUsers) unsubscribeUsers(); [cite: 274]
    if (unsubscribeRooms) unsubscribeRooms(); [cite: 275]

    // 1. Firestore: Bütün istifadəçilərin canlı siyahısı və rolların lokal keşi
    unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        currentUsersList = []; [cite: 275]
        userRolesMap = {}; [cite: 275]

        // Cari istifadəçinin rolunu keçə daxil edirik
        if (currentUser && currentUserData) {
            userRolesMap[currentUser.uid] = currentUserData.role || "user"; [cite: 275]
        }

        snapshot.forEach(doc => { [cite: 275]
            const uData = doc.data(); [cite: 276]
            userRolesMap[uData.uid] = uData.role || "user"; // Rolları UID üzərindən xəritələyirik [cite: 276]
            
            if (uData.uid !== currentUser.uid) {
                currentUsersList.push(uData); [cite: 276]
            }
        }); [cite: 277]
        renderUsersList(currentUsersList, currentStatuses, currentRooms); [cite: 277]
    });

    // 2. Realtime DB: İstifadəçilərin On/Off statusları
    onValue(ref(rtdb, "presence"), (snap) => {
        currentStatuses = snap.val() || {}; [cite: 278]
        renderUsersList(currentUsersList, currentStatuses, currentRooms); [cite: 278]
    });

    // 3. Firestore: Şəxsi otaqlar və bildiriş dataları
    const roomsQuery = query(collection(db, "rooms"), where("participants", "arrayContains", currentUser.uid)); [cite: 279]
    unsubscribeRooms = onSnapshot(roomsQuery, (snapshot) => { [cite: 280]
        currentRooms = {}; [cite: 280]
        snapshot.forEach(doc => {
            currentRooms[doc.id] = doc.data(); [cite: 280]
        });
        renderUsersList(currentUsersList, currentStatuses, currentRooms); [cite: 280]
    });
}

function renderUsersList(users, statuses, rooms) {
    if (!currentUser || !currentUserData) return; [cite: 281]
    usersList.innerHTML = ""; [cite: 281]

    const myLevel = getRoleLevel(currentUserData.role); [cite: 281]
    users.forEach(user => {
        const userStatus = statuses[user.uid] ? statuses[user.uid].status : "offline"; [cite: 282]
        const isTyping = statuses[user.uid] && statuses[user.uid].typingTo === activeRoomId; [cite: 282]
        const userAvatar = user.photoURL || DEFAULT_AVATAR; [cite: 282]

        const roomId = [currentUser.uid, user.uid].sort().join("_"); [cite: 282]
        const roomData = rooms[roomId]; [cite: 282]
        const unreadCount = roomData ? (roomData[`unread_${currentUser.uid}`] || 0) : 0; [cite: 282]
        const badgeHtml = unreadCount > 0 ? 
            `<span class="unread-badge">${unreadCount}</span>` : ''; [cite: 283]

        // --- TƏLƏB 1: Rol İerarxiyasına Görə Dinamik Ulduzların Alınması ---
        const roleStarsHtml = getRoleStarsHtml(user.role);

        const targetLevel = getRoleLevel(user.role); [cite: 285]
        const isTargetBanned = user.isBanned === true; [cite: 285]

        // Rol vermə və alma düyməsi (Yalnız Super Admin görə bilər - hər kəsə tətbiq edə bilər)
        const roleButtonHtml = (myLevel === 4) 
            ? `<button class="role-toggle-btn" onclick="event.stopPropagation(); [cite: 285]
                 changeUserRole('${user.uid}', '${user.role || 'user'}')" title="Rolu idarə et (Hazırda: ${user.role || 'user'})">
                 <i class="fa-solid fa-user-gear"></i>
               </button>` 
            : '';

        // Ban Düyməsi: Super Admin hamını, Admin isə yalnız moderator və user-ləri banlaya bilər
        const canBan = (myLevel === 4) || (myLevel === 3 && targetLevel < 3); [cite: 286]
        const banButtonHtml = canBan 
            ? `<button class="admin-ban-btn" onclick="event.stopPropagation(); [cite: 287]
                 toggleBanUser('${user.uid}', ${isTargetBanned})" title="${isTargetBanned ? 'Banı qaldır' : 'Hesabı banla'}">
                 <i class="fa-solid ${isTargetBanned ? [cite: 288]
                 'fa-user-check' : 'fa-user-slash'}" style="color: ${isTargetBanned ? '#2ecc71' : '#f39c12'}"></i>
               </button>`
            : '';

        // Kökündən Silmə düyməsi (Yalnız Super Admin hər kəsi silə bilər)
        const adminDeleteHtml = (myLevel === 4) 
            ? `<button class="admin-user-delete-btn" onclick="event.stopPropagation(); [cite: 289]
                 adminDeleteUser('${user.uid}')" title="İstifadəçini tamamilə sil">
                 <i class="fa-solid fa-user-minus"></i>
               </button>` 
            : '';

        const li = document.createElement("li"); [cite: 290]
        li.className = `user-item ${activeRoomId.includes(user.uid) ? 'active' : ''}`; [cite: 290]
        
        // Ban olunmuşların adının üzərindən xətt çəkilsin
        const nameStyle = isTargetBanned ? 'text-decoration: line-through; opacity: 0.5;' : ''; [cite: 291]

        // TƏLƏBƏ UYĞUN OLARAQ: Ulduz addan SONRA yerləşir (${escapeHTML(user.displayName)}${roleStarsHtml})
        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${userAvatar}" class="avatar" alt="">
                <span class="status-indicator ${isTargetBanned ? [cite: 292]
                'offline' : userStatus}"></span>
            </div>
            <span class="username" style="${nameStyle}">${escapeHTML(user.displayName)}${roleStarsHtml}</span>
            <span class="typing-notify ${isTyping ? [cite: 293]
            '' : 'hidden'}">yazır...</span>
            ${badgeHtml}
            <div class="user-actions">
                ${roleButtonHtml}
                ${banButtonHtml}
                ${adminDeleteHtml}
            </div>
        `; [cite: 294]
     
        li.addEventListener("click", () => startDirectMessage(user)); [cite: 295]
        usersList.appendChild(li); [cite: 295]
    });
}

function startDirectMessage(targetUser) {
    activeRoomIsDM = true; [cite: 295]
    activeRoomId = [currentUser.uid, targetUser.uid].sort().join("_"); [cite: 295]
    activeRoomTitle.innerText = targetUser.displayName; [cite: 295]
    document.getElementById("activeRoomSub").innerText = "Şəxsi Məxfi Söhbət"; [cite: 295]
    btnGlobalRoom.classList.remove("active"); [cite: 295]
    
    setDoc(doc(db, "rooms", activeRoomId), {
        roomId: activeRoomId, isDM: true, participants: [currentUser.uid, targetUser.uid],
        lastMessageAt: serverTimestamp(),
        [`unread_${currentUser.uid}`]: 0
    }, { 
        merge: true }); [cite: 296]
    loadMessages(); [cite: 296]
}

btnGlobalRoom.addEventListener("click", () => {
    activeRoomIsDM = false; [cite: 296]
    activeRoomId = "global_room"; [cite: 296]
    activeRoomTitle.innerText = "Ümumi Çat"; [cite: 297]
    document.getElementById("activeRoomSub").innerText = "Son 50 mesaj göstərilir"; [cite: 297]
    btnGlobalRoom.classList.add("active"); [cite: 297]
    loadMessages(); [cite: 297]
});

// ==========================================================================
// 7. REAL-VAXT MESAJ AXINI (Messaging Core)
// ==========================================================================
function loadMessages() {
    if (unsubscribeMessages) unsubscribeMessages(); [cite: 298]
    chatMessagesArea.innerHTML = ""; [cite: 298]
    const msgQuery = query(
        collection(db, "rooms", activeRoomId, "messages"),
        orderBy("createdAt", "desc"),
        limit(50)
    ); [cite: 299]
    unsubscribeMessages = onSnapshot(msgQuery, (snapshot) => { [cite: 300]
        let messages = []; [cite: 300]
        snapshot.forEach(doc => { messages.push({ id: doc.id, ...doc.data() }); }); [cite: 300]
        messages.reverse(); [cite: 300]
        
        chatMessagesArea.innerHTML = ""; [cite: 300]
        messages.forEach(msg => appendMessageElement(msg)); [cite: 300]
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight; [cite: 300]

        if (activeRoomIsDM && currentRooms[activeRoomId]?.[`unread_${currentUser.uid}`] > 0) {
            setDoc(doc(db, "rooms", activeRoomId), { [`unread_${currentUser.uid}`]: 0 }, { merge: true }); [cite: 301]
        }
    });
}

function appendMessageElement(msg) {
    const isMe = msg.senderId === currentUser.uid; [cite: 302]
    const wrapper = document.createElement("div"); [cite: 302]
    wrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`; [cite: 303]

    // --- IERARXIYAYA UYGUN MESAJ SİLMƏ PARADİQMASI ---
    const myLevel = getRoleLevel(currentUserData.role); [cite: 303]
    const senderRole = userRolesMap[msg.senderId] || "user"; [cite: 304]
    const senderLevel = getRoleLevel(senderRole); [cite: 304]

    let canDelete = false; [cite: 304]
    if (isMe) {
        canDelete = true; [cite: 305] // Hər kəs öz mesajını hər zaman silə bilər [cite: 306]
    } else {
        if (myLevel === 4) {
            canDelete = true; [cite: 306] // Super Admin istənilən şəxsin mesajını silə bilər [cite: 307]
        } else if (myLevel === 3 && senderLevel < 3) {
            canDelete = true; [cite: 307] // Admin yalnız moderator və user-lərin mesajını silə bilər [cite: 308]
        } else if (myLevel === 2 && senderLevel === 1) {
            canDelete = true; [cite: 308] // Moderator yalnız standart user-lərin mesajını silə bilər [cite: 309]
        }
    }

    const deleteBtnHtml = canDelete ? [cite: 309]
        `<button class="delete-msg-btn" data-id="${msg.id}"><i class="fa-solid fa-trash"></i></button>` : ''; [cite: 310]

    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`; [cite: 310]
    if (msg.fileURL) {
        contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Paylaşılan Şəkil" onclick="window.open('${msg.fileURL}')">`; [cite: 311]
    }

    const msgAvatar = msg.senderAvatar || DEFAULT_AVATAR; [cite: 312]
    const time = msg.createdAt ? [cite: 312]
        new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "..."; [cite: 313]

    wrapper.innerHTML = `
        <img src="${msgAvatar}" class="msg-avatar" alt="">
        <div class="message-bubble">
            <span class="sender-name">${escapeHTML(msg.senderName)} ${deleteBtnHtml}</span>
            ${contentHtml}
            <span class="timestamp">${time}</span>
        </div>
    `; [cite: 313]
    const delBtn = wrapper.querySelector(".delete-msg-btn"); [cite: 314]
    if(delBtn) {
        delBtn.addEventListener("click", async () => {
            if(confirm("Bu mesajı silmək istədiyinizdən əminsiniz?")) {
                await deleteDoc(doc(db, "rooms", activeRoomId, "messages", msg.id)); [cite: 314]
                showToast("Mesaj uğurla silindi.", "info"); [cite: 314]
            }
        });
    }

    chatMessagesArea.appendChild(wrapper); [cite: 315]
}

async function sendMessage() {
    const text = messageInputField.value.trim(); [cite: 315]
    const fileInput = document.getElementById("chatFileInput"); [cite: 315]
    const file = fileInput.files[0]; [cite: 316]

    if (!text && !file) return;
    
    messageInputField.value = ""; [cite: 316]
    fileInput.value = ""; [cite: 316]

    let fileURL = null; [cite: 316]
    let fileType = null; [cite: 317]

    if (file) {
        try {
            fileURL = await uploadImageToImgBB(file); [cite: 317]
            fileType = file.type; [cite: 318]
        } catch (err) { 
            showToast(err.message, "error"); [cite: 318]
            return;  [cite: 319]
        }
    }

    try {
        await addDoc(collection(db, "rooms", activeRoomId, "messages"), {
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || "Anonim",
            senderAvatar: currentUserData.photoURL || DEFAULT_AVATAR,
            text: text,
            fileURL: fileURL, 
            fileType: fileType, [cite: 320]
            createdAt: serverTimestamp() [cite: 320]
        });
        if (activeRoomIsDM) { [cite: 321]
            const targetUserId = activeRoomId.split("_").find(id => id !== currentUser.uid); [cite: 321]
            await setDoc(doc(db, "rooms", activeRoomId), {  [cite: 322]
                lastMessageAt: serverTimestamp(),
                [`unread_${targetUserId}`]: increment(1)
            }, { merge: true }); [cite: 322]
        } else {
            await setDoc(doc(db, "rooms", activeRoomId), { lastMessageAt: serverTimestamp() }, { merge: true }); [cite: 323]
        }
    } catch (err) { showToast("Mesaj göndərilərkən xəta: " + err.message, "error"); } [cite: 324]
}

sendMessageBtn.addEventListener("click", sendMessage); [cite: 324]
messageInputField.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); }); [cite: 325]

// ==========================================================================
// 7B. INDIKATOR PROSESI (Dondurmayan Tək Qlobal Dinləyici)
// ==========================================================================
function checkActiveRoomTyping() {
    if (unsubscribeTyping) unsubscribeTyping(); [cite: 326]
    unsubscribeTyping = onValue(ref(rtdb, "presence"), (snap) => { [cite: 327]
        const statuses = snap.val() || {}; [cite: 327]
        let someoneTyping = false; [cite: 327]

        for (let uid in statuses) {
            if (currentUser && uid !== currentUser.uid && statuses[uid].typingTo === activeRoomId) {
                someoneTyping = true; [cite: 327]
                break; [cite: 327]
            }
        }

        const indicator = document.getElementById("typingIndicator"); [cite: 328]
        if (indicator) {
            if (someoneTyping) indicator.classList.remove("hidden");
            else indicator.classList.add("hidden"); [cite: 328]
        }
    });
}

messageInputField.addEventListener("input", () => {
    set(ref(rtdb, `/presence/${currentUser.uid}/typingTo`), activeRoomId); [cite: 329]
    clearTimeout(typingTimeout); [cite: 329]
    typingTimeout = setTimeout(() => {
        set(ref(rtdb, `/presence/${currentUser.uid}/typingTo`), null); [cite: 329]
    }, 1800);
});

// ==========================================================================
// 8. PROFİL MODALININ IDARƏEDİLMƏSİ (Unikal Ad Dəyişdir Dəstəkli)
// ==========================================================================
openSettingsBtn.addEventListener("click", () => {
    document.getElementById("settingsDisplayName").value = currentUserData.displayName; [cite: 330]
    document.getElementById("settingsAvatarPreview").src = currentUserData.photoURL || DEFAULT_AVATAR; [cite: 330]
    settingsModal.classList.add("active"); [cite: 330]
});
closeSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("active")); [cite: 331]

profileSettingsForm.addEventListener("submit", async (e) => {
    e.preventDefault(); [cite: 331]
    const newName = document.getElementById("settingsDisplayName").value.trim(); [cite: 331]
    const avatarFile = document.getElementById("avatarFileInput").files[0]; [cite: 331]
    let newAvatarUrl = currentUserData.photoURL || DEFAULT_AVATAR; [cite: 331]

    const submitBtn = profileSettingsForm.querySelector("button[type='submit']"); [cite: 331]
    const originalBtnText = submitBtn.innerText; [cite: 331]
    submitBtn.innerText = "Yüklənir..."; [cite: 331]
    submitBtn.disabled = true; [cite: 331]

    if (newName !== currentUserData.displayName) {
        try {
            const nameQuery = query(collection(db, "users"), where("displayName", "==", newName)); [cite: 331]
            const nameSnap = await getDocs(nameQuery); [cite: 332]
            const isTaken = nameSnap.docs.some(doc => doc.id !== currentUser.uid); [cite: 332]
            
            if (isTaken) {
                showToast("Bu istifadəçi adı artıq başqası tərəfindən alınıb. Başqa ad yoxlayın.", "warning"); [cite: 332]
                submitBtn.innerText = originalBtnText; [cite: 332]
                submitBtn.disabled = false; [cite: 333]
                return;
            }
        } catch (err) {
            showToast("Yoxlama zamanı xəta baş verdi.", "error"); [cite: 333]
            submitBtn.innerText = originalBtnText; [cite: 334]
            submitBtn.disabled = false; [cite: 334]
            return;
        }
    }

    if (avatarFile) {
        try {
            newAvatarUrl = await uploadImageToImgBB(avatarFile); [cite: 334]
        } catch (err) { 
            showToast(err.message, "error"); [cite: 335]
            submitBtn.innerText = originalBtnText; [cite: 336]
            submitBtn.disabled = false; [cite: 336]
            return; 
        }
    }

    try {
        await updateProfile(currentUser, { displayName: newName, photoURL: newAvatarUrl }); [cite: 336]
        await setDoc(doc(db, "users", currentUser.uid), {
            displayName: newName, photoURL: newAvatarUrl
        }, { merge: true }); [cite: 337]
        currentUserData.displayName = newName; [cite: 338]
        currentUserData.photoURL = newAvatarUrl; [cite: 338]
        
        // TƏLƏBƏ UYĞUN OLARAQ: Ayarlardan ad yenilənəndə də ulduzlar addan SONRA qalır
        document.getElementById("currentUserName").innerHTML = escapeHTML(newName) + getRoleStarsHtml(currentUserData.role);
        document.getElementById("currentUserAvatar").src = newAvatarUrl; [cite: 338]

        showToast("Profil məlumatlarınız uğurla yeniləndi!", "success"); [cite: 338]
        settingsModal.classList.remove("active"); [cite: 338]
    } catch (err) { 
        showToast("Sistem xətası: " + err.message, "error"); [cite: 339]
    } finally {
        submitBtn.innerText = originalBtnText; [cite: 340]
        submitBtn.disabled = false; [cite: 340]
    }
});
document.getElementById("deleteAccBtn")?.addEventListener("click", deleteAccount); [cite: 340]

// ==========================================================================
// 9. MASTER OBSERVER (Auth State Monitor)
// ==========================================================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user; [cite: 341]
        const userDoc = await getDoc(doc(db, "users", user.uid)); [cite: 341]
        if (userDoc.exists()) {
            currentUserData = userDoc.data(); [cite: 341]
            
            // Əgər istifadəçi banlanıbsa, proqrama girişini tam əngəlləyirik
            if (currentUserData.isBanned === true) {
                showToast("Giriş əngəlləndi! Sizin hesabınız ban edilib.", "error"); [cite: 342]
                await signOut(auth); [cite: 342]
                setTimeout(() => { window.location.reload(); }, 2000); [cite: 342]
                return;
            }
        } else {
            currentUserData = { role: "user", displayName: user.displayName, photoURL: user.photoURL || DEFAULT_AVATAR, isBanned: false }; [cite: 343]
        }

        // TƏLƏBƏ UYĞUN OLARAQ: Giriş etdikdən sonra panel hissəsində ulduzlar addan SONRA yerləşir
        document.getElementById("currentUserName").innerHTML = escapeHTML(currentUserData.displayName || "Anonim") + getRoleStarsHtml(currentUserData.role);
        document.getElementById("currentUserAvatar").src = currentUserData.photoURL || DEFAULT_AV4TAR; [cite: 344]
        
        // UI-da cari rol adının tənzimlənməsi
        let roleTitle = "İstifadəçi"; [cite: 344]
        if (currentUserData.role === "super_admin") roleTitle = "Super Admin"; [cite: 345]
        else if (currentUserData.role === "admin") roleTitle = "Admin"; [cite: 345]
        else if (currentUserData.role === "moderator") roleTitle = "Moderator"; [cite: 346]
        document.getElementById("currentUserRole").innerText = roleTitle; [cite: 346]
        
        logoutBtn.classList.remove("hidden"); [cite: 346]
        openSettingsBtn.classList.remove("hidden"); [cite: 346]
        authScreen.classList.remove("active"); [cite: 346]
        chatScreen.classList.add("active"); [cite: 346]

        setupPresence(user); [cite: 346]
        listenUsersAndPresence(); [cite: 346]
        checkActiveRoomTyping();  [cite: 346]
        loadMessages(); [cite: 346]
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct(); [cite: 347]
        startSelfDestructListener(user); [cite: 347]
    } else {
        currentUser = null; [cite: 347]
        logoutBtn.classList.add("hidden"); [cite: 347]
        openSettingsBtn.classList.add("hidden"); [cite: 347]
        chatScreen.classList.remove("active"); [cite: 347]
        authScreen.classList.add("active"); [cite: 348]
        
        if (unsubscribeMessages) unsubscribeMessages(); [cite: 348]
        if (unsubscribeUsers) unsubscribeUsers(); [cite: 348]
        if (unsubscribeRooms) unsubscribeRooms(); [cite: 348]
        if (unsubscribeTyping) unsubscribeTyping(); [cite: 348]
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct(); [cite: 348]
    }
});

// ==========================================================================
// 10. TƏHLÜKƏSİZLİK FUNKSİYALARI (Anti-XSS Protection)
// ==========================================================================
function escapeHTML(str) {
    if (!str) return ""; [cite: 349]
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); [cite: 350]
}
