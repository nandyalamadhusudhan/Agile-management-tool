import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../dashboard.css";
import {socket} from "../socket";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate=useNavigate();
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({
  workspaces: 0,
  boards: 0,
  users: 0,
  cards: 0,
  pending: 0,
  inProgress: 0,
  completed: 0
});
  

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
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.name);
    }
    fetchStats();
  }, []);
  useEffect(() => {
  const handleWorkspaceUpdate = () => {
    fetchStats();
  };

  socket.on("workspace-created", handleWorkspaceUpdate);
  socket.on("workspace-deleted", handleWorkspaceUpdate);
  socket.on("workspaceJoined", handleWorkspaceUpdate);

  return () => {
    socket.off("workspace-created", handleWorkspaceUpdate);
    socket.off("workspace-deleted", handleWorkspaceUpdate);
    socket.off("workspaceJoined", handleWorkspaceUpdate);
  };
}, []);

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
          <button onClick={() => navigate("/mainpage/workspace")}>Open Workspace</button>
          <button onClick={() => navigate("/mainpage/teams")}>Team members</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
        </div>
      </div>
      {/* Task Overview */}
      <div className="section">
  <h2>Task Overview</h2>
  <div className="task-overview">
    <div className="status-card">
      <h3>{stats.pending}</h3>
      <p>Pending</p>
    </div>
    <div className="status-card">
      <h3>{stats.inProgress}</h3>
      <p>In Progress</p>
    </div>
    <div className="status-card">
      <h3>{stats.completed}</h3>
      <p>Completed</p>
    </div>
  </div>
</div>
    </div>
  );
}
export default Dashboard;