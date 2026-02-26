import React, { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editError, setEditError] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // hover/focus states
  const [inputFocus, setInputFocus] = useState(false);
  const [editInputFocus, setEditInputFocus] = useState(false);
  const [addHover, setAddHover] = useState(false);
  const [updateHover, setUpdateHover] = useState(false);
  const [editHover, setEditHover] = useState({}); // object for each edit button

  const fetchTodos = async () => {
    const res = await api.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ADD TODO
  const addTodo = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError("⚠ Task cannot be empty. Please enter any task.");
      return;
    }
    try {
      setLoadingAdd(true);
      setError("");
      await api.post("/todos", { task });
      setTask("");
      fetchTodos();
    } finally {
      setLoadingAdd(false);
    }
  };

  // DELETE TODO
  const deleteTodo = async (id) => {
    try {
      setLoadingDelete(id);
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } finally {
      setLoadingDelete(null);
    }
  };

  // OPEN MODAL
  const openModal = (todo) => {
    setEditingId(todo.id);
    setEditTask(todo.task);
    setEditError("");
    setIsModalOpen(true);
  };

  // UPDATE TODO
  const updateTodo = async () => {
    if (!editTask.trim()) {
      setEditError("⚠ Task cannot be empty. Please enter any task.");
      return;
    }
    try {
      setLoadingUpdate(true);
      setEditError("");
      await api.put(`/todos/${editingId}`, { task: editTask });
      setIsModalOpen(false);
      fetchTodos();
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Dynamic input styles
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "0.2s",
    borderColor: inputFocus ? "#3498db" : "#ddd",
    boxShadow: inputFocus ? "0 0 5px #3498db" : "none",
  };

  const editInputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "0.2s",
    borderColor: editInputFocus ? "#3498db" : "#ddd",
    boxShadow: editInputFocus ? "0 0 5px #3498db" : "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          width: "380px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h3>Project Details</h3>
        <p><strong>React</strong> project backend with <strong>Node</strong>. <strong>Express</strong> as a <strong>framework</strong>. <strong>Sequelize</strong> as an <strong>ORM</strong>. <strong>Postgress</strong> as <strong>DB</strong></p>
        <h2 style={{ marginBottom: "20px" }}>✨ My Todo List</h2>

        <form onSubmit={addTodo} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onFocus={() => {
              setError("");
              setInputFocus(true);
            }}
            onBlur={() => setInputFocus(false)}
            onMouseEnter={() => setInputFocus(true)}
            onMouseLeave={() => setInputFocus(false)}
            style={inputStyle}
          />
          <button
            type="submit"
            title="Add task"
            disabled={loadingAdd}
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              background: addHover ? "#45a049" : "#4CAF50",
              color: "#fff",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={() => setAddHover(true)}
            onMouseLeave={() => setAddHover(false)}
          >
            {loadingAdd ? "Adding..." : "Add"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
            {error}
          </p>
        )}

        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                background: "#f9f9f9",
                marginTop: "10px",
                padding: "12px 15px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{todo.task}</span>
              <div>
                <button
                  onClick={() => openModal(todo)}
                  title="Edit task"
                  style={{
                    marginRight: "8px",
                    border: "none",
                    background: editHover[todo.id] ? "#e0b800" : "#ffc107",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseEnter={() =>
                    setEditHover((prev) => ({ ...prev, [todo.id]: true }))
                  }
                  onMouseLeave={() =>
                    setEditHover((prev) => ({ ...prev, [todo.id]: false }))
                  }
                >
                  ✏
                </button>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    border: "none",
                    background: "#e74c3c",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  disabled={loadingDelete === todo.id}
                  title="Delete task"
                >
                  {loadingDelete === todo.id ? "..." : "❌"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "350px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3>Edit Task</h3>
              <span
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => !loadingUpdate && setIsModalOpen(false)}
              >
                ✖
              </span>
            </div>

            <input
              type="text"
              value={editTask}
              onChange={(e) => setEditTask(e.target.value)}
              onFocus={() => {
                setEditError("");
                setEditInputFocus(true);
              }}
              onBlur={() => setEditInputFocus(false)}
              onMouseEnter={() => setEditInputFocus(true)}
              onMouseLeave={() => setEditInputFocus(false)}
              style={editInputStyle}
            />

            {editError && (
              <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
                {editError}
              </p>
            )}

            <button
              onClick={updateTodo}
              disabled={loadingUpdate}
              title="Update task"
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: updateHover ? "#45a049" : "#4CAF50",
                color: "#fff",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={() => setUpdateHover(true)}
              onMouseLeave={() => setUpdateHover(false)}
            >
              {loadingUpdate ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;