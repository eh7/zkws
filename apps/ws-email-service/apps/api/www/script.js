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

alert("321 email-subject :: " + document.getElementById('email-subject').value)


    document.getElementById('reply-subject').value = "Re: " + document.getElementById('email-subject').value;

    document.getElementById('reply-subject').value = "Re: " + document.getElementById('email-subject').value;
    document.getElementById('reply-to').value = document.getElementById('email-from').value;
    document.getElementById('reply-from').value = document.getElementById('email-to').value;
    document.getElementById('reply-body').value = document.getElementById('email-body').value;
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
      paginationHTML += `<a class="first_last_prev_next" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</a><br/><br/>`;

      for (let i = 1; i <= totalPages; i++) {
        //paginationHTML += `<button onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
        paginationHTML += `|<a onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</a>`;
      }
      paginationHTML += `|<br/><br/>`;

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

forwardMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('forward-subject').value;
  const to = document.getElementById('forward-to').value;
  const body = document.getElementById('forward-body').value;
  const response = await sendEmail({ subject, to, body })
  alert(`Email sent :: Subject: ${subject}`)
});

replyMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('reply-subject').value;
  const to = document.getElementById('reply-to').value;
  const body = document.getElementById('reply-body').value;
  const response = await sendEmail({ subject, to, body })
  alert(`Email reply sent :: Subject: ${subject}`)
});

sendMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const subject = document.getElementById('send-subject').value;
  const to = document.getElementById('send-to').value;
  const body = document.getElementById('send-body').value;
  const response = await sendEmail({ subject, to, body })
  console.log(response)
  alert(`Email sent :: Subject: ${subject}`)
});
