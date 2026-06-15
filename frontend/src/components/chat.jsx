import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {socket} from "../socket";
import "../chat.css";

function Chat() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const payload = JSON.parse(
    atob(token.split(".")[1])
  );

  const username = payload.name;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinWorkspace", {
      workspaceId,
      token,
    });

    console.log(`${username} joined workspace ${workspaceId}`);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [workspaceId, token]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      workspaceId,
      text: message,
    });

    setMessage("");
  };

  return (
    <div className="chat-container slide-in">
      <div className="chat-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2>Workspace Chat</h2>

        <span>{username}</span>
      </div>

      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="empty-chat">
            No messages yet...
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === username
                  ? "message-row right"
                  : "message-row left"
              }
            >
              <div
                className={
                  msg.sender === username
                    ? "message-bubble my-message"
                    : "message-bubble other-message"
                }
              >
                <div className="sender">
                  {msg.sender}
                </div>

                <div className="text">
                  {msg.text}
                </div>

                <div className="time">
                  {new Date(
                    msg.timestamp
                  ).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className="send-btn"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;