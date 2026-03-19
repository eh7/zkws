// In-memory "database" for demo purposes
const users = [{email: 'test@mail.com', password: 'password123'}];

const isRunningInJest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;

if (isRunningInJest) {
}

// persitant filesystem json db
const AuthDb = require('../libs/authDb');
const authDb = new AuthDb(isRunningInJest ? '/tmp/authDb.test.json' : '');

module.exports = {
  findByEmail: (email) => users.find(user => user.email === email),
  create: (user) => users.push(user),

  authDb: () => console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', authDb),
  listUser: () => console.log('xxxxxxxxxxxxssssssssssssssss', authDb.listUsers()), 
  createUser: async (email, password) => {
    const newUser = await authDb.createUser(
      email,
      password,
    )
    return newUser
  },
//  createUser: (email, password) => User.createUser(email, password), 
};

