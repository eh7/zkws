const request = require('supertest');
// sum.test.js
const server = require('./server');
const fs = require('fs');

beforeAll(() => {
  // Clear the authDb old test data so 
  // we have clean db for testing
  fs.rmSync('/tmp/authDb.testing.json')
  const fd = fs.openSync('/tmp/authDb.testing.json', 'w')
  const data = JSON.stringify({users:[]});
  fs.writeSync(fd, data, 0, data.length, 0);
});

afterAll(() => {
  server.close();
});

describe('Test server endpoints', () => {

  it('request a list of emails in maildir inbox but not authed', async () => {
    const response = await request(server)
      .get('/api/mail/list')
    expect(response.body.message).toBe('No token, authorization denied')
  });

  it('test login endpoint failed login', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({"email": "test@mail.com", "password": "password123"})
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('returns a list of emails in maildir inbox', async () => {
    const responseRegister = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send({"email": "user@example.com", "password": "password123"})
    expect(responseRegister.body).toHaveProperty('token');

    const tokenRegister = responseRegister.body.token;

    const responseRegister1 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send({"email": "user@example.com", "password": "password123"})
    expect(responseRegister1.body.message).toBe('User already exists');

    const responseListEmail = await request(server)
      .get('/api/mail/list')
      .set("x-auth-token", tokenRegister)
    //console.log(Object.keys(responseListEmail.body).length)
    //console.log(responseListEmail.body.length)
    expect(responseListEmail.body.length).toBe(2);

    const responseGetEmail1 = await request(server)
      .get('/api/mail/1')
      .set('Content-Type', 'application/json')
      .set("x-auth-token", tokenRegister)
    expect(responseGetEmail1.body).toHaveProperty('id');
    expect(responseGetEmail1.body).toHaveProperty('from');
    expect(responseGetEmail1.body).toHaveProperty('subject');
    expect(responseGetEmail1.body).toHaveProperty('body');

    const responseLogin = await request(server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({"email": "user@example.com", "password": "password123"})

/*
    const response = await request(server)
      .get('/api/mail/list')
console.log(response.body)
      .expect(200)
      .expect('Content-Type', /json/);
    //expect(response.body).toHaveProperty('users');
*/
  });

  it('test send and email through the api endpoint', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({"email": "user@example.com", "password": "password123"})
    const token = response.body.token;

    const responseList = await request(server)
      .get('/api/mail/list')
      .set("x-auth-token", token)
      .expect(200)
      .expect('Content-Type', /json/);

    const email = {
      "from": '"gavfrom" <gav@zkws.org>',
      "to": '"to gav" <gav@zkws.org>',
      "subject": 'Test Subject Take #1',
      "text": 'this is the text part of email.\n\nThanks...',
      "html": '<h1>this is a html header</h1>Thanks...',
    }
    const responseSend = await request(server)
      .post('/api/maildir/send')
      .set("x-auth-token", token)
      .set('Content-Type', 'application/json')
      .send(email)

    const attachments = [
      {
        filename: "hello.txt",
        content: "Hello world!",
      },
    ]
    const emailAttachment = {
      "from": '"gavfrom" <gav@zkws.org>',
      "to": '"to gav" <gav@zkws.org>',
      "subject": 'Test Subject Take #2 with Attachment',
      "text": 'this is the text part of email.\n\nThanks...',
      "html": '<h1>take #2</h1><h3>this is a html header</h3>Thanks...',
      attachments,
    }
    const responseSendAttachment = await request(server)
      .post('/api/maildir/send')
      .set("x-auth-token", token)
      .set('Content-Type', 'application/json')
      .send(emailAttachment)

    // missing manditory fields
    const emailError = {
      "from": '"gavfrom" <gav@zkws.org>',
      "to": '"to gav" <gav@zkws.org>',
    }
    const responseError = await request(server)
      .post('/api/maildir/send')
      .set("x-auth-token", token)
      .set('Content-Type', 'application/json')
      .send(emailError)
    console.log('responseError', responseError.body)

    const pop3Settings = await request(server)
      .get('/api/maildir/pop3/settings')
      .set("x-auth-token", token)
      .set('Content-Type', 'application/json')
    console.log('ssssssssssssssssssssssssssss', pop3Settings.body)

    //const setPop3Settings = await request(server)
    //  .post('/api/maildir/pop3/settings')
    //  .set("x-auth-token", token)
    //  .set('Content-Type', 'application/json')

  }, 30000);

/*
it('test login on default user data :: user@test.com and password', () => {
  //expect(server(1, 2)).toBe(3);
  console.log(server)
});

afterAll(() => {
  //globalDatabase.cleanUp(); // Runs once after all tests
  console.log("111111111111111111111111111111111")
});
*/

});
