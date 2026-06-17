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
    where, getDocs, increment, updateDoc \n} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
    getDatabase, ref, set, onValue, onDisconnect, serverTimestamp as rtdbTimestamp \n} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { firebaseConfig } from "./config.js";

// İnfrastrukturun başladılması
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const IMGBB_API_KEY = "5437281cb3fb0c2e28ca265eefa6eaf7";
const DEFAULT_AVATAR = "https://i.ibb.co/mS66gHQ/avatar-default.png";

/* ==========================================================================
   2. DOM ELEMENTLƏRİNİN SEÇİLMƏSİ
   ========================================================================== */
// Ekranlar
const authScreen = document.getElementById('authScreen');
const chatScreen = document.getElementById('chatScreen');

// Autentifikasiya Formları
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const toggleToRegister = document.getElementById('toggleToRegister');
const toggleToLogin = document.getElementById('toggleToLogin');

// Çat Pəncərələri və Otaq Sahələri
const generalChatArea = document.getElementById('generalChatArea');
const privateChatArea = document.getElementById('privateChatArea');
const generalMessagesContainer = document.getElementById('generalMessagesContainer');
const privateMessagesContainer = document.getElementById('privateMessagesContainer');

// Otaq Keçid Düymələri və Başlıqlar
const btnGlobalRoom = document.getElementById('btnGlobalRoom');
const privateRoomTitle = document.getElementById('privateRoomTitle');
const btnClosePrivate = document.getElementById('btnClosePrivate');

// Mesaj Giriş Elementləri
const generalMessageInput = document.getElementById('generalMessageInput');
const generalSendBtn = document.getElementById('generalSendBtn');
const generalFileInput = document.getElementById('generalFileInput');
const generalFileBtn = document.getElementById('generalFileBtn');

const privateMessageInput = document.getElementById('privateMessageInput');
const privateSendBtn = document.getElementById('privateSendBtn');
const privateFileInput = document.getElementById('privateFileInput');
const privateFileBtn = document.getElementById('privateFileBtn');

// Naviqasiya və İdarəetmə düymələri
const logoutBtn = document.getElementById('logoutBtn');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const openAdminBtn = document.getElementById('openAdminBtn');

// Siyahılar
const usersListContainer = document.getElementById('usersListContainer');
const adminUsersList = document.getElementById('adminUsersList');

// Modallar
const profileSettingsModal = document.getElementById('profileSettingsModal');
const profileSettingsForm = document.getElementById('profileSettingsForm');
const settingsAvatarPreview = document.getElementById('settingsAvatarPreview');
const avatarFileInput = document.getElementById('avatarFileInput');
const settingsDisplayName = document.getElementById('settingsDisplayName');
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
const deleteAccBtn = document.getElementById('deleteAccBtn');

const adminPanelModal = document.getElementById('adminPanelModal');
const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
const clearChatBtn = document.getElementById('clearChatBtn');

// İndikatorlar
const generalTypingIndicator = document.getElementById('generalTypingIndicator');
const privateTypingIndicator = document.getElementById('privateTypingIndicator');

/* ==========================================================================
   3. QLOBAAL DƏYİŞƏNLƏR VƏ ABUNƏLİKLƏR (State Management)
   ========================================================================== */
let currentUser = null;
let activeRoomId = 'general';
let activeRoomIsDM = false;

// Dinamik dinləyicilərin referansları (Yaddaş sızmasının qarşısını almaq üçün)
let unsubscribeGeneralMessages = null;
let unsubscribePrivateMessages = null;
let unsubscribeUsers = null;
let unsubscribeRooms = null;
let unsubscribeTyping = null;
let unsubscribeSelfDestruct = null;

/* ==========================================================================
   4. TOAST BİLDİRİŞ SİSTEMİ (Toast Notification Engine)
   ========================================================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '<i class="fa-solid fa-info-circle"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';

    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 300);
    }, 4000);
}

/* ==========================================================================
   5. AUTENTİFİKASİYA ƏMƏLİYYATLARI (Hesab Giriş/Qeydiyyat)
   ========================================================================== */
