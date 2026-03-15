// In-memory "database" for demo purposes
const users = [];

module.exports = {
  findByEmail: (email) => users.find(user => user.email === email),
  create: (user) => users.push(user),
};

