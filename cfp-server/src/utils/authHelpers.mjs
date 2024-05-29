import pkg from "jsonwebtoken";
const { verify, sign } = pkg;
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  return authHeader.split(" ")[1];
}

export { sign, bcrypt, SECRET_KEY, verifyToken, extractToken };
