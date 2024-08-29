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
import eventRoutes from "./routes/events.mjs";
import exportRoutes from "./routes/export.mjs";
import pdfRoutes from "./routes/generatedPdfs.mjs";
import deviceBackupRoutes from "./routes/deviceBackup.mjs";

const app = express();
const port = process.env.PORT;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Client origin
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
app.use("/api", eventRoutes);
app.use("/api", pacePlanRoutes);
app.use("/api", equipmentRoutes);
app.use("/api", equipmentGroupRoutes);
app.use("/api", personnelRoutes);
app.use("/api", phonebookRoutes);
app.use("/api", exportRoutes);
app.use("/api", pdfRoutes);
app.use("/api", deviceBackupRoutes);

// Global Error Handler
app.use((err, req, res, next) => { // Include all four parameters
  if (err) {
    console.error('Error:', err.stack || err.message || err); // Log the stack, message, or the error object itself
    res.status(500).send("Something broke me!");
  } else {
    next(); // If there's no error, call the next middleware
  }
});

// Handle 404 errors (Invalid Routes)
app.use((req, res, next) => {
  res.status(404).json({
      error: 'Not Found',
      message: `The requested resource ${req.originalUrl} was not found on this server.`,
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Add default users
(async () => {
  await addUser("admin", "admin");
})();
