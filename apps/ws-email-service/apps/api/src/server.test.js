const request = require('supertest');
// sum.test.js
const server = require('./server');

afterAll(() => {
  server.close();
});

describe('Test server endpoints', () => {

  it('request a list of emails in maildir inbox but not authed', async () => {
    const response = await request(server)
      .get('/api/mail/list')
    expect(response.body.message).toBe('No token, authorization denied')
  });

  it('returns a list of emails in maildir inbox', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({"email": "test@mail.com", "password": "password123"})
    expect(response.body.message).toBe('Invalid credentials');

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

/*
    const response = await request(server)
      .get('/api/mail/list')
console.log(response.body)
      .expect(200)
      .expect('Content-Type', /json/);
    //expect(response.body).toHaveProperty('users');
*/
  });
});

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
