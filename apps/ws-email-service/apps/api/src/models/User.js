// In-memory "database" for demo purposes
const users = [{email: 'test@mail.com', password: 'password123'}];

//const isRunningInJest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;

//if (isRunningInJest) {
//}

// persitant filesystem json db
const AuthDb = require('../libs/authDb');
//const authDb = new AuthDb(isRunningInJest ? '/tmp/authDb.test.json' : '');
const authDb = new AuthDb();

module.exports = {
  findByEmail: (email) => users.find(user => user.email === email),
  create: (user) => users.push(user),

  authDb: () => authDb,
  listUser: () => authDb.listUsers(), 
  resetDb: () => authDb.resetDb(),
  createUser: async (email, password) => {
    const newUser = await authDb.createUser(
      email,
      password,
    )
    return newUser
  },
  getUser: (email) => {
    return authDb.getUser(email)
  },
  verifyPassword: async (email, password)  => {
    return await authDb.verifyPassword(email, password)
  },
  deleteUser: (email) => {
    return authDb.deleteUser(email)
  },
  updatePassword: async (email, newPassword) => {
    return authDb.updatePassword(email, newPassword)
  },
//  createUser: (email, password) => User.createUser(email, password), 
};

