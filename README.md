# 🚀 Employee Management System - Full-Stack Application

A modern, production-ready **Employee Management System** built with **React**, **Node.js**, **Express**, **TypeScript
**, **Prisma ORM**, and **SQLite**. This application demonstrates full-stack development capabilities with
enterprise-grade features including authentication, CRUD operations, real-time updates, drag-and-drop task management,
data visualization, and export/import functionality.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Demo Accounts](#-demo-accounts)
- [Bonus Features Implemented](#-bonus-features-implemented)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin & User roles)
- **Password hashing** using bcryptjs
- Auto-redirect on token expiration
- Protected routes with middleware

### 👥 Employee Management

- **CRUD operations** for employee records
- **Advanced search** with debouncing (300ms delay)
- **Multi-filter support** (department, status)
- **Grid & List view** toggle
- **Pagination** with navigation controls
- **Export to CSV** and **PDF reports**
- **Bulk import** via CSV upload
- **Real-time validation** with error feedback
- Beautiful gradient cards with animations

### 📋 Task Management

- **Drag-and-drop Kanban board** (4 columns: Pending, In Progress, Completed, Cancelled)
- **Real-time status updates** via drag-and-drop
- **Priority levels** (Low, Medium, High, Urgent)
- **Task assignment** to employees
- **Due date tracking** with overdue indicators
- **Export to CSV** and **PDF reports**
- **Filter by status & priority**
- Color-coded task cards

### 📊 Dashboard & Analytics

- **Real-time statistics** display
- **Interactive charts** (Bar charts, Pie charts)
- **Department distribution** visualization
- **Task status breakdown**
- **Priority distribution** cards
- **Generate PDF reports** with comprehensive data
- Animated stat cards with trend indicators

### 🎨 UI/UX Features

- **Modern gradient design** with glass-morphism effects
- **Framer Motion animations** for smooth transitions
- **Responsive design** (mobile, tablet, desktop)
- **Toast notifications** for user feedback
- **Loading states** with skeleton screens
- **Error boundaries** for graceful error handling
- **Beautiful landing page** with feature highlights
- **Lucide React icons** for consistent iconography

---

## 🛠 Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **@hello-pangea/dnd** - Drag and drop
- **React Hot Toast** - Notifications
- **jsPDF** - PDF generation
- **PapaParse** - CSV parsing

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **SQLite** - Database (dev environment)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Development Tools

- **tsx** - TypeScript execution
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Concurrently** - Run multiple commands

---

## 📸 Screenshots

### Landing Page

![Landing Page](screenshots/landing.png)
*Beautiful gradient landing page with feature highlights*

### Login/Register

![Login](screenshots/login.png)
*Modern authentication with demo account buttons*

### Dashboard

![Dashboard](screenshots/dashboard.png)
*Real-time analytics with interactive charts*

### Employee Management

![Employees](screenshots/employees.png)
*Grid view with search, filters, and export options*

### Kanban Board

![Tasks](screenshots/tasks.png)
*Drag-and-drop task management with color-coded priorities*

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

#### Option 1: Automated Setup (Recommended)

**Windows (PowerShell):**

```powershell
.\setup.ps1
```

**Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd EmployeeFullStack
```

2. **Install root dependencies**

```bash
npm install
```

3. **Setup Backend**

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
cd ..
```

4. **Setup Frontend**

```bash
cd client
npm install
cd ..
```

5. **Configure Environment Variables**

Create `server/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Running the Application

#### Development Mode

**Run both frontend and backend:**

```bash
npm run dev
```

**Or run separately:**

```bash
# Terminal 1 - Backend (http://localhost:5000)
npm run dev:server

# Terminal 2 - Frontend (http://localhost:3000)
npm run dev:client
```

#### Production Build

```bash
npm run build
npm start
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api

---

## 📁 Project Structure

```
EmployeeFullStack/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── EmployeeModal.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── ImportModal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── Layout.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useDebounce.ts
│   │   ├── lib/              # Utility functions
│   │   │   ├── api.ts        # Axios configuration
│   │   │   ├── toast.ts      # Toast notifications
│   │   │   ├── validation.ts # Form validation
│   │   │   ├── export.ts     # CSV export/import
│   │   │   └── pdf.ts        # PDF generation
│   │   ├── pages/            # Page components
│   │   │   ├── Welcome.tsx
│   │   │   ├── LoginNew.tsx
│   │   │   ├── DashboardNew.tsx
│   │   │   ├── EmployeesNew.tsx
│   │   │   ├── EmployeeDetails.tsx
│   │   │   └── TasksNew.tsx
│   │   ├── store/            # State management
│   │   │   └── authStore.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx           # Root component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── server/                    # Backend Node.js application
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── dev.db            # SQLite database
│   │   └── migrations/       # Database migrations
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   └── env.ts
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── employee.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/           # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── employee.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── lib/              # Utilities
│   │   │   └── prisma.ts
│   │   ├── seed.ts           # Database seeding
│   │   └── server.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── package.json               # Root package.json
├── setup.ps1                  # Windows setup script
├── setup.sh                   # Linux/Mac setup script
└── README.md                  # This file
```

---

## 🔌 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile

```http
GET /auth/profile
Authorization: Bearer <token>
```

### Employee Endpoints

#### Get All Employees

```http
GET /employees?page=1&limit=10&search=john&department=Engineering&status=active
Authorization: Bearer <token>
```

#### Get Employee by ID

```http
GET /employees/:id
Authorization: Bearer <token>
```

#### Create Employee (Admin Only)

```http
POST /employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "position": "Software Engineer",
  "salary": 75000,
  "hireDate": "2024-01-15",
  "status": "active"
}
```

#### Update Employee (Admin Only)

```http
PUT /employees/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "salary": 80000,
  "position": "Senior Software Engineer"
}
```

#### Delete Employee (Admin Only)

```http
DELETE /employees/:id
Authorization: Bearer <token>
```

#### Get Employee Statistics

```http
GET /employees/stats
Authorization: Bearer <token>
```

### Task Endpoints

#### Get All Tasks

```http
GET /tasks?page=1&limit=10&status=pending&priority=high
Authorization: Bearer <token>
```

#### Get Task by ID

```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Create Task (Admin Only)

```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based auth",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-02-15",
  "employeeId": "employee-uuid"
}
```

#### Update Task (Admin Only)

```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

#### Delete Task (Admin Only)

```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

#### Get Task Statistics

```http
GET /tasks/stats
Authorization: Bearer <token>
```

---

## 🔑 Demo Accounts

The application comes pre-seeded with demo accounts:

### Administrator Account

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Permissions:** Full access (Create, Read, Update, Delete)

### Regular User Account

- **Email:** `user@example.com`
- **Password:** `user123`
- **Permissions:** Read-only access

### Demo Employees

The database is pre-populated with 8 sample employees across different departments:

- Engineering
- Marketing
- Sales
- HR
- Finance
- Design

### Demo Tasks

10 sample tasks with varying statuses and priorities

---

## 🎁 Bonus Features Implemented

✅ **All Three Tracks Completed**

- Track 1: Frontend (React with mock data simulation)
- Track 2: Backend (RESTful API with database)
- Track 3: Full-Stack (Integrated application)

✅ **Advanced Authentication**

- JWT-based authentication
- Role-based access control
- Secure password hashing

✅ **Real-Time Features**

- Drag-and-drop task management
- Optimistic UI updates
- Debounced search

✅ **Data Import/Export**

- CSV export for employees and tasks
- PDF report generation
- Bulk CSV import

✅ **Advanced UI/UX**

- Framer Motion animations
- Toast notifications
- Skeleton loaders
- Error boundaries
- Responsive design

✅ **Data Visualization**

- Interactive charts (Bar, Pie)
- Real-time statistics
- Color-coded indicators

✅ **Code Quality**

- TypeScript for type safety
- Clean code structure
- Separation of concerns
- Reusable components
- Custom hooks

---

## 🔮 Future Enhancements

- [ ] Deploy to cloud (Vercel + Render/Railway)
- [ ] Switch to PostgreSQL/MySQL for production
- [ ] Add email notifications
- [ ] Implement forgot password functionality
- [ ] Add file upload for employee avatars
- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] Unit and integration tests
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] API rate limiting
- [ ] Comprehensive logging (Winston)

---

## 📝 Notes & Assumptions

### Assumptions

1. SQLite is used for development (can be easily switched to PostgreSQL/MySQL)
2. JWT tokens expire after 7 days
3. Pagination defaults to 10 items per page (configurable)
4. CSV import expects specific column headers
5. Admin role is required for Create, Update, Delete operations

### Design Decisions

1. **Zustand over Redux** - Lighter state management for this scale
2. **Prisma ORM** - Type-safe database access with great DX
3. **TailwindCSS** - Rapid UI development with consistency
4. **Monorepo structure** - Easy to manage both frontend and backend
5. **JWT in localStorage** - Simple auth (can be moved to httpOnly cookies for better security)

### Known Limitations

1. SQLite doesn't support all production features (use PostgreSQL for production)
2. File uploads not implemented (avatar field exists in schema)
3. Forgot password requires email service integration
4. No real-time collaboration features

---

## 📄 License

This project is developed as part of a job application assessment.

---

## 👨‍💻 Author

**Developed for Prou Australia Assessment**

Submission Date: December 2024

---

## 🙏 Acknowledgments

- React Team for React 18
- Vercel for Next.js and Vite
- Prisma Team for the amazing ORM
- TailwindCSS Team for utility-first CSS
- All open-source contributors

---

## 📧 Contact

For any questions or clarifications:

- **Email:** vasudharini.s@prou.com.au, pavithra.mannar@prou.com.au

---

**⭐ If you found this project interesting, please give it a star!**
