# TaskFlow

A full-stack task management application built with Next.js, MongoDB, and Better-Auth.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS v4, shadcn/ui (Radix UI)
- **Database:** MongoDB with Mongoose 9
- **Auth:** Better-Auth (email/password, MongoDB adapter)
- **Forms:** react-hook-form + zod validation
- **Patterns:** Server Actions, neverthrow (Result), DAL caching with `"use cache"`

## Features

- User sign up / sign in / sign out
- Create, read, update, and delete tasks
- Filter: all tasks or only your own
- Gravatar avatars via SHA256 email hash
- Server-side cached data fetching with cache tags
- Validation on client (zod) and server (Mongoose + neverthrow)
- Responsive dark-mode UI with toast notifications

## Project Structure

```
app/
  page.tsx            # Dashboard (task list + create form)
  layout.tsx          # Root layout (dark mode, fonts)
  sign-in/page.tsx    # Sign in page
  sign-up/page.tsx    # Sign up page
  api/auth/[...all]/  # Better-Auth API route
components/
  TaskCard.tsx        # Task card with edit/delete (author only)
  TaskForm.tsx        # Create / update task form
  signin-form.tsx     # Sign in form
  signup-form.tsx     # Sign up form (with Gravatar)
  signout-button.tsx  # Sign out button
  ui/                 # shadcn/ui primitives
lib/
  auth.ts             # Better-Auth server config
  auth-client.ts      # Better-Auth client config
  db.ts               # Mongoose connection (cached singleton)
  schemas.ts          # Zod schemas (task, signup)
  server/task.ts      # Server-only task service (CRUD + auth guards)
  utils.ts            # Utility functions (cn)
models/
  User.ts             # Mongoose User model
  Task.ts             # Mongoose Task model (paginated, unique validation)
dal/
  tasks.ts            # Cached task queries (getTasks, getUserTasks)
  users.ts            # Cached user queries (getUsers)
actions/
  tasks.ts            # Server Actions (create, update, delete)
```

## Getting Started

### Prerequisites

- Node.js or Bun
- MongoDB instance (local or Atlas)

### Setup

1. Clone the repository
2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill in `.env`:

```
MONGODB_URI=mongodb://localhost:27017/taskflow
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

4. Install dependencies:

```bash
bun install
# or npm install
```

5. Run the development server:

```bash
bun dev
# or npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `bun dev`      | Start dev server         |
| `bun build`    | Production build         |
| `bun start`    | Start production server  |
| `bun lint`     | Run ESLint               |
