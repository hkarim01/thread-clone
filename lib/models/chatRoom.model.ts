import mongoose, { mongo } from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
