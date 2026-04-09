// Global variable to store the authentication token
let token = null;
let currentEmailData = {}

let currentPop3Settings = {}

// DOM Elements
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const messageViewPage = document.getElementById('message-view-page');
const messageDisplayPage = document.getElementById('message-display-page');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageList = document.getElementById('message-list');
const messageContent = document.getElementById('message-content');

const emailTable = document.getElementById('email-table');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutButton = document.getElementById('logout-button');
const backToMessagesButton = document.getElementById('back-to-messages');
const backToMessagesTopButton = document.getElementById('back-to-messages-top');

// ----- start ----
const sendMessagePage = document.getElementById('send-message-page');
const replyMessagePage = document.getElementById('reply-message-page');
const forwardMessagePage = document.getElementById('forward-message-page');
const sendMessageForm = document.getElementById('send-message-form');
const replyMessageForm = document.getElementById('reply-message-form');
const forwardMessageForm = document.getElementById('forward-message-form');
const sendToInput = document.getElementById('send-to');
const sendSubjectInput = document.getElementById('send-subject');
const sendBodyTextarea = document.getElementById('send-body');
const emailQuoteDiv = document.getElementById('email-quote');
const cancelSendButton = document.getElementById('cancel-send');
const cancelReplyButton = document.getElementById('cancel-reply');
const cancelForwardButton = document.getElementById('cancel-forward');
const composeButton = document.getElementById('compose-button');

const checkMessagesButton = document.getElementById('check-messages-button');

const pop3SettingsForm = document.getElementById('settings-form');
const pop3SettingsButton = document.getElementById('pop3-settings-button');
const settingsPage = document.getElementById('settings-page');
const cancelSettingsButton = document.getElementById('cancel-settings');

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

pop3SettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const smtpServer       = document.getElementById('smtp-server').value 
    const smtpPort         = document.getElementById('smtp-port').value 
    const smtpAuthUser     = document.getElementById('smtp-auth-user').value 
    const smtpAuthPassword = document.getElementById('smtp-auth-password').value 
    const pop3Server       = document.getElementById('pop3-server').value 
    const pop3Port         = document.getElementById('pop3-port').value 

    /*
    alert(
      'smtp-server :: ' + smtpServer +
      '\nsmtp-port :: ' + smtpPort +
      '\nsmtp-auth-user :: ' + smtpAuthUser +
      '\nsmtp-auth-password :: ' + smtpAuthPassword +
      '\npop3-server :: ' + pop3Server +
      '\npop3-port :: ' + pop3Port 
    );
    */

    const status = await settingsSave({
      smtpServer,
      smtpPort,
      smtpAuthUser,
      smtpAuthPassword,
      pop3Server,
      pop3Port,
    })

    //await register(email, password);
});


logoutButton.addEventListener('click', () => {
    token = null;
    messageViewPage.style.display = 'none';
    loginPage.style.display = 'block';
});

backToMessagesButton.addEventListener('click', () => {
    window.scrollTo(0, 0);
    messageDisplayPage.style.display = 'none';
    messageViewPage.style.display = 'block';
});

backToMessagesTopButton.addEventListener('click', () => {
    window.scrollTo(0, 0);
    messageDisplayPage.style.display = 'none';
    messageViewPage.style.display = 'block';
});

// ----- start ----
cancelSettingsButton.addEventListener('click', async () => {
  window.scrollTo(0, 0);
  settingsPage.style.display = 'none';
  messageViewPage.style.display = 'block';
});

pop3SettingsButton.addEventListener('click', async () => {
  window.scrollTo(0, 0);
  //await loadMessages();
  messageViewPage.style.display = 'none';
  settingsPage.style.display = 'block';
});

checkMessagesButton.addEventListener('click', async () => {
  window.scrollTo(0, 0);
  await checkForNewPop3Messages()
  await loadMessages();
  alert('checked for new messages')
});

// Compose new email
composeButton.addEventListener('click', () => {
  sendMessageTitle.textContent = 'New Message';
  sendMessageForm.reset();
  emailQuoteDiv.style.display = 'none';
  messageViewPage.style.display = 'none';
  sendMessagePage.style.display = 'block';
  replyMessagePage.style.display = 'none';
  forwardMessagePage.style.display = 'none';
});

