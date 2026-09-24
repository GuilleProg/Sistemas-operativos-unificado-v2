# Módulo 03 — CPU: Planificación de Procesos

## Asignatura: Sistemas Operativos

---

### 👥 Integrantes

- Oneal Marchan
- Guillermo Rojas
- Manuel Salazar

---

### 📋 Descripción

Backend del simulador de planificación de procesos de CPU. Implementa algoritmos **FIFO**, **SJF** y **Round Robin** con comunicación en tiempo real vía **WebSockets** y persistencia en **PostgreSQL**.

---

### 🚀 Ejecución con Docker (recomendado)

> Desde la raíz del repositorio, con Docker Desktop abierto:

```bash
docker-compose up --build
```

El frontend estará en **http://localhost:8081** y el backend en **http://localhost:3003**.  
La BD PostgreSQL se crea automáticamente en el contenedor `cpu-db`.

---

### 🛠️ Stack

- **NestJS** · **TypeORM** · **PostgreSQL** · **Socket.IO** · **Swagger**
