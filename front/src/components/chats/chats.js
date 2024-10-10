import React, { useContext, useEffect, useState } from "react";
import Navbar from "../navbar";
import "../../assets/css/chatsCss/chat.css";
import ChatContainer from "./chatContainer";
//import pfp from "../../assets/images/createProfile.jpg";
import axios from "axios";
import Loader from "../loader";
import { UserContext } from "../../App";

function Chats() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  //const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatView, setChatView] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("fetchProfile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setUsers(res.data.profile);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLastMessages = async () => {
      setLoading(true);
      const lastMessages = [];

      for (const user of users) {
        try {
          const res = await axios.get(
            `fetchLastChatForUser?recipientId=${user.postedBy}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.data.success) {
            lastMessages.push({
              user,
              lastMessage: res.data.lastChat
                ? res.data.lastChat.message
                : "No messages yet",
            });
          }
        } catch (error) {
          console.log("Error fetching last chat:", error);
        }
        setChatView(lastMessages);
        console.log(lastMessages);
        setLoading(false);
      }
    };
    fetchLastMessages();
  }, [users]);

  // useEffect(() => {
  //   const fetchLastMessages = async () => {
  //     // Only fetch if the window is active
  //     if (document.visibilityState === "visible") {
  //       // Fetch your data here
  //     }
  //   };

  //   const intervalId = setInterval(fetchLastMessages, 3000);

  //   // Clean up on component unmount or visibility change
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "hidden") {
  //       clearInterval(intervalId);
  //     } else {
  //       fetchLastMessages(); // Trigger fetch if the user comes back
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     clearInterval(intervalId);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [users]);

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div className="chats-container">
        <div className="chat-div">
          {loading && <Loader />}
          <h2>Chats</h2>
          <input type="text" placeholder="Search..." className="search-bar" />
          <br />
          <br />
          <div>
            {chatView.map(({ user, lastMessage }) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedReceiver(user);
                  setSelectedReceiverId(user.postedBy);
                }}
                className={`chat-item ${
                  selectedReceiver?._id === user._id ? "active" : ""
                }`}
              >
                <div className="chat-info">
                  <img
                    src={user.profileImage}
                    alt="avatar"
                    className="chat-pfp"
                  />
                  <div className="chat-details">
                    <p className="chat-username">@{user.username}</p>
                    <p className="chat-name">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="chat-preview">{lastMessage}</p>
                  </div>
                </div>
                <div className="chat-time">{time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-page">
          {selectedReceiver ? (
            <>
              <div className="chats-header">
                <img
                  src={selectedReceiver.profileImage}
                  alt="pfp"
                  className="pfp"
                />
                <div className="profile-info">
                  <span className="username">
                    {selectedReceiver.firstname} {selectedReceiver.lastname}
                  </span>
                  <span className="username">@{selectedReceiver.username}</span>
                  <span className="time">{time}</span>
                </div>
              </div>
              <ChatContainer selectedReceiverId={selectedReceiverId} />
            </>
          ) : (
            <p style={{ textAlign: "center" }}>
              Select a user to start chatting
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Chats;
