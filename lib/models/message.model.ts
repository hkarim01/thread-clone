import mongoose from "mongoose";

const StatusEnum = {
  values: ["unread", "read"],
  message: "`{VALUE}` is an invalid value for `{PATH}`",
};

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  status: { type: String, enum: StatusEnum, default: "unread" },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