// Qeydiyyat Prosesi
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast("Şifrələr üst-üstə düşmür!", "warning");
        return;
    }
    if (password.length < 6) {
        showToast("Şifrə ən azı 6 simvoldan ibarət olmalıdır!", "warning");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username, photoURL: DEFAULT_AVATAR });
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: username,
            photoURL: DEFAULT_AVATAR,
            role: 'user',
            isBanned: false,
            createdAt: serverTimestamp()
        });

        registerForm.reset();
    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            showToast("Bu e-poçt ünvanı artıq istifadədədir!", "error");
        } else {
            showToast("Qeydiyyat xətası: " + err.message, "error");
        }
    }
});

// E-poçt və Şifrə ilə Giriş
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginForm.reset();
    } catch (err) {
        if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
            showToast("E-poçt və ya şifrə xətalıdır!", "error");
        } else {
            showToast("Giriş zamanı xəta: " + err.message, "error");
        }
    }
});

// Google ilə Giriş
googleLoginBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Google İstifadəçisi',
                photoURL: user.photoURL || DEFAULT_AVATAR,
                role: 'user',
                isBanned: false,
                createdAt: serverTimestamp()
            });
        }
    } catch (err) {
        showToast("Google ilə giriş ləğv edildi və ya xəta baş verdi.", "error");
    }
});

// Sistemdən Çıxış Düyməsi
logoutBtn.addEventListener('click', () => {
    if (currentUser) {
        const statusRef = ref(rtdb, `status/${currentUser.uid}`);
        set(statusRef, { state: 'offline', lastChanged: rtdbTimestamp }).then(() => {
            signOut(auth).then(() => {
                showToast("Sistemdən uğurla çıxış etdiniz.", "info");
            });
        });
    }
});

// Ekran Keçid Linkləri
toggleToRegister.addEventListener('click', () => {
    loginForm.classList.remove('active');
    setTimeout(() => { registerForm.classList.add('active'); }, 200);
});
toggleToLogin.addEventListener('click', () => {
    registerForm.classList.remove('active');
    setTimeout(() => { loginForm.classList.add('active'); }, 200);
});

/* ==========================================================================
   6. ON-LINE STATUS VƏ İSTİFADƏÇİ SİYAHISI (Presence Engine)
   ========================================================================== */
function setupPresence(user) {
    const onlineRef = ref(rtdb, '.info/connected');
    const statusRef = ref(rtdb, `status/${user.uid}`);

    onValue(onlineRef, (snapshot) => {
        if (snapshot.val() === false) return;
        onDisconnect(statusRef).set({
            state: 'offline',
            lastChanged: rtdbTimestamp
        }).then(() => {
            set(statusRef, {
                state: 'online',
                lastChanged: rtdbTimestamp
            });
        });
    });
}

function listenUsersAndPresence() {
    if (unsubscribeUsers) unsubscribeUsers();
    unsubscribeUsers = onSnapshot(collection(db, 'users'), (firestoreSnapshot) => {
        const usersData = [];
        firestoreSnapshot.forEach(doc => { usersData.push(doc.data()); });

        const statusRef = ref(rtdb, 'status');
        onValue(statusRef, (rtdbSnapshot) => {
            const statuses = rtdbSnapshot.val() || {};
            const mergedUsers = usersData.map(u => ({
                ...u,
                status: statuses[u.uid] ? statuses[u.uid].state : 'offline'
            }));
            
            // Cari istifadəçinin ban statusunu dərhal yoxla
            const me = mergedUsers.find(u => u.uid === currentUser.uid);
            if (me && me.isBanned) {
                showToast("Hesabınız bloklandığı üçün sistemdən çıxarılırsınız.", "error");
                signOut(auth);
                return;
            }

            // Şəxsi otaqların oxunmamış mesaj sayğaclarını dinləmək üçün otaqları çəkək
            if (unsubscribeRooms) unsubscribeRooms();
            unsubscribeRooms = onSnapshot(collection(db, 'rooms'), (roomsSnapshot) => {
                const roomsData = [];
                roomsSnapshot.forEach(d => roomsData.push(d.data()));
                
                renderUsersList(mergedUsers, roomsData);
            });
        });
    });
}

