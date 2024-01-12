import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;
