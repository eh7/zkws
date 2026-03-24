Here’s how you can extend your API to include **password updates**, **moving emails between folders**, **marking emails as read**, and **deleting emails**. All endpoints will require a valid JWT token.

---

## 1. Update Password

### **routes/auth.js**
Add this endpoint to your existing auth routes:

```javascript
// Update password
router.post('/update-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = User.findByEmail(req.user.email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

  user.password = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password updated successfully' });
});
```

---

## 2. Maildir Operations

### **routes/mail.js**
Update your mail routes to include the new features:

```javascript
const fs = require('fs');
const path = require('path');

// Move email between folders (e.g., 'new' to 'cur')
router.post('/move/:id', auth, async (req, res) => {
  const { source, destination } = req.body; // e.g., { source: 'new', destination: 'cur' }
  const maildir = new Maildir({ path: MAILDIR_PATH });

  try {
    const oldPath = path.join(MAILDIR_PATH, source, req.params.id);
    const newPath = path.join(MAILDIR_PATH, destination, req.params.id);

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ message: 'Email not found' });
    }

    fs.renameSync(oldPath, newPath);
    res.json({ message: 'Email moved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to move email' });
  }
});

// Mark email as read (move from 'new' to 'cur')
router.post('/mark-read/:id', auth, async (req, res) => {
  await moveEmail(req.params.id, 'new', 'cur', res);
});

// Delete email
router.delete('/:id', auth, async (req, res) => {
  const maildir = new Maildir({ path: MAILDIR_PATH });

  try {
    const emailPath = path.join(MAILDIR_PATH, 'new', req.params.id);
    if (fs.existsSync(emailPath)) {
      fs.unlinkSync(emailPath);
      return res.json({ message: 'Email deleted successfully' });
    }

    const curPath = path.join(MAILDIR_PATH, 'cur', req.params.id);
    if (fs.existsSync(curPath)) {
      fs.unlinkSync(curPath);
      return res.json({ message: 'Email deleted successfully' });
    }

    res.status(404).json({ message: 'Email not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete email' });
  }
});

// Helper function to move emails
async function moveEmail(id, source, destination, res) {
  const maildir = new Maildir({ path: MAILDIR_PATH });

  try {
    const oldPath = path.join(MAILDIR_PATH, source, id);
    const newPath = path.join(MAILDIR_PATH, destination, id);

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ message: 'Email not found' });
    }

    fs.renameSync(oldPath, newPath);
    res.json({ message: 'Email moved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to move email' });
  }
}
```

---

## 3. Testing the New Endpoints

### Update Password
```bash
curl -X POST http://localhost:3000/api/auth/update-password \
  -H "Content-Type: application/json" \
  -H "x-auth-token: your_jwt_token" \
  -d '{"currentPassword": "oldpassword", "newPassword": "newpassword123"}'
```

### Move Email
```bash
curl -X POST http://localhost:3000/api/mail/move/1234567890.12345_1.example.com \
  -H "Content-Type: application/json" \
  -H "x-auth-token: your_jwt_token" \
  -d '{"source": "new", "destination": "cur"}'
```

### Mark as Read
```bash
curl -X POST http://localhost:3000/api/mail/mark-read/1234567890.12345_1.example.com \
  -H "x-auth-token: your_jwt_token"
```

### Delete Email
```bash
curl -X DELETE http://localhost:3000/api/mail/1234567890.12345_1.example.com \
  -H "x-auth-token: your_jwt_token"
```

---

## 4. Notes

- **Error Handling**: Always validate input and handle filesystem errors gracefully.
- **Security**: Ensure the `id` parameter is sanitized to prevent path traversal.
- **Idempotency**: Consider making these operations idempotent (e.g., moving an already-moved email doesn’t cause errors).
- **Logging**: Add logging for important actions (e.g., password changes, email deletions).

---

Would you like to add more features, such as email search, folders, or attachments handling? Let me know how you’d like to proceed!

## TODO add pop3 retrival and storage in maildir

### Recommended Tools
node-pop3: For connecting to a POP3 server and downloading emails. 
mailparser: To parse raw email content into structured data. 
Custom logic: To write parsed emails to maildir directories.

### Example Workflow
Connect to POP3 server using node-pop3.
Retrieve messages using RETR.
Parse each message with mailparser.simpleParser().
Serialize the parsed email to MIME format using nodemailer’s createTransport() or manual MIME construction.
Save the MIME string to a file in the maildir/new/ directory. 
