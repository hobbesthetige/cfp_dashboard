import { extractToken, verifyToken } from "../utils/authHelpers.mjs";

async function validateRequest(req, res) {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return null;
  }
  try {
    const decodedToken = await verifyToken(token);
    return decodedToken;
  } catch (err) {
    res.status(401).json({ message: err.message });
    return null;
  }
}

export { validateRequest };
