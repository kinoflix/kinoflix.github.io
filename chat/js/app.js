/* ==========================================================================
 1. FIREBASE MODULLARININ VƏ CONFIG-İN İMPORT EDİLMƏSİ
 ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, collection, addDoc, query, 
    orderBy, onSnapshot, serverTimestamp, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
    getDatabase, ref, set, onValue, onDisconnect, serverTimestamp as rtdbTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const IMGBB_API_KEY = "5437281cb3fb0c201211e2f38d3ab969"; // Mövcud API Açarınız
const DEFAULT_AVATAR = "https://i.ibb.co/XzZLg1b/default-avatar.png";

// DOM Elementləri
const authScreen = document.getElementById('authScreen');
const chatScreen = document.getElementById('chatScreen');
const loginForm = document.getElementById('loginForm');
const userList = document.getElementById('userList');
const messagesContainer = document.getElementById('messagesContainer');
const messageForm = document.getElementById('messageForm');
const chatInput = document.getElementById('chatInput');
const chatFileInput = document.getElementById('chatFileInput');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const filePreviewImg = document.getElementById('filePreviewImg');
const removeFileBtn = document.getElementById('removeFileBtn');
const roomTitle = document.getElementById('roomTitle');
const closePrivateBtn = document.getElementById('closePrivateBtn');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;
let currentUserData = null;
let activeRoom = 'general';
let selectedFile = null;

let unsubscribeGeneralMessages = null;
let unsubscribePrivateMessages = null;
let unsubscribeUsers = null;

// ==========================================================================
// 2. AUTHENTICATION (SİSTEMƏ GİRİŞ / ÇIXIŞ)
// ==========================================================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
        } else {
            currentUserData = { role: 'user', photoURL: DEFAULT_AVATAR, ignoredUsers: [] };
        }
        
        let roleTitle = 'İstifadəçi'; 
        if (currentUserData.role === 'super_admin') roleTitle = 'Super Admin'; 
        else if (currentUserData.role === 'admin') roleTitle = 'Admin'; 
        else if (currentUserData.role === 'moderator') roleTitle = 'Moderator';
        document.getElementById('currentUserRole').innerText = roleTitle;
        
        logoutBtn.classList.remove('hidden');
        authScreen.classList.remove('active'); 
        chatScreen.classList.add('active');

        setupPresence(user); 
        listenUsersAndPresence(); 
        loadGeneralMessages();
    } else {
        currentUser = null; 
        logoutBtn.classList.add('hidden');
        chatScreen.classList.remove('active'); 
        authScreen.classList.add('active');
        
        if (unsubscribeGeneralMessages) unsubscribeGeneralMessages(); 
        if (unsubscribePrivateMessages) unsubscribePrivateMessages();
        if (unsubscribeUsers) unsubscribeUsers();
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => showToast("Xəta baş verdi: " + err.message, "error"));
});

logoutBtn.addEventListener('click', () => signOut(auth));

// ==========================================================================
// 3. STATUS (ONLINE / AWAY) İŞIQLARI VƏ İSTİFADƏÇİ SİYAHISI (FİX EDİLDİ)
// ==========================================================================
function setupPresence(user) {
    const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
    const isOfflineForDatabase = { state: 'offline', last_changed: rtdbTimestamp() };
    const isOnlineForDatabase = { state: 'online', last_changed: rtdbTimestamp() };
    const isAwayForDatabase = { state: 'away', last_changed: rtdbTimestamp() };

    const connectedRef = ref(rtdb, '.info/connected');
    onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === false) return;
        
        onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
            updateDoc(doc(db, 'users', user.uid), { status: 'online' });
        });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            set(userStatusDatabaseRef, isAwayForDatabase);
            updateDoc(doc(db, 'users', user.uid), { status: 'away' });
        } else {
            set(userStatusDatabaseRef, isOnlineForDatabase);
            updateDoc(doc(db, 'users', user.uid), { status: 'online' });
        }
    });
}

function listenUsersAndPresence() {
    const usersQuery = query(collection(db, 'users'));
    unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        userList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const u = docSnap.data();
            if (u.uid === currentUser.uid) return;

            // Status yoxlaması - Firestore-dan gələn dataya əsasən rəng təyini
            let statusClass = 'offline';
            if (u.status === 'online') statusClass = 'online';
            else if (u.status === 'away') statusClass = 'away';

            const li = document.createElement('li');
            li.className = 'user-item';
            li.innerHTML = `
                <div class="avatar-wrapper">
                    <img src="${u.photoURL || DEFAULT_AVATAR}" alt="avatar">
                    <span class="status-indicator ${statusClass}"></span>
                </div>
                <div class="user-details">
                    <h4>${escapeHTML(u.displayName || u.email)}</h4>
                    <p>${u.role || 'İstifadəçi'}</p>
                </div>
            `;
            li.addEventListener('click', () => openPrivateRoom(u));
            userList.appendChild(li);
        });
    });
}

// ==========================================================================
// 4. MESAJLAŞMA VƏ İQNOR MƏNTİQİ (FİX EDİLDİ)
// ==========================================================================
function loadGeneralMessages() {
    activeRoom = 'general';
    roomTitle.innerText = "Ümumi Çat";
    closePrivateBtn.classList.add('hidden');
    messagesContainer.innerHTML = '';
    
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    unsubscribeGeneralMessages = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const msg = change.doc.data();
                if (msg.roomId === 'general') {
                    // İqnor edilən istifadəçinin mesajını ümumi çatda gizlət
                    if (currentUserData.ignoredUsers && currentUserData.ignoredUsers.includes(msg.senderId)) return;
                    renderMessage(msg);
                }
            }
        });
        scrollToBottom();
    });
}

function openPrivateRoom(targetUser) {
    activeRoom = targetUser.uid;
    roomTitle.innerText = `Şəxsi: ${targetUser.displayName || targetUser.email}`;
    closePrivateBtn.classList.remove('hidden');
    messagesContainer.innerHTML = '';

    if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();

    const roomId = currentUser.uid < targetUser.uid ? `${currentUser.uid}_${targetUser.uid}` : `${targetUser.uid}_${currentUser.uid}`;

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    unsubscribePrivateMessages = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const msg = change.doc.data();
                if (msg.roomId === roomId) {
                    // FİX EDİLDİ: İqnor edilən şəxsin şəxsi mesajları DA gizlədilir!
                    if (currentUserData.ignoredUsers && currentUserData.ignoredUsers.includes(msg.senderId)) return;
                    renderMessage(msg);
                }
            }
        });
        scrollToBottom();
    });
}

closePrivateBtn.addEventListener('click', () => {
    loadGeneralMessages();
});

function renderMessage(msg) {
    const isMe = msg.senderId === currentUser.uid;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isMe ? 'me' : 'other'}`;
    
    let contentHtml = `<p>${escapeHTML(msg.text)}</p>`;
    if (msg.imageUrl) {
        contentHtml += `<img src="${msg.imageUrl}" alt="Şəkil" style="max-width: 200px; cursor: pointer;">`;
    }

    msgDiv.innerHTML = `
        <div class="msg-info">${escapeHTML(msg.senderName)}</div>
        <div class="msg-bubble">${contentHtml}</div>
    `;
    messagesContainer.appendChild(msgDiv);
}

// ==========================================================================
// 5. FAYL ƏLAVƏ ETMƏ UI VƏ GÖNDƏRMƏ (FİX EDİLDİ)
// ==========================================================================
chatFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            filePreviewImg.src = e.target.result;
            filePreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

removeFileBtn.addEventListener('click', () => {
    selectedFile = null;
    chatFileInput.value = '';
    filePreviewContainer.classList.add('hidden');
    filePreviewImg.src = '';
});

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text && !selectedFile) return;

    let imageUrl = null;
    if (selectedFile) {
        imageUrl = await uploadToImgbb(selectedFile);
    }

    const roomId = activeRoom === 'general' ? 'general' : 
        (currentUser.uid < activeRoom ? `${currentUser.uid}_${activeRoom}` : `${activeRoom}_${currentUser.uid}`);

    await addDoc(collection(db, 'messages'), {
        roomId: roomId,
        senderId: currentUser.uid,
        senderName: currentUserData.displayName || currentUser.email,
        text: text,
        imageUrl: imageUrl,
        timestamp: serverTimestamp()
    });

    chatInput.value = '';
    selectedFile = null;
    chatFileInput.value = '';
    filePreviewContainer.classList.add('hidden');
});

async function uploadToImgbb(file) {
    const formData = new FormData();
    formData.append("image", file);
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const data = await res.json();
        return data.data.url;
    } catch (err) {
        showToast("Fayl yüklənərkən xəta baş verdi.", "error");
        return null;
    }
}

// ==========================================================================
// 6. YARDIMÇI FUNKSİYALAR (TOAST VƏ S.)
// ==========================================================================
function escapeHTML(str) {
    if (!str) return ''; 
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.getElementById("toastContainer").appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}