function renderUsersList(users = [], rooms = []) {
    if (!usersListContainer || !currentUser) return;
    usersListContainer.innerHTML = '';

    const otherUsers = users.filter(u => u.uid !== currentUser.uid);

    otherUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = `user-card ${user.status === 'online' ? 'online' : ''}`;
        
        // Bu istifadəçi ilə olan otağın unread count dəyərini tapmaq
        const roomId = [currentUser.uid, user.uid].sort().join('_');
        const currentRoomData = rooms.find(r => r.roomId === roomId);
        const unreadCount = currentRoomData ? (currentRoomData[`unread_${currentUser.uid}`] || 0) : 0;

        let roleBadge = '';
        if (user.role === 'super_admin') roleBadge = '<span class="badge s-admin">S-Admin</span>';
        else if (user.role === 'admin') roleBadge = '<span class="badge admin">Admin</span>';
        else if (user.role === 'moderator') roleBadge = '<span class="badge mod">Mod</span>';

        userCard.innerHTML = `
            <div class="user-avatar-wrapper">
                <img src="${user.photoURL || DEFAULT_AVATAR}" alt="Avatar">
                <span class="status-indicator"></span>
            </div>
            <div class="user-info">
                <div class="user-name-row">
                    <span class="username-text">${escapeHTML(user.displayName)}</span>
                    ${roleBadge}
                </div>
                <span class="user-status-text">${user.status === 'online' ? 'aktivdir' : 'oflayn'}</span>
            </div>
            ${unreadCount > 0 ? `<span class="unread-counter">${unreadCount}</span>` : ''}
        `;

        userCard.addEventListener('click', () => { openPrivateRoom(user); });
        usersListContainer.appendChild(userCard);
    });
}

/* ==========================================================================
   7. OTAQLAR ARASI KEÇİD MƏNTİQİ (Room Navigation & Typing Indicators)
   ========================================================================== */
function openPrivateRoom(targetUser) {
    activeRoomIsDM = true;
    activeRoomId = [currentUser.uid, targetUser.uid].sort().join('_');
    
    // Qorunan struktur dəyişikliyi: Başlıq sabit "Şəxsi yazışma" qalır
    privateRoomTitle.innerText = "Şəxsi yazışma";
    
    btnGlobalRoom.classList.remove('active');
    
    generalChatArea.classList.remove('active');
    generalChatArea.classList.add('hidden');
    
    privateChatArea.classList.remove('hidden');
    privateChatArea.classList.add('active');
    
    setDoc(doc(db, 'rooms', activeRoomId), {
        roomId: activeRoomId,
        isDM: true,
        participants: [currentUser.uid, targetUser.uid],
        lastMessageAt: serverTimestamp(),
        [`unread_${currentUser.uid}`]: 0
    }, { merge: true });

    checkActiveRoomTyping();
    loadPrivateMessages();
}

function closePrivateRoom() {
    activeRoomIsDM = false;
    activeRoomId = 'general';
    
    btnGlobalRoom.classList.add('active');
    
    privateChatArea.classList.remove('active');
    privateChatArea.classList.add('hidden');
    
    generalChatArea.classList.remove('hidden');
    generalChatArea.classList.add('active');
    
    checkActiveRoomTyping();
    loadGeneralMessages();
}

btnGlobalRoom.addEventListener('click', closePrivateRoom);
btnClosePrivate.addEventListener('click', closePrivateRoom);

// Yazır... (Typing Status) Məntiqi
function setTypingStatus(isTyping) {
    if (!currentUser) return;
    const typingRef = ref(rtdb, `rooms/${activeRoomId}/typing/${currentUser.uid}`);
    if (isTyping) {
        set(typingRef, { displayName: currentUser.displayName, isTyping: true });
    } else {
        set(typingRef, null);
    }
}

