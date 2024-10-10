import React, { useState, useEffect, useContext, useCallback } from "react";
import "../../assets/css/chatsCss/chatContainer.css";
import InputText from "./inputText";
import ChatLists from "./chatLists";
import axios from "axios";
import { UserContext } from "../../App";
import Login from "../../pages/login";
import pfp from "../../assets/images/createProfile.jpg";
import Chats from "./chats";

function ChatContainer({ selectedReceiverId }) {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);
  let [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const time = currentDateTime.toLocaleTimeString("en-Us", {
    timeStyle: "short",
    hour12: false,
  });

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const profileDetails = response.data.profile.find(
        (profile) => profile.postedBy === user._id
      );
      setProfileData({
        firstname: profileDetails.firstname,
        lastname: profileDetails.lastname,
        profileImage: profileDetails.profileImage,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    if (!selectedReceiverId) return;
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `fetchChats?recipientId=${selectedReceiverId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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
    const intervalId = setInterval(fetchChats, 3000); //updates every 5 seconds
    return () => clearInterval(intervalId); // Then clean up on unmount
  }, [selectedReceiverId]);

  const addMessage = async (chat) => {
    const newChat = {
      username: user.username,
      message: chat,
      //avatar: profileData.profileImage,
      senderId: user._id,
      receiverId: selectedReceiverId,
    };
    setLoading(true);
    try {
      const res = await axios.post("createChat", newChat, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setLoading(false);
        setChats((prevChats) => [...prevChats, res.data.result]);
        //setChats((prevChats) => [...prevChats, newChat]);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      {user ? (
        <div className="home">
          <ChatLists chats={chats} />
          <InputText addMessage={addMessage} />
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default ChatContainer;
