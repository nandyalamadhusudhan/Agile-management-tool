import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../workspace.css";
function Workspace() {
  const navigate = useNavigate();
  const token=localStorage.getItem("token");
  const payload = token
  ? JSON.parse(atob(token.split(".")[1]))
  : null;
  const currentUserId = payload?.id;
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
      alert(err.response?.data || err.message);
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
    const res = await axios.post(
      "http://localhost:5000/workspace/create",
      workspaceData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(res.data.message);
    setShowModal(false);
    setWorkspaceData({
      workspaceName: "",
      description: "",
    });

    fetchWorkspaceCount();
    fetchWorkspaces();
  } catch (err) {
    alert(
      err.response?.data?.message ||
      err.message
    );
  }
};
const deleteWorkspace = async(id)=>{

  const confirmDelete = window.confirm(
    "Delete this workspace?"
  );

  if(!confirmDelete) return;


  try{

    const token = localStorage.getItem("token");


    await axios.delete(
      `http://localhost:5000/workspace/${id}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );


    setWorkspaces(
      workspaces.filter(
        w=>w._id !== id
      )
    );


    alert("Workspace deleted");


  }catch(err){

    alert(
      err.response?.data?.message ||
      err.message
    );

  }

};

  // invitstion sends to all users
  const openInviteModal = (workspaceId) => {
    setSelectedWorkspace(workspaceId);
    setMemberEmail("");
    setShowInviteModal(true);
  };

  // INVITE MEMBER
  const inviteMember = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:5000/workspace/invite",
      {
        workspaceId: selectedWorkspace,
        email: memberEmail,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(res.data.message);
    setShowInviteModal(false);
    setMemberEmail("");
  } catch (err) {
    alert(
      err.response?.data?.message ||
      err.message
    );
  }
};
  // NAVIGATE TO BOARD
  const openWorkspaceBoard = (workspace) => {
    navigate(`/workspace/${workspace._id}`, {
      state: {
        workspaceId: workspace._id,
        workspaceName: workspace.name,
        owner: workspace.owner,
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

      <div className="workspace-list">
  {workspaces.map((workspace) => (
  <div key={workspace._id} className="workspace-card" onClick={() => openWorkspaceBoard(workspace)}>

  <h3>{workspace.name}</h3>

<p>{workspace.description || "No Description"}</p>
{workspace.owner === currentUserId && (
 <>
 <button className="member-btn"
 onClick={(e)=>{
   e.stopPropagation();
   openInviteModal(workspace._id);
 }}
 >
 Add Members
 </button>
 <button
 className="delete-btn"
 onClick={(e)=>{
   e.stopPropagation();
   deleteWorkspace(workspace._id);
 }}
 >
 Delete
 </button>


 </>

)}

</div>
  ))}
</div>
  
      {showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Create Workspace</h2>
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
      {/* INVITE MODAL */}
        {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Member</h2>
            <input
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Enter member email"
            />
            <div className="modal-buttons">
              <button
                className="create-btn"
                onClick={inviteMember}
              >
                Add
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowInviteModal(false)}
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