function checkActiveRoomTyping() {
    if (unsubscribeTyping) unsubscribeTyping();
    const typingRef = ref(rtdb, `rooms/${activeRoomId}/typing`);
    
    unsubscribeTyping = onValue(typingRef, (snapshot) => {
        const data = snapshot.val() || {};
        const typers = [];
        Object.keys(data).forEach(uid => {
            if (uid !== currentUser.uid && data[uid].isTyping) {
                typers.push(data[uid].displayName);
            }
        });

        const textNode = activeRoomIsDM ? privateTypingIndicator : generalTypingIndicator;
        if (typers.length > 0) {
            textNode.innerText = `${typers.join(', ')} yazır...`;
            textNode.classList.add('active');
        } else {
            textNode.classList.remove('active');
            textNode.innerText = '';
        }
    });
}

// Giriş sahələri üçün typing hadisələrinin dinlənilməsi
let generalTypingTimeout = null;
generalMessageInput.addEventListener('input', () => {
    setTypingStatus(true);
    clearTimeout(generalTypingTimeout);
    generalTypingTimeout = setTimeout(() => { setTypingStatus(false); }, 2000);
});
generalMessageInput.addEventListener('blur', () => { setTypingStatus(false); });

let privateTypingTimeout = null;
privateMessageInput.addEventListener('input', () => {
    setTypingStatus(true);
    clearTimeout(privateTypingTimeout);
    privateTypingTimeout = setTimeout(() => { setTypingStatus(false); }, 2000);
});
privateMessageInput.addEventListener('blur', () => { setTypingStatus(false); });

/* ==========================================================================
   8. MEKƏZİ ÇAT MƏNTİQİ (Mesajların Göndərilməsi və Yüklənməsi)
   ========================================================================== */
// Resurs fərqi olmadan ImageBB-yə şəkil yükləmə funksiyası
async function uploadImageToImgBB(file) {
    if (file.size > 5 * 1024 * 1024) {
        showToast("Şəkil ölçüsü 5MB-dan çox ola bilməz!", "error");
        return null;
    }
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            return result.data.url;
        } else {
            showToast("Şəkil yüklənərkən xəta baş verdi!", "error");
            return null;
        }
    } catch {
        showToast("Şəkil yüklənərkən xəta baş verdi!", "error");
        return null;
    }
}

// Vahid mesaj ötürmə funksiyası
async function sendMessage(textInput, fileInput) {
    const text = textInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) {
        showToast("Zəhmət olmasa mesaj yazın və ya şəkil seçin!", "warning");
        return;
    }

    let imageUrl = null;
    textInput.value = '';
    const cachedFile = file;
    fileInput.value = '';

    if (cachedFile) {
        imageUrl = await uploadImageToImgBB(cachedFile);
        if (!imageUrl) return; // Yüklənmə uğursuz oldusa dayandır
    }

    // Otaq hədəfinə görə kolleksiya təyini
    let msgColl;
    if (activeRoomIsDM) {
        msgColl = collection(db, 'rooms', activeRoomId, 'messages');
    } else {
        msgColl = collection(db, 'messages');
    }

    const currentRole = document.getElementById('currentUserRole').innerText || 'user';

    await addDoc(msgColl, {
        senderUid: currentUser.uid,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.photoURL || DEFAULT_AVATAR,
        senderRole: currentRole.toLowerCase().replace(' ', '_'),
        text: text,
        imageUrl: imageUrl,
        likes: [],
        createdAt: serverTimestamp()
    });

    // Əgər Şəxsi çatdadırsa, qarşı tərəfin unread sayğacını artır və otaq tarixçəsini yenilə
    if (activeRoomIsDM) {
        const targetUid = activeRoomId.replace(currentUser.uid, '').replace('_', '');
        await updateDoc(doc(db, 'rooms', activeRoomId), {
            lastMessageAt: serverTimestamp(),
            [`unread_${targetUid}`]: increment(1)
        });
    }
    
    setTypingStatus(false);
}

// Hadisə dinləyicilərinin bağlanması
generalSendBtn.addEventListener('click', () => sendMessage(generalMessageInput, generalFileInput));
generalMessageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(generalMessageInput, generalFileInput); });
generalFileBtn.addEventListener('click', () => generalFileInput.click());
generalFileInput.addEventListener('change', () => { if (generalFileInput.files[0]) showToast(`Şəkil seçildi: ${generalFileInput.files[0].name}`, "info"); });

