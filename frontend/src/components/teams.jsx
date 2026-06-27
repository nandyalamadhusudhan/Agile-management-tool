import { useEffect, useState } from "react";
import axios from "axios";
import "../teams.css";
function Team() {
  const [workspaces, setWorkspaces] = useState([]);
  useEffect(() => {
    getTeams();
  }, []);
  const getTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://agile-management-tool.onrender.com/api/workspaces/myteams",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setWorkspaces(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
   <div className="team-page">
  <h1>My Team Members In Workspaces</h1>
  {workspaces.map((workspace) => (
    <div key={workspace._id} className="workspace-card">
      <div className="workspace-header">
        <h2>{workspace.name}</h2>
        <p>{workspace.description}</p>
      </div>
      <h3 className="members-title">
        Team Members ({workspace.members.length})
      </h3>
      {workspace.members.length === 0 ? (
        <div className="no-members">
          No members assigned yet
        </div>
      ) : (
        <div className="members-grid">
          {workspace.members.map((member) => (
            <div key={member._id} className="member-card">
              <div className="avatar">
                {member.name?.charAt(0).toUpperCase()}
              </div>
              <div className="member-info">
                <h4>{member.name}</h4>
                <p>{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>
);
}

export default Team;