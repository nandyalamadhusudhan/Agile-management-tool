import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState({
    name: "Profile",
    avatar: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      setUser({
        name: decoded.name || "Profile",
        avatar: decoded.avatar || ""
      });
    }
  }, []);

  return (
    <div className="maincontainer">

      <div className={open ? "sidebarcon active" : "sidebarcon"}>

        <div className="child1">
          <button onClick={() => setOpen(!open)}>
            ☰
          </button>

          {!open && <h1>Menu</h1>}
          {open && <h1>Collab Space</h1>}
        </div>

        {open && (
          <>
            <div className="child2">
              <h2>Dashboard</h2>
            </div>

            <div className="child3">
              <h3>Workspace</h3>

              <div className="child3-1">
                <ul>
                  <li>Projects</li>
                  <li>Tasks</li>
                  <li>Calendar</li>
                  <li>Files</li>
                  <li>Team Members</li>
                </ul>
              </div>
            </div>

            <div className="child4">
              <h3>Communication</h3>

              <div className="child4-1">
                <ul>
                  <li>Chat</li>
                  <li>Channels</li>
                </ul>
              </div>
            </div>

            <div className="child5">
              <h3>Settings</h3>

              <div className="child5-1">
                <ul>
                  <li>Settings</li>
                  <li>Help & Support</li>
                </ul>
              </div>
            </div>

            {/* Profile Section */}
            <div className="child6">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="avatar"
                />
              ) : (
                <button className="probtn">
                  {user.name.charAt(0).toUpperCase()}
                </button>
              )}

              <div className="child6-1">
                <h3>{user.name}</h3>
                <p>Member</p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Sidebar;