import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "../mainpage.css";
import {socket} from "../socket";
import { useEffect } from "react";

function Mainpage() {
  useEffect(() => {
    socket.connect();
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );
    socket.emit("register", payload.id);
  }
}, []);
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