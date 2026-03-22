const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const mailRoutes = require('./routes/mail');
const maildirRoutes = require('./routes/mail.lib.maildir');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/maildir', maildirRoutes);

//`function startServer () {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || 'localhost';
  const server = app.listen(PORT, () => {
    console.log(`Server running on port http://${HOST}:${PORT}`);
  });
  module.exports = server;
//}

//function stopServer () {
//  app.stop()
//}
