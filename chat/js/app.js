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

// FIREBASE KONFİQURASİYASI (Bunu öz məlumatlarınla doldur)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase-i Başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// ==========================================================================
// 2. QLOBAL DƏYİŞƏNLƏR VƏ DOM ELEMENTLƏRİ
// ==========================================================================
let currentUser = null;
let currentUserData = null; // Giriş edən istifadəçinin Firestore məlumatları (Rolu daxil)
let activeRoomId = "global_room";
let activeRoomIsDM = false;

let currentUsersList = [];
let currentStatuses = {};
let currentRooms = {};

const DEFAULT_AVATAR = "https://via.placeholder.com/40";

// DOM Elementləri
const usersList = document.getElementById("usersList");
const activeRoomTitle = document.getElementById("activeRoomTitle");
const btnGlobalRoom = document.getElementById("btnGlobalRoom");
const chatMessagesArea = document.getElementById("chatMessagesArea");

// ==========================================================================
// 3. AUTH (GİRİŞ/ÇIXIŞ) VƏ ÖZÜNÜ-MƏHV DİNLEYİCİSİ
// ==========================================================================

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        // İstifadəçinin Firestore-dakı sənədini götürürük (Rolu yoxlamaq üçün)
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
        } else {
            // Əgər yeni qeydiyyatdırsa və sənəd hələ tam yazılmayıbsa, müvəqqəti obyekt yaradırıq
            currentUserData = { role: "user" };
        }

        // Hesab silinmə dinləyicisini başladırıq
        startSelfDestructListener(user);
        
        // Çat və reaktiv məlumatları dinləməyə başlayırıq
        listenUsersAndPresence();
    } else {
        currentUser = null;
        currentUserData = null;
        // İstifadəçi daxil olmayıbsa, yenidən Auth ekranına yönləndirmə kodların...
    }
});

// Admin silməsini yoxlayan "Özünü-Məhv" Dinləyicisi (Race Condition Həll Edildi)
function startSelfDestructListener(currentUserObj) {
    if (!currentUserObj) return;
    const myDocRef = doc(db, "users", currentUserObj.uid);
    let isInitialLoad = true; 

    onSnapshot(myDocRef, async (snapshot) => {
        // Yeni qeydiyyat zamanı setDoc gecikməsində sistemdən atılma xətasının qarşısını alır
        if (isInitialLoad) {
            isInitialLoad = false;
            return;
        }

        // Əgər profil verilənlər bazasından silinibsə (Admin tərəfindən)
        if (!snapshot.exists()) {
            console.log("Profil sənədi tapılmadı! Sistemdən təmizlənmə başladılır...");
            try {
                await deleteUser(currentUserObj);
                showToast("Hesabınız admin tərəfindən silindi!", "error");
            } catch (err) {
                await signOut(auth);
                showToast("Hesabınız bloklandı və sistemdən çıxarıldınız!", "error");
            }
            setTimeout(() => { window.location.reload(); }, 2000);
        }
    });
}

// ==========================================================================
// 4. ADMİN FUNKSİYALARI (ROL DƏYİŞMƏ VƏ İSTİFADƏÇİ SİLMƏ)
// ==========================================================================

// İstifadəçinin Rolunu Dəyişən Funksiya (Admin <-> User)
async function changeUserRole(userId, currentRole) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            role: newRole
        });
        showToast(`${newRole === 'admin' ? 'İstifadəçi Admin edildi!' : 'Admin statusu ləğv edildi!'}`, "success");
    } catch (error) {
        console.error("Rol dəyişərkən xəta:", error);
        showToast("Bu əməliyyat üçün icazəniz yoxdur!", "error");
    }
}

// Admin tərəfindən istifadəçinin verilənlər bazasından silinməsi
async function adminDeleteUser(userId) {
    if (confirm("Bu istifadəçini silmək istədiyinizdən əminsiniz?")) {
        try {
            await deleteDoc(doc(db, "users", userId));
            showToast("İstifadəçi bazadan silindi!", "success");
        } catch (error) {
            console.error("Silərkən xəta:", error);
            showToast("Silmə uğursuz oldu!", "error");
        }
    }
}

// Hesabın istifadəçinin özü tərəfindən profil ayarlarından silinməsi
async function deleteOwnAccount() {
    if (confirm("Hesabınızı tamamilə silmək istədiyinizə əminsiniz? Bu geri qaytarıla bilməz!")) {
        try {
            const userId = auth.currentUser.uid;
            // Əvvəlcə Firestore-dan silirik (Trigger işə düşəcək)
            await deleteDoc(doc(db, "users", userId));
        } catch (error) {
            console.error("Hesab silinərkən xəta:", error);
            showToast("Xəta baş verdi. Yenidən daxil olub yoxlayın.", "error");
        }
    }
}

// ==========================================================================
// 5. İSTİFADƏÇİ SİYAHISININ RENDERİ VƏ DM KEÇİDLƏRİ
// ==========================================================================

function listenUsersAndPresence() {
    onSnapshot(collection(db, "users"), (snapshot) => {
        currentUsersList = [];
        snapshot.forEach(doc => { 
            if(currentUser && doc.id !== currentUser.uid) currentUsersList.push(doc.data()); 
        });
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
    });
    
    onValue(ref(rtdb, "presence"), (presenceSnap) => {
        currentStatuses = presenceSnap.val() || {};
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
    });

    const qRooms = query(collection(db, "rooms"), where("participants", "array-contains", currentUser.uid));
    onSnapshot(qRooms, (roomSnap) => {
        currentRooms = {};
        roomSnap.forEach(doc => { currentRooms[doc.id] = doc.data(); });
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
        
        if (activeRoomIsDM && currentRooms[activeRoomId]?.[`unread_${currentUser.uid}`] > 0) {
            setDoc(doc(db, "rooms", activeRoomId), { [`unread_${currentUser.uid}`]: 0 }, { merge: true });
        }
    });
}

function renderUsersList(users, statuses, rooms) {
    if (!currentUser || !currentUserData) return;
    usersList.innerHTML = "";
    
    users.forEach(user => {
        const userStatus = statuses[user.uid] ? statuses[user.uid].status : "offline";
        const isTyping = statuses[user.uid] && statuses[user.uid].typingTo === activeRoomId;
        const userAvatar = user.photoURL || DEFAULT_AVATAR;

        // Oxunmamış mesaj sayının hesablanması
        const roomId = [currentUser.uid, user.uid].sort().join("_");
        const roomData = rooms[roomId];
        const unreadCount = roomData ? (roomData[`unread_${currentUser.uid}`] || 0) : 0;
        const badgeHtml = unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : '';

        // 1. Rol dəyişmə düyməsi (Yalnız sistem Admininə görünür)
        const roleButtonHtml = currentUserData.role === "admin" 
            ? `<button class="role-toggle-btn" onclick="event.stopPropagation(); changeUserRole('${user.uid}', '${user.role}')" title="Rolu dəyiş (Hal-hazırda: ${user.role})">
                 <i class="fa-solid ${user.role === 'admin' ? 'fa-user-shield' : 'fa-user'}"></i>
               </button>` 
            : '';

        // 2. Admin Silmə düyməsi (Yalnız sistem Admininə görünür)
        const adminDeleteHtml = currentUserData.role === "admin" 
            ? `<button class="admin-user-delete-btn" onclick="event.stopPropagation(); adminDeleteUser('${user.uid}')" title="İstifadəçini sil">
                 <i class="fa-solid fa-user-minus"></i>
               </button>` 
            : '';

        // 3. Siyahı elementinin strukturlaşdırılması
        const li = document.createElement("li");
        li.className = `user-item ${activeRoomId.includes(user.uid) ? 'active' : ''}`;
        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${userAvatar}" class="avatar" alt="">
                <span class="status-indicator ${userStatus}"></span>
            </div>
            <span class="username">${escapeHTML(user.displayName)}</span>
            <span class="typing-notify ${isTyping ? '' : 'hidden'}">yazır...</span>
            ${badgeHtml}
            <div class="user-actions">
                ${roleButtonHtml}
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
    }, { merge: true });

    loadMessages();
}

// ==========================================================================
// 6. KÖMƏKÇİ UTİLİTLƏR VƏ EVENT LISTENER-LƏR
// ==========================================================================

btnGlobalRoom.addEventListener("click", () => {
    activeRoomIsDM = false;
    activeRoomId = "global_room";
    activeRoomTitle.innerText = "Ümumi Çat";
    document.getElementById("activeRoomSub").innerText = "Son 50 mesaj göstərilir";
    btnGlobalRoom.classList.add("active");
    loadMessages();
});

// Profil tənzimləmələrindəki Hesabımı Sil triggeri
const deleteAccBtn = document.getElementById("deleteAccBtn");
if(deleteAccBtn) {
    deleteAccBtn.addEventListener("click", deleteOwnAccount);
}

// Təhlükəsizlik üçün HTML vizuallarını təmizləmə funksiyası
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Toast/Bildiriş pəncərəsi (Əgər xüsusi kitabxana yoxdursa standart alert əvəzi)
function showToast(message, type = "success") {
    console.log(`[TOAST - ${type.toUpperCase()}]: ${message}`);
    // Bura öz toast UI bildiriş animasiya kodlarını yaza bilərsən
}

function loadMessages() {
    // Mesaj yükləmə məntiqləriniz (Mövcud kodunuz dəyişmədən qalır)
    console.log(`${activeRoomId} otağının mesajları yüklənir...`);
}

// ==========================================================================
// 7. MODULE SCOPE DÜZƏLİŞİ (HTML ONCLICK ATRIBUTLARI ÜÇÜN İCAZƏ)
// ==========================================================================
// type="module" daxilindəki funksiyaların HTML-də görünə bilməsi üçün mütləq window-a bağlanmalıdır
window.changeUserRole = changeUserRole;
window.adminDeleteUser = adminDeleteUser;
window.startDirectMessage = startDirectMessage;
