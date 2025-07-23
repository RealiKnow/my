import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

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

// Gemini API Key provided by the user
const GEMINI_API_KEY = "AIzaSyCa4oS6AnLLRZJsC3HBIvEeAwzYRhGdUg4";
const GEMINI_MODEL = "gemini-2.5-flash"; // User specified gemini-2.5-flash

// Get DOM elements
const chatMessagesDiv = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const chatErrorDiv = document.getElementById('chatError');

let chatHistory = []; // Stores the conversation history for Gemini API

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

// Function to add a message to the chat display
function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', 'mb-4');

    if (sender === 'user') {
        messageElement.classList.add('justify-end');
        messageElement.innerHTML = `
            <div class="bg-purple-600 text-white p-3 rounded-lg max-w-xs md:max-w-md shadow-md break-words">
                ${message}
            </div>
        `;
    } else { // sender === 'bot'
        messageElement.classList.add('justify-start');
        messageElement.innerHTML = `
            <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs md:max-w-md shadow-md break-words">
                ${message}
            </div>
        `;
    }
    chatMessagesDiv.appendChild(messageElement);
    // Scroll to the bottom
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

// Function to send message to Gemini API
async function sendMessageToGemini(prompt) {
    hideError(chatErrorDiv);
    loadingIndicator.classList.remove('hidden');
    sendButton.disabled = true; // Disable send button while loading

    // Add user message to chat history
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
        contents: chatHistory,
        generationConfig: {
            // You can add more generation config here if needed, e.g., temperature, topK, topP
            // For now, keeping it simple as per request
        }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const botResponse = result.candidates[0].content.parts[0].text;
            addMessage('bot', botResponse);
            // Add bot response to chat history
            chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
        } else {
            addMessage('bot', 'Sorry, I could not generate a response.');
            displayError(chatErrorDiv, 'Empty or invalid response from AI.');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        addMessage('bot', 'Sorry, I am having trouble connecting to the AI. Please try again later.');
        displayError(chatErrorDiv, `Error: ${error.message}`);
    } finally {
        loadingIndicator.classList.add('hidden');
        sendButton.disabled = false; // Re-enable send button
        chatInput.value = ''; // Clear input field
    }
}

// Event listener for send button click
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage('user', message);
        sendMessageToGemini(message);
    }
});

// Event listener for Enter key press in input field
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click(); // Trigger send button click
    }
});

// Firebase Authentication Check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not signed in, redirect to login page
        window.location.href = 'login.html';
    }
    // If user is signed in, stay on chat page
});

// Initialize chat history with the welcome message
// The welcome message is already in HTML, so we don't add it to chatHistory for API context
// We will add user and model messages to chatHistory as they occur.
