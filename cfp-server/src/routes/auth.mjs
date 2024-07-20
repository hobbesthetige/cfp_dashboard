import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import { addUser, users } from "../utils/userHelpers.mjs";
import { sign, SECRET_KEY, bcrypt } from "../utils/authHelpers.mjs";

const router = express.Router();

// Validate token endpoint
router.get("/validate", async (req, res) => {
  const token = await validateRequest(req, res);
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  res.status(200).json({ message: "Token is valid", token: token });
});

// Registration endpoint
router.post("/register", async (req, res) => {
  const token = await validateRequest(req, res);
  if (!token) {
    return;
  }
  await addUser(req.body.username, req.body.password);
  res.status(201).json({ message: "User registered successfully" });
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !user.hashedPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = sign({ username: user.username }, SECRET_KEY, {
    expiresIn: "8h",
  });
  res.status(200).json({ message: "Logged in successfully", token: token });
});

export default router;
