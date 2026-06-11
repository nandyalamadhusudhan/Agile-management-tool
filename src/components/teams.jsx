import React, { useState } from "react";
import "../teams.css";

function Teams() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Frontend Team",
      members: 5,
    },
    {
      id: 2,
      name: "Backend Team",
      members: 4,
    },
  ]);

  return (
    <div className="teams-container">
      <div className="teams-header">
        <h1>Teams</h1>

        <button className="create-team-btn">
          + Create Team
        </button>
      </div>

      <div className="teams-grid">
        {teams.map((team) => (
          <div
            key={team.id}
            className="team-card"
          >
            <h3>{team.name}</h3>

            <p>
              Members: {team.members}
            </p>

            <button className="view-btn">
              View Team
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;