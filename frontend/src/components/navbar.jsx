import  { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaTimes } from "react-icons/fa";
import "../navbar.css";
import {socket} from "../socket";
import axios from "axios";
function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef(new Audio("../notification.mp3"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
const fetchNotifications = async () => {
  try {
    const token =localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/workspace/invitations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNotifications(res.data);
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {

  socket.on("workspace-invited", (data) => {
    if(audioRef.current){
      audioRef.current.play().catch(()=>{});
    }
    setNotifications((prev)=>[
      data,
      ...prev
    ]);
    setUnreadCount((prev)=>prev+1);
  });

  // ADD THIS
  socket.on("workspace-deleted",(data)=>{
    if(audioRef.current){
      audioRef.current.play().catch(()=>{});
    }
   console.log("DELETE EVENT RECEIVED:", data);
    setNotifications((prev)=>[
      {
        _id: Date.now(),
        type:"delete",
        message:data.message
      },
      ...prev
    ]);
    setUnreadCount((prev)=>prev+1);
  });
  return ()=>{
    socket.off("workspace-invited");
    socket.off("workspace-deleted");
  };

},[]);
const acceptInvite = async (invitationId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/workspace/accept",
      { invitationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNotifications((prev) =>
      prev.filter(
        (n) => n._id !== invitationId
      )
    );
    alert(
      "Successfully joined workspace"
    );
  } catch (err) {
    console.error(err);
    alert("Failed to accept invitation");
  }
};

const rejectInvite = async (invitationId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/workspace/reject",
      { invitationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNotifications((prev) =>
      prev.filter(
        (n) => n._id !== invitationId
      )
    );
    alert("Invitation rejected");
  } catch (err) {
    console.error(err);
    alert("Failed to reject invitation");
  }
};
 return (
<>
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
  </ul>
  {/* Notification Bell */}

  <div
    className="notification-wrapper"
    onClick={() => {
      setShowNotifications(!showNotifications);

      if (!showNotifications) {
        setUnreadCount(0);
      }
    }}
  >
    <FaBell className="nav-icon" />
    {unreadCount > 0 && (
      <span className="notification-badge">
        {unreadCount}
      </span>
    )}

  </div>

  {/* Logout */}

  <div className="right-section">
    <button
      className="video-btn"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>


</nav>




{/* Notification sidebar */}

<div
 className={`notification-sidebar ${
   showNotifications ? "open" : ""
 }`}
>
<div className="notification-header">
<h3>
 Notifications
</h3>
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
    key={n._id}
    className="notification-item"
  >
    {n.type === "delete" ? (
      <>
        <p>
          🗑️ <strong>{n.message}</strong>
        </p>

        <div className="notification-actions">
          <button
            className="accept-btn"
            onClick={() =>
              setNotifications((prev) =>
                prev.filter(
                  (item) => item._id !== n._id
                )
              )
            }
          >
            OK
          </button>
        </div>
      </>
    ) : (
      <>
        <p>
          <strong>{n.sender?.name}</strong>
          {" invited you to "}
          <strong>
            {n.workspace?.name || n.workspaceName}
          </strong>
          {" workspace"}
        </p>
        <div className="notification-actions">
          <button
            className="accept-btn"
            onClick={() => acceptInvite(n._id)}
          >
            Accept
          </button>
          <button
            className="reject-btn"
            onClick={() => rejectInvite(n._id)}
          >
            Reject
          </button>
        </div>
      </>
    )}
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