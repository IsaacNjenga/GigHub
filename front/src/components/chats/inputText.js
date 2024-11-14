import React, { useState } from "react";
import "../../assets/css/chatsCss/inputText.css";
import sendIcon from "../../assets/icons/paper-plane.png";
function InputText({ addMessage }) {
  const [value, setValue] = useState("");

  const sendMessage = () => {
    if (value.trim()) {
      addMessage(value);
      setValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  return (
    <>
      <div className="inputtext-container">
        <textarea
          name="message"
          rows="15"
          placeholder="Type a message"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
        />
        <button onClick={sendMessage}>
          <img src={sendIcon} alt="sendIcon" className="send-icon" />
        </button>
      </div>
    </>
  );
}

export default InputText;
