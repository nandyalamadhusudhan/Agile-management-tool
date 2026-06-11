import React, { useState } from "react";
import "../chat.css";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "System",
      text: "Welcome to Team Chat",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: "You",
      text: message,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <h1>Team Chat</h1>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;