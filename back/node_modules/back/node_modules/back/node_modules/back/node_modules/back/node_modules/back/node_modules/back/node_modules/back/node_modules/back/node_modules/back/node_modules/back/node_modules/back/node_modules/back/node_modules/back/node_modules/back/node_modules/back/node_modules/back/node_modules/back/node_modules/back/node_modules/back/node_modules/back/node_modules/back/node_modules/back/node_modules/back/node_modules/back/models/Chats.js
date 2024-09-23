import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    username: { type: String },
    message: { type: String },
    //senderId: { type: String },
    //receiverId: { type: String },
  },
  { collection: "chats", timestamps: true }
);

const ChatModel = mongoose.model("chats", chatSchema);
export default ChatModel;