privateSendBtn.addEventListener('click', () => sendMessage(privateMessageInput, privateFileInput));
privateMessageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(privateMessageInput, privateFileInput); });
privateFileBtn.addEventListener('click', () => privateFileInput.click());
privateFileInput.addEventListener('change', () => { if (privateFileInput.files[0]) showToast(`Şəkil seçildi: ${privateFileInput.files[0].name}`, "info"); });

// Mesajların Firebase-dən Canlı Yüklənməsi
function loadGeneralMessages() {
    if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribeGeneralMessages = onSnapshot(q, (snapshot) => {
        const docs = [];
        snapshot.forEach(d => docs.push({ id: d.id, ...d.data() }));
        docs.reverse();
        renderMessages(docs, generalMessagesContainer);
    });
}

function loadPrivateMessages() {
    if (unsubscribePrivateMessages) unsubscribePrivateMessages();
    const q = query(collection(db, 'rooms', activeRoomId, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    unsubscribePrivateMessages = onSnapshot(q, (snapshot) => {
        const docs = [];
        snapshot.forEach(d => docs.push({ id: d.id, ...d.data() }));
        docs.reverse();
        renderMessages(docs, privateMessagesContainer);

        // Şəxsi otaq oxunduğu üçün bizim unread statusumuzu sıfırla
        updateDoc(doc(db, 'rooms', activeRoomId), {
            [`unread_${currentUser.uid}`]: 0
        });
    });
}

// Mesajların DOM elementinə render edilməsi
function renderMessages(messages, container) {
    if (!container) return;
    container.innerHTML = '';

    messages.forEach(msg => {
        const isMe = msg.senderUid === currentUser.uid;
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `message-wrapper ${isMe ? 'me' : 'other'}`;

        let roleBadge = '';
        if (msg.senderRole === 'super_admin') roleBadge = '<span class="msg-badge s-admin">S-Admin</span>';
        else if (msg.senderRole === 'admin') roleBadge = '<span class="msg-badge admin">Admin</span>';
        else if (msg.senderRole === 'moderator') roleBadge = '<span class="msg-badge mod">Mod</span>';

        const hasLiked = msg.likes && msg.likes.includes(currentUser.uid);
        const likeCount = msg.likes ? msg.likes.length : 0;

        let deleteBtnHtml = '';
        const myRole = document.getElementById('currentUserRole').innerText.toLowerCase().replace(' ', '_');
        const canDelete = isMe || myRole === 'super_admin' || myRole === 'admin' || myRole === 'moderator';
        
        if (canDelete) {
            deleteBtnHtml = `<button class="msg-action-btn delete-msg-btn" data-id="${msg.id}"><i class="fa-solid fa-trash-can"></i></button>`;
        }

        let msgTextHtml = '';
        if (msg.text) {
            msgTextHtml = `<p class="message-text">${escapeHTML(msg.text)}</p>`;
        }

        let msgImgHtml = '';
        if (msg.imageUrl) {
            msgImgHtml = `<div class="message-image-box"><img src="${msg.imageUrl}" alt="Yüklənmiş Şəkil" class="chat-inline-img" onclick="window.open('${msg.imageUrl}', '_blank')"></div>`;
        }

        msgWrapper.innerHTML = `
            <img src="${msg.senderAvatar || DEFAULT_AVATAR}" alt="Avatar" class="message-avatar">
            <div class="message-bubble-content">
                <div class="message-meta-row">
                    <span class="message-sender-name">${escapeHTML(msg.senderName)}</span>
                    ${roleBadge}
                    <span class="message-time">${formatDate(msg.createdAt)}</span>
                </div>
                ${msgTextHtml}
                ${msgImgHtml}
                <div class="message-interaction-bar">
                    <button class="msg-action-btn copy-msg-btn" data-text="${escapeHTML(msg.text || '')}"><i class="fa-solid fa-copy"></i> Kopyala</button>
                    <button class="msg-action-btn like-msg-btn ${hasLiked ? 'liked' : ''}" data-id="${msg.id}">
                        <i class="${hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${likeCount} bəyənmə
                    </button>
                    ${deleteBtnHtml}
                </div>
            </div>
        `;

        container.appendChild(msgWrapper);
    });

    container.scrollTop = container.scrollHeight;
    bindMessageActions(container);
}

// Mesaj elementlərinin daxili klik hadisələri
function bindMessageActions(container) {
    container.querySelectorAll('.copy-msg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text');
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast("Mesaj mətni kopyalandı!", "success");
                });
            }
        });
    });

    container.querySelectorAll('.like-msg-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const msgId = btn.getAttribute('data-id');
            const targetColl = activeRoomIsDM ? `rooms/${activeRoomId}/messages` : 'messages';
            const msgDocRef = doc(db, targetColl, msgId);
            const msgSnap = await getDoc(msgDocRef);

            if (msgSnap.exists()) {
                const data = msgSnap.data();
                let currentLikes = data.likes || [];
                if (currentLikes.includes(currentUser.uid)) {
                    currentLikes = currentLikes.filter(id => id !== currentUser.uid);
                } else {
                    currentLikes.push(currentUser.uid);
                }
                await updateDoc(msgDocRef, { likes: currentLikes });
            }
        });
    });

    container.querySelectorAll('.delete-msg-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const msgId = btn.getAttribute('data-id');
            // OLDapp.js daxilindəki orijinal confirm mətni
            if (confirm("Bu mesajı silmək istədiyinizə əminsiniz?")) {
                const targetColl = activeRoomIsDM ? `rooms/${activeRoomId}/messages` : 'messages';
                await deleteDoc(doc(db, targetColl, msgId));
                showToast("Mesaj uğurla silindi.", "success");
            }
        });
    });
}

