import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../board.css";

function Board() {
  const { id } = useParams();
  const location = useLocation();

  const workspaceId = id || location.state?.workspaceId;
  const workspaceName = location.state?.workspaceName;

  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (workspaceId) {
      fetchBoards();
      fetchMembers();
    }
  }, [workspaceId]);

  // GET BOARDS
  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/boards/${workspaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBoards(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // GET MEMBERS
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/workspace/${workspaceId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMembers(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // CREATE BOARD
  const createBoard = async () => {
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/boards",
        {
          title,
          workspace: workspaceId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBoards([...boards, res.data]);
      setTitle("");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // DELETE BOARD
  const deleteBoard = async (boardId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/boards/${boardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBoards(boards.filter((b) => b._id !== boardId));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>{workspaceName || "Workspace Board"}</h2>

      <div>
        <h4>Members</h4>
        {members.map((m) => (
          <span key={m._id}>{m.name}</span>
        ))}
      </div>

      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Board name"
        />

        <button onClick={createBoard}>Create</button>
      </div>

      <div>
        {boards.map((b) => (
          <div key={b._id}>
            <h3>{b.title}</h3>

            <button onClick={() => deleteBoard(b._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;