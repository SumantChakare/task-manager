# Full-Stack Task Manager (PHP / MySQL / React)

**Job Assessment:** Practical Technical Assessment — PHP / MySQL / React Developer
**Developer:** Sumant
**Tech Stack:** PHP 8.2+ / Laravel 12 + MySQL (InnoDB) + Laravel Sanctum + React 19 (Vite)

---

## 📌 Project Overview

This project is a full-stack, production-ready **Task Manager Application** designed and implemented to satisfy the requirements of the practical technical assessment. It features robust RESTful APIs, strict server-side validation, relational database indexing, secure token authentication via Laravel Sanctum, Role-Based Access Control (RBAC), and a responsive, modern React frontend.

### Mandatory Deliverables Implemented:

- [X] **Task 1 — Full-Stack CRUD App: Task Manager (Core)**
  - RESTful backend API with create, list, show, update, and delete actions.
  - Task fields: `title`, `description`, `status` (`todo`/`in-progress`/`done`), `priority` (`low`/`medium`/`high`), `due_date`, and `user_id` owner.
  - Query filtering by status, search in title/desc, sorting, and pagination.
  - Modern React frontend with task grid, add/edit modal, quick status change, safe delete confirmation, and skeleton loading/error feedback.
- [X] **Task 2 — Authentication & Role-Based Authorization (Core)**
  - User registration and login with Bcrypt password hashing (`Hash::make` / cost 12).
  - Bearer token authentication via Laravel Sanctum protecting all task endpoints (`401 Unauthorized`).
  - RBAC with two roles:
    - **Regular User (`user`)**: Can only view, update, and delete their **own** tasks.
    - **Administrator (`admin`)**: Can view, edit, reassign, and delete **all users'** tasks.
  - Explicit `403 Forbidden` responses for unauthorized cross-user modifications.
  - React protected views, automatic 401 interceptor auto-logout, and dynamic Admin-only UI controls (owner filter and assignment).
- [X] **Task 3 — Database Design & Query Optimization (Core)**
  - Formal DDL script ([`schema.sql`](./schema.sql)) with constraints and foreign keys (`ON DELETE CASCADE`).
  - Performance optimization report ([`DATABASE_OPTIMIZATION.md`](./DATABASE_OPTIMIZATION.md)) featuring:
    - Entity-Relationship Diagram (ERD).
    - Written justification for every index and composite index (`user_id, status`).
    - 3 real-world optimized queries with `EXPLAIN` execution plans avoiding table scans (`ALL`) and temporary filesorts.

---

## 🚀 Quick Setup & Installation

### Prerequisites

- **PHP**: `^8.2` or later
- **Composer**: `^2.5`
- **Node.js**: `^18.0` or `^20.0`
- **MySQL / MariaDB**: `^8.0` / `^10.4` (via XAMPP or standalone service)

---

### Step 1: Database Setup

1. Open your MySQL client (or phpMyAdmin at `http://localhost/phpmyadmin`).
2. Create a database named `task_manager`:
   ```sql
   CREATE DATABASE task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   *(Alternatively, run the provided [`schema.sql`](./schema.sql) file directly).*

---

### Step 2: Backend Setup (Laravel 12)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```
2. Verify dependencies are installed:

   ```bash
   composer install
   ```
3. Copy the environment configuration:

   ```bash
   cp .env.example .env
   ```
4. Verify database credentials in `backend/.env`:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=task_manager
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Generate application key and run migrations:

   ```bash
   php artisan key:generate
   php artisan migrate
   ```
6. (Optional) Seed Default Admin and User accounts:

   ```bash
   php artisan db:seed
   ```

   **Default Test Credentials:**

   | Role            | Email                  | Password        |
   | :-------------- | :--------------------- | :-------------- |
   | **Admin** | `sumant@example.com` | `password123` |
   | **User**  | `user@example.com`   | `password123` |
7. Start the Laravel development server:

   ```bash
   php artisan serve
   ```

   *The backend REST API will be live at `http://127.0.0.1:8000`.*

---

### Step 3: Frontend Setup (React 19 + Vite)

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit: **`http://localhost:5173`**

---

## 📡 REST API Reference

All protected endpoints require the HTTP header:
`Authorization: Bearer <your_sanctum_token>`