/* ==========================================================================
   9. ADMIN PANELİ ƏMƏLİYYATLARI (Admin Control Engine)
   ========================================================================== */
function openAdminPanel() {
    adminPanelModal.classList.add('active');
    renderAdminUsers();
}
function closeAdminPanel() { adminPanelModal.classList.remove('active'); }

openAdminBtn.addEventListener('click', openAdminPanel);
closeAdminModalBtn.addEventListener('click', closeAdminPanel);

async function renderAdminUsers() {
    if (!adminUsersList) return;
    adminUsersList.innerHTML = '';

    const firestoreSnapshot = await getDocs(collection(db, 'users'));
    firestoreSnapshot.forEach(uDoc => {
        const u = uDoc.data();
        if (u.uid === currentUser.uid) return;

        const li = document.createElement('li');
        li.className = 'admin-user-item';

        li.innerHTML = `
            <div class="admin-user-left">
                <img src="${u.photoURL || DEFAULT_AVATAR}" alt="Avatar">
                <div>
                    <strong>${escapeHTML(u.displayName)}</strong>
                    <span class="admin-user-email">${escapeHTML(u.email)}</span>
                </div>
            </div>
            <div class="admin-user-actions">
                <select class="role-select" data-uid="${u.uid}">
                    <option value="user" ${u.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="moderator" ${u.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="super_admin" ${u.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
                </select>
                <button class="ban-btn ${u.isBanned ? 'banned' : ''}" data-uid="${u.uid}" data-banned="${u.isBanned}" data-name="${escapeHTML(u.displayName)}">
                    <i class="fa-solid ${u.isBanned ? 'fa-user-check' : 'fa-user-slash'}"></i> ${u.isBanned ? 'Bloku Aç' : 'Banla'}
                </button>
            </div>
        `;
        adminUsersList.appendChild(li);
    });

    // Rol dəyişmə hadisələri
    adminUsersList.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const uid = select.getAttribute('data-uid');
            const newRole = e.target.value;
            await updateDoc(doc(db, 'users', uid), { role: newRole });
            showToast("İstifadəçi rolu uğurla dəyişdirildi!", "success");
        });
    });

    // Banlama / Ban açma hadisələri
    adminUsersList.querySelectorAll('.ban-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const uid = btn.getAttribute('data-uid');
            const isBanned = btn.getAttribute('data-banned') === 'true';
            const userDisplayName = btn.getAttribute('data-name');

            if (isBanned) {
                // OLDapp.js daxilindəki orijinal confirm mətni
                if (confirm(`${userDisplayName} adlı istifadəçinin blokunu qaldırmaq istədiyinizə əminsiniz?`)) {
                    await updateDoc(doc(db, 'users', uid), { isBanned: false });
                    showToast("İstifadəçinin bloku qaldırıldı!", "success");
                    renderAdminUsers();
                }
            } else {
                // OLDapp.js daxilindəki orijinal confirm mətni
                if (confirm(`${userDisplayName} adlı istifadəçini bloklamaq (ban) istədiyinizə əminsiniz?`)) {
                    await updateDoc(doc(db, 'users', uid), { isBanned: true });
                    
                    // Real-vaxtda verilənlər bazasından sessiyasını kəsmək üçün statusunu oflayn et
                    const statusRef = ref(rtdb, `status/${uid}`);
                    await set(statusRef, { state: 'offline', lastChanged: rtdbTimestamp });
                    
                    showToast("İstifadəçi bloklandı!", "success");
                    renderAdminUsers();
                }
            }
        });
    });
}

