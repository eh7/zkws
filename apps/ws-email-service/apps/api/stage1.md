Creating a JavaScript REST API with user registration, authentication, and protected endpoints for accessing a maildir mailbox is a multi-step process. Below, I’ll outline the key components and provide a basic implementation using **Node.js**, **Express**, and **JSON Web Tokens (JWT)**. This example assumes you’re using a simple in-memory database for users and a mock maildir structure for demonstration.

---

## 1. Project Setup

### Install Dependencies
```bash
npm init -y
npm install express jsonwebtoken bcryptjs body-parser
```

---

## 2. API Structure

### File Structure
```
/api
  ├── server.js          # Main server file
  ├── routes/
  │   ├── auth.js        # Authentication routes
  │   └── mail.js        # Mailbox routes
  ├── middleware/
  │   └── auth.js        # Authentication middleware
  └── models/
      └── User.js        # User model (in-memory for demo)
```

---

## 3. Code Implementation

### **server.js**
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const mailRoutes = require('./routes/mail');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### **models/User.js**
```javascript
// In-memory "database" for demo purposes
const users = [];

module.exports = {
  findByEmail: (email) => users.find(user => user.email === email),
  create: (user) => users.push(user),
};
```

---

### **middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

---

### **routes/auth.js**
```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'your_jwt_secret_key';

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const existingUser = User.findByEmail(email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword };
  User.create(user);

  const token = jwt.sign({ user: { email } }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ user: { email } }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
```

---

### **routes/mail.js**
```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock maildir data
const maildir = {
  emails: [
    { id: 1, from: 'user1@example.com', subject: 'Hello', body: 'This is email 1' },
    { id: 2, from: 'user2@example.com', subject: 'Hi', body: 'This is email 2' },
  ],
};

// List all emails
router.get('/list', auth, (req, res) => {
  res.json(maildir.emails);
});

// Get specific email
router.get('/:id', auth, (req, res) => {
  const email = maildir.emails.find(e => e.id === parseInt(req.params.id));
  if (!email) return res.status(404).json({ message: 'Email not found' });
  res.json(email);
});

module.exports = router;
```

---

## 4. Testing the API

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```
**Response:** `{ "token": "your_jwt_token" }`

### Access Protected Endpoints
```bash
# List all emails
curl -X GET http://localhost:3000/api/mail/list \
  -H "x-auth-token: your_jwt_token"

# Get specific email
curl -X GET http://localhost:3000/api/mail/1 \
  -H "x-auth-token: your_jwt_token"
```

---

## 5. Notes and Next Steps

- **Security:** Use environment variables for secrets (e.g., `JWT_SECRET`), and consider using a real database (e.g., MongoDB, PostgreSQL).
- **Maildir Integration:** Replace the mock `maildir` with a real maildir library (e.g., [node-maildir](https://www.npmjs.com/package/node-maildir)).
- **Error Handling:** Add more robust error handling and validation.
- **Rate Limiting:** Implement rate limiting for auth endpoints.

---

Would you like me to expand on any part, such as integrating a real maildir library or adding more features?
