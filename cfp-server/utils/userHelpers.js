const { bcrypt } = require('./authHelpers');

const users = [];

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function addUser(username, password) {
  const hashedPassword = await hashPassword(password);
  users.push({ username, hashedPassword });
}

module.exports = { addUser, hashPassword, users };