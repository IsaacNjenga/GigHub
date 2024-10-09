import ChatModel from "../models/Chats.js";

const createChat = async (req, res) => {
  const { username, message, receiverId, avatar, receiverName } = req.body;
  try {
    const newChat = new ChatModel({
      username,
      message,
      senderId: req.user._id,
      avatar,
      receiverName,
      receiverId,
    });
    const result = await newChat.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.log("Error saving chat", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchChats = async (req, res) => {
  const { recipientId } = req.query; // Get the recipient ID from the request query
  const senderId = req.user._id; // Current logged-in user

  try {
    // Fetch messages where the sender is the current user and the recipient is the other user or vice versa
    const chats = await ChatModel.find({
      $or: [
        { senderId: senderId, receiverId: recipientId },
        { senderId: recipientId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.log("Error fetching chats", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateChat = async (req, res) => {};

const deleteChat = async (req, res) => {};

export { createChat, fetchChats, updateChat, deleteChat };

/*try {
    const chats = await ChatModel.find({});
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.log("Error fetching chats", error);
    return res.status(500).json({ error: error.message });
  } */
