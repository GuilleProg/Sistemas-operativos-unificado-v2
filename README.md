# Módulos 03 y 04 — Sistemas Operativos

## Asignatura: Sistemas Operativos

---

### 👥 Integrantes

**Módulo 03: CPU — Planificación de Procesos**
- Oneal Marchan
- Guillermo Rojas
- Manuel Salazar

**Módulo 04: Interrupciones**
- Gabriel Bastardo
- Saúl Ramos

---

### 📋 Descripción

Este repositorio contiene dos simuladores interactivos:

- **Módulo 03 (CPU):** Simulador de planificación de procesos con algoritmos FIFO, SJF y Round Robin. Backend en **NestJS** con WebSockets y PostgreSQL; frontend en HTML/CSS/JS.
- **Módulo 04 (Interrupciones):** Simulador del ciclo de interrupciones de un Sistema Operativo. Frontend estático (HTML/CSS/JS) servido vía **Nginx**, con backend en **NestJS**.

---

### 🚀 Ejecución (Docker — ambos módulos)

> Solo requiere [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **en ejecución**.

```bash
git clone <url-del-repositorio>
cd Sistemas-operativos-unificado-v2
docker-compose up --build
```

| Servicio | URL |
|---|---|
| 🖥️ **Módulo 03** — CPU Frontend | http://localhost:8081 |
| ⚡ **Módulo 04** — Interrupciones Frontend | http://localhost:8080 |
| 🔧 CPU Backend (API) | http://localhost:3003 |
| 🔧 Interrupciones Backend (API) | http://localhost:3000 |

> La base de datos PostgreSQL del Módulo 03 se crea automáticamente en el contenedor `cpu-db`.

---

### 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | NestJS · TypeORM · PostgreSQL · Socket.IO · Swagger |
| Frontend | HTML · CSS · JavaScript |
| Infraestructura | Docker · Docker Compose · Nginx |
