import React, { useState, useEffect, useContext } from "react";
import "../../assets/css/chatsCss/chatContainer.css";
import InputText from "./inputText";
import ChatLists from "./chatLists";
import axios from "axios";
import { UserContext } from "../../App";
import Login from "../../pages/login";

function ChatContainer() {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await axios.get("fetchChats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setChats(res.data.chats);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    fetchChats();
    const intervalId = setInterval(fetchChats, 5000); //updates every 5 seconds
    return () => clearInterval(intervalId); // Then clean up on unmount
  }, []);

  const addMessage = async (chat) => {
    const newChat = {
      username: user.username,
      message: chat,
    }; setLoading(true);
    try {
      const res = await axios.post("createChat", newChat, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {setLoading(false);
        setChats((prevChats) => [...prevChats, newChat]);        
      }
    } catch (err) {
        setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <div>
        {user ? (
          <div className="home">
            <div className="chats_header"></div>
            <ChatLists chats={chats} />
            <InputText addMessage={addMessage} />
          </div>
        ) : (
          <Login />
        )}
      </div>
    </>
  );
}

export default ChatContainer;
