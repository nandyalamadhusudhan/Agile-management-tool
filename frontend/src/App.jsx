import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/homepage";
import Login from "./components/login";
import Register from "./components/register";
import Mainpage from "./components/mainpage";
import Board from "./components/board";
function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/workspace/:id" element={<Board />} />
      <Route
        path="/mainpage/*"
        element={
          token ? (
            <Mainpage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}
export default App;