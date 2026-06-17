/* ==========================================================================
   1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
   ========================================================================== */
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

import { firebaseConfig } from "./config.js";

// İnfrastrukturun başladılması
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80";

/* ==========================================================================
   2. QLOBAL APP STATE (VƏZİYYƏT)
   ========================================================================== */
let currentUser = null;
let activeChatType = "general"; // 'general' və ya 'private'
let activeTargetUser = null;    // Şəxsi mesaj yazılan istifadəçi obyekti

// Real-vaxt Abunəliklərini İdarə etmək Üçün Unsubscribe Funksiyaları
let unsubscribeGeneralMessages = null;
let unsubscribePrivateMessages = null;
let unsubscribeUsersList = null;

/* ==========================================================================
   3. DOM ELEMENTLƏRİNİN SEÇİLMƏSİ
   ========================================================================== */
const authScreen = document.getElementById("authScreen");
const chatScreen = document.getElementById("chatScreen");
const authForm = document.getElementById("authForm");
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const usernameGroup = document.getElementById("usernameGroup");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const googleAuthBtn = document.getElementById("googleAuthBtn");

const mobileUsersToggleBtn = document.getElementById("mobileUsersToggleBtn");
const usersSidebar = document.getElementById("usersList");
const usersListContainer = document.getElementById("usersListContainer");
const onlineCountSpan = document.getElementById("onlineCount");

const generalChatArea = document.getElementById("generalChatArea");
const generalMessagesContainer = document.getElementById("generalMessagesContainer");
const generalMessageForm = document.getElementById("generalMessageForm");
const generalMessageInput = document.getElementById("generalMessageInput");

const privateChatArea = document.getElementById("privateChatArea");
const privateChatHeader = document.getElementById("privateChatHeader");
const privateMessagesContainer = document.getElementById("privateMessagesContainer");
const privateMessageForm = document.getElementById("privateMessageForm");
const privateMessageInput = document.getElementById("privateMessageInput");
const privateChatTargetName = document.getElementById("privateChatTargetName");
const privateChatAvatar = document.getElementById("privateChatAvatar");

const openSettingsBtn = document.getElementById("openSettingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const settingsModal = document.getElementById("settingsModal");
const profileSettingsForm = document.getElementById("profileSettingsForm");
const settingsDisplayName = document.getElementById("settingsDisplayName");
const avatarFileInput = document.getElementById("avatarFileInput");
const settingsAvatarPreview = document.getElementById("settingsAvatarPreview");
const logoutBtn = document.getElementById("logoutBtn");
const deleteAccBtn = document.getElementById("deleteAccBtn");

/* ==========================================================================
   4. MOBİL İNTERFEYS LOGİKASI VƏ KEÇİDLƏR
   ========================================================================== */

// Aktiv İstifadəçilər Sidebar-ını Mobildə Açıb/Bağlamaq
mobileUsersToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    usersSidebar.classList.toggle("mobile-open");
});

// Sidebar-dan kənara kliklədikdə avtomatik bağlanması
document.addEventListener("click", (e) => {
    if (!usersSidebar.contains(e.target) && e.target !== mobileUsersToggleBtn) {
        usersSidebar.classList.remove("mobile-open");
    }
});

// Şəxsi Mesaj Sahəsinin Başlığına Toxunanda Şəxsi Mesajı Bağlamaq (Ümumi çata qayıdış)
privateChatHeader.addEventListener("click", () => {
    closePrivateChat();
});

function closePrivateChat() {
    activeChatType = "general";
    activeTargetUser = null;
    
    // Şəxsi pəncərəni gizlət, ümumi pəncərəni göstər
    privateChatArea.classList.remove("active-pane");
    generalChatArea.classList.add("active-pane");
    
    if (unsubscribePrivateMessages) {
        unsubscribePrivateMessages();
        unsubscribePrivateMessages = null;
    }
    
    scrollToBottom(generalMessagesContainer);
}

/* ==========================================================================
   5. AUTHENTICATION MƏNTİQİ (Giriş / Qeydiyyat)
   ========================================================================== */
let isLoginTab = true;

tabLogin.addEventListener("click", () => {
    isLoginTab = true;
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    usernameGroup.style.display = "none";
    authSubmitBtn.innerText = "Daxil Ol";
    document.getElementById("authUsername").removeAttribute("required");
});

tabRegister.addEventListener("click", () => {
    isLoginTab = false;
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    usernameGroup.style.display = "flex";
    authSubmitBtn.innerText = "Qeydiyyatdan Keç";
    document.getElementById("authUsername").setAttribute("required", "required");
});

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    const username = document.getElementById("authUsername").value.trim();

    try {
        if (isLoginTab) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: username,
                photoURL: DEFAULT_AVATAR
            });
            // Firestore-da istifadəçi sənədi yarat
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                displayName: username,
                photoURL: DEFAULT_AVATAR,
                email: email,
                role: "İstifadəçi",
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        alert("Xəta baş verdi: " + error.message);
    }
});

googleAuthBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,
                displayName: user.displayName || "Google User",
                photoURL: user.photoURL || DEFAULT_AVATAR,
                email: user.email,
                role: "İstifadəçi",
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        alert("Google Giriş Xətası: " + error.message);
    }
});

logoutBtn.addEventListener("click", () => {
    // RTDB-də oflayn et
    if (currentUser) {
        set(ref(rtdb, 'status/' + currentUser.uid), {
            state: 'offline',
            last_changed: rtdbTimestamp()
        }).then(() => signOut(auth));
    } else {
        signOut(auth);
    }
});

/* ==========================================================================
   6. USER STATUS & PRESENCE ENGINE (Realtime Database + Firestore)
   ========================================================================== */
function setupPresence(user) {
    const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
    const isOfflineForDatabase = {
        state: 'offline',
        last_changed: rtdbTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL || DEFAULT_AVATAR
    };
    const isOnlineForDatabase = {
        state: 'online',
        last_changed: rtdbTimestamp(),
        displayName: user.displayName,
        photoURL: user.photoURL || DEFAULT_AVATAR
    };

    onValue(ref(rtdb, '.info/connected'), (snapshot) => {
        if (snapshot.val() == false) return;
        onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
        });
    });
}

function listenUsersAndPresence() {
    const statusRef = ref(rtdb, 'status');
    unsubscribeUsersList = onValue(statusRef, async (snapshot) => {
        const statuses = snapshot.val() || {};
        usersListContainer.innerHTML = "";
        let onlineCounter = 0;

        for (const uid in statuses) {
            if (uid === currentUser.uid) continue; // Özünü siyahıda göstərmə
            
            const data = statuses[uid];
            if (data.state === 'online') {
                onlineCounter++;
                const card = document.createElement("div");
                card.className = "user-item-card";
                card.innerHTML = `
                    <div class="user-card-left">
                        <div class="user-avatar-wrapper">
                            <img src="${data.photoURL || DEFAULT_AVATAR}" class="user-avatar" alt="User">
                            <span class="status-dot online"></span>
                        </div>
                        <div class="user-details">
                            <h5>${escapeHTML(data.displayName)}</h5>
                            <span>çevrimiçi</span>
                        </div>
                    </div>
                `;
                
                // Ada / Karta toxunanda Şəxsi Mesajlaşmanı Başlatmaq
                card.addEventListener("click", () => {
                    usersSidebar.classList.remove("mobile-open"); // Mobildə sidebarı bağla
                    openPrivateChat({ uid, displayName: data.displayName, photoURL: data.photoURL });
                });

                usersListContainer.appendChild(card);
            }
        }
        onlineCountSpan.innerText = onlineCounter;
    });
}

/* ==========================================================================
   7. MESAJLAŞMA SİSTEMİ (Ümumi və Şəxsi)
   ========================================================================== */

// Ümumi Mesajları Yüklə
function loadGeneralMessages() {
    const q = query(collection(db, "generalMessages"), orderBy("createdAt", "asc"), limit(100));
    unsubscribeGeneralMessages = onSnapshot(q, (snapshot) => {
        generalMessagesContainer.innerHTML = "";
        snapshot.forEach((doc) => {
            const msg = doc.data();
            renderMessage(generalMessagesContainer, msg);
        });
        if (activeChatType === "general") scrollToBottom(generalMessagesContainer);
    });
}

// Şəxsi Çatı Açmaq
function openPrivateChat(targetUser) {
    activeChatType = "private";
    activeTargetUser = targetUser;

    privateChatTargetName.innerText = targetUser.displayName;
    privateChatAvatar.src = targetUser.photoURL || DEFAULT_AVATAR;

    // Panellərin vizual dəyişimi
    generalChatArea.classList.remove("active-pane");
    privateChatArea.classList.add("active-pane");

    if (unsubscribePrivateMessages) unsubscribePrivateMessages();

    // Unikal şəxsi otaq ID generasiyası (UID-lərə görə sıralı)
    const roomId = currentUser.uid < targetUser.uid 
        ? `${currentUser.uid}_${targetUser.uid}` 
        : `${targetUser.uid}_${currentUser.uid}`;

    const q = query(collection(db, "rooms", roomId, "messages"), orderBy("createdAt", "asc"), limit(100));
    
    unsubscribePrivateMessages = onSnapshot(q, (snapshot) => {
        privateMessagesContainer.innerHTML = "";
        snapshot.forEach((doc) => {
            renderMessage(privateMessagesContainer, doc.data());
        });
        scrollToBottom(privateMessagesContainer);
    });
}

