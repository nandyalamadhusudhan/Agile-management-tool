import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../board.css";
import { useNavigate } from "react-router-dom";
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd";
function Board() {
  const { id } = useParams();
  const location = useLocation();
  const workspaceId = id || location.state?.workspaceId||"";
  const workspaceName = location.state?.workspaceName;
  const workspaceDescription = location.state?.workspaceDescription;
  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const navigate=useNavigate();
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    if (location.state?.owner === payload.id) {
      setIsOwner(true);
    }
  }
}, [location]);
const onDragEnd = async (result) => {
  const { destination, draggableId } = result;

  if (!destination) return;

  const parts = destination.droppableId.split("-");

  const newStatus = parts.slice(1).join("-");

  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/cards/${draggableId}/move`,
      {
        listName: newStatus,
      },
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    fetchBoards();

  } catch(err){
    console.log(
      err.response?.data || err.message
    );
  }
};
const renderCard = (card) => (
  <div
    key={card._id}
    className="task-card"
  >
    <div className="task-top">
      <h4 className="task-title">
        {card.title}
      </h4>

      <div className="task-actions">
        <span
          className={`priority-${(
            card.priority || "Medium"
          ).toLowerCase()}`}
        >
          {card.priority || "Medium"}
        </span>

        <button
          className="task-delete-btn"
          onClick={() =>
            deleteCard(card._id)
          }
        >
          Delete
        </button>
      </div>
    </div>

    {card.description && (
      <p className="task-desc">
        {card.description}
      </p>
    )}

    <div className="task-details">
      <div className="detail-item">
        👤 <strong>Assigned:</strong>{" "}
        {card.assignedTo?.name ||
          "Unassigned"}
      </div>

      <div className="detail-item">
        📅 <strong>Due:</strong>{" "}
        {card.dueDate
          ? new Date(
              card.dueDate
            ).toLocaleDateString()
          : "Not Set"}
      </div>

      <div className="detail-item">
        📌 <strong>Status:</strong>{" "}
        <span className="status-badge">
          {card.listName || "Todo"}
        </span>
      </div>
    </div>
  </div>
);
const openchat=()=>{
      if (!workspaceId) {
    console.error("Workspace ID missing");
    return;
  }
  navigate(`/mainpage/chat/${workspaceId}`);
  };
  useEffect(() => {
  if (!workspaceId) return;
  fetchBoards();
  fetchMembers();
}, [workspaceId]);
  const fetchBoards = async () => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(
  `http://localhost:5000/boards/${workspaceId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
setBoards(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/workspace/${workspaceId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBoards([...boards, res.data]);
      setTitle("");
      setShowBoardModal(false);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/cards",
        {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          assignedTo,
          boardId: selectedBoard,
          listName:"Todo"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setAssignedTo("");
      setSelectedBoard("");

      setShowTaskModal(false);

      fetchBoards();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  const deleteCard = async (cardId) => {
  const confirmDelete = window.confirm(
    "Delete this task?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/cards/${cardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBoards(); // refresh boards after deleting
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  const deleteBoard = async (boardId) => {
  const confirmDelete = window.confirm(
    "Delete this board and all tasks?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/boards/${boardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBoards(
      boards.filter((b) => b._id !== boardId)
    );
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
const removeMember = async (memberId) => {
  const confirmRemove = window.confirm(
    "Remove this member from the workspace?"
  );
  if (!confirmRemove) return;
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/workspace/${workspaceId}/members/${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMembers(
      members.filter((m) => m._id !== memberId)
    );
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  return (
    <div className="board-container">
      <div className="board-top">
  <button
    className="back-btn"
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>
</div>
      <div className="board-header">
        <h2>WORKSPACE NAME:{workspaceName || "Workspace Board"}</h2>
        <p>{workspaceDescription}</p>
      </div>
      <div className="members-section">
        <h4>Team Members</h4>
        <div className="member-list">
          {members.map((m) => (
  <div key={m._id} className="member-chip">
    <span>{m.name}</span>
   {isOwner && (
  <button
  className="remove-member-btn"
  onClick={() => removeMember(m._id)}
>
  ✕
</button>
)}
  </div>
))}
        </div>
      </div>
      <div className="action-bar">
        <button
          className="create-board-btn"
          onClick={() => setShowBoardModal(true)}
        >
          + Create Board
        </button>
        <button
          className="task-btn"
          onClick={() => setShowTaskModal(true)}
        >
          + Add Task
        </button>
        <button className="chat-btn" onClick={openchat}>
  💬 Chat
</button>
      </div>
 <DragDropContext onDragEnd={onDragEnd}>   
<div className="boards-grid">
  {boards.map((board) => (
    <div key={board._id} className="board-card">
      <div className="board-header-row">
        <h3>{board.title}</h3>
        <button
          className="delete-btn"
          onClick={() => deleteBoard(board._id)}
        >
          Delete
        </button>
      </div>
 <div className="kanban-board">

{
  ["Todo","In Progress","Completed"].map((status)=>(
    
    <Droppable
      key={`${board._id}-${status}`}
      droppableId={`${board._id}-${status}`}
    >

    {(provided)=>(

      <div
        className="status-column"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {
          board.cards
          ?.filter(card => card.listName === status)
          .map((card,index)=>(

            <Draggable
              key={card._id}
              draggableId={card._id}
              index={index}
            >

            {(provided)=>(

              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >

                {renderCard(card)}

              </div>

            )}

            </Draggable>

          ))
        }

        {provided.placeholder}

      </div>

    )}

    </Droppable>

  ))
}
</div>
</div>
    ))}

</div>
</DragDropContext> 
      {showBoardModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Board</h3>

            <input
              type="text"
              placeholder="Board Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={createBoard}>
                Create
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowBoardModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Task</h3>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
            >
              <option value="">Select Board</option>
              {boards.map((board) => (
                <option key={board._id} value={board._id}>
                  {board.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign Member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={createTask}>
                Create Task
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowTaskModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Board;