import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../workspace.css";

function Workspace() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [workspaceCount, setWorkspaceCount] = useState(0);
  const [workspaces, setWorkspaces] = useState([]);

  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [workspaceData, setWorkspaceData] = useState({
    workspaceName: "",
    description: "",
  });

  useEffect(() => {
    fetchWorkspaceCount();
    fetchWorkspaces();
  }, []);

  // GET COUNT
  const fetchWorkspaceCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/workspace/count",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkspaceCount(res.data.count);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // GET WORKSPACES
  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/workspace/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkspaces(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setWorkspaceData({
      ...workspaceData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE WORKSPACE
  const createWorkspace = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/workspace/create",
        workspaceData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowModal(false);
      setWorkspaceData({ workspaceName: "", description: "" });

      fetchWorkspaceCount();
      fetchWorkspaces();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // OPEN INVITE
  const openInviteModal = (workspaceId) => {
    setSelectedWorkspace(workspaceId);
    setMemberEmail("");
    setShowInviteModal(true);
  };

  // INVITE MEMBER
  const inviteMember = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/workspace/invite",
        {
          workspaceId: selectedWorkspace,
          email: memberEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowInviteModal(false);
      setMemberEmail("");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // NAVIGATE TO BOARD
  const openWorkspaceBoard = (workspace) => {
    navigate(`/workspace/${workspace._id}`, {
      state: {
        workspaceId: workspace._id,
        workspaceName: workspace.name,
      },
    });
  };

  return (
    <div className="workspace-container">
      <h1>Workspace Dashboard</h1>

      <div className="workspace-summary">
        <h3>Total Workspaces: {workspaceCount}</h3>

        <button onClick={() => setShowModal(true)}>
          + Create Workspace
        </button>
      </div>

      <div className="workspace-list">
        {workspaces.map((workspace) => (
          <div
            key={workspace._id}
            className="workspace-card"
            onClick={() => openWorkspaceBoard(workspace)}
          >
            <h3>{workspace.name}</h3>

            <p>{workspace.description || "No Description"}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openInviteModal(workspace._id);
              }}
            >
              Add Members
            </button>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="modal">
          <input
            name="workspaceName"
            value={workspaceData.workspaceName}
            onChange={handleChange}
            placeholder="Workspace Name"
          />

          <input
            name="description"
            value={workspaceData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <button onClick={createWorkspace}>Create</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="modal">
          <input
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="Email"
          />

          <button onClick={inviteMember}>Add</button>
          <button onClick={() => setShowInviteModal(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Workspace;