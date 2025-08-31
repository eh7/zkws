import nodemailer from "nodemailer"

import 'dotenv/config'

/*
const sendEmail = process.env.BOT_USER_1
const sendPass  = process.env.BOT_PASSWD_1
const sendHost  = process.env.BOT_HOST_1
const sendPort  = process.env.BOT_OUT_PORT_1
*/

const sendEmail = process.env.BOT_USER
const sendPass  = process.env.BOT_PASSWD
const sendHost  = process.env.BOT_HOST
const sendPort  = process.env.BOT_OUT_PORT

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: sendHost,
  port: sendPort,
  secure: false, // true for 465, false for other ports
  auth: {
    user: sendEmail,
    pass: sendPass,
  },
});
//console.log(transporter)
//process.exit()

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from: '"Gav" <' + sendEmail + '>',
    to: "gav@zkws.org",
    subject: "Hello testing email sending 2",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.messageId);
})();
