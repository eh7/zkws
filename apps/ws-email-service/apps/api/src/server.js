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
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, () => {
  console.log(`Server running on port http://${HOST}:${PORT}`);
});

