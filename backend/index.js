const express = require("express");
const cors = require("cors");
const { PORT } = require("./config");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const { Message } = require("./db");

const mainRouter = require("./routes/index");

const app = express();
app.use(cors()); // enable CORS
app.use(express.json()); // body parser

const server = http.createServer(app); // Wrap Express

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React URL
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    // Decode the token to get the userId
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId; // Attach the ID to the socket object
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

const userSockets = new Map();

io.on("connection", (socket) => {
  // Get userId from the frontend handshake
  const userId = socket.userId;

  if (userId) {
    userSockets.set(userId, socket.id);
  }

  // Handle sending a message
  socket.on("send-message", async (data) => {
    try {
      const { receiverId, content, type } = data;
      const receiverSocketId = userSockets.get(receiverId);

      const savedMessage = await Message.create({
        senderId: userId,
        receiverId: receiverId,
        type: "TEXT",
        content: content,
        timestamp: new Date(),
      });

      if (receiverSocketId) {
        // Push to receiver
        io.to(receiverSocketId).emit("receive-message", savedMessage);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      // Optional: notify the sender that the message failed to save
      socket.emit("error", { message: "Message could not be sent" });
    }
  });

  socket.on("disconnect", () => {
    userSockets.delete(userId);
    console.log(`User ${userId} disconnected.`);
  });
});

app.use("/api/v1", mainRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
