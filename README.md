# Agile Collaborative Workspace

A full-stack **Agile Collaborative Workspace** application built using the **MERN Stack**.  
It helps teams collaborate, manage projects, assign tasks, and track progress through Kanban boards with real-time updates.

## 🚀 Features

### 🔐 Authentication
- User Registration and Login
- JWT based authentication
- Protected routes
- Password encryption using Bcrypt

### 👥 Workspace Management
- Create workspaces
- Invite team members
- Accept / Reject invitations
- Remove workspace members
- Owner-based permissions

### 📋 Task Management
- Create tasks
- Assign tasks to members
- Set task priority
- Delete tasks
- Drag and drop task movement
- Kanban workflow:
  - Todo
  - In Progress
  - Completed

### ⚡ Real-Time Collaboration
- Real-time chat system
- Live workspace updates
- Instant invitation notifications
- Member join/remove updates
- Powered by Socket.IO

### 📊 Dashboard
- Workspace count
- Board overview
- Task progress tracking
- Assigned task statistics

### 🔎 Search
- Search tasks by title

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router
- Axios
- Socket.IO Client
- @hello-pangea/dnd
- CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Socket.IO
- Dotenv

---

# 📂 Project Structure

```
Agiletool
│
├── frontend
│   ├── src
│   ├── components
│   └── package.json
│
├── backend
│   ├── models
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/agile-workspace.git
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
https://agile-management-tool.onrender.com
```

---

# 🔄 Workflow

```
Register / Login
        ↓
Create Workspace
        ↓
Invite Members
        ↓
Accept Invitation
        ↓
Create Tasks
        ↓
Assign Tasks
        ↓
Move Tasks Using Kanban Board
        ↓
Collaborate in Real-Time
```

---

# 📡 API Overview

## Authentication

```
POST /register
POST /login
```

## Workspace

```
POST /workspace/create
GET /workspace/all
GET /workspace/count
GET /workspace/:workspaceId

POST /workspace/invite
POST /workspace/accept
POST /workspace/reject

DELETE /workspace/:id
```

## Board

```
GET /boards/:workspaceId
POST /boards
DELETE /boards/:id
```

## Cards

```
POST /cards
PUT /cards/:id/move
DELETE /cards/:id
```

## Chat

```
GET /workspace/:workspaceId/messages
```

---

# 🔒 Security

- JWT authentication
- Protected APIs
- Password hashing
- Role based workspace permissions
- Environment variable security

---

# 🔮 Future Enhancements

- File sharing
- Calendar integration
- Task comments
- Due date reminders
- Notification center
- Activity logs
- Dark mode
- Advanced filtering
- Role based access control

---

# ⭐ Project Highlights

- MERN Stack application
- Real-time collaboration using Socket.IO
- Secure JWT authentication
- Kanban board with drag and drop
- Team workspace management
- Task assignment system
- Live chat functionality
