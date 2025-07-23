import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

// Firebase configuration (same as your other files)
const firebaseConfig = {
    apiKey: "AIzaSyD2e5ZFUMY67KJsUrrflJpSIm1UpE4gn_Q",
    authDomain: "realauth-f47e3.firebaseapp.com",
    projectId: "realauth-f47e3",
    storageBucket: "realauth-f47e3.firebasestorage.app",
    messagingSenderId: "246570204070",
    appId: "1:246570204070:web:d89596de8b627467e66d67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use onAuthStateChanged to check authentication status immediately
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to chat page
        window.location.href = 'chat.html';
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }
});
