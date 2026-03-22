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

// ----- start ----
const sendMessagePage = document.getElementById('send-message-page');
const sendMessageForm = document.getElementById('send-message-form');
const sendToInput = document.getElementById('send-to');
const sendSubjectInput = document.getElementById('send-subject');
const sendBodyTextarea = document.getElementById('send-body');
const emailQuoteDiv = document.getElementById('email-quote');
const cancelSendButton = document.getElementById('cancel-send');
const composeButton = document.getElementById('compose-button');

const sendAttachmentsInput = document.getElementById('send-attachments');
const sendMessageTitle = document.getElementById('send-message-title');
// ----- end ----

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

// ----- start ----
// Compose new email
composeButton.addEventListener('click', () => {
	alert(22)
  sendMessageTitle.textContent = 'New Message';
  sendMessageForm.reset();
  emailQuoteDiv.style.display = 'none';
  messageViewPage.style.display = 'none';
  sendMessagePage.style.display = 'block';
});

// Cancel sending
cancelSendButton.addEventListener('click', () => {
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});

// Compose new email
composeButton.addEventListener('click', () => {
  sendMessageTitle.textContent = 'New Message';
  sendMessageForm.reset();
  emailQuoteDiv.style.display = 'none';
  messageViewPage.style.display = 'none';
  sendMessagePage.style.display = 'block';
});

// Cancel sending
cancelSendButton.addEventListener('click', () => {
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});

// Compose new email
composeButton.addEventListener('click', () => {
  sendMessageTitle.textContent = 'New Message';
  sendMessageForm.reset();
  emailQuoteDiv.style.display = 'none';
  messageViewPage.style.display = 'none';
  sendMessagePage.style.display = 'block';
});

// Cancel sending
cancelSendButton.addEventListener('click', () => {
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});
// -----end ----

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
            messages.emails.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = 'message-item';
                //messageElement.textContent = message.filename;
                messageElement.textContent = message;
                messageElement.addEventListener('click', () => loadMessage(message));
                messageList.appendChild(messageElement);
            });
        } else {
            alert('Failed to load messages');
        }
    } catch (error) {
        alert('An error occurred while loading messages.');
    }
}

async function loadMessageOld(filename) {
    try {
        const response = await fetch(`http://localhost:3000/api/maildir/${filename}`, {
            headers: {
                'x-auth-token': `${token}`,
            },
        });
        const message = await response.json();
	    console.log('message',message)
        if (response.ok) {
            messageContent.textContent = message.email;
            messageViewPage.style.display = 'none';
            messageDisplayPage.style.display = 'block';
        } else {
            alert('Failed to load message');
        }
    } catch (error) {
        alert('An error occurred while loading the message.');
    }
}

async function loadMessage(filename) {
  try {
    const response = await fetch(`http://localhost:3000/api/maildir/${filename}`, {
      headers: {
        'x-auth-token': `${token}`,
      },
    });
    const email = (await response.json()).email;

    if (response.ok) {
      // Display email headers
      messageContent.innerHTML = `
        <div class="email-header">
          <h2>${email.subject}</h2>
          <p><strong>From:</strong> ${email.from.text} &lt;${email.from.value[0].address}&gt;</p>
          <p><strong>To:</strong> ${email.to.text}</p>
          <p><strong>Date:</strong> ${new Date(email.date).toLocaleString()}</p>
        </div>
        <div class="email-body">
          ${email.html || `<pre>${email.text}</pre>`}
        </div>
        <div class="email-actions">
          <button id="reply-button">Reply</button>
          <button id="forward-button">Forward</button>
        </div>
        <div class="email-attachments">
          ${email.attachments.length > 0 ? '<h3>Attachments:</h3>' : ''}
          <ul>
            ${email.attachments.map(attachment => `
              <li>
                <a href="data:${attachment.contentType};base64,${attachment.content.toString('base64')}"
                   download="${attachment.filename}">
                  ${attachment.filename}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;

      // Show reply/forward modals (example)
      document.getElementById('reply-button').addEventListener('click', () => {
        alert(`Reply to: ${email.from.text}`);
        // Implement reply logic (e.g., open a compose modal)
      });

      document.getElementById('forward-button').addEventListener('click', () => {
        alert(`Forward email: ${email.subject}`);
        // Implement forward logic (e.g., open a compose modal)
      });

      messageViewPage.style.display = 'none';
      messageDisplayPage.style.display = 'block';
    } else {
      alert('Failed to load message');
    }
  } catch (error) {
    alert('An error occurred while loading the message.');
  }
}

