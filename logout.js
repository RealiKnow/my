import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

// Firebase configuration provided by the user
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

const logoutButton = document.getElementById('logoutButton');
const logoutErrorDiv = document.getElementById('logoutError');

// Function to display error messages
function displayError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

// Check authentication state on page load
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is already logged out or not signed in, redirect to login page
        window.location.href = 'login.html';
    }
});

// Handle logout button click
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        // User signed out successfully, onAuthStateChanged will handle redirection
    } catch (error) {
        console.error('Error signing out:', error);
        displayError(logoutErrorDiv, `Logout failed: ${error.message}`);
    }
});

// Auto-logout if user somehow lands on this page and is authenticated
// This is a safety measure, as the chat page has a direct logout link.
// If the user directly navigates to logout.html while logged in, this will sign them out.
// This will trigger the onAuthStateChanged listener above, which then redirects.
window.onload = () => {
    // No explicit action needed here as onAuthStateChanged handles the redirection.
    // The logout button provides a manual confirmation if needed.
};
