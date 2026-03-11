class EmailViewer {
  /**
   * Initialize the EmailViewer
   * @param {string} containerSelector - The CSS selector for the wrapper element
   * @param {Object} options - Configuration options
   */
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) throw new Error(`Container '${containerSelector}' not found.`);
    
    this.options = {
      height: options.height || '600px',
      themeColor: options.themeColor || '#f9f9f9',
      onSend: options.onSend || function(email) { console.log("Email sent:", email); },
      onCancel: options.onCancel || null,
      ...options
    };

    this.currentEmail = null; // Stores the currently viewed email
    this._injectStyles();
  }

  // Injects base CSS into the document head
  _injectStyles() {
    if (document.getElementById('email-viewer-styles')) return;
    const style = document.createElement('style');
    style.id = 'email-viewer-styles';
    style.textContent = `
      .ev-container { font-family: system-ui, -apple-system, sans-serif; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      .ev-header { padding: 20px; background: ${this.options.themeColor}; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start; }
      .ev-header-content { flex: 1; }
      .ev-subject { margin: 0 0 16px 0; font-size: 1.5rem; color: #1e293b; font-weight: 600; }
      .ev-meta { font-size: 0.9rem; color: #475569; display: grid; gap: 6px; }
      .ev-meta strong { color: #0f172a; width: 60px; display: inline-block; }
      .ev-body { padding: 0; flex: 1; background: #ffffff; display: flex; }
      .ev-iframe { border: none; width: 100%; height: 100%; flex: 1; }
      .ev-plaintext { padding: 20px; white-space: pre-wrap; font-family: monospace; color: #333; overflow-y: auto; flex: 1; }
      
      /* Action Buttons */
      .ev-actions { display: flex; gap: 8px; }
      .ev-btn { padding: 8px 16px; font-size: 0.85rem; font-weight: 500; cursor: pointer; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; color: #0f172a; transition: all 0.2s; }
      .ev-btn:hover { background: #f1f5f9; }
      .ev-btn-primary { background: #2563eb; color: #ffffff; border-color: #2563eb; }
      .ev-btn-primary:hover { background: #1d4ed8; }

      /* Compose Form */
      .ev-compose-form { display: flex; flex-direction: column; flex: 1; background: #fff; }
      .ev-input-group { display: flex; border-bottom: 1px solid #e2e8f0; align-items: center; }
      .ev-input-group label { width: 80px; padding: 12px 16px; color: #64748b; font-size: 0.9rem; font-weight: 500; }
      .ev-input { flex: 1; border: none; padding: 12px 16px; font-size: 1rem; outline: none; }
      .ev-textarea { flex: 1; border: none; padding: 16px; font-size: 1rem; resize: none; outline: none; font-family: inherit; line-height: 1.5; }
      .ev-compose-footer { padding: 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; }
    `;
    document.head.appendChild(style);
  }

  _escapeHtml(unsafe) {
    return (unsafe || '').toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  // Strips HTML safely to create clean plain-text quotes for replying/forwarding
  _extractPlainText(body, isHtml) {
    if (!isHtml) return body;
    return body
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<\/?(?:p|div|h[1-6]|br|li)[^>]*>/gi, '\n') // Block elements to newlines
      .replace(/<[^>]+>/g, '') // Strip remaining tags
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\n\s*\n/g, '\n\n') // Collapse multiple newlines
      .trim();
  }

  /**
   * Render an email object in "View" mode
   * @param {Object} email 
   */
  render(email) {
    this.currentEmail = email;
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'ev-container';
    wrapper.style.height = this.options.height;

    const formattedDate = new Date(email.date).toLocaleString();
    
    // --- Header with Action Buttons ---
    const header = document.createElement('div');
    header.className = 'ev-header';
    header.innerHTML = `
      <div class="ev-header-content">
        <h2 class="ev-subject">${this._escapeHtml(email.subject || 'No Subject')}</h2>
        <div class="ev-meta">
          <div><strong>From:</strong> ${this._escapeHtml(email.from)}</div>
          <div><strong>To:</strong> ${this._escapeHtml(email.to)}</div>
          <div><strong>Date:</strong> ${formattedDate}</div>
        </div>
      </div>
      <div class="ev-actions" id="ev-view-actions"></div>
    `;
    wrapper.appendChild(header);

    // --- Body ---
    const bodyContainer = document.createElement('div');
    bodyContainer.className = 'ev-body';

    if (email.isHtml) {
      const iframe = document.createElement('iframe');
      iframe.className = 'ev-iframe';
      iframe.setAttribute('sandbox', 'allow-popups allow-same-origin');
      bodyContainer.appendChild(iframe);
      iframe.onload = () => {
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`<base target="_blank">` + email.body);
        doc.close();
      };
      iframe.src = 'about:blank'; 
    } else {
      const pre = document.createElement('div');
      pre.className = 'ev-plaintext';
      pre.textContent = email.body;
      bodyContainer.appendChild(pre);
    }
    wrapper.appendChild(bodyContainer);
    this.container.appendChild(wrapper);

    // Attach Action Listeners dynamically
    const actionsContainer = document.getElementById('ev-view-actions');
    
    const replyBtn = document.createElement('button');
    replyBtn.className = 'ev-btn';
    replyBtn.textContent = 'Reply';
    replyBtn.onclick = () => this.reply(email);
    actionsContainer.appendChild(replyBtn);

    const forwardBtn = document.createElement('button');
    forwardBtn.className = 'ev-btn';
    forwardBtn.textContent = 'Forward';
    forwardBtn.onclick = () => this.forward(email);
    actionsContainer.appendChild(forwardBtn);
  }

  /**
   * Transition to compose mode for a reply
   */
  reply(email) {
    const plainTextOriginal = this._extractPlainText(email.body, email.isHtml);
    const quotedBody = `\n\n\n--- On ${new Date(email.date).toLocaleString()}, ${email.from} wrote ---\n${plainTextOriginal}`;
    
    this.compose({
      type: 'Reply',
      to: email.from,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: quotedBody
    });
  }

  /**
   * Transition to compose mode for a forward
   */
  forward(email) {
    const plainTextOriginal = this._extractPlainText(email.body, email.isHtml);
    const quotedBody = `\n\n\n--- Forwarded message ---\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\nSubject: ${email.subject}\nTo: ${email.to}\n\n${plainTextOriginal}`;

    this.compose({
      type: 'Forward',
      to: '',
      subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
      body: quotedBody
    });
  }

  /**
   * Render the "Compose" mode
   * @param {Object} data - Initial data for the compose form
   */
  compose(data = {}) {
    this.container.innerHTML = ''; 

    const wrapper = document.createElement('div');
    wrapper.className = 'ev-container';
    wrapper.style.height = this.options.height;

    // Header
    const header = document.createElement('div');
    header.className = 'ev-header';
    header.innerHTML = `<h2 class="ev-subject" style="margin:0;">${data.type || 'New Message'}</h2>`;
    wrapper.appendChild(header);

    // Form
    const form = document.createElement('div');
    form.className = 'ev-compose-form';
    
    form.innerHTML = `
      <div class="ev-input-group">
        <label>To:</label>
        <input type="text" class="ev-input" id="ev-compose-to" value="${this._escapeHtml(data.to || '')}" placeholder="recipient@example.com">
      </div>
      <div class="ev-input-group">
        <label>Subject:</label>
        <input type="text" class="ev-input" id="ev-compose-subject" value="${this._escapeHtml(data.subject || '')}" placeholder="Message Subject">
      </div>
      <textarea class="ev-textarea" id="ev-compose-body" placeholder="Write your message here...">${this._escapeHtml(data.body || '')}</textarea>
      
      <div class="ev-compose-footer">
        <button class="ev-btn" id="ev-compose-cancel">Cancel</button>
        <button class="ev-btn ev-btn-primary" id="ev-compose-send">Send Message</button>
      </div>
    `;

    wrapper.appendChild(form);
    this.container.appendChild(wrapper);

    // Event Listeners for Compose Form
    document.getElementById('ev-compose-send').onclick = () => {
      const emailPayload = {
        to: document.getElementById('ev-compose-to').value,
        subject: document.getElementById('ev-compose-subject').value,
        body: document.getElementById('ev-compose-body').value,
        date: new Date().toISOString(),
        isHtml: false // Library outputs plain text emails
      };
      
      this.options.onSend(emailPayload);
    };

    document.getElementById('ev-compose-cancel').onclick = () => {
      if (this.options.onCancel) {
        this.options.onCancel();
      } else if (this.currentEmail && (data.type === 'Reply' || data.type === 'Forward')) {
        this.render(this.currentEmail); // Go back to original email
      } else {
        this.container.innerHTML = ''; // Clear widget entirely
      }
    };
  }
}
