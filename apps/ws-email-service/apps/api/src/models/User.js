// In-memory "database" for demo purposes
const users = [{email: 'test@mail.com', password: 'password123'}];

module.exports = {
  findByEmail: (email) => users.find(user => user.email === email),
  create: (user) => users.push(user),
};

