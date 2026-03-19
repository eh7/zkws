const User = require('./User');
//const AuthDb = require('../libs/authDb');

const path = require('path');

//const authDb = new AuthDb(path.join(__dirname, '../../data/authDb.test.json'));

test('test Users model', async () => {
  expect(
    User.resetDb()
  ).toBe(true);

  expect(
    User.listUser()
  ).toStrictEqual([]);

  expect(
    (await User.createUser('email1', 'password1')).email,
  ).toBe('email1');

  expect(
    (User.getUser('email1')).email,
  ).toBe('email1');

  expect(
    await User.verifyPassword('email1', 'password1'),
  ).toBe(true);

  expect(
    (await User.updatePassword('email1', 'password2')).message,
  ).toBe("Password updated");

  expect(
    (User.deleteUser('email1')).email,
  ).toBe('email1');

  expect(
    User.listUser()
  ).toStrictEqual([]);

  try {
    await User.verifyPassword('___email1', 'password1')
  } catch (e) {
    expect(e.message).toBe('User not found');
  }
});
