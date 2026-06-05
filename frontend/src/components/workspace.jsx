import { useState, useEffect } from "react";
import axios from "axios";
import "../workspace.css";

function Workspace() {
  const [showModal, setShowModal] = useState(false);

  const [workspaceCount, setWorkspaceCount] = useState(0);

  const [workspaces, setWorkspaces] = useState([]);

  const [workspaceData, setWorkspaceData] = useState({
    workspaceName: "",
    description: "",
  });

  useEffect(() => {
    fetchWorkspaceCount();
    fetchWorkspaces();
  }, []);

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

  const handleChange = (e) => {
    setWorkspaceData({
      ...workspaceData,
      [e.target.name]: e.target.value,
    });
  };

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

      alert(
        error.response?.data?.message ||
          "Failed to create workspace"
      );
    }
  };
  return (
    <div className="workspace-container">
      <h1>Workspace Dashboard</h1>
      <div className="workspace-header">
        <div className="workspace-count-card">
          <h3>Total Workspaces</h3>
          <span>{workspaceCount}</span>
        </div>
        <button
          className="create-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Workspace
        </button>
      </div>
      <div className="workspace-list">
        {workspaces.length === 0 ? (
          <p>No workspaces found.</p>
        ) : (
          workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className="workspace-card"
            >
              <h3>{workspace.name}</h3>
              <p>
                <strong>Description:</strong>{" "}
                {workspace.description ||
                  "No Description"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(
                  workspace.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create Workspace</h2>
            <input
              type="text"
              name="workspaceName"
              placeholder="Workspace Name"
              value={workspaceData.workspaceName}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={workspaceData.description}
              onChange={handleChange}
            />
            <div className="modal-buttons">
              <button onClick={createWorkspace}>
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
    </div>
  );
}
export default Workspace;