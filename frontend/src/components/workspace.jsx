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
  const [workspaceData, setWorkspaceData] = useState({
    workspaceName: "",
    description: "",
  });
  const [memberEmail, setMemberEmail] = useState("");
  useEffect(() => {
    fetchWorkspaceCount();
    fetchWorkspaces();
  }, []);
  // FETCH WORKSPACE COUNT
  const fetchWorkspaceCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/workspace/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkspaceCount(response.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  // FETCH ALL WORKSPACES
  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/workspace/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkspaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // HANDLE INPUT CHANGE
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
        {
          workspaceName: workspaceData.workspaceName,
          description: workspaceData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Workspace Created Successfully");

      await fetchWorkspaceCount();
      await fetchWorkspaces();

      setWorkspaceData({
        workspaceName: "",
        description: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create workspace");
    }
  };

  // OPEN INVITE MODAL
  const openInviteModal = (workspaceId) => {
    setSelectedWorkspace(workspaceId);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Member Added Successfully");

      setMemberEmail("");
      setShowInviteModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add member");
    }
  };

  // OPEN BOARD
  const openWorkspaceBoard = (workspace) => {
    navigate(`/workspace/${workspace._id}`, {
      state: {
        workspaceName: workspace.workspaceName,
        workspaceId: workspace._id,
      },
    });
  };

  return (
    <div className="workspace-container">
      <h1>Workspace Dashboard</h1>

      <div className="workspace-summary">
        <h3>Total Workspaces: {workspaceCount}</h3>

        <button
          className="create-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Workspace
        </button>
      </div>

      {/* WORKSPACES */}
      <div className="workspace-list">
        {workspaces.length === 0 ? (
          <p>No workspaces found.</p>
        ) : (
          workspaces.map((workspace) => (
            <div
              className="workspace-card"
              key={workspace._id}
              onClick={() => openWorkspaceBoard(workspace)}
              style={{ cursor: "pointer" }}
            >
              <h3>
                {workspace.workspaceName || workspace.name}
              </h3>

              <p>
                <strong>Description:</strong>{" "}
                {workspace.description || "No Description"}
              </p>

              <p>
                <strong>Created At:</strong>{" "}
                {new Date(
                  workspace.createdAt
                ).toLocaleDateString()}
              </p>

              <button
                className="member-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openInviteModal(workspace._id);
                }}
              >
                Add Members
              </button>
            </div>
          ))
        )}
      </div>

      {/* CREATE WORKSPACE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Workspace</h2>

            <input
              type="text"
              name="workspaceName"
              placeholder="Workspace Name"
              value={workspaceData.workspaceName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={workspaceData.description}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button
                className="create-btn"
                onClick={createWorkspace}
              >
                Create
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVITE MEMBER MODAL */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Member</h2>

            <input
              type="email"
              placeholder="Enter member email"
              value={memberEmail}
              onChange={(e) =>
                setMemberEmail(e.target.value)
              }
            />

            <div className="modal-buttons">
              <button
                className="create-btn"
                onClick={inviteMember}
              >
                Add Member
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowInviteModal(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workspace;