import ChatModel from "../models/Chats.js";

const createChat = async (req, res) => {
  const { username, message } = req.body;
  try {
    const newChat = new ChatModel({
      username,
      message,
    });
    const result = await newChat.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.log("Error saving chat", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({});
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.log("Error fetching chats", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateChat = async (req, res) => {};

const deleteChat = async (req, res) => {};

export { createChat, fetchChats, updateChat, deleteChat };
