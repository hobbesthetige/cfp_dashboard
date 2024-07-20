// import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import pkg from "body-parser";
const { json } = pkg;
import { createServer } from "http";
import cors from "cors";
import authRoutes from "./routes/auth.mjs";
import pacePlanRoutes from "./routes/pacePlan.mjs";
import personnelRoutes from "./routes/personnel.mjs";
import { addUser } from "./utils/userHelpers.mjs";
import { verifyToken } from "./utils/authHelpers.mjs"; // Ensure you import verifyToken
import { setupSockets } from "./sockets/socketNamespaces.mjs";
import equipmentGroupRoutes from "./routes/equipmentGroups.mjs";
import equipmentRoutes from "./routes/equipment.mjs";
import phonebookRoutes from "./routes/phonebook.mjs";

const app = express();
const port = process.env.PORT || 3001;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Client origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

// Middleware
app.use(json());
app.use(cors());

// Socket.IO integration with JWT authentication
io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  try {
    const decoded = await verifyToken(token);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

setupSockets(io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", pacePlanRoutes);
app.use("/api", equipmentRoutes);
app.use("/api", equipmentGroupRoutes);
app.use("/api", personnelRoutes);
app.use("/api", phonebookRoutes);

// Global Error Handler (if you have one)
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Add default users
(async () => {
  await addUser("admin", "admin");
})();
