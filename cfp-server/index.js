require("dotenv").config();
const express = require("express");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const pacePlanRoutes = require("./routes/pacePlan");
const { addUser } = require("./utils/userHelpers");
const { verifyToken } = require("./utils/authHelpers"); // Ensure you import verifyToken
const pacePlanSocket = require("./sockets/pacePlan");

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Client origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

// Middleware
app.use(bodyParser.json());
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

pacePlanSocket(io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", pacePlanRoutes);

// Global Error Handler (if you have one)
app.use((err, req, res, next) => {
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
