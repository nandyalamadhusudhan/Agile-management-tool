import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaTimes } from "react-icons/fa";
import "../navbar.css";
import {socket} from "../socket";
import axios from "axios";
function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
  socket.on("workspace-invited", (data) => {
    setNotifications((prev) => [
      data,
      ...prev,
    ]);
  });
  return () => {
    socket.off("workspace-invited");
  };
}, []);
const acceptInvite = async (invitationId) => {
  const token =
    localStorage.getItem("token");
  await axios.post(
    "http://localhost:5000/workspace/accept",
    { invitationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  alert("Succefully you in Joined workspace,Enjoy the workspace");
};
const rejectInvite = async (invitationId) => {
  const token =
    localStorage.getItem("token");
  await axios.post(
    "http://localhost:5000/workspace/reject",
    { invitationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("Invitation rejected");
};
  return (
    <>
      <nav className="navbar">
        <div className="logo">CollabSpace</div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search documents, teams..."
          />
        </div>

        <ul className="nav-links">
          <li onClick={() => navigate("/mainpage")}>
            Dashboard
          </li>
          <li onClick={() => navigate("/mainpage/workspace")}>
            Workspace
          </li>
          <li onClick={() => navigate("/mainpage/teams")}>
            Teams
          </li>
        </ul>

        <div className="right-section">
          <FaBell
            className="nav-icon"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
          />

          <button
            className="video-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div
        className={`notification-sidebar ${
          showNotifications ? "open" : ""
        }`}
      >
        <div className="notification-header">
          <h3>Notifications</h3>

          <FaTimes
            className="close-icon"
            onClick={() =>
              setShowNotifications(false)
            }
          />
        </div>

        <div className="notification-list">
 {notifications.map((n) => (
  <div
    key={n.invitationId}
    className="notification-item"
  >
    <p>
      <strong>{n.sender}</strong>
      {" invited you to "}
      <strong>{n.workspaceName}</strong>
    </p>

   <div className="notification-actions">
  <button
    className="accept-btn"
    onClick={() => acceptInvite(n.invitationId)}
  >
    Accept
  </button>

  <button
    className="reject-btn"
    onClick={() => rejectInvite(n.invitationId)}
  >
    Reject
  </button>
</div>
  </div>
))}
</div>
      </div>
      {showNotifications && (
        <div
          className="overlay"
          onClick={() =>
            setShowNotifications(false)
          }
        />
      )}
    </>
  );
}

export default Navbar;