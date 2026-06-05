import { useState } from "react";
import { useParams } from "react-router-dom";
import "../board.css";
function Board() {
  const { workspaceId } = useParams();

  const [showTaskModal, setShowTaskModal] = useState(false);

  const [members] = useState([
    { _id: "1", name: "Madhu" },
    { _id: "2", name: "Ravi" },
    { _id: "3", name: "John" },
  ]);

  const [tasks, setTasks] = useState([]);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  const createTask = () => {
    if (!taskData.title) {
      alert("Enter task title");
      return;
    }

    const selectedMember = members.find(
      (member) => member._id === taskData.assignedTo
    );

    const newTask = {
      _id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      assignedTo: selectedMember?.name || "Unassigned",
      status: "Todo",
    };

    setTasks([...tasks, newTask]);

    setTaskData({
      title: "",
      description: "",
      assignedTo: "",
    });

    setShowTaskModal(false);
  };

  return (
    <div className="board-page">
      <div className="board-header">
        <h1>Workspace Board</h1>

        <button
          className="create-btn"
          onClick={() => setShowTaskModal(true)}
        >
          + Add Task
        </button>
      </div>

      <p>
        <strong>Workspace ID:</strong> {workspaceId}
      </p>

      <div className="board-container">

        {/* TODO */}
        <div className="board-column">
          <h2>Todo</h2>

          {tasks
            .filter((task) => task.status === "Todo")
            .map((task) => (
              <div className="task-card" key={task._id}>
                <h4>{task.title}</h4>

                <p>{task.description}</p>

                <p>
                  <strong>Assigned To:</strong>{" "}
                  {task.assignedTo}
                </p>
              </div>
            ))}
        </div>

        {/* IN PROGRESS */}
        <div className="board-column">
          <h2>In Progress</h2>

          {tasks
            .filter(
              (task) => task.status === "In Progress"
            )
            .map((task) => (
              <div className="task-card" key={task._id}>
                <h4>{task.title}</h4>

                <p>{task.description}</p>

                <p>
                  <strong>Assigned To:</strong>{" "}
                  {task.assignedTo}
                </p>
              </div>
            ))}
        </div>

        {/* COMPLETED */}
        <div className="board-column">
          <h2>Completed</h2>

          {tasks
            .filter(
              (task) => task.status === "Completed"
            )
            .map((task) => (
              <div className="task-card" key={task._id}>
                <h4>{task.title}</h4>

                <p>{task.description}</p>

                <p>
                  <strong>Assigned To:</strong>{" "}
                  {task.assignedTo}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>Create Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Task Description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                })
              }
            />

            <select
              value={taskData.assignedTo}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  assignedTo: e.target.value,
                })
              }
            >
              <option value="">
                Select Member
              </option>

              {members.map((member) => (
                <option
                  key={member._id}
                  value={member._id}
                >
                  {member.name}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button
                className="create-btn"
                onClick={createTask}
              >
                Create Task
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowTaskModal(false)
                }
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