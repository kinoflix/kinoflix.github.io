// ==========================================================================
// 1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, collection, addDoc, query, 
    orderBy, limit, onSnapshot, serverTimestamp, deleteDoc,
    where, getDocs, increment
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
const DEFAULT_AVATAR = "https://i.ibb.co/S7XzY8V/avatar.png"; // Birbaşa şəkil linkiniz (.png/.jpg)

// ==========================================================================
// 2. QLOBAL DƏYİŞƏNLƏR VƏ DOM ELEMENTLƏRİ
// ==========================================================================
let currentUser = null;
let currentUserData = { role: "user", displayName: "", photoURL: DEFAULT_AVATAR };
let activeRoomId = "global_room"; 
let activeRoomIsDM = false;
let unsubscribeMessages = null;
let typingTimeout = null;

// Reaktiv status və mesaj idarəetməsi üçün keş dəyişənləri
let currentUsersList = [];
let currentStatuses = {};
let currentRooms = {};

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

// ==========================================================================
// 2B. MÜASİR AZƏRBAYCAN DİLİNDƏ TOAST BİLDİRİŞ SİSTEMİ (Modern Alert UI)
// ==========================================================================
function showToast(message, type = "info") {
    if (!document.getElementById("flix-toast-styles")) {
        const style = document.createElement("style");
        style.id = "flix-toast-styles";
        style.innerHTML = `
            .flix-toast-container {
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                display: flex; flex-direction: column; gap: 10px;
            }
            .flix-toast {
                background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);
                color: #1a1a1a; padding: 14px 22px; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); font-family: 'Segoe UI', sans-serif;
                font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 12px;
                transform: translateX(120%); animation: flixSlideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                border-left: 5px solid #ccc; max-width: 360px; pointer-events: auto;
            }
            [data-theme="dark"] .flix-toast {
                background: rgba(28, 28, 30, 0.9); color: #ffffff;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            }
            .flix-toast.success { border-left-color: #2ecc71; }
            .flix-toast.error { border-left-color: #e74c3c; }
            .flix-toast.warning { border-left-color: #f39c12; }
            .flix-toast.info { border-left-color: #3498db; }
            
            .unread-badge {
                background-color: #e74c3c; color: white; border-radius: 20px;
                padding: 2px 8px; font-size: 11px; font-weight: bold;
                margin-left: auto; min-width: 18px; text-align: center;
                box-shadow: 0 2px 6px rgba(231, 76, 60, 0.4); animation: flixPulse 1.5s infinite;
            }
            
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

// Firebase xətalarını doğma Azərbaycan dilinə tərcümə edən funksiya
function localizeFirebaseError(err) {
    switch(err.code) {
        case "auth/email-already-in-use": return "Bu e-poçt ünvanı ilə artıq qeydiyyatdan keçilib.";
        case "auth/invalid-credential": return "E-poçt ünvanı və ya şifrə yanlışdır.";
        case "auth/weak-password": return "Şifrə çox zəifdir. Ən azı 6 simvoldan ibarət olmalıdır.";
        case "auth/invalid-email": return "Daxil etdiyiniz e-poçt strukturu düzgün deyil.";
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
        // 1. İstifadəçi adının unikal olub-olmadığını yoxlayırıq
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
            photoURL: DEFAULT_AVATAR, role: "user", createdAt: serverTimestamp()
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
// 6. İSTİFADƏÇİ SİYAHISININ RENDERİ VƏ DM KEÇİDLƏRİ
// ==========================================================================
function listenUsersAndPresence() {
    onSnapshot(collection(db, "users"), (snapshot) => {
        currentUsersList = [];
        snapshot.forEach(doc => { if(doc.id !== currentUser.uid) currentUsersList.push(doc.data()); });
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
    });
    
    onValue(ref(rtdb, "presence"), (presenceSnap) => {
        currentStatuses = presenceSnap.val() || {};
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
    });

    // Daxil olan şəxsi mesajların sayını və yenilənməsini reaktiv izləyirik
    const qRooms = query(collection(db, "rooms"), where("participants", "array-contains", currentUser.uid));
    onSnapshot(qRooms, (roomSnap) => {
        currentRooms = {};
        roomSnap.forEach(doc => { currentRooms[doc.id] = doc.data(); });
        renderUsersList(currentUsersList, currentStatuses, currentRooms);
        
        // İstifadəçi daxil olduğu DM otağında yeni mesajları oxuyursa, sayğacı anında sıfırlayırıq
        if (activeRoomIsDM && currentRooms[activeRoomId]?.[`unread_${currentUser.uid}`] > 0) {
            setDoc(doc(db, "rooms", activeRoomId), { [`unread_${currentUser.uid}`]: 0 }, { merge: true });
        }
    });
}

function renderUsersList(users, statuses, rooms) {
    usersList.innerHTML = "";
    users.forEach(user => {
        const userStatus = statuses[user.uid] ? statuses[user.uid].status : "offline";
        const isTyping = statuses[user.uid] && statuses[user.uid].typingTo === activeRoomId;
        const userAvatar = user.photoURL || DEFAULT_AVATAR;

        // Oxunmamış mesaj sayının hesablanması sahəsi
        const roomId = [currentUser.uid, user.uid].sort().join("_");
        const roomData = rooms[roomId];
        const unreadCount = roomData ? (roomData[`unread_${currentUser.uid}`] || 0) : 0;
        const badgeHtml = unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : '';

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
    
    // Keçid etdiyimiz üçün öz oxunmamış bildirişlərimizi dərhal təmizləyirik
    setDoc(doc(db, "rooms", activeRoomId), {
        roomId: activeRoomId, isDM: true, participants: [currentUser.uid, targetUser.uid],
        lastMessageAt: serverTimestamp(),
        [`unread_${currentUser.uid}`]: 0
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
        
        checkActiveRoomTyping();

        // Aktiv pəncərədə yeni mesajların sayğacı artarsa avtomatik sıfırlama təhlükəsizliyi
        if (activeRoomIsDM && currentRooms[activeRoomId]?.[`unread_${currentUser.uid}`] > 0) {
            setDoc(doc(db, "rooms", activeRoomId), { [`unread_${currentUser.uid}`]: 0 }, { merge: true });
        }
    });
}

function appendMessageElement(msg) {
    const isMe = msg.senderId === currentUser.uid;
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`;

    const canDelete = isMe || currentUserData.role === "admin";
    const deleteBtnHtml = canDelete ? `<button class="delete-msg-btn" data-id="${msg.id}"><i class="fa-solid fa-trash"></i></button>` : '';

    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`;
    if (msg.fileURL) {
        contentHtml += `<img src="${msg.fileURL}" class="chat-shared-image" alt="Paylaşılan Şəkil" onclick="window.open('${msg.fileURL}')">`;
    }

    const msgAvatar = msg.senderAvatar || DEFAULT_AVATAR;
    const time = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "...";

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
        
        // Şəxsi mesajdırsa (DM), qarşı tərəfin profilinə unread triggeri atırıq (+1 artırır)
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

function checkActiveRoomTyping() {
    onValue(ref(rtdb, "presence"), (snap) => {
        const statuses = snap.val() || {};
        let someoneTyping = false;

        for (let uid in statuses) {
            if (uid !== currentUser.uid && statuses[uid].typingTo === activeRoomId) {
                someoneTyping = true;
                break;
            }
        }

        const indicator = document.getElementById("typingIndicator");
        if (someoneTyping) indicator.classList.remove("hidden");
        else indicator.classList.add("hidden");
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

    // 2. Ad dəyişdirilirsə, başqasının bu adı alıb-almadığını yoxlayırıq
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
        
        document.getElementById("currentUserName").innerText = newName;
        document.getElementById("currentUserAvatar").src = newAvatarUrl;

        showToast("Profil məlumatlarınız uğurla yeniləndi!", "success");
        settingsModal.classList.remove("active");
    } catch (err) { showToast("Sistem xətası: " + err.message, "error"); }
    finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

// ==========================================================================
// 9. MASTER OBSERVER (Auth State Monitor)
// ==========================================================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
        } else {
            currentUserData = { role: "user", displayName: user.displayName, photoURL: user.photoURL || DEFAULT_AVATAR };
        }

        document.getElementById("currentUserName").innerText = currentUserData.displayName || "Anonim";
        document.getElementById("currentUserAvatar").src = currentUserData.photoURL || DEFAULT_AVATAR;
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
// 10. TƏHLÜKƏSİZLİK FUNKSİYALARI (Anti-XSS Protection)
// ==========================================================================
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
