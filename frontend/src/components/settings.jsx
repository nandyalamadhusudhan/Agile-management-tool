import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../settings.css";
import { jwtDecode } from "jwt-decode";
function Settings() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
 useEffect(() => {
  const fetchProfile = async () => {
    try {
    
      if (!token) return
      const decoded = jwtDecode(token);
      console.log(decoded);
      const userId = decoded.id;

      const res = await axios.get(
  `http://localhost:5000/user/${userId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err) {
      console.log(err);
    }
  };

  fetchProfile();
}, []);

  const updateProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    await axios.put(
  `http://localhost:5000/user/update/${decoded.id}`,
  {
    name,
    email,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    alert("Profile Updated Successfully");
  } catch (err) {
    console.log(err);
  }
};

  const openWorkspace = () => {
    navigate(`/mainpage/workspace`);
  };


  return (
    <div className="settings-container">
        <button
  className="back-btn"
  onClick={() => navigate("/mainpage")}
>
  ← Back to Dashboard
</button>
  <h1 className="settings-title">Settings</h1>

  <div className="section">
    <h2>Profile</h2>

    <div className="input-group">
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>

    <button
      className="btn primary-btn"
      onClick={updateProfile}
    >
      Update Profile
    </button>
  </div>
  <div className="section">
    <h2>Workspace</h2>
    <button
      className="btn workspace-btn"
      onClick={openWorkspace}
    >
      Open Workspace
    </button>
  </div>

  </div>
  );
}

export default Settings;