# Team Task Manager

A full-stack project management application built with Next.js, React, Prisma, and PostgreSQL.

## Features
- **Authentication**: JWT-based Signup/Login with Role-Based Access Control (Admin/Member).
- **Projects**: Create and manage projects (Admins).
- **Tasks**: Kanban-style task board with To Do, In Progress, and Done statuses.
- **Dashboard**: Real-time overview of tasks and project statistics.
- **Responsive UI**: Modern, premium dark/light mode responsive design.

## Local Development (With PostgreSQL)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/teamtask"
   JWT_SECRET="your-super-secret-key"
   ```

3. **Run Database Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Deployment on Railway

This app is production-ready for Railway deployment.

1. Create a new project on [Railway.app](https://railway.app/).
2. Add a **PostgreSQL** database plugin to your Railway project.
3. Add a **GitHub Repo** service and connect this repository.
4. In your Railway Web Service variables, add:
   - `DATABASE_URL` (Use the internal connection URL from your Railway Postgres).
   - `JWT_SECRET` (Generate a random secure string).
5. Railway will automatically detect Next.js and Prisma, run `npm install`, `npx prisma generate`, and `npm run build`.
6. Add a custom domain in Railway to access your live URL!

## Usage Demo
(Watch the demo video provided in the submission for a complete walkthrough of all features).
