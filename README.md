 
# Todo Management Platform

A full-stack project management and team collaboration platform built with React, Express, TypeScript, and MySQL. This application enables teams to manage projects, tasks, users, and notifications efficiently with robust authentication and role-based access control.

## Features

- User authentication (login, email verification, password reset)
- Role-based access control (admin, project manager, team member)
- Project and task management
- Team and user management
- Real-time notifications
- Secure RESTful API with rate limiting and validation
- Responsive frontend UI with React, Vite, and Tailwind CSS

## Tech Stack
 
---

## Backend Structure & Setup

The backend is built with Express.js and TypeScript, providing a secure RESTful API for the frontend. Key features include authentication, role-based access, and integration with a MySQL database.

### Folder Structure

```
server/
	server.ts                # Main server entry point
	controllers/             # Route controllers (auth, user, project, task, etc.)
	database/
		db.ts                  # MySQL connection and pool
	middleware/              # Auth, rate limiting, validation, etc.
	routes/                  # API route definitions
	services/                # Email, notification, time utilities
	types/                   # TypeScript types
	validation/              # Validation logic
```

### Main Server Entry
- `server/server.ts`: Sets up Express, middleware (Helmet, cookie-parser, JSON parsing), and API routes. Starts the server and tests the database connection.

### Database Connection
- `server/database/db.ts`: Configures a MySQL connection pool using environment variables. Exports a test function to verify connectivity.

### API Routes
- `server/routes/`: Organizes routes for authentication, users, projects, and tasks. Each route is handled by its respective controller.

### Environment Configuration
- Uses `.env` for sensitive config (DB credentials, JWT secrets, etc.).
- Example variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`, `JWT_SECRET`.

---

## Frontend Structure & Usage

The frontend is built with React, Vite, and Tailwind CSS, providing a modern, responsive user interface for managing projects, tasks, and teams.

### Folder Structure

```
src/
	App.tsx                  # Main app component and router
	componets/               # Shared UI components (header, sidebar)
	page/                    # Page components (dashboard, login, projects, tasks, etc.)
	assets/                  # Static assets (images, icons)
	main.tsx                 # App entry point
	App.css, index.css       # Styles
```

### Main Components & Routing
- `App.tsx`: Sets up React Router with routes for dashboard, tasks, projects, teams, users, notifications, etc.
- `componets/`: Contains reusable UI components like the header and sidebar.
- `page/`: Contains main pages for dashboard, login, projects, tasks, team, users, notifications, and settings.

### Running the Frontend

---

## Setup Instructions

---

## Database Schema & Migration
---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Credits

- Developed by Aryan Thapa and contributors
- Built with React, Express, TypeScript, and MySQL

The database uses MySQL. The schema is defined in `database.sql` and includes tables for users, permissions, projects, milestones, and more.

### Main Tables
- **users**: Stores user credentials, roles, status, and verification info
- **permissions**: User-specific permissions for access control
- **projects**: Project details, status, progress, and deadlines
- **milestones**: Project milestones and deadlines
- **tasks**: Tasks assigned to users or teams

### Setting Up the Database
1. Create a new MySQL database (e.g., `todo_db`).
2. Import the schema:
	```sh
	mysql -u <user> -p <todo_db> < database.sql
	```
3. Update your `.env` file with the correct database credentials.

### Prerequisites
- Node.js (v18+ recommended)
- MySQL server

### Installation
1. Clone the repository:
	```sh
	git clone <repo-url>
	cd todo
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Configure environment variables:
	- Copy `.env.example` to `.env` and fill in your database and JWT credentials.
4. Set up the database (see next section).

### Available Scripts
- `npm run dev` — Start both frontend (Vite) and backend (Express) in development mode
- `npm run dev:frontend` — Start only the frontend
- `npm run dev:backend` — Start only the backend
- `npm run build` — Build both frontend and backend for production
- `npm run build:frontend` — Build only the frontend
- `npm run build:backend` — Build only the backend
- `npm run lint` — Run ESLint on the codebase

---


- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript
- **Database:** MySQL
- **Authentication:** JWT, bcrypt, email verification
- **Other:** ESLint, Nodemailer, Helmet, Express Rate Limit


