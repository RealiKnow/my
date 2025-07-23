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
    // Optional: Add a temporary class for animation or emphasis if needed
    // element.classList.add('animate-shake'); // Example, requires CSS for animate-shake
}

// Function to hide error messages
function hideError(element) {
    element.textContent = '';
    element.classList.add('hidden');
    // element.classList.remove('animate-shake'); // Remove animation class
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
        let errorMessage = "An unexpected error occurred. Please try again.";
        switch (error.code) {
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password. Please check your credentials and try again.';
                break;
            case 'auth/user-not-found': // Included for clarity, though invalid-credential often covers this
                errorMessage = 'No user found with this email. Please register or try again.';
                break;
            case 'auth/wrong-password': // Included for clarity, though invalid-credential often covers this
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'The email address is not valid. Please enter a valid email.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Please contact support for assistance.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed login attempts. Please try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection and try again.';
                break;
            default:
                console.error("Login Error:", error.code, error.message); // Log full error for debugging
                errorMessage = 'Login failed. Please verify your email and password.';
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
        displayError(registerErrorDiv, 'Passwords do not match. Please ensure both passwords are the same.');
        return;
    }

    if (password.length < 6) {
        displayError(registerErrorDiv, 'Password should be at least 6 characters long for security.');
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // User registered successfully, onAuthStateChanged will handle redirection
    } catch (error) {
        let errorMessage = "An unexpected error occurred during registration. Please try again.";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please log in or use a different email.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'The email address is not valid. Please enter a valid email.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please choose a stronger password with at least 6 characters.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection and try again.';
                break;
            default:
                console.error("Registration Error:", error.code, error.message); // Log full error for debugging
                errorMessage = 'Registration failed. Please try again with valid credentials.';
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