// Bütün Çat Tarixçəsini Təmizləmə Düyməsi
clearChatBtn.addEventListener('click', async () => {
    // OLDapp.js daxilindəki orijinal confirm mətni
    if (confirm("DİQQƏT! Bütün çat tarixçəsini (bütün mesajları) tamamilə silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarılmır!")) {
        try {
            const targetColl = activeRoomIsDM ? `rooms/${activeRoomId}/messages` : 'messages';
            const querySnapshot = await getDocs(collection(db, targetColl));
            const deletePromises = [];
            querySnapshot.forEach(uDoc => {
                deletePromises.push(deleteDoc(doc(db, targetColl, uDoc.id)));
            });
            await Promise.all(deletePromises);
            showToast("Bütün çat tarixçəsi təmizləndi!", "success");
            closeAdminPanel();
        } catch (err) {
            showToast("Təmizləmə zamanı xəta: " + err.message, "error");
        }
    }
});

/* ==========================================================================
   10. PROFİL AYARLARI MODALI VƏ HESABIN SİLİNMƏSİ
   ========================================================================== */
function openSettingsModal() {
    if (!currentUser) return;
    settingsDisplayName.value = currentUser.displayName || '';
    settingsAvatarPreview.src = currentUser.photoURL || DEFAULT_AVATAR;
    profileSettingsModal.classList.add('active');
}
function closeSettingsModal() { profileSettingsModal.classList.remove('active'); }

openSettingsBtn.addEventListener('click', openSettingsModal);
closeSettingsModalBtn.addEventListener('click', closeSettingsModal);

// Ayarlar panelində daxili şəkil önbaxışı
avatarFileInput.addEventListener('change', () => {
    const file = avatarFileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { settingsAvatarPreview.src = e.target.result; };
        reader.readAsDataURL(file);
    }
});

// Profil məlumatlarının yadda saxlanılması
profileSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = settingsDisplayName.value.trim();
    const file = avatarFileInput.files[0];

    if (!newName) return;

    try {
        let uploadedUrl = currentUser.photoURL;
        if (file) {
            uploadedUrl = await uploadImageToImgBB(file);
            if (!uploadedUrl) return;
        }

        await updateProfile(auth.currentUser, { displayName: newName, photoURL: uploadedUrl });
        await updateDoc(doc(db, 'users', currentUser.uid), {
            displayName: newName,
            photoURL: uploadedUrl
        });

        // Cari mesaj konteynerində profil dəyişikliyini yenilə
        currentUser.displayName = newName;
        currentUser.photoURL = uploadedUrl;

        showToast("Profiliniz uğurla yeniləndi!", "success");
        closeSettingsModal();
    } catch (err) {
        showToast("Profil yenilənərkən xəta: " + err.message, "error");
    }
});

