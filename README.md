# 🚀 Team Task Manager

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Data-316192?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)

A modern, full-stack project management application built to streamline team collaboration. Manage projects, assign tasks, and track real-time progress through an intuitive dashboard.

---

## ✨ Key Features

- 🔐 **Secure Authentication**: JWT-based Signup and Login with Role-Based Access Control (`ADMIN` and `MEMBER`).
- 📁 **Project Management**: Project Admins can create and oversee multiple projects simultaneously.
- ✅ **Task Assignment**: Kanban-style task tracking with `TODO`, `IN_PROGRESS`, and `DONE` statuses.
- 📊 **Real-Time Dashboard**: Comprehensive metrics, overdue task tracking, and workload breakdowns.
- 🎨 **Premium UI/UX**: Fully responsive, dynamic interface featuring a sleek design system.

---

## 🏛️ System Architecture

The application follows a modern Serverless architecture using Next.js App Router.

```mermaid
graph TD
    Client[Client Browser] -->|HTTP Requests| NextJS[Next.js Application]
    
    subgraph Frontend [React Server Components]
        NextJS --> Pages[App Pages/Layouts]
        Pages --> ClientComps[Client Components]
    end
    
    subgraph Backend [Next.js API Routes]
        NextJS --> API[RESTful API Routes]
        API --> Auth[JWT Authentication]
        API --> PrismaClient[Prisma ORM]
    end
    
    PrismaClient -->|Connection Pool| Database[(PostgreSQL Database)]
    
    classDef default fill:#1f2937,stroke:#4b5563,stroke-width:2px,color:#fff;
    classDef highlight fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff;
    class Database highlight;
```

---

## 💾 Database Schema (ERD)

The database schema revolves around Users, Projects, and Tasks with enforced relational integrity.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "owns"
    USER ||--o{ TASK : "is assigned to"
    PROJECT ||--o{ TASK : "contains"

    USER {
        String id PK
        String name
        String email UK
        String passwordHash
        String role "ADMIN or MEMBER"
        DateTime createdAt
    }

    PROJECT {
        String id PK
        String name
        String description
        String ownerId FK
        DateTime createdAt
    }

    TASK {
        String id PK
        String title
        String description
        String status "TODO, IN_PROGRESS, DONE"
        String priority "LOW, MEDIUM, HIGH"
        DateTime dueDate
        String projectId FK
        String assigneeId FK
        DateTime createdAt
    }
```

---

## 🛠️ Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/teamtask"
   JWT_SECRET="your-super-secret-key"
   ```

3. **Generate Prisma Client & Push Schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   *The app will be available at http://localhost:3000*

---

## 🚀 Deployment (Vercel)

This application is configured for seamless deployment on serverless platforms like Vercel.

1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**, selecting your GitHub repository.
3. Vercel automatically detects Next.js and configures the build settings.
4. **Environment Variables**: Add your `JWT_SECRET` in the Vercel project settings. The database connection is already configured within the application's Prisma schema.
5. Click **Deploy**. Vercel will run `npm run build` and automatically serve your app globally.

*(For detailed usage, refer to the demo video provided in the assignment submission).*
