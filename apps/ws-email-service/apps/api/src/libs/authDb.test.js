const path = require('path');

const AuthDb = require('./authDb');

const authDb = new AuthDb(path.join(__dirname, '../../data/authDb.test.json'));

test('test listUsers', () => {
  authDb.resetDb()
  expect(authDb.listUsers().length).toBe(0);
});

describe('Testing authDb functionality', () => {
  test('testing WIP', async () => {

    authDb.resetDb()

    expect(
      authDb.listUsers().length
    ).toBe(0)

    expect(
      (await authDb.createUser("_email", "password")).email
    ).toBe('_email')

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
      await authDb.verifyPassword('_email_no_match', 'password')
    } catch (e) {
      expect(e.message).toBe("User not found")
    }

    expect(
      await authDb.verifyPassword('_email', 'password')
    ).toBe(true)

    expect(
      (authDb.getUser('_email')).email
    ).toBe('_email')

    console.log(
      await authDb.updatePassword('_email', 'newPassword')
    )

    await authDb.deleteUser('_email')
    expect(
      authDb.listUsers().length
    ).toBe(0)
  });
});
