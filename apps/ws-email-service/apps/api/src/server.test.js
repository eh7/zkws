const request = require('supertest');
// sum.test.js
const server = require('./server');

describe('GET /api/mail/list', () => {
  it('returns a list of emails in maildir inbox', async () => {
    const response = await request(server)
      .get('/api/mail/list')
    //  .expect(200)
    //  .expect('Content-Type', /json/);
    //expect(response.body).toHaveProperty('users');
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