// Cancel sending
cancelSendButton.addEventListener('click', () => {
  console.log("Cancel sending")
  messageDisplayPage.style.display = 'none';
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
  replyMessagePage.style.display = 'none';
  forwardMessagePage.style.display = 'none';
});

// Cancel reply 
cancelReplyButton.addEventListener('click', () => {
  console.log("Cancel reply")
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'none';
  messageDisplayPage.style.display = 'block';
  replyMessagePage.style.display = 'none';
  forwardMessagePage.style.display = 'none';
});

// Cancel forward
cancelForwardButton.addEventListener('click', () => {
  console.log("Cancel forward")
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'none';
  messageDisplayPage.style.display = 'block';
  replyMessagePage.style.display = 'none';
  forwardMessagePage.style.display = 'none';
});

// Compose new email
composeButton.addEventListener('click', () => {
  sendMessageTitle.textContent = 'New Message';
  sendMessageForm.reset();
  emailQuoteDiv.style.display = 'none';
  messageViewPage.style.display = 'none';
  sendMessagePage.style.display = 'block';
});

/*
// Cancel sending
cancelSendButton.addEventListener('click', () => {
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});

// Reply to email
composeButton.addEventListener('click', () => {
  sendMessageTitle.textContent = 'New Message';
  sendMessageForm.reset();
  emailQuoteDiv.style.display = 'none';
  messageViewPage.style.display = 'none';
  sendMessagePage.style.display = 'block';
});
*/

/*
// Cancel sending
cancelSendButton.addEventListener('click', () => {
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});
*/

const replyButtonClicked = (email) => {
    //alert(`Reply to: ${email.from.text}`);
    // Implement reply logic (e.g., open a compose modal)
    sendMessageTitle.textContent = 'Reply to Message';
    sendMessageForm.reset();
    emailQuoteDiv.style.display = 'none';
    messageViewPage.style.display = 'none';
    messageDisplayPage.style.display = 'none';
    sendMessagePage.style.display = 'none';
    replyMessagePage.style.display = 'block';
    forwardMessagePage.style.display = 'none';

    document.getElementById('reply-subject').value = "Re: " + currentEmailData.subject;
    document.getElementById('reply-to').value = currentEmailData.from;
    document.getElementById('reply-body').value = "\n\n" + currentEmailData.body.replace(/^/gm, '> ');
}

const forwardButtonClicked = (email) => {
    //alert(`Forward email: ${email.subject}`);
    // Implement forward logic (e.g., open a compose modal)
    sendMessageTitle.textContent = 'Forward Message';
    sendMessageForm.reset();
    emailQuoteDiv.style.display = 'none';
    messageViewPage.style.display = 'none';
    messageDisplayPage.style.display = 'none';
    sendMessagePage.style.display = 'none';
    replyMessagePage.style.display = 'none';
    forwardMessagePage.style.display = 'block';

    document.getElementById('forward-subject').value = "Fwd: " + currentEmailData.subject;
    document.getElementById('forward-to').value = currentEmailData.from;
    document.getElementById('forward-body').value = "\n\n" + currentEmailData.body.replace(/^/gm, '> ');;
}
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

            const status = await settings()

            if (Object.keys(status[1]).length > 0) {
              currentPop3Settings = JSON.parse(status[1])
            }

            /*alert(
              "--> settings status\n" +
              JSON.stringify(status, 0, 4),
            );*/
            
            if (!status[0]) {
              settingsPage.style.display = 'block';
            } else {
              setPop3SettingFormData(currentPop3Settings)
              await loadMessages();
              messageViewPage.style.display = 'block';
            }
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('An error occurred during login.\n\n' + error.message);
    }
}

async function checkForNewPop3Messages() {
    try {
        const response = await fetch('http://localhost:3000/api/maildir/pop3/retrieve', {
            method: 'POST',
            headers: {
                'x-auth-token': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentPop3Settings)
        });
/*
*/
        alert('checkForNewPop3Messages :: \n\n' + JSON.stringify(response))
        return true;
    } catch (e) {
        alert('An error occurred while checkForNewPop3Messages :: ' + e.message);
        return false;
    }
}

async function settingsSave(settingsData) {
    try {
        const response = await fetch('http://localhost:3000/api/maildir/pop3/settings', {
            method: 'POST',
            headers: {
                'x-auth-token': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settingsData),
        });
        alert('WIP TEST settingsSave' + JSON.stringify(settingsData))
/*
        const response = await response.json();
        alert("settingsSave response :: \n" + JSON.stringify(response))
*/
    } catch (error) {
        alert('An error occurred while saving settings.' + error.message);
        return false;
    }
/*
*/
}

