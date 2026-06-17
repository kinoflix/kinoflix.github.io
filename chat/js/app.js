// ==========================================================================
// 1. FIREBASE MODULLARININ CDN ÜZƏRİNDƏN İMPORT EDİLMƏSİ (v10 ES6)
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, collection, addDoc, query, 
    orderBy, limit, onSnapshot, where, serverTimestamp, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
    getDatabase, ref, set, onValue, onDisconnect, serverTimestamp as rtdbTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { 
    getStorage, ref as storageRef, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ==========================================================================
// 2. FIREBASE KONFİQURASİYASI (Bunu öz layihə açarlarınızla əvəzləyin)
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyYOUR_ACTUAL_API_KEY_HERE",
    authDomain: "your-app.firebaseapp.com",
    databaseURL: "https://your-app-default-rtdb.firebaseio.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:123456:web:abcdef"
};

// İnfrastrukturun başladılması
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

// ==========================================================================
// 3. QOLBAL DYİŞƏNLƏR VƏ DOOM ELEMENTLƏRİ
// ==========================================================================
let currentUser = null;
let currentUserData = { role: "user", displayName: "" };
let activeRoomId = "global_room"; // Standart olaraq ümumi çat
let activeRoomIsDM = false;
let unsubscribeMessages = null;
let typingTimeout = null;

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

// ==========================================================================
// 4. AUTENTİFİKASİYA MƏNTİQİ (Auth & Tabs)
// ==========================================================================

// Giriş/Qeydiyyat Tab keçidləri
tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active"); tabRegister.classList.remove("active");
    loginForm.classList.add("active"); registerForm.classList.remove("active");
});
tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active"); tabLogin.classList.remove("active");
    registerForm.classList.add("active"); loginForm.classList.remove("active");
});

// Email/Şifrə ilə Qeydiyyat
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value;

    try {
        const userCredential = await currentUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name, photoURL: "https://via.placeholder.com/40" });
        
        // Firestore-da istifadəçi sənədi yarat
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid, displayName: name, email: email,
            photoURL: "https://via.placeholder.com/40", role: "user", createdAt: serverTimestamp()
        });
        registerForm.reset();
    } catch (err) { alert("Qeydiyyat xətası: " + err.message); }
});

// Email/Şifrə ilə Giriş
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;
    try { await signInWithEmailAndPassword(auth, email, pass); loginForm.reset(); } 
    catch (err) { alert("Giriş xətası: " + err.message); }
});

// Google ilə Giriş
document.getElementById("googleAuthBtn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // Əgər bazada yoxdursa, yeni istifadəçi kimi qeyd et
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid, displayName: user.displayName || "Anonim", email: user.email,
                photoURL: user.photoURL || "https://via.placeholder.com/40", role: "user", createdAt: serverTimestamp()
            });
        }
    } catch (err) { alert("Google giriş xətası: " + err.message); }
});

// Çıxış Prosesi
logoutBtn.addEventListener("click", () => {
    if(currentUser) set(ref(rtdb, `/presence/${currentUser.uid}`), { status: "offline", lastChanged: rtdbTimestamp() });
    signOut(auth);
});

// ==========================================================================
// 5. STATUS VƏ REALTIME PRESENCE SYSTEM
// ==========================================================================
function setupPresence(user) {
    const statusRef = ref(rtdb, `/presence/${user.uid}`);
    const connectedRef = ref(rtdb, ".info/connected");

    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            // Brauzer qapananda və ya əlaqə kəsiləndə avtomatik offline et
            onDisconnect(statusRef).set({
                status: "offline", lastChanged: rtdbTimestamp(), typingTo: null
            }).then(() => {
                set(statusRef, { status: "online", lastChanged: rtdbTimestamp(), typingTo: null });
            });
        }
    });

    // "Away" (Boşda) detektoru - 5 dəqiqə hərəkətsizlik olduqda
    let idleTimer;
    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        set(statusRef, { status: "online", lastChanged: rtdbTimestamp(), typingTo: activeRoomId });
        idleTimer = setTimeout(() => {
            set(statusRef, { status: "away", lastChanged: rtdbTimestamp(), typingTo: null });
        }, 5 * 60 * 1000); 
    };
    window.onload = resetIdleTimer;
    window.onmousemove = resetIdleTimer;
    window.onkeypress = resetIdleTimer;
}

