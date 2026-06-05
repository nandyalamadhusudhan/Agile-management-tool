import React from "react";
import {
  FaSearch,
  FaBell,
} from "react-icons/fa";

import "../navbar.css";

function Navbar({ setpage, setisloggedin }) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    setisloggedin(false);
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

        <li onClick={() => setpage("dashboard")}>
          Dashboard
        </li>

        <li onClick={() => setpage("workspace")}>
          Workspace
        </li>

        <li onClick={() => setpage("teams")}>
          Teams
        </li>

        <li onClick={() => setpage("chat")}>
          Chat
        </li>

        <li onClick={() => setpage("Projects")}>
          Projects
        </li>

      </ul>

      <div className="right-section">

        <button className="video-btn">
          + New Project
        </button>

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