async function settings() {
    try {
        const response = await fetch('http://localhost:3000/api/maildir/pop3/settings', {
            headers: {
                'x-auth-token': `${token}`,
            },
        });
        //const settings = (await response.json()).settings;
        const responseJson = await response.json();
        const settings = responseJson.settings;
        //alert('settings' + JSON.stringify(settings, 0, 2));
        if (response.ok) {
          //alert('Settings retrieved.' + JSON.stringify(settings));
          const isEmpty = (Object.keys(settings).length === 0);
//alert('sssssssssss\n' + JSON.stringify(settings) + "\n" + isEmpty)
          if (isEmpty) {
//alert('sssssssssss\n' + [false, settings])
            return [false, settings];
          }
//alert('xxxxxssssss\n' + [true, settings])
          return [true, settings];
        } else {
          alert('An error occurred while getting response for settings.');
          return false;
        }
    } catch (error) {
        alert('An error occurred while getting settings.' + error.message);
        return false;
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

          // Function to handle row clicks
          function onEmailSelected(email) {
            console.log('onEmailSelected Selected email:', email);
            //alert(`You selected: ${email.subject}`);
	    //loadMessage(email)'
          }
          // Render the email table
          renderEmailTable(messages.emails, onEmailSelected, 10);
/*
          let tableHTML = await getEmailsTable(messages)
          emailTable.innerHTML = tableHTML;
*/

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

async function loadMessage(message) {
  try {
    //const filename = message.filename;
    const response = await fetch(`http://localhost:3000/api/maildir/${message.filename}`, {
      headers: {
        'x-auth-token': `${token}`,
      },
    });
    const email = (await response.json()).email;

    if (response.ok) {
      // Display email headers
      //currentEmailData.from = email.from.text;
      currentEmailData.from = email.from.value[0].address;
      //currentEmailData.to   = email.to.text;
      currentEmailData.to   = email.to.value[0].address;
      currentEmailData.subject = email.subject;
      currentEmailData.body = email.text;
      //currentEmailData.body = email.html || email.text;
console.log("currentEmailData ::", currentEmailData, email)

      messageContent.innerHTML = `
        <div class="email-header">
          <h2 id="email-subject">${email.subject}</h2>
          <p><strong>From:</strong> <span id="email-from">${email.from.text} &lt;${email.from.value[0].address}&gt;</span></p>
          <p><strong>To:</strong> <span id="email-to">${email.to.text}</span></p>
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

      messageViewPage.style.display = 'none';
      messageDisplayPage.style.display = 'block';

      // Show reply/forward modals (example)
      document.getElementById('reply-button').addEventListener('click', () => {
//alert(123)
	replyButtonClicked(email)
        /*
        alert(`Reply to: ${email.from.text}`);
        // Implement reply logic (e.g., open a compose modal)
        sendMessageTitle.textContent = 'Reply to Message';
        sendMessageForm.reset();
        emailQuoteDiv.style.display = 'none';
        messageViewPage.style.display = 'none';
        sendMessagePage.style.display = 'block';
	*/
      });

      document.getElementById('forward-button').addEventListener('click', () => {
	forwardButtonClicked(email)
	/*
        alert(`Forward email: ${email.subject}`);
        // Implement forward logic (e.g., open a compose modal)
        sendMessageTitle.textContent = 'Forward Message';
        sendMessageForm.reset();
        emailQuoteDiv.style.display = 'none';
        messageViewPage.style.display = 'none';
        sendMessagePage.style.display = 'block';
        */
      });

    } else {
      alert('Failed to load message');
    }
  } catch (error) {
    alert('An error occurred while loading the message.');
  }
}

/**
 * Formats an array of mailparser email objects into an HTML table.
 * @param {Array} emails - Array of mailparser email objects.
 * @returns {string} HTML table as a string.
 */
function formatEmailsAsTable(emails) {
  if (!emails || !emails.length) {
    return '<p>No emails to display.</p>';
  }

  // Create the table header
  let tableHTML = `
    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px;">Date</th>
          <th style="text-align: left; padding: 8px;">Subject</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Add a row for each email
  emails.forEach((email, index) => {
    const date = email.date ? new Date(email.date).toLocaleString() : 'No date';
    const subject = email.subject || 'No subject';
    const rowStyle = index % 2 === 0 ? 'background-color: #f9f9f9;' : 'background-color: #ffffff;';

    tableHTML += `
      <tr style="${rowStyle}" data-email='${JSON.stringify(email).replace(/'/g, "\\'")}'>
        <td style="padding: 8px;">${date}</td>
        <td style="padding: 8px;">${subject}</td>
      </tr>
    `;
  });

  // Close the table
  tableHTML += `
      </tbody>
    </table>
  `;

  return tableHTML;
}

/**
 * Renders a paginated, sortable, and filterable email table.
 * @param {Array} emails - Array of mailparser email objects.
 * @param {Function} onEmailSelected - Function to call when a row is clicked.
 * @param {number} rowsPerPage - Number of rows to display per page.
 */
function renderEmailTable(emails, onEmailSelected, rowsPerPage = 10) {
  // State
  let currentPage = 1;
  let sortField = 'date';
  let sortDirection = 'desc';
  let filterText = '';

  // DOM Elements
  const tableContainer = document.getElementById('email-table');
  const paginationContainer = document.getElementById('email-pagination');
  const paginationTopContainer = document.getElementById('email-pagination-top');
  const filterInput = document.getElementById('email-filter');

  // Filter and sort emails
  function getProcessedEmails() {
    let processed = [...emails];

    // Filter
    if (filterText) {
      const lowerFilter = filterText.toLowerCase();
      processed = processed.filter(email =>
        email.subject.toLowerCase().includes(lowerFilter) ||
        email.from.text.toLowerCase().includes(lowerFilter) ||
        (email.text && email.text.toLowerCase().includes(lowerFilter))
      );
    }

    // Sort
    processed.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      return sortDirection === 'asc' ? aValue > bValue ? 1 : -1 : bValue > aValue ? 1 : -1;
    });

    return processed;
  }

  // Render table
  function renderTable() {
    const processedEmails = getProcessedEmails();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedEmails = processedEmails.slice(startIndex, startIndex + rowsPerPage);

    // Table header
    let tableHTML = `
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; cursor: pointer;" onclick="toggleSort('date')">Date ${sortField === 'date' ? sortDirection === 'asc' ? '↑' : '↓' : ''}</th>
            <th style="text-align: left; padding: 8px; cursor: pointer;" onclick="toggleSort('subject')">Subject ${sortField === 'subject' ? sortDirection === 'asc' ? '↑' : '↓' : ''}</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Table rows
    paginatedEmails.forEach((email, index) => {
      const date = email.date ? new Date(email.date).toLocaleString() : 'No date';
      const subject = email.subject || 'No subject';
      const rowStyle = index % 2 === 0 ? 'background-color: #f9f9f9;' : 'background-color: #ffffff;';
      const emailJSON = JSON.stringify(email).replace(/'/g, "&apos;");
      //const emailJSON = JSON.stringify(email.filename).replace(/'/g, "&apos;");

          //onclick='onEmailSelected(${emailJSON})'
      tableHTML += `
        <tr
          style="${rowStyle}"
	  onclick='loadMessage(${emailJSON})'
          onmouseover="this.style.backgroundColor='#e6f2ff'"
          onmouseout="this.style.backgroundColor='${index % 2 === 0 ? '#f9f9f9' : '#ffffff'}'"
        >
          <td style="padding: 8px;">${date}</td>
          <td style="padding: 8px;">${subject}</td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
      <style>
        #email-table tbody tr:hover {
          background-color: #e6f2ff !important;
          cursor: pointer;
        }
      </style>
    `;

    tableContainer.innerHTML = tableHTML;

    // Render pagination
    renderPagination(processedEmails.length);
  }

  // Render pagination
  function renderPagination(totalEmails) {
    const totalPages = Math.ceil(totalEmails / rowsPerPage);
    let paginationHTML = '<div style="margin: 15px;">';

    if (totalPages > 1) {
      //paginationHTML += `<button class="first_last_prev_next" onclick="goToPage(1)" ${currentPage === 1 ? 'disabled' : ''}>First</button>`;
      //paginationHTML += `<button class="first_last_prev_next" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button><br/>`;

      paginationHTML += `<a class="first_last_prev_next" onclick="goToPage(1)" ${currentPage === 1 ? 'disabled' : ''}>First</a>`;
      paginationHTML += `<a class="first_last_prev_next" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</a> `;

      for (let i = 1; i <= totalPages; i++) {
        //paginationHTML += `<button onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
        paginationHTML += `|<a onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</a>`;
        if (i > 0 && (i % 10) === 0) {
          paginationHTML += '\n';
        }
      }
      paginationHTML += `|`;

      //paginationHTML += `<button class="first_last_prev_next" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
      //paginationHTML += `<button class="first_last_prev_next" onclick="goToPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>Last</button><br/><br/>`;

      paginationHTML += `<a class="first_last_prev_next" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</a>`;
      paginationHTML += `<a class="first_last_prev_next" onclick="goToPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>Last</a><br/>`;

      paginationHTML += `<span>Page ${currentPage} of ${totalPages}</span>`;
    }
    paginationHTML += `</div>`;

    paginationContainer.innerHTML = paginationHTML;
    //paginationTopContainer.innerHTML = paginationHTML;
  }

  // Toggle sort
  window.toggleSort = (field) => {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
    currentPage = 1;
    renderTable();
  };

  // Go to page
  window.goToPage = (page) => {
    const processedEmails = getProcessedEmails();
    const totalPages = Math.ceil(processedEmails.length / rowsPerPage);
    currentPage = Math.max(1, Math.min(page, totalPages));
    renderTable();
  };

  // Filter emails
  filterInput.addEventListener('input', (e) => {
    filterText = e.target.value;
    currentPage = 1;
    renderTable();
  });

  // Initial render
  renderTable();
