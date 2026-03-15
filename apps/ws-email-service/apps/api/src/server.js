const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const mailRoutes = require('./routes/mail');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRoutes);

//`function startServer () {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
//}

//function stopServer () {
//  app.stop()
//}

