// Global variable to store the authentication token
let token = null;

// DOM Elements
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const messageViewPage = document.getElementById('message-view-page');
const messageDisplayPage = document.getElementById('message-display-page');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageList = document.getElementById('message-list');
const messageContent = document.getElementById('message-content');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutButton = document.getElementById('logout-button');
const backToMessagesButton = document.getElementById('back-to-messages');

// Event Listeners
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.style.display = 'none';
    registerPage.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerPage.style.display = 'none';
    loginPage.style.display = 'block';
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await login(email, password);
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    await register(email, password);
});

logoutButton.addEventListener('click', () => {
    token = null;
    messageViewPage.style.display = 'none';
    loginPage.style.display = 'block';
});

backToMessagesButton.addEventListener('click', () => {
    messageDisplayPage.style.display = 'none';
    messageViewPage.style.display = 'block';
});

// API Functions
async function register(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            registerPage.style.display = 'none';
            loginPage.style.display = 'block';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('An error occurred during registration.');
    }
}

async function login(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            token = data.token;
            loginPage.style.display = 'none';
            await loadMessages();
            messageViewPage.style.display = 'block';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('An error occurred during login.');
    }
}

async function loadMessages() {
    try {
        const response = await fetch('http://localhost:3000/api/maildir/list', {
            headers: {
                'x-auth-token': `${token}`,
            },
        });
        const messages = await response.json();
        if (response.ok) {
            messageList.innerHTML = '';
            messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = 'message-item';
                messageElement.textContent = message.filename;
                messageElement.addEventListener('click', () => loadMessage(message.filename));
                messageList.appendChild(messageElement);
            });
        } else {
            alert('Failed to load messages');
        }
    } catch (error) {
        alert('An error occurred while loading messages.');
    }
}

async function loadMessage(filename) {
    try {
        const response = await fetch(`http://localhost:3000/api/maildir/${filename}`, {
            headers: {
                'x-auth-token': `${token}`,
            },
        });
        const message = await response.json();
        if (response.ok) {
            messageContent.textContent = message.content;
            messageViewPage.style.display = 'none';
            messageDisplayPage.style.display = 'block';
        } else {
            alert('Failed to load message');
        }
    } catch (error) {
        alert('An error occurred while loading the message.');
    }
}

