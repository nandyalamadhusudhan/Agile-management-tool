import { useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Dashboard from "../components/dashboard";
import "../mainpage.css";

function Mainpage({ setisloggedin }) {
  const [page, setpage] = useState("dashboard");

  return (
    <>
      <Navbar
        setpage={setpage}
        setisloggedin={setisloggedin}
      />

      <Sidebar />

      <div className="page-content">

        {page === "dashboard" && (
          <Dashboard />
        )}

        {page === "workspace" && (
          <h1>Workspace Page</h1>
        )}

        {page === "teams" && (
          <h1>Teams Page</h1>
        )}

        {page === "chat" && (
          <h1>Chat Page</h1>
        )}

      </div>
    </>
  );
}

export default Mainpage;