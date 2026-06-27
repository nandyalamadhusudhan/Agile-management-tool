import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "../mainpage.css";
import { socket } from "../socket";
import { useEffect } from "react";
function Mainpage() {
  const navigate = useNavigate();
  useEffect(() => {
    socket.connect();
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );
      socket.emit("register", payload.id);
    }
    // Keep the singleton socket connected for the whole session.
    // Disconnect only on logout if needed.
    return () => {};
  }, []);

  useEffect(() => {
  socket.on("member-removed", (data) => {
    alert(data.message);
    navigate("/mainpage");
  });

  return () => {
    socket.off("member-removed");
  };
}, [navigate]);
  return (
    <div className="mainpage">
      <Navbar />
      <div className="body-container">
        <Sidebar />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Mainpage;