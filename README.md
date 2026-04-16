# App web basica con Docker

Proyecto de aprendizaje con dos servicios:

- `frontend`: app en React creada de forma manual con Vite.
- `backend`: API REST en Node.js + Express.
- Sin base de datos: las tareas viven en memoria.

## Que hace la app

- Lista tareas.
- Crea nuevas tareas.
- Marca tareas como completadas.

## Estructura

```text
.
|-- backend
|   |-- Dockerfile
|   |-- package.json
|   `-- server.js
|-- frontend
|   |-- Dockerfile
|   |-- package.json
|   |-- index.html
|   |-- vite.config.js
|   `-- src
|-- docker-compose.yml
`-- README.md
```

## Como ejecutarlo

Necesitas Docker Desktop con `docker compose`.

```bash
docker compose up --build
```

Luego abre:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000/tasks`

## Endpoints del backend

### `GET /health`

Devuelve el estado del servicio.

### `GET /tasks`

Devuelve la lista de tareas.

### `POST /tasks`

Crea una tarea nueva.

Body de ejemplo:

```json
{
  "text": "Mi nueva tarea"
}
```

### `PATCH /tasks/:id`

Actualiza el estado `completed` de una tarea.

Body de ejemplo:

```json
{
  "completed": true
}
```

## Detalles utiles para aprender Docker

- Cada servicio tiene su propio `Dockerfile`.
- `docker-compose.yml` conecta frontend y backend en una red interna.
- El frontend usa `VITE_API_URL=http://backend:3000`, donde `backend` es el nombre del servicio.
- Como no hay base de datos, si recreas el contenedor del backend se pierden las tareas.

## Siguientes mejoras sugeridas

- Persistir tareas en archivo o base de datos.
- Servir el frontend compilado con `Nginx`.
- Agregar eliminacion de tareas.
- Separar el backend en rutas y controladores.