// Mesajı Ekrana Çıxarmaq
function renderMessage(container, msg) {
    const isMe = msg.senderId === currentUser.uid;
    const row = document.createElement("div");
    row.className = `message-bubble-row ${isMe ? 'me' : 'other'}`;

    const timeString = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "...";

    row.innerHTML = `
        ${!isMe ? `<img src="${msg.senderAvatar || DEFAULT_AVATAR}" class="msg-avatar" alt="A">` : ''}
        <div class="msg-content-box">
            ${!isMe ? `<span class="msg-sender-name">${escapeHTML(msg.senderName)}</span>` : ''}
            <div class="msg-text-wrapper">
                <p>${escapeHTML(msg.text)}</p>
                <span class="msg-timestamp">${timeString}</span>
            </div>
        </div>
    `;
    container.appendChild(row);
}

// Ümumi Mesaj Göndərilməsi
generalMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = generalMessageInput.value.trim();
    if (!text) return;

    generalMessageInput.value = "";
    await addDoc(collection(db, "generalMessages"), {
        text: text,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.photoURL || DEFAULT_AVATAR,
        createdAt: serverTimestamp()
    });
});

// Şəxsi Mesaj Göndərilməsi
privateMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = privateMessageInput.value.trim();
    if (!text || !activeTargetUser) return;

    privateMessageInput.value = "";
    const roomId = currentUser.uid < activeTargetUser.uid 
        ? `${currentUser.uid}_${activeTargetUser.uid}` 
        : `${activeTargetUser.uid}_${currentUser.uid}`;

    await addDoc(collection(db, "rooms", roomId, "messages"), {
        text: text,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.photoURL || DEFAULT_AVATAR,
        createdAt: serverTimestamp()
    });
});

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

/* ==========================================================================
   8. PROFİL AYARLARI FUNKSİONALLIĞI
   ========================================================================== */
openSettingsBtn.addEventListener("click", () => {
    settingsDisplayName.value = currentUser.displayName || "";
    avatarFileInput.value = currentUser.photoURL || "";
    settingsAvatarPreview.src = currentUser.photoURL || DEFAULT_AVATAR;
    settingsModal.classList.add("active");
});

closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("active");
});

profileSettingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = settingsDisplayName.value.trim();
    const newAvatarUrl = avatarFileInput.value.trim() || DEFAULT_AVATAR;

    try {
        await updateProfile(auth.currentUser, {
            displayName: newName,
            photoURL: newAvatarUrl
        });

        await updateDoc(doc(db, "users", currentUser.uid), {
            displayName: newName,
            photoURL: newAvatarUrl,
            updatedAt: serverTimestamp()
        });

        // RTDB statusunu dərhal yenilə
        set(ref(rtdb, 'status/' + currentUser.uid), {
            state: 'online',
            last_changed: rtdbTimestamp(),
            displayName: newName,
            photoURL: newAvatarUrl
        });

        alert("Profil uğurla yeniləndi!");
        settingsModal.classList.remove("active");
    } catch (error) {
        alert("Yenilənmə xətası: " + error.message);
    }
});

// Hesabın Tamamilə Silinməsi
deleteAccBtn.addEventListener("click", async () => {
    if (confirm("Hesabınızı silmək istədiyinizdən əminsiniz? Bütün məlumatlar silinəcək.")) {
        try {
            const user = auth.currentUser;
            await deleteDoc(doc(db, "users", user.uid));
            await set(ref(rtdb, 'status/' + user.uid), null);
            await deleteUser(user);
        } catch (error) {
            alert("Hesab silinərkən xəta: Təhlükəsizlik üçün yenidən giriş edib dərhal silməyi yoxlayın.");
        }
    }
});

/* ==========================================================================
   9. AUTH STATUS SENTINEL (Giriş Nəzarətçisi)
   ========================================================================== */
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        authScreen.classList.remove("active");
        chatScreen.classList.add("active");

        setupPresence(user);
        listenUsersAndPresence();
        loadGeneralMessages();
    } else {
        currentUser = null;
        chatScreen.classList.remove("active");
        authScreen.classList.add("active");

        // Abunəlikləri Təmizlə
        if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
        if (unsubscribePrivateMessages) unsubscribePrivateMessages();
        if (unsubscribeUsersList) unsubscribeUsersList();
        
        closePrivateChat();
    }
});

/* ==========================================================================
   10. TƏHLÜKƏSİZLİK FUNKSİYALARI (Anti-XSS Protection)
   ========================================================================== */
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
