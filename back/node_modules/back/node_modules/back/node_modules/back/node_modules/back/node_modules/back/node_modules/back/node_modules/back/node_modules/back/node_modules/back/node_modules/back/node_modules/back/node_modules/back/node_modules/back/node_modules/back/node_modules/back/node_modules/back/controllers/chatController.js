import ChatModel from "../models/Chats.js";

const createChat = async (req, res) => {
  const { username, message, receiverId, receiverName } = req.body;
  try {
    const newChat = new ChatModel({
      username,
      message,
      senderId: req.user._id,
      receiverName,
      isRead: false,
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
  const { recipientId } = req.query;
  const senderId = req.user._id;
  try {
    // Fetch messages where the sender is the current user and the recipient is the other user or vice versa
    const chats = await ChatModel.find({
      $or: [
        { senderId: senderId, receiverId: recipientId },
        { senderId: recipientId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    // Mark messages as read for the current user
    await ChatModel.updateMany(
      { receiverId: senderId, senderId: recipientId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.log("Error fetching chats", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchLastChatForUser = async (req, res) => {
  const { recipientId } = req.query;
  const senderId = req.user._id;
  try {
    const lastChat = await ChatModel.find({
      $or: [
        { senderId: senderId, receiverId: recipientId },
        { senderId: recipientId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(1);
    const lastChatMessage = lastChat.length > 0 ? lastChat[0] : null;

    return res.status(200).json({ success: true, lastChat: lastChatMessage });
  } catch (error) {
    console.log("Error fetching last chat", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateChat = async (req, res) => {};

const deleteChat = async (req, res) => {};

export { createChat, fetchChats, updateChat, deleteChat, fetchLastChatForUser };
