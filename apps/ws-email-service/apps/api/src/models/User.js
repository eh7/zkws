// In-memory "database" for demo purposes
const users = [{email: 'test@mail.com', password: 'password123'}];

// persitant filesystem json db
const AuthDb = require('../libs/authDb');
const authDb = new AuthDb();

module.exports = {
  findByEmail: (email) => users.find(user => user.email === email),
  create: (user) => users.push(user),
  authDb: () => console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', authDb),
  listUser: () => User.listUser(), 
  createUser: (email, password) => User.createUser(email, password), 
};

