import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/users.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Message from "./models/MessageModel.js";
import { verifySocketToken } from "./middleware/socketAuth.js";

const app = express();
const PORT = process.env.PORT || 5000;
// CORS configuration for production
app.use(  
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// REST endpoints
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

// "mongodb://127.0.0.1:27017/chat-app" ||
const mongodb_connect_url = process.env.MONGO_URI;
console.log("mongouri", mongodb_connect_url);

// DB connect
try {
  await mongoose.connect(mongodb_connect_url);
  console.log("MongoDB connected ✅");
} catch (err) {
  console.error("MongoDB connection error ❌:", err.message);
}


app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/", async (req, res) => {
  res.send("hello sir");
});

// Add /me endpoint for current user
app.get("/api/users/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(401).json({ msg: "Invalid token" });
  }
});

app.post("/api/users", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
});

// create http server & socket
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

// socket auth middleware (verify JWT)
io.use(async (socket, next) => verifySocketToken(socket, next));

// socket events
io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log(`User ${userId} connected`);
  socket.join(userId);

  // Update user online status
  User.findByIdAndUpdate(userId, {
    isOnline: true,
    lastSeen: new Date(),
  }).catch((err) => console.error("Error updating user status:", err));

  socket.on("private_message", async (payload) => {
    try {
      console.log("Received message:", payload);
      const { to, text, attachments } = payload;

      if (!to) {
        socket.emit("error", { message: "Recipient ID is required" });
        return;
      }

      // Create chatId by sorting user IDs
      const chatId = [userId, to].sort().join("_");

      // Create message in DB
      const message = await Message.create({
        chatId,
        sender: userId,
        receiver: to,
        text,
        attachments: attachments || [],
      });

      // Populate sender info
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name username email")
        .populate("receiver", "name username email");

      console.log("Message saved to DB:", populatedMessage);

      // Emit to receiver and sender
      io.to(to).emit("private_message", populatedMessage);
      socket.emit("message_sent", populatedMessage);

      console.log(`Message sent to user ${to} from user ${userId}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date(),
    }).catch((err) => console.error("Error updating user status:", err));
  });
});

httpServer.listen(PORT, () => console.log(`Server on ${PORT}`));
