const express = require("express");
const sequelize = require("./config/database");
const Todo = require("./models/Todo");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* ---------- ROUTES ---------- */

// Create Todo
app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.create({ task: req.body.task });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.findAll({
  order: [['id', 'ASC']]
});
  res.json(todos);
});

// Get Single Todo
app.get("/todos/:id", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  res.json(todo);
});

// Update Todo
app.put("/todos/:id", async (req, res) => {
  await Todo.update(
    { task: req.body.task },
    { where: { id: req.params.id } }
  );
  res.json({ message: "Updated" });
});

// Delete Todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
});

/* ---------- START SERVER ---------- */

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});