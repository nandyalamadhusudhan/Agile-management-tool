// Login.jsx
import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "../login.css";

function Login({ setpage,setisloggedin }) {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // login function
  const handleLogin = async (e) => {

    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      // save token
      localStorage.setItem(
        "token",
        response.data.token
      );
      alert(response.data.message);
      console.log(response.data.token);
      setisloggedin(true);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {/* Password */}
          <div className="password-box">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {
                showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
              }
            </span>
          </div>
          {/* Button */}
          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>
        </form>
        {/* Register Link */}
        <p className="switch-text">
          Don't have an account?
          <span
            className="switch-link"
            onClick={() => setpage("register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
export default Login;