import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import Workspace from "./workspace";
import Teams from "./teams";
import Chat from "./chat";
import "../mainpage.css";

function Mainpage() {
  return (
    <div className="mainpage">
      <Navbar />

      <div className="body-container">
        <Sidebar />

        <div className="content-container">
          <Routes>
            <Route index element={<Dashboard />} />

            <Route
              path="workspace"
              element={<Workspace />}
            />

            <Route
              path="teams"
              element={<Teams />}
            />

            <Route
              path="chat"
              element={<Chat />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Mainpage;