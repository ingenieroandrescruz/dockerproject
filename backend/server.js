import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let nextId = 3;
let tasks = [
  { id: 1, text: "Aprender Docker Compose", completed: false },
  { id: 2, text: "Conectar frontend con backend", completed: true }
];

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", (_req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const text = req.body?.text?.trim();

  if (!text) {
    return res.status(400).json({ error: "El texto de la tarea es obligatorio." });
  }

  const task = {
    id: nextId++,
    text,
    completed: false
  };

  tasks = [task, ...tasks];
  return res.status(201).json(task);
});

app.patch("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  if (typeof req.body?.completed !== "boolean") {
    return res.status(400).json({ error: "El campo completed debe ser booleano." });
  }

  task.completed = req.body.completed;
  return res.json(task);
});

app.listen(port, () => {
  console.log(`Backend escuchando en el puerto ${port}`);
});
