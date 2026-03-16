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
/*
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
*/
    const response = await request(server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({"email": "test@mail.com", "password": "password123"})
    console.log(response.body)
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
