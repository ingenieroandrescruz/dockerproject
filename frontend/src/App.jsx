import { useEffect, useMemo, useState } from "react";
import "./App.css";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const pendingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/tasks`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar las tareas.");
      }

      const data = await response.json();
      setTasks(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) {
      setError("Escribe una tarea antes de enviarla.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear la tarea.");
      }

      setTasks((currentTasks) => [data, ...currentTasks]);
      setText("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTask(task) {
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: !task.completed })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar la tarea.");
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === data.id ? data : currentTask
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Docker + React + Node</p>
        <h1>Lista de tareas</h1>
        <p className="description">
          App fullstack sencilla para practicar contenedores, API REST y
          comunicación entre frontend y backend.
        </p>

        <div className="stats">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{pendingCount}</strong>
            <span>Pendientes</span>
          </div>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Escribe una tarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Agregar"}
          </button>
        </form>

        {error ? <p className="message error">{error}</p> : null}
        {loading ? <p className="message">Cargando tareas...</p> : null}

        {!loading && (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? "task done" : "task"}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />
                  <span>{task.text}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
