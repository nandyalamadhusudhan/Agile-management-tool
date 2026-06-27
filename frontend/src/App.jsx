import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/homepage";
import Login from "./components/login";
import Register from "./components/register";
import Mainpage from "./components/mainpage";
import Board from "./components/board";
import Chat from "./components/chat";
import Team from "./components/teams";
import Dashboard from "./components/dashboard";
import Workspace from "./components/workspace";
import Settings from "./components/settings";
import HelpSupport from "./components/help";
function App() {
  const token = localStorage.getItem("token");
  console.log(token);
  return (
    <Routes>
      <Route
  path="/"
  element={<Home />}
/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected Main Layout */}
      <Route
        path="/mainpage/*"
        element={
          token ? (
            <Mainpage />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="workspace"
          element={<Workspace />}
        />
        <Route
          path="teams"
          element={<Team />}
        />
        <Route
          path="chat/:workspaceId"
          element={<Chat />}
        />
      </Route>
      <Route
        path="/workspace/:id"
        element={<Board />}
      />
      <Route
  path="/settings"
  element={<Settings />}
/>
<Route
  path="/help-support"
  element={<HelpSupport />}
/>
    </Routes>
  );
}
export default App;