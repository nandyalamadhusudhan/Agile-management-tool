// Home.jsx
import "../Home.css";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">AgileTool</h1>
        <button className="login-btn" onClick={()=>navigate("/login")}>Login</button>
      </nav>
      <div className="content">
        <h1>Welcome to Agile Management Tool</h1>
        <p>Manage projects and collaborate with your team in real time.</p>
        <button className="start-btn" onClick={() => navigate("/login")}>
          Real Time collaborative system
        </button>
      </div>
    </div>
  );
}
export default Home;