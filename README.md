🚀 Task Management Application (MERN Stack)
A secure, production-ready Task Management application built with the MERN Stack. It features JWT authentication stored in HTTP-Only cookies, AES-256 encryption for sensitive data, and a modern, colorful UI built with Tailwind CSS.

MongoDBExpressReactNode

📍 Live Demo & Repository
🌐 Live Application: [Replace with your Vercel URL]
💻 GitHub Repository: [Replace with your GitHub URL]
📡 API Endpoint: [Replace with your Render URL]
📸 Application Preview
Login Page	Dashboard
Vibrant gradient design with glassmorphism.	Manage tasks with search, filter, and pagination.
Login Screenshot	Dashboard Screenshot

✨ Key Features
Functional Requirements
User Authentication: Register and Login functionality.
Task CRUD: Create, Read, Update, and Delete tasks.
Search & Filter: Search tasks by title and filter by status (Pending, In Progress, Completed).
Pagination: Efficiently browse tasks with server-side pagination.
Protected Routes: Frontend routes are secured; users cannot access the dashboard without logging in.
Security Implementation (Advanced)
JWT in HTTP-Only Cookies: Access tokens are stored in cookies with httpOnly and secure flags to prevent XSS attacks.
Password Hashing: Passwords are hashed using bcryptjs before storage.
AES Encryption: Task Descriptions are encrypted using crypto-js (AES-256) before saving to MongoDB and decrypted automatically when retrieved.
Security Headers: Uses helmet middleware for setting HTTP security headers.
CORS: Configured to allow requests only from the trusted frontend domain.

🏗️ Architecture & Tech Stack
Tech Stack
Frontend: React.js (Vite), Tailwind CSS, Axios, React Router v6, React Toastify.
Backend: Node.js, Express.js.
Database: MongoDB (Atlas or Local).
Deployment: Vercel (Frontend), Render (Backend).
Architecture Diagram
[ User Browser ]      |      | (HTTP Request with Cookies)      v[ React Frontend (Vercel) ] <---> [ Express Backend (Render) ]                                        |                                        | (Verify JWT & Decrypt Data)                                        v                                 [ MongoDB Atlas ]
📁 Project Structure
text

root/
├── server/
│   ├── config/          # DB Connection
│   ├── controllers/     # Logic (Auth, Tasks)
│   ├── middleware/      # Auth Middleware
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # API Endpoints
│   ├── utils/           # Encryption Helper
│   ├── .env             # Server Variables
│   └── server.js        # Entry Point
│
├── client/
│   ├── src/
│   │   ├── context/     # AuthContext for State
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── services/    # API Calls (Axios)
│   │   ├── App.jsx      # Routes Definition
│   │   └── index.css    # Tailwind Styles
│   ├── .env             # Client Variables
│   └── package.json
│
└── README.md
🛠️ Installation & Setup
Prerequisites
Node.js (v14 or higher)
MongoDB Atlas Account (or local MongoDB)
1. Clone the Repository
bash

git clone https://github.com/beautymaji/task-manager-mern
cd task-manager-mern
2. Setup Backend (Server)
bash

cd server
npm install
Create a .env file inside the server folder:

env

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key_123
AES_SECRET_KEY=a_32_character_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
Start the server:

bash

nodemon server.js
3. Setup Frontend (Client)
Open a new terminal:

bash

cd client
npm install
Create a .env file inside the client folder:

env

VITE_API_URL=http://localhost:5000/api
Start the client:

bash

npm run dev

📖 API Documentation
Authentication
Register User
URL: /api/auth/register
Method: POST
Body:
json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "123456"
}
Success Response: 201 Created
json

{
  "_id": "65f...",
  "username": "johndoe",
  "email": "john@example.com"
}
Login User
URL: /api/auth/login
Method: POST
Body:
json

{
  "email": "john@example.com",
  "password": "123456"
}
Success Response: 200 OK (Sets token cookie)
Tasks
Get Tasks (Protected)
URL: /api/tasks
Method: GET
Query Params: page, limit, search, status
Example: /api/tasks?page=1&limit=5&search=project&status=pending
Success Response:
json

{
  "tasks": [
    {
      "_id": "...",
      "title": "Project Setup",
      "description": "Decrypted description here",
      "status": "pending",
      "createdAt": "2024-03-15T10:00:00Z"
    }
  ],
  "totalPages": 2,
  "currentPage": 1
}
Create Task (Protected)
URL: /api/tasks
Method: POST
Body:
json

{
  "title": "New Task",
  "description": "Sensitive info (Encrypted)",
  "status": "pending"
}


🚀 Deployment Guide
Database: Create a free cluster on MongoDB Atlas and whitelist IP 0.0.0.0/0.
Backend: Deploy the server folder to Render. Add all .env variables in the Render Dashboard.
Frontend: Deploy the client folder to Vercel.
Set VITE_API_URL in Vercel Environment Variables to your Render URL.
Update CLIENT_URL in Render to your Vercel URL to allow CORS.


📝 License
This project is open-sourced under the MIT License.