/*
*/
}

async function getEmailsTable(messages) {
  let tableHTML = `
    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px;">Date</th>
          <th style="text-align: left; padding: 8px;">Subject</th>
        </tr>
      </thead>
    <tbody>
  `;
  messages.emails.forEach((email, index) => {
    const date = email.date ? new Date(email.date).toLocaleString() : 'No date';
    const subject = email.subject || 'No subject';
    const rowStyle = index % 2 === 0 ? 'background-color: #f9f9f9;' : 'background-color: #ffffff;';
	     const emailJSON = JSON.stringify(email).replace(/'/g, "&apos;");


    //emailTableElement.addEventListener('click', () => loadMessage(message));
    tableHTML += `
      <tr
	        style="${rowStyle}"
		class="email-table-item"
		onclick='loadMessage(${emailJSON})'
		onmouseover="this.style.backgroundColor='#e6f2ff'"
        onmouseout="this.style.backgroundColor='${index % 2 === 0 ? '#f9f9f9' : '#ffffff'}'"
      >
        <td style="padding: 8px;" class="email-table-item">${date}</td>
        <td style="padding: 8px;">${subject}</td>
      </tr>
    `;
  });
  tableHTML += `
      </tbody>
    </table>
  `;
  return tableHTML;
}

async function sendEmail(email) {
  try {
    // this could be updated from external source or 
    // something????
    const from = '"gav js web client" <gav@zkws.org>';

    const to = email.to; //document.getElementById('send-to').value;
    const subject = email.subject; //document.getElementById('send-subject').value;
    const body = email.body; //document.getElementById('send-body').value;

    console.log('email data on form :: ', { from, to, subject, body })

    const sendEmailAttachments = document.getElementById('send-attachments').files
    const replyEmailAttachments = document.getElementById('reply-attachments').files
    const forwardEmailAttachments = document.getElementById('forward-attachments').files

    const formData = new FormData();

    // Append email fields
    formData.append('to', to);
    formData.append("from", from);
    formData.append("subject", subject);
    formData.append('body', body);

 formData.append('attachments', sendEmailAttachments[0])
console.log('sendEmailAttachments', sendEmailAttachments)
console.log('formData', formData)
//alert("WIP `SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")

/*
    // Append attachments if present
    if (attachments && attachments.length > 0) {
      Array.from(attachments).forEach((file) => {
        formData.append('attachments', file);
      });
    }

    // WIP :: checcking file upload works....
    const uploadedFilesSend = document.getElementById("send-attachments")
    const uploadedFilesReply = document.getElementById("reply-attachments")
    const uploadedFilesForward = document.getElementById("forward-attachments")
    emailData.append("uploadedFilesSend", uploadedFilesSend.files[0])
    emailData.append("uploadedFilesReply", uploadedFilesReply.files[0])
    emailData.append("uploadedFilesForward", uploadedFilesForward.files[0])
console.log('checcking file upload works', )

*/


    //const filename = message.filename;
    const attachments = [
      {
        filename: "hello.txt",
        content: "Hello world!",
      },
    ]

    const emailData = {
      "from": from, //'"gavfrom" <gav@zkws.org>',
      "to": to, //'"to gav" <gav@zkws.org>',
      "subject": subject, //'Test Subject Take #2 with Attachment',
      "text": body, //'this is the text part of email.\n\nThanks...',
      //"html": '<h1>take #2</h1><h3>this is a html header</h3>Thanks...',
      //attachments,
    }
    //console.log(JSON.stringify(emailData))
    //console.log(token)

    const response = await fetch(`http://localhost:3000/api/maildir/send`, {
      method: 'POST',
      headers: {
        'x-auth-token': `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
//      body: formData,
    });
    console.log('send email response :: ', response)
    console.log('response.ok??? send email response :: ', response.ok)
/*
    console.log('send email response :: ', response.json())
    //const email = (await response.json()).email;
    //
*/
  } catch (e) {
    console.log('send email ERROR :: ', e)
    alert('An error occurred while sending email.');
  }

//  const responseSendAttachment = await request(server)
//    .post('/api/maildir/send')
//    .set("x-auth-token", token)
//    .set('Content-Type', 'application/json')
//    .send(emailAttachment)
}

async function setPop3SettingFormData (settings) {
    document.getElementById("smtp-server").value = currentPop3Settings.smtpServer
    document.getElementById("smtp-port").value = currentPop3Settings.smtpPort
    document.getElementById("smtp-auth-user").value = currentPop3Settings.smtpAuthUser
    document.getElementById("smtp-auth-password").value = currentPop3Settings.smtpAuthPassword
    document.getElementById("pop3-server").value = currentPop3Settings.pop3Server
    document.getElementById("pop3-port").value = currentPop3Settings.pop3Port
    //alert("setPop3SettingFormData")
/*
    alert('setPop3SettingFormData' + JSON.stringify(settings))
              currentPop3Settigs = settings;
        <!-- Settings Page -->
        <div id="settings-page" class="page" style="display: none;">
            <h1>POP3 Settings</h1>
            <form id="settings-form">

                <label for="smtp-server">smtp server</label>
                <br/>
                <input type="text" id="smtp-server" placeholder="mail0.example-domain.org" required>
                <br/>

                <label for="smtp-port">smtp port</label>
                <br/>
                <input type="text" id="smtp-port" placeholder="587" required>
                <br/>

                <label for="smtp-auth-user">smtp auth user</label>
                <br/>
                <input type="email" id="smtp-auth-user" placeholder="Email" required>
                <br/>
                <label for="smtp-auth-password">smtp auth password</label>
                <br/>
                <input type="password" id="smtp-auth-password" placeholder="Password" required>
                <br/>

                <label for="pop3-server">pop3 server</label>
                <br/>
                <input type="text" id="pop3-server" placeholder="mail0.example-domain.org" required>
                <br/>

                <label for="pop3-port">pop3 port</label>
                <br/>
                <input type="text" id="pop3-port" placeholder="17998" required>
                <br/>

                <button type="submit">Update Settings</button>
                <button type="button" id="cancel-settings">Cancel</button>
            </form>
        </div>
*/
}

forwardMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('forward-subject').value;
  const to = document.getElementById('forward-to').value;
  const body = document.getElementById('forward-body').value;
  const response = await sendEmail({ subject, to, body })
  alert(`Email sent :: Subject: ${subject}`)
  await loadMessages();
  forwardMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});

replyMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('reply-subject').value;
  const to = document.getElementById('reply-to').value;
  const body = document.getElementById('reply-body').value;
  const response = await sendEmail({ subject, to, body })
  alert(`Email reply sent :: Subject: ${subject}`)
  await loadMessages();
  replyMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});

sendMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('send-subject').value;
  const to = document.getElementById('send-to').value;
  const body = document.getElementById('send-body').value;
  const response = await sendEmail({ subject, to, body })
  console.log(response)
  alert(`Email sent :: Subject: ${subject}`)
  await loadMessages();
  sendMessagePage.style.display = 'none';
  messageViewPage.style.display = 'block';
});