| Method     | Endpoint            |  Auth  |      Role      | Description                                                                                                                          |
| :--------- | :------------------ | :-----: | :-------------: | :----------------------------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/api/register`   | Public |  Standard User  | Register user account (defaults strictly to`user` role)                                                                            |
| `POST`   | `/api/login`      | Public |       Any       | Authenticate credentials (returns token + user payload)                                                                              |
| `GET`    | `/api/me`         | Sanctum |       Any       | Get profile of authenticated user session                                                                                            |
| `POST`   | `/api/logout`     | Sanctum |       Any       | Invalidate active Bearer token                                                                                                       |
| `GET`    | `/api/users`      | Sanctum | **Admin** | Get list of all registered users (for assignment & filtering)                                                                        |
| `GET`    | `/api/tasks`      | Sanctum |  User / Admin  | List tasks (User: own only; Admin: all tasks). Supports`?status=`, `?search=`, `?priority=`, `?page=`, `?user_id=` (Admin) |
| `POST`   | `/api/tasks`      | Sanctum |  User / Admin  | Create new task (Admin can assign`user_id` to any user)                                                                            |
| `GET`    | `/api/tasks/{id}` | Sanctum |  Owner / Admin  | Retrieve task details (403 if unpermitted)                                                                                           |
| `PUT`    | `/api/tasks/{id}` | Sanctum |  Owner / Admin  | Update task details (403 if unpermitted)                                                                                             |
| `DELETE` | `/api/tasks/{id}` | Sanctum |  Owner / Admin  | Delete task (403 if unpermitted)                                                                                                     |

---

## 🧪 Testing Role-Based Access Control (RBAC)

You can test user separation directly through the web UI or via API / Postman:

1. **Test as Regular User**:

   - Register a new account via the UI (e.g., `testuser@example.com`), which automatically receives the `user` role.
   - Alternatively, use the **Evaluator Instant Demo** button: `Login as Demo User` (`user@example.com` / `password123`).
   - Create 2–3 tasks.
   - Observe that only tasks created by this user are visible.
   - Admin-only controls (e.g., Owner Filter dropdown, owner reassignment in modal) are cleanly omitted.
2. **Test as Administrator**:

   - Sign in using the seeded Admin account (`sumant@example.com` / `password123`) or click `Login as Sumant (Admin)` on the landing page hero.
   - Observe the **Admin Mode Active** banner and badge in the top navbar.
   - Notice that tasks created by **all users** are visible with creator badges.
   - Use the **Owner Filter** in the toolbar to filter tasks by any user.
   - In the **New Task / Edit Task** modal, notice the **Assignee (User)** dropdown allowing task assignment to any registered user.
   - Edit or delete any user's task.
3. **Verify Security (401 & 403 HTTP codes)**:

   - Sending requests to `/api/tasks` without token returns: `401 Unauthorized`.
   - Modifying or deleting another user's task ID with a regular user token returns: `403 Forbidden`.
   - Attempting to access `/api/users` with a regular user token returns: `403 Forbidden`.

---

## ⚡ Database Optimization Highlights (Task 3)

Complete documentation is provided in [`DATABASE_OPTIMIZATION.md`](./DATABASE_OPTIMIZATION.md):

- **Composite Index `(user_id, status)`**: Satisfies the Leftmost Prefix Rule for user-scoped filtering, eliminating full table scans.
- **Join Optimization**: Tasks and users joins execute via `eq_ref` over the primary key `users.id`.
- **Foreign Keys**: Configured with `ON DELETE CASCADE` so deleting a user cleanly purges tasks in a single atomic transaction.

---

## 📁 Repository Structure

```text
task-manager/
├── backend/                  # Laravel 12 API backend (PHP 8.2+)
│   ├── app/
│   │   ├── Http/Controllers/ # TaskController, AuthController
│   │   ├── Http/Requests/    # StoreTaskRequest, UpdateTaskRequest, RegisterRequest, LoginRequest
│   │   ├── Models/           # Task, User
│   │   └── Policies/         # TaskPolicy (RBAC authorization)
│   ├── config/               # app.php, sanctum.php (token TTL 1440m)
│   ├── database/
│   │   ├── migrations/       # Schema migrations with indexes and foreign keys
│   │   └── seeders/          # DatabaseSeeder (Admin: sumant@example.com, User: user@example.com)
│   └── routes/api.php        # Sanctum protected route definitions
├── frontend/                 # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/       # LandingHero, DatePicker, TaskList, TaskCard, TaskModal,
│   │   │                     # TaskFilterBar, AuthModal, ConfirmModal, Pagination, Toast, Navbar
│   │   ├── context/          # AuthContext (state, Sanctum Bearer tokens, auto-logout)
│   │   ├── services/         # api.js (Axios-style fetch client), taskService, authService
│   │   ├── App.jsx           # Main orchestrator
│   │   └── App.css           # Premium styling tokens, responsive grid, animations
├── DATABASE_OPTIMIZATION.md  # Detailed schema analysis, DDL, and EXPLAIN plans
├── schema.sql                # Standalone MySQL DDL creation script
└── README.md                 # Project documentation & setup guide
```
