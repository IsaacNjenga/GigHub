import React, { useContext, useEffect, useState } from "react";
import Navbar from "../navbar";
import "../../assets/css/chatsCss/chat.css";
import ChatContainer from "./chatContainer";
import defaultPfp from "../../assets/images/defaultProfilePic.png";
import axios from "axios";
import { format, differenceInDays, isToday, isYesterday } from "date-fns";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import Loader from "../loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../App";

function Chats() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
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
          const otherUsers = res.data.profile.filter(
            (userProfile) => userProfile.postedBy !== user._id
          );
          const thisUser = res.data.profile.filter(
            (userProfile) => userProfile.postedBy === user._id
          );
          setUsers(otherUsers);
          setCurrentUser(thisUser);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

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
            lastMessage: res.data.lastChat ? res.data.lastChat.message : "",
            lastMessageTime: res.data.lastChat?.createdAt,
            isRead: res.data.lastChat?.isRead || false,
          });
        }
      } catch (error) {
        console.log("Error fetching last chat:", error);
      }
      lastMessages.sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      setChatView(lastMessages);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastMessages();
  }, [users]);

  const handleNewMessage = () => {
    fetchLastMessages();
  };

  const getFormattedTime = (lastMessageTime) => {
    if (!lastMessageTime) return "";

    const messageTime = new Date(lastMessageTime);
    if (isNaN(messageTime.getTime())) {
      return "";
    }
    const now = new Date();
    const diffInDays = differenceInDays(now, messageTime);

    if (isToday(messageTime)) {
      return format(messageTime, "HH:mm"); // If it's today, display time in "HH:mm"
    } else if (isYesterday(messageTime)) {
      return "Yesterday"; // If it was yesterday
    } else if (diffInDays < 7) {
      return format(messageTime, "EEEE"); // Day of the week (e.g., Monday)
    } else {
      // If it's more than a week ago, show the date in "dd/MM/yyyy"
      return format(messageTime, "dd/MM/yyyy");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="chats-page-background">
        <Navbar />
        <div className="chats-container">
          <div className="chat-div">
            {loading && <Loader />}
            {currentUser.map((liveUser) => (
              <div key={liveUser._id} className="chat-info">
                <img
                  src={
                    liveUser.profileImage ? liveUser.profileImage : defaultPfp
                  }
                  alt=""
                  className="chat-pfp"
                />
                <div className="chat-details">
                  <p className="chat-username">
                    <u>@{user.username}</u>
                  </p>
                  <p className="chat-name">
                    {liveUser.firstname} {liveUser.lastname}
                  </p>
                </div>
              </div>
            ))}
            <h2>Chats</h2>
            <input type="text" placeholder="Search..." className="search-bar" />
            <br />
            <br />
            <div>
              {chatView.map(
                ({ user, lastMessage, lastMessageTime, isRead }) => (
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
                        src={user.profileImage ? user.profileImage : defaultPfp}
                        alt=""
                        className="chat-pfp"
                      />
                      <div className="chat-details">
                        <p className="chat-username">
                          <u>@{user.username}</u>
                        </p>
                        <p className="chat-name">
                          {user.firstname} {user.lastname}
                        </p>
                        <div className="message-details">
                          {isRead ? (
                            <FontAwesomeIcon
                              icon={faCheckDouble}
                              className="circle-read"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="circle-unread"
                            />
                          )}{" "}
                          <p className="chat-preview">{lastMessage}</p>
                        </div>
                      </div>
                    </div>
                    {lastMessageTime ? (
                      <div className="chat-time">
                        {getFormattedTime(lastMessageTime)}
                      </div>
                    ) : null}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="chat-page">
            {selectedReceiver ? (
              <>
                <div className="chats-header">
                  <img
                    src={
                      selectedReceiver.profileImage
                        ? selectedReceiver.profileImage
                        : defaultPfp
                    }
                    alt="pfp"
                    className="pfp"
                  />
                  <div className="profile-info">
                    <span className="username">
                      {selectedReceiver.firstname} {selectedReceiver.lastname}
                    </span>
                    <span className="username">
                      @{selectedReceiver.username}
                    </span>
                    <span className="time">{selectedReceiver.role}</span>
                  </div>
                </div>
                <ChatContainer
                  selectedReceiverId={selectedReceiverId}
                  onNewMessage={handleNewMessage}
                />
              </>
            ) : (
              <p style={{ textAlign: "center" }}>
                Select a user to start chatting
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;