// Hesabın Tamamilə Silinməsi (Self-Destruct System)
deleteAccBtn.addEventListener('click', async () => {
    // OLDapp.js daxilindəki orijinal confirm mətni
    if (confirm("Hesabınızı silmək istədiyinizə əminsiniz? Bu əməliyyat GERİ QAYTARILMAZ və bütün mesajlarınız silinə bilər!")) {
        try {
            const userToDelete = auth.currentUser;
            const uid = userToDelete.uid;

            // Əvvəlcə Firestore və Realtime DB-dən təmizlə
            await deleteDoc(doc(db, 'users', uid));
            await set(ref(rtdb, `status/${uid}`), null);
            await set(ref(rtdb, `rooms/general/typing/${uid}`), null);

            // Authentication-dan birdəfəlik sil
            await deleteUser(userToDelete);
            showToast("Hesabınız uğurla silindi.", "info");
        } catch (err) {
            showToast("Hesab silinərkən xəta: " + err.message, "error");
        }
    }
});

// Kənardan silinmə və ya idarəçi tərəfindən ban hadisələrini real-vaxtda izləmə
function startSelfDestructListener(user) {
    if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    unsubscribeSelfDestruct = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
        if (!snapshot.exists()) {
            showToast("Hesabınız silindiyi üçün sistemdən çıxarılırsınız.", "error");
            auth.signOut();
        }
    });
}

/* ==========================================================================
   11. AUTH STATE CHANGED (Mərkəzi İdarəetmə və Rol Təyini)
   ========================================================================== */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let currentUserData = userDoc.data();

        if (!currentUserData) {
            // Əgər məlumat sızması olubsa mərkəzi qorunma
            currentUserData = { role: 'user', isBanned: false };
        }

        if (currentUserData.isBanned) {
            showToast("Hesabınız bloklandığı üçün sistemdən çıxarılırsınız.", "error");
            await set(ref(rtdb, `status/${user.uid}`), { state: 'offline', lastChanged: rtdbTimestamp });
            signOut(auth);
            return;
        }

        // İdarəçi Panel düyməsinin görünmə icazəsi
        if (currentUserData.role === 'super_admin' || currentUserData.role === 'admin' || currentUserData.role === 'moderator') {
            openAdminBtn.classList.remove('hidden');
        } else {
            openAdminBtn.classList.add('hidden');
        }

        // Rol adının ekranda lokallaşdırılmış şəkildə yazılması
        let roleTitle = 'İstifadəçi';
        if (currentUserData.role === 'super_admin') roleTitle = 'Super Admin';
        else if (currentUserData.role === 'admin') roleTitle = 'Admin';
        else if (currentUserData.role === 'moderator') roleTitle = 'Moderator';
        document.getElementById('currentUserRole').innerText = roleTitle;
        
        logoutBtn.classList.remove('hidden'); 
        openSettingsBtn.classList.remove('hidden');
        authScreen.classList.remove('active'); 
        chatScreen.classList.add('active');

        setupPresence(user);
        listenUsersAndPresence();
        checkActiveRoomTyping(); 
        
        // Cari otaq vəziyyətinə görə mesaj yüklənməsi
        if (activeRoomIsDM) {
            loadPrivateMessages();
        } else {
            loadGeneralMessages();
        }
        
        startSelfDestructListener(user);
    } else {
        currentUser = null;
        logoutBtn.classList.add('hidden'); 
        openSettingsBtn.classList.add('hidden');
        openAdminBtn.classList.add('hidden');
        chatScreen.classList.remove('active'); 
        authScreen.classList.add('active');
        
        if (unsubscribeGeneralMessages) unsubscribeGeneralMessages();
        if (unsubscribePrivateMessages) unsubscribePrivateMessages();
        if (unsubscribeUsers) unsubscribeUsers();
        if (unsubscribeRooms) unsubscribeRooms();
        if (unsubscribeTyping) unsubscribeTyping();
        if (unsubscribeSelfDestruct) unsubscribeSelfDestruct();
    }
});

/* ==========================================================================
   12. KÖMƏKÇİ UTİLİTLƏR (Anti-XSS Protection & Date Formatter)
   ========================================================================== */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function formatDate(timestamp) {
    if (!timestamp) return '...';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
}
