import React, { useState } from "react";
import "../../assets/css/chatsCss/inputText.css";

function InputText({ addMessage }) {
  const [value, setValue] = useState("");

  const sendMessage = () => {
    if (value.trim()) {
      addMessage(value);
      setValue("");
    }
  };

  return (
    <>
      <hr cols="6" /> <br />
      <div className="inputtext-container">
        <textarea
          name="message"
          rows="6"
          placeholder="Message..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
}

export default InputText;
