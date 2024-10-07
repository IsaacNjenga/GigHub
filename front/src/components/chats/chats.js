import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import "../../assets/css/chatsCss/chat.css";
import ChatContainer from "./chatContainer";
import pfp from "../../assets/images/createProfile.jpg";

function Chats() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  return (
    <>
      <Navbar />
      <div>
        <div className="chats-container">
          <div className="chat-div">
            <h2>Chats</h2>
            <input type="text" placeholder="Search..." className="search-bar" />
            <div className="chat-item">
              <div className="chat-info">
                <img src={pfp} alt="pfp" className="chat-pfp" />
                <div className="chat-details">
                  <p className="chat-username">Username</p>
                  <p className="chat-preview">
                    This is a preview of the chat...
                  </p>
                </div>
              </div>
              <div className="chat-time">{time}</div>
            </div>
            <hr className="my-hr" />{" "}
            <div className="chat-item">
              <div className="chat-info">
                <img src={pfp} alt="pfp" className="chat-pfp" />
                <div className="chat-details">
                  <p className="chat-username">Username</p>
                  <p className="chat-preview">
                    This is a preview of the chat...
                  </p>
                </div>
              </div>
              <div className="chat-time">Yesterday</div>
            </div>
            <hr />{" "}
            <div className="chat-item">
              <div className="chat-info">
                <img src={pfp} alt="pfp" className="chat-pfp" />
                <div className="chat-details">
                  <p className="chat-username">Username</p>
                  <p className="chat-preview">
                    This is a preview of the chat...
                  </p>
                </div>
              </div>
              <div className="chat-time">Monday</div>
            </div>
            <hr />{" "}
            <div className="chat-item">
              <div className="chat-info">
                <img src={pfp} alt="pfp" className="chat-pfp" />
                <div className="chat-details">
                  <p className="chat-username">Username</p>
                  <p className="chat-preview">
                    This is a preview of the chat...
                  </p>
                </div>
              </div>
              <div className="chat-time">Sunday</div>
            </div>
            <hr />{" "}
            <div className="chat-item">
              <div className="chat-info">
                <img src={pfp} alt="pfp" className="chat-pfp" />
                <div className="chat-details">
                  <p className="chat-username">Username</p>
                  <p className="chat-preview">
                    This is a preview of the chat...
                  </p>
                </div>
              </div>
              <div className="chat-time">Saturday</div>
            </div>
            <hr />
          </div>

          <div className="chat-page">
            <ChatContainer />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;
