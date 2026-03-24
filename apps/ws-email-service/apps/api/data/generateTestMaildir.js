const fs = require('fs');
const path = require('path');

// Create Maildir structure
const maildirPath = path.join(__dirname, 'testMaildir');
const newPath = path.join(maildirPath, 'new');
const curPath = path.join(maildirPath, 'cur');
const tmpPath = path.join(maildirPath, 'tmp');

// Sample emails (including attachments)
const sampleEmails = [
  {
    filename: '1625097600.M12345P12345.server.com,S=1234:2,',
    content: `From: sender1@example.com
To: recipient@example.com
Subject: Test Email 1
Date: Mon, 1 Jan 2023 12:00:00 +0000

This is the body of test email 1.`,
  },
  {
    filename: '1625184000.M67890P67890.server.com,S=1500:2,',
    content: `From: sender2@example.com
To: recipient@example.com
Subject: Test Email 2
Date: Tue, 2 Jan 2023 12:00:00 +0000

This is the body of test email 2.
It has multiple lines.`,
  },
  {
    filename: '1625270400.M99999P99999.server.com,S=1000:2,S',
    content: `From: sender3@example.com
To: recipient@example.com
Subject: Test Email 3 (Marked as Seen)
Date: Wed, 3 Jan 2023 12:00:00 +0000

This email is already marked as seen (flag: S).`,
  },
  {
    filename: '1625356800.M11111P11111.server.com,S=2000:2,',
    content: `From: sender4@example.com
To: recipient@example.com
Subject: Test Email with Attachment
Date: Thu, 4 Jan 2023 12:00:00 +0000
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="boundary123"

--boundary123
Content-Type: text/plain; charset="UTF-8"

This is the body of the email with an attachment.

--boundary123
Content-Type: text/plain; charset="UTF-8"
Content-Disposition: attachment; filename="example1.txt"
Content-Transfer-Encoding: base64

SGVsbG8sIHRoaXMgaXMgYSBzYW1wbGUgdGV4dCBhdHRhY2htZW50Lg==

--boundary123
Content-Type: text/plain; charset="UTF-8"
Content-Disposition: attachment; filename="example2.txt"
Content-Transfer-Encoding: base64

SGVsbG8sIHRoaXMgaXMgYSBzYW1wbGUgdGV4dCBhdHRhY2htZW50Lg==

--boundary123--`,
  },
  {
    filename: '1625443200.M22222P22222.server.com,S=3000:2,',
    content: `From: sender5@example.com
To: recipient@example.com
Subject: Test Email with PDF Attachment
Date: Fri, 5 Jan 2023 12:00:00 +0000
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="boundary456"

--boundary456
Content-Type: text/plain; charset="UTF-8"

This email includes a PDF attachment.

--boundary456
Content-Type: application/pdf; name="sample.pdf"
Content-Disposition: attachment; filename="sample.pdf"
Content-Transfer-Encoding: base64

JVBERi0xLjQKJcOkw7zDtsOfCjQgMCBvYmoKPDwvTGVuZ3RoIDUgMCBSPj4Kc3RyZWFtCkJUCjEw
MDU2CiUlRU9GDQo=

--boundary456--`,
  },
];

// Create directories
fs.mkdirSync(maildirPath, { recursive: true });
fs.mkdirSync(newPath, { recursive: true });
fs.mkdirSync(curPath, { recursive: true });
fs.mkdirSync(tmpPath, { recursive: true });

// Write sample emails to 'new' directory
sampleEmails.forEach((email) => {
  const filePath = path.join(newPath, email.filename);
  fs.writeFileSync(filePath, email.content);
});

console.log(`Test Maildir (with attachments) generated at: ${maildirPath}`);

