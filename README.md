# 🚀 Employee Management System

> **Assessment Submission for Prou Australia**  
> **All Three Tracks Completed**: Frontend + Backend + Full-Stack Integration

A modern, production-ready **Employee Management System** built with **React**, **Node.js**, **Express**, **TypeScript
**, **Prisma ORM**, and **PostgreSQL**.

## 🌐 Live Demo

- **Frontend:** https://employee-management-rcej.vercel.app
- **Backend API:** https://employee-management-api-kvlr.onrender.com

**Demo Accounts:**

- **Admin:** `admin@example.com` / `9392359Abc@`
- **User:** `user@example.com` / `9392359Abc@`

⚠️ Backend may take 30-60 seconds to wake up on first request (free tier).

## 📌 Assessment Tracks Completion

### ✅ Track 1: Frontend Development

- Responsive React application with modern UI/UX
- State management with Zustand
- Advanced features: Search, filters, pagination, drag-and-drop

### ✅ Track 2: Backend Development

- RESTful API with Express.js and TypeScript
- PostgreSQL database with Prisma ORM
- JWT authentication and role-based authorization

### ✅ Track 3: Full-Stack Integration

- Seamless frontend-backend integration
- End-to-end functionality with production deployment

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/boddusaiganesh/Employee_management.git
cd EmployeeFullStack

# Install all dependencies
npm install

# Run development servers
npm run dev

# Access: http://localhost:3000
```

**Prerequisites:** Node.js v18+, PostgreSQL v12+

## ✨ Features

- **Authentication:** JWT-based with role-based access control (Admin/User)
- **Employee Management:** CRUD operations, search, filters, pagination, CSV/PDF export
- **Task Management:** Drag-and-drop Kanban board, priority levels, due date tracking
- **Dashboard:** Real-time statistics, interactive charts (Bar/Pie), data visualization
- **UI/UX:** Responsive design, animations, toast notifications, skeleton loaders

## 🛠 Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Zustand, Axios, Recharts

**Backend:** Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT, bcryptjs

## 📸 Screenshots

### Landing Page

![Landing Page](screenshots/landing.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Employee Management

![Employees](screenshots/employees.png)

### Task Management (Kanban Board)

![Tasks](screenshots/tasks.png)

### Employee Details

![Employee Details](screenshots/employee-details.png)

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL v12+

### Installation Steps

1. **Clone and Install**

```bash
git clone https://github.com/boddusaiganesh/Employee_management.git
cd EmployeeFullStack
npm install
```

2. **Setup Backend**

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

3. **Configure Environment**

Create `server/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/employee_db?schema=public"
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. **Run Application**

```bash
npm run dev
```

Access at: http://localhost:3000

## 📁 Project Structure

```
EmployeeFullStack/
├── client/              # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities (API, validation, export)
│   │   ├── store/       # State management
│   │   └── types/       # TypeScript types
│   └── package.json
│
├── server/              # Backend (Node.js + Express)
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth & error handling
│   │   └── server.ts    # Entry point
│   └── package.json
│
└── package.json         # Root scripts
```

## 🔌 API Endpoints

**Base URL:** `http://localhost:5000/api`

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires auth)

### Employees

- `GET /employees` - List all employees (pagination, search, filters)
- `GET /employees/:id` - Get employee details
- `POST /employees` - Create employee (admin only)
- `PUT /employees/:id` - Update employee (admin only)
- `DELETE /employees/:id` - Delete employee (admin only)
- `GET /employees/stats` - Get statistics

### Tasks

- `GET /tasks` - List all tasks (pagination, filters)
- `GET /tasks/:id` - Get task details
- `POST /tasks` - Create task (admin only)
- `PUT /tasks/:id` - Update task (admin only)
- `DELETE /tasks/:id` - Delete task (admin only)
- `GET /tasks/stats` - Get statistics



## 🎁 Bonus Features

✅ **All Three Tracks Completed** - Frontend + Backend + Full-Stack Integration

✅ **Deployment** - Live demo on Vercel (Frontend) + Render (Backend)

✅ **Authentication** - JWT-based with role-based access control

✅ **Advanced UI** - Drag-and-drop Kanban, animations, responsive design

✅ **Data Visualization** - Interactive charts, real-time statistics

✅ **Creative Features** - CSV/PDF export, bulk import, debounced search

## 📝 Assumptions

- PostgreSQL database with proper configuration
- JWT tokens expire after 7 days
- Admin role required for Create/Update/Delete operations
- CSV import expects specific column headers
- Pagination defaults to 10 items per page

Screen shots:

<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/c27057dd-c26b-481c-b060-4ef3ad66a003" />
<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/a5c61e0d-bb78-4a4c-8cca-4f87e8cec70f" />
<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/12bd22c8-34aa-49c2-b489-92b7dd2bcd1a" />
<img width="1919" height="862" alt="image" src="https://github.com/user-attachments/assets/4df6af76-3206-48eb-bdfb-ee1565e84ab9" />
<img width="1919" height="787" alt="image" src="https://github.com/user-attachments/assets/4393b81c-5382-427a-a33d-5ecf48be52b6" />






