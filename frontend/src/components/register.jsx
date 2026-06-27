import React, { useState } from "react";
import axios from "axios";
import "../register.css";
import { useNavigate } from "react-router-dom";
function Register() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    role: "Member"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/register`, 
        formData
      );
      alert(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };
  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="avatar"
            placeholder="Avatar Image URL"
            value={formData.avatar}
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" >
            Register
          </button>
        </form>
        
        <p>
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;