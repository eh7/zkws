const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Default path for the database file
const DEFAULT_DB_PATH = path.join(__dirname, 'authDb.json');

// Initialize the database file if it doesn't exist
function initDb(dbPath = DEFAULT_DB_PATH) {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [] }, null, 2));
  }
}

// Read the database file
function readDb(dbPath = DEFAULT_DB_PATH) {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// Write to the database file
function writeDb(data, dbPath = DEFAULT_DB_PATH) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// User model
class AuthDb {
  constructor(dbPath = DEFAULT_DB_PATH) {
    this.dbPath = dbPath;
    initDb(this.dbPath);
  }

  // Create a new user
  async createUser(email, password) {
    const data = readDb(this.dbPath);
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };
    data.users.push(newUser);
    writeDb(data, this.dbPath);
    return newUser;
  }

  // Get a user by email
  getUser(email) {
    const data = readDb(this.dbPath);
    return data.users.find(user => user.email === email);
  }

  // List all users
  listUsers() {
    const data = readDb(this.dbPath);
    return data.users.map(user => ({ email: user.email })); // Omit passwords
  }

  // Update a user's password
  async updatePassword(email, newPassword) {
    const data = readDb(this.dbPath);
    const user = data.users.find(user => user.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    writeDb(data, this.dbPath);
    return { email: user.email, message: 'Password updated' };
  }

  // Delete a user
  deleteUser(email) {
    const data = readDb(this.dbPath);
    const userIndex = data.users.findIndex(user => user.email === email);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    data.users.splice(userIndex, 1);
    writeDb(data, this.dbPath);
    return { email, message: 'User deleted' };
  }

  resetDb() {
    writeDb({users:[]}, this.dbPath);
  }

  // Verify a user's password
  async verifyPassword(email, password) {
    const user = this.getUser(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  }
}

module.exports = AuthDb;

