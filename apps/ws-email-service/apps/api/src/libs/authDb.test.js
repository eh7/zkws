const AuthDb = require('./authDb');

const authDb = new AuthDb()

test('test listUsers', () => {
  authDb.resetDb()
  expect(authDb.listUsers().length).toBe(0);
});

test('testing WIP', async () => {
  authDb.resetDb()

  expect(
    authDb.listUsers().length
  ).toBe(0)

  expect(
    (await authDb.createUser("_email", "password")).email
  ).toBe('_email')

  //await authDb.createUser("email1", "password1")

  const users = authDb.listUsers()
  expect(
    users.length
  ).toBe(1)
  expect(
    users[0].email
  ).toBe('_email')

  expect(
    await authDb.verifyPassword('_email', 'password')
  ).toBe(true)

  try {
    await authDb.verifyPassword('_email1', 'password')
  } catch (e) {
    expect(e.message).toBe("User not found")
  }
});
