# Team Task Manager

A production-ready full-stack web application with role-based access control (Admin and Member) for managing projects and tasks.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS v4, React Router v7, Axios, Lucide React
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, bcryptjs
- **Deployment:** Ready for Railway

## Features
- **Role-Based Access Control:** Admin and Member roles.
- **Projects:** Admins can create and manage projects.
- **Tasks:** Admins can assign tasks to members. Members can update task status.
- **Kanban Board:** Simple column-based task board for each project.
- **Dashboard:** Visual summary of assigned tasks and overall progress.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

## Local Development Setup

1. **Clone the repository** (or use the generated directory).

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```
   Start the backend server:
   ```bash
   npm run dev
   # (Note: make sure you add "dev": "nodemon server.js" to backend/package.json)
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Railway Deployment Instructions

To deploy this project to Railway, the recommended approach is to create two separate services from this single repository.

1. Create a GitHub repository and push this code.
2. Log in to [Railway](https://railway.app/).
3. Provision a **MongoDB** database in your Railway project.

### Deploy Backend:
1. Click **New** -> **GitHub Repo** and select your repository.
2. Go to the newly created service's **Settings**.
3. Under **Build**, set the **Root Directory** to `/backend`.
4. Under **Variables**, add:
   - `PORT`: `5000` (or leave default, Railway auto-injects)
   - `MONGO_URI`: Use the connection string from your Railway MongoDB plugin.
   - `JWT_SECRET`: Generate a random secure string.
5. Generate a Public Domain for the backend.

### Deploy Frontend:
1. Click **New** -> **GitHub Repo** and select your repository again.
2. Go to this second service's **Settings**.
3. Under **Build**, set the **Root Directory** to `/frontend`.
4. Under **Variables**, add:
   - `VITE_API_URL`: Set this to your Backend's Public Domain + `/api` (e.g., `https://backend-production-xyz.up.railway.app/api`).
5. Generate a Public Domain for the frontend.

Your application is now live!
