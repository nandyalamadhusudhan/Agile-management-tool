import React from "react";
import { useNavigate} from "react-router-dom";
import {
  FaSearch,
  FaBell,
} from "react-icons/fa";
import "../navbar.css";
function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="logo">
        CollabSpace
      </div>
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
        <li onClick={() => navigate("/mainpage/chat")}>
          Chat
        </li>
      </ul>
      <div className="right-section">
        <FaBell className="nav-icon" />
        <button
          className="video-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
export default Navbar;