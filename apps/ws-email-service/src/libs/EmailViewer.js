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
      ...options
    };

    this._injectStyles();
  }

  // Injects base CSS into the document head
  _injectStyles() {
    if (document.getElementById('email-viewer-styles')) return;
    const style = document.createElement('style');
    style.id = 'email-viewer-styles';
    style.textContent = `
      .ev-container { font-family: system-ui, -apple-system, sans-serif; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      .ev-header { padding: 20px; background: ${this.options.themeColor}; border-bottom: 1px solid #e2e8f0; }
      .ev-subject { margin: 0 0 16px 0; font-size: 1.5rem; color: #1e293b; font-weight: 600; }
      .ev-meta { font-size: 0.9rem; color: #475569; display: grid; gap: 6px; }
      .ev-meta strong { color: #0f172a; width: 60px; display: inline-block; }
      .ev-body { padding: 0; flex: 1; background: #ffffff; display: flex; }
      .ev-iframe { border: none; width: 100%; height: 100%; flex: 1; }
      .ev-plaintext { padding: 20px; white-space: pre-wrap; font-family: monospace; color: #333; overflow-y: auto; }
      .ev-attachments { padding: 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; flex-wrap: wrap; }
      .ev-attachment { padding: 8px 16px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; text-decoration: none; color: #0f172a; display: inline-flex; align-items: center; transition: background 0.2s; }
      .ev-attachment:hover { background: #e2e8f0; cursor: pointer; }
    `;
    document.head.appendChild(style);
  }

  // Basic HTML escaping for headers to prevent XSS
  _escapeHtml(unsafe) {
    return (unsafe || '').toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  /**
   * Render an email object into the container
   * @param {Object} email - The email data object
   */
  render(email) {
    const { subject, from, to, date, body, isHtml, attachments } = email;

    this.container.innerHTML = ''; // Clear previous content

    const wrapper = document.createElement('div');
    wrapper.className = 'ev-container';
    wrapper.style.height = this.options.height;

    // --- 1. Construct Header ---
    const header = document.createElement('div');
    header.className = 'ev-header';
    const formattedDate = new Date(date).toLocaleString();
    
    header.innerHTML = `
      <h2 class="ev-subject">${this._escapeHtml(subject || 'No Subject')}</h2>
      <div class="ev-meta">
        <div><strong>From:</strong> ${this._escapeHtml(from)}</div>
        <div><strong>To:</strong> ${this._escapeHtml(to)}</div>
        <div><strong>Date:</strong> ${formattedDate}</div>
      </div>
    `;
    wrapper.appendChild(header);

    // --- 2. Construct Body ---
    const bodyContainer = document.createElement('div');
    bodyContainer.className = 'ev-body';

    if (isHtml) {
      // Secure iFrame implementation
      const iframe = document.createElement('iframe');
      iframe.className = 'ev-iframe';
      // SANDBOX is critical to prevent JavaScript execution and popups
      iframe.setAttribute('sandbox', 'allow-popups allow-same-origin');
      bodyContainer.appendChild(iframe);

      // Inject HTML content into the iframe
      iframe.onload = () => {
        const doc = iframe.contentWindow.document;
        doc.open();
        // Add a base target="_blank" so links open in new tabs, not inside the iframe
        doc.write(`<base target="_blank">` + body);
        doc.close();
      };
      
      // Trigger onload for browsers that don't auto-trigger empty iframes
      iframe.src = 'about:blank'; 
    } else {
      // Plain text implementation
      const pre = document.createElement('div');
      pre.className = 'ev-plaintext';
      pre.textContent = body; // textContent automatically escapes HTML
      bodyContainer.appendChild(pre);
    }
    wrapper.appendChild(bodyContainer);

    // --- 3. Construct Attachments (if any) ---
    if (attachments && attachments.length > 0) {
      const attContainer = document.createElement('div');
      attContainer.className = 'ev-attachments';
      
      attachments.forEach(att => {
        const link = document.createElement('a');
        link.className = 'ev-attachment';
        link.href = att.url || '#';
        link.textContent = `📎 ${att.filename} (${att.size})`;
        if (att.url) link.target = '_blank';
        attContainer.appendChild(link);
      });
      
      wrapper.appendChild(attContainer);
    }

    this.container.appendChild(wrapper);
  }
}
