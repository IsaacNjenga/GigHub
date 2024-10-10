import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    username: { type: String },
    receiverName: { type: String },
    message: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiverId: { type: String },
   // avatar: { type: String },
  },
  { collection: "chats", timestamps: true }
);

const ChatModel = mongoose.model("chats", chatSchema);
export default ChatModel;
