import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "../mainpage.css";

function Mainpage() {
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