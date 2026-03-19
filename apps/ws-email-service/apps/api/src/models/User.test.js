const User = require('./User');
//const AuthDb = require('../libs/authDb');

const path = require('path');

//const authDb = new AuthDb(path.join(__dirname, '../../data/authDb.test.json'));

test('test Users model', async () => {
  console.log(
    User.listUser(),
    await User.createUser('email1', 'password1'),
  )
  //authDb.resetDb()
  //expect(authDb.listUsers().length).toBe(0);
});
