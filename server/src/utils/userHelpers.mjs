import bcrypt from "bcryptjs";

const users = [];

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function addUser(username, password) {
  const hashedPassword = await hashPassword(password);
  users.push({ username, hashedPassword });
}

export { addUser, hashPassword, users };