// ==========================================================================
// 6. AKTİV İSTİFADƏÇİLƏRİN VƏ STATUSLARIN LİSTƏLƏNMƏSİ
// ==========================================================================
function listenUsersAndPresence() {
    // Firestore-dan istifadəçiləri alırıq
    onSnapshot(collection(db, "users"), (snapshot) => {
        const usersData = [];
        snapshot.forEach(doc => { if(doc.id !== currentUser.uid) usersData.push(doc.data()); });
        
        // RTDB-dən canlı statusları dinləyirik
        onSnapshot(collection(db, "users"), () => { // Trigger update on status sync
            onValue(ref(rtdb, "presence"), (presenceSnap) => {
                const statuses = presenceSnap.val() || {};
                renderUsersList(usersData, statuses);
            });
        });
    });
}

function renderUsersList(users, statuses) {
    usersList.innerHTML = "";
    users.forEach(user => {
        const userStatus = statuses[user.uid] ? statuses[user.uid].status : "offline";
        const isTyping = statuses[user.uid] && statuses[user.uid].typingTo === activeRoomId;

        const li = document.createElement("li");
        li.className = `user-item ${activeRoomId.includes(user.uid) ? 'active' : ''}`;
        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${user.photoURL}" class="avatar" alt="">
                <span class="status-indicator ${userStatus}"></span>
            </div>
            <span class="username">${escapeHTML(user.displayName)}</span>
            <span class="typing-notify ${isTyping ? '' : 'hidden'}">yazır...</span>
        `;
        
        // İstifadəçiyə kliklədikdə Şəxsi Mesajlaşma (DM) otağı yarat/keç
        li.addEventListener("click", () => startDirectMessage(user));
        usersList.appendChild(li);
    });
}

function startDirectMessage(targetUser) {
    activeRoomIsDM = true;
    // DM Room ID yaradılması: İki UID əlifba sırası ilə birləşdirilir (Məsələn: uid1_uid2)
    activeRoomId = [currentUser.uid, targetUser.uid].sort().join("_");
    activeRoomTitle.innerText = targetUser.displayName;
    document.getElementById("activeRoomSub").innerText = "Şəxsi Məxfi Söhbət";
    btnGlobalRoom.classList.remove("active");
    
    // Otaq sənədini Firestore-da yarat/yenilə (Security rules üçün lazımdır)
    setDoc(doc(db, "rooms", activeRoomId), {
        roomId: activeRoomId, isDM: true, participants: [currentUser.uid, targetUser.uid],
        lastMessageAt: serverTimestamp()
    }, { merge: true });

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
// 7. REAL-VAXT MESAJLAŞMA SİSTEMİ (Firestore + Pagination)
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
        
        // Descending gələn mesajları ekranda düzgün sıralamaq üçün tərs çeviririk
        messages.reverse();
        
        chatMessagesArea.innerHTML = "";
        messages.forEach(msg => appendMessageElement(msg));
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight; // Avtomatik aşağı sürüşdürmə
    });
}

function appendMessageElement(msg) {
    const isMe = msg.senderId === currentUser.uid;
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`;

    // Admin və ya mesaj sahibidirsə silmə düyməsini göstər
    const canDelete = isMe || currentUserData.role === "admin";
    const deleteBtnHtml = canDelete ? `<button class="delete-msg-btn" data-id="${msg.id}"><i class="fa-solid fa-trash"></i></button>` : '';

    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`;
    if (msg.fileURL) {
        if (msg.fileType.startsWith("image/")) {
            contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Şəkil" onclick="window.open('${msg.fileURL}')">`;
        } else {
            contentHtml += `<a href="${msg.fileURL}" target="_blank" style="color:var(--accent); text-decoration:underline; font-size:0.85rem;"><i class="fa-solid fa-file"></i> Sənədə Bax</a>`;
        }
    }

    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "...";

    wrapper.innerHTML = `
        <img src="${msg.senderAvatar}" class="msg-avatar" alt="">
        <div class="message-bubble">
            <span class="sender-name">${escapeHTML(msg.senderName)} ${deleteBtnHtml}</span>
            ${contentHtml}
            <span class="timestamp">${time}</span>
        </div>
    `;

    // Silmə hadisəsi
    const delBtn = wrapper.querySelector(".delete-msg-btn");
    if(delBtn) {
        delBtn.addEventListener("click", async () => {
            if(confirm("Bu mesajı silmək istədiyinizdən əminsiniz?")) {
                await deleteDoc(doc(db, "rooms", activeRoomId, "messages", msg.id));
            }
        });
    }

    chatMessagesArea.appendChild(wrapper);
}

