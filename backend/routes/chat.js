import express from "express";
import mongoose from "mongoose";
import Message from "../models/MessageModel.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for documents
  fileFilter: (req, file, cb) => {
    // Allow images, videos, and documents
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|webm|mov|avi|mkv/;
    const allowedDocTypes = /pdf|doc|docx|txt|rtf|odt|xls|xlsx|ppt|pptx|zip|rar|7z/;
    
    const extname = path.extname(file.originalname).toLowerCase();
    const isImage = allowedImageTypes.test(extname) && file.mimetype.startsWith('image/');
    const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');
    const isDocument = allowedDocTypes.test(extname) || 
                      file.mimetype.includes('application/pdf') ||
                      file.mimetype.includes('application/msword') ||
                      file.mimetype.includes('application/vnd.openxmlformats-officedocument') ||
                      file.mimetype.includes('text/') ||
                      file.mimetype.includes('application/zip') ||
                      file.mimetype.includes('application/x-rar-compressed');
    
    if (isImage || isVideo || isDocument) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, videos, and documents are allowed!'));
    }
  }
});

// Get chat messages between two users
router.get("/messages/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();
    
    // Create chatId by sorting user IDs
    const chatId = [currentUserId, userId].sort().join('_');
    
    const messages = await Message.find({ chatId })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Get all chats for current user
router.get("/chats", auth, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    
    // Get all unique chatIds for this user
    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUserId) },
            { receiver: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        $group: {
          _id: "$chatId",
          lastMessage: { $last: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$sender", new mongoose.Types.ObjectId(currentUserId)] },
                    { $eq: ["$read", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);
    
    // Populate user info for each chat
    for (let chat of chats) {
      const message = await Message.findById(chat.lastMessage._id)
        .populate('sender', 'name email')
        .populate('receiver', 'name email');
      chat.lastMessage = message;
    }
    
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Search users by username/email
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    }).select('name email');
    
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// Upload file
router.post("/upload", auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size
    };
    
    res.json(fileInfo);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

export default router;
