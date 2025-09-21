// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true }, // e.g. sorted concat of user ids "user1_user2"
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String },
  attachments: [
    {
      filename: String,
      url: String,
      mimeType: String,
      size: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

messageSchema.index({ chatId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