// Mesaj Göndərilməsi
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
            const fileRef = storageRef(storage, `chat_files/${activeRoomId}/${Date.now()}_${file.name}`);
            const uploadTask = await uploadBytes(fileRef, file);
            fileURL = await getDownloadURL(uploadTask.ref);
            fileType = file.type;
        } catch (err) { alert("Fayl yüklənmədi: " + err.message); return; }
    }

    try {
        await addDoc(collection(db, "rooms", activeRoomId, "messages"), {
            senderId: currentUser.uid,
            senderName: currentUserData.displayName || "Anonim",
            senderAvatar: currentUserData.photoURL || "https://via.placeholder.com/40",
            text: text,
            fileURL: fileURL,
            fileType: fileType,
            createdAt: serverTimestamp()
        });
        
        // Otağın son aktivlik vaxtını yeniləyirik
        await setDoc(doc(db, "rooms", activeRoomId), { lastMessageAt: serverTimestamp() }, { merge: true });
    } catch (err) { alert("Mesaj göndərilmə xətası: " + err.message); }
}

sendMessageBtn.addEventListener("click", sendMessage);
messageInputField.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// "... yazır" (Typing Indikatoru) məntiqi
messageInputField.addEventListener("input", () => {
    set(ref(rtdb, `/presence/${currentUser.uid}/typingTo`), activeRoomId);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        set(ref(rtdb, `/presence/${currentUser.uid}/typingTo`), null);
    }, 2000);
});

// ==========================================================================
// 8. PROFİL AYARLARI SİSTEMİ (Firebase Storage İnteqrasiyalı)
// ==========================================================================
openSettingsBtn.addEventListener("click", () => {
    document.getElementById("settingsDisplayName").value = currentUserData.displayName;
    document.getElementById("settingsAvatarPreview").src = currentUserData.photoURL;
    settingsModal.classList.add("active");
});
closeSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("active"));

profileSettingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = document.getElementById("settingsDisplayName").value.trim();
    const avatarFile = document.getElementById("avatarFileInput").files[0];
    let newAvatarUrl = currentUserData.photoURL;

    if (avatarFile) {
        try {
            const avatarRef = storageRef(storage, `avatars/${currentUser.uid}/profile.jpg`);
            const uploadTask = await uploadBytes(avatarRef, avatarFile);
            newAvatarUrl = await getDownloadURL(uploadTask.ref);
        } catch (err) { alert("Avatar yüklənmədi: " + err.message); return; }
    }

    try {
        // Auth profilini yenilə
        await updateProfile(currentUser, { displayName: newName, photoURL: newAvatarUrl });
        // Firestore sənədini yenilə
        await setDoc(doc(db, "users", currentUser.uid), {
            displayName: newName, photoURL: newAvatarUrl
        }, { merge: true });
        
        alert("Profil uğurla yeniləndi!");
        settingsModal.classList.remove("active");
    } catch (err) { alert("Xəta baş verdi: " + err.message); }
});

// ==========================================================================
// 9. CODA CAN VERƏN MASTER OBSERVABLE (OnAuthStateChanged)
// ==========================================================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        // Firestore-dan istifadəçi rolunu və datalarını çək
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
        } else {
            currentUserData = { role: "user", displayName: user.displayName, photoURL: user.photoURL };
        }

        // UI elementlərini aktivləşdir
        document.getElementById("currentUserName").innerText = currentUserData.displayName || "Anonim";
        document.getElementById("currentUserAvatar").src = currentUserData.photoURL || "https://via.placeholder.com/40";
        document.getElementById("currentUserRole").innerText = currentUserData.role === "admin" ? "Admin" : "İstifadəçi";
        
        logoutBtn.classList.remove("hidden");
        openSettingsBtn.classList.remove("hidden");
        authScreen.classList.remove("active");
        chatScreen.classList.add("active");

        setupPresence(user);
        listenUsersAndPresence();
        loadMessages();
    } else {
        currentUser = null;
        logoutBtn.classList.add("hidden");
        openSettingsBtn.classList.add("hidden");
        chatScreen.classList.remove("active");
        authScreen.classList.add("active");
        if(unsubscribeMessages) unsubscribeMessages();
    }
});

// ==========================================================================
// 10. TƏHLÜKƏSİZLİK VƏ KÖMƏKÇİ FUNKSİYALAR (XSS Anti-Sanitization)
// ==========================================================================
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Mobil üçün ekran sürüşdürmə dəstəyi (CSS hissəsində qeyd olunan idarəetmə üçün)
// Bura ehtiyac olduqda mobil menyu düyməsi üçün funksiyalar bağlana bilər.
