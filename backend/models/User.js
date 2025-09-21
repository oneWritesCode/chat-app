// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  mobile: { type: String, unique: true, required: true, sparse: true }, // allow null but unique when present
  password: { type: String }, // hashed; null for OAuth users
  avatar: { type: String }, // profile picture URL
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
