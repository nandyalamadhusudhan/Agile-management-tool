import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../dashboard.css";

function Dashboard() {
  const [username, setUsername] = useState("");

  const [stats, setStats] = useState({
    workspaces: 0,
    boards: 0,
    users: 0,
    cards: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.name);
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard">

      {/* Welcome */}
      <div className="welcome-card">
        <h1>Hello, {username} 👋</h1>
        <p>
          Welcome back to CollabSpace. Here's your project overview.
        </p>
      </div>

      {/* Statistics */}
      <div className="cards">

        <div className="card">
          <h2>{stats.workspaces}</h2>
          <p>Workspaces</p>
        </div>

        <div className="card">
          <h2>{stats.boards}</h2>
          <p>Boards</p>
        </div>

        <div className="card">
          <h2>{stats.users}</h2>
          <p>Team Members</p>
        </div>

        <div className="card">
          <h2>{stats.cards}</h2>
          <p>Tasks</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2>Quick Actions</h2>

        <div className="quick-actions">
          <button>Create Workspace</button>
          <button>Create Board</button>
          <button>Add Task</button>
          <button>Invite Member</button>
        </div>
      </div>

      {/* Task Overview */}
      <div className="section">
        <h2>Task Overview</h2>

        <div className="task-overview">

          <div className="status-card">
            <h3>12</h3>
            <p>Pending</p>
          </div>

          <div className="status-card">
            <h3>8</h3>
            <p>In Progress</p>
          </div>

          <div className="status-card">
            <h3>25</h3>
            <p>Completed</p>
          </div>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-card">
        <h2>Recent Activity</h2>

        <ul>
          <li>✅ New task created</li>
          <li>📁 Workspace updated</li>
          <li>👤 Member joined team</li>
          <li>📌 New board created</li>
        </ul>
      </div>

    </div>
  );
}

export default Dashboard;