import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import "../../assets/css/chatsCss/chat.css";
import ChatContainer from "./chatContainer";
//import pfp from "../../assets/images/createProfile.jpg";
import axios from "axios";

function Chats() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [selectedReceiver, setSelectedReceiver] = useState(null);

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
      try {
        const res = await axios.get("fetchProfile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setUsers(res.data.profile);
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="chats-container">
        <div className="chat-div">
          <h2>Chats</h2>
          <input type="text" placeholder="Search..." className="search-bar" />
          <br />
          <br />
          <div>
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedReceiver(user);
                  setSelectedReceiverId(user.postedBy);
                }} // Store the full user object
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
                    <p className="chat-username">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="chat-preview">
                      This is a preview of the chat...
                    </p>
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
            <p>Select a user to start chatting</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Chats;
