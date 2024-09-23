import React, { useContext, useEffect, useRef } from "react";
import "../../assets/css/chatsCss/chatLists.css";
import { format } from "date-fns";
import { UserContext } from "../../App";

function ChatLists({ chats }) {
  const { user } = useContext(UserContext);
  const endOfMessages = useRef();

  function ChatMessage({ message, username, createdAt, isSender }) {
    let formattedTime = "Invalid time";
    if (createdAt && !isNaN(new Date(createdAt))) {
      formattedTime = format(new Date(createdAt), "HH:mm");
    }

    return (
      <div className={isSender ? "chat-sender" : "chat-receiver"}>
        <p>
          {/*<p>{username}</p>*/}
          {message}
          <br />
          <span
            style={{
              display: "block", 
              textAlign: "right", 
              fontSize: "11.2px",
            }}
          >
            {formattedTime}
          </span>
        </p>
      </div>
    );
  }

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    endOfMessages.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="chats-lists">
        {chats.map((chat, index) => (
          <ChatMessage
            key={index}
            message={chat.message}
            username={chat.username}
            createdAt={chat.createdAt}
            isSender={chat.username === user.username}
          />
        ))}
        <div ref={endOfMessages}></div>
      </div>
    </div>
  );
}

export default ChatLists;
