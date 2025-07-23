import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

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

// Get form elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginErrorDiv = document.getElementById('loginError');
const registerErrorDiv = document.getElementById('registerError');

// Function to display error messages
function displayError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

// Function to hide error messages
function hideError(element) {
    element.textContent = '';
    element.classList.add('hidden');
}

// Check authentication state on page load
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to chat page
        window.location.href = 'chat.html';
    }
    // If no user, stay on login page
});

// Handle Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(loginErrorDiv); // Clear previous errors

    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // User logged in successfully, onAuthStateChanged will handle redirection
    } catch (error) {
        let errorMessage = "An unknown error occurred.";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No user found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                break;
            default:
                errorMessage = error.message;
        }
        displayError(loginErrorDiv, errorMessage);
    }
});

// Handle Register Form Submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(registerErrorDiv); // Clear previous errors

    const email = registerForm.registerEmail.value;
    const password = registerForm.registerPassword.value;
    const confirmPassword = registerForm.confirmPassword.value;

    if (password !== confirmPassword) {
        displayError(registerErrorDiv, 'Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        displayError(registerErrorDiv, 'Password should be at least 6 characters.');
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // User registered successfully, onAuthStateChanged will handle redirection
    } catch (error) {
        let errorMessage = "An unknown error occurred.";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already in use.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak.';
                break;
            default:
                errorMessage = error.message;
        }
        displayError(registerErrorDiv, errorMessage);
    }
});

// Toggle between login and register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    hideError(loginErrorDiv); // Clear errors when switching
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    hideError(registerErrorDiv); // Clear errors when switching
});
