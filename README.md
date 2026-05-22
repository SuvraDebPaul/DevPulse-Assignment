# DevPulse - Internal Tech Issue & Feature Tracker API

DevPulse is a backend REST API developed for an internal tech issue and feature tracking system. The project allows users to register, log in, create issues, view issues, update issues based on role permissions, and delete issues as a maintainer.

This project is built using **Node.js**, **TypeScript**, **Express.js**, **PostgreSQL**, and the native **pg Pool** driver with raw SQL queries.

---

## Live URL

```txt
Add your deployed backend URL here
```

Example:

```txt
https://your-project-name.onrender.com
```

---

## Project Features

### Authentication Features

- User registration with name, email, password, and role
- User login with email and password
- Password hashing using bcrypt
- JWT token generation after successful login
- JWT-based protected route access
- User information stored in JWT payload
- Password is not returned in signup or login response

### Issue Management Features

- Authenticated users can create issues
- Public users can view all issues
- Public users can view a single issue
- Issues can be filtered by type and status
- Issues can be sorted by newest or oldest
- Contributors can update only their own issues
- Contributors can update only issues with `open` status
- Maintainers can update any issue
- Maintainers can delete any issue

### Authorization Features

- Role-based route protection
- Supported roles:
  - `contributor`
  - `maintainer`
- Separate middleware for authentication and role authorization

### Error Handling Features

- Centralized global error handler
- Custom `AppError` class for operational errors
- Async error handling using reusable `asyncHandler`
- Standard JSON error response format

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| TypeScript | Type-safe JavaScript development |
| Express.js | Backend web framework |
| PostgreSQL | Relational database |
| pg | Native PostgreSQL driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variable management |
| tsx | TypeScript development runner |

---

## Project Folder Structure

```txt
src/
├── app.ts
├── server.ts
│
├── config/
│   └── index.ts
│
├── db/
│   └── index.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── authorizeRoles.ts
│   └── errorHandler.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.interface.ts
│   │   ├── auth.route.ts
│   │   └── auth.service.ts
│   │
│   └── issue/
│       ├── issue.controller.ts
│       ├── issue.interface.ts
│       ├── issue.route.ts
│       └── issue.service.ts
│
└── shared/
    ├── error/
    │   └── appError.ts
    │
    ├── types/
    │   └── express.d.ts
    │
    └── utils/
        └── index.ts
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Assignment-2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory.

```env
PORT=5000
CONNECTION_STRING=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Run the Development Server

```bash
npm run dev
```

The server will start using:

```txt
src/server.ts
```

The root route can be tested at:

```http
GET /
```

Response:

```txt
API is Running
```

---

## Available Script

```json
{
  "dev": "tsx watch ./src/server.ts"
}
```

Run the project in development mode:

```bash
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server running port |
| `CONNECTION_STRING` | PostgreSQL database connection string |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens |
| `NODE_ENV` | Application environment, for example `development` |

---

## Database Connection

The project uses PostgreSQL `Pool` from the `pg` package.

```ts
export const pool = new Pool({ connectionString: config.connection_string });
```

Database tables are initialized automatically when the server starts by calling:

```ts
initDB();
```

This function creates the `users` and `issues` tables if they do not already exist.

---

## Database Schema

### users Table

The `users` table stores registered user information.

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | Unique user ID |
| `name` | VARCHAR(100) | User full name |
| `email` | VARCHAR(150) UNIQUE | Unique user email |
| `password` | TEXT | Hashed password |
| `role` | VARCHAR(200) | User role |
| `created_at` | TIMESTAMP | User creation time |
| `updated_at` | TIMESTAMP | User update time |

Table creation query used in the project:

```sql
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT,
  role VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### issues Table

The `issues` table stores bug reports and feature requests.

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | Unique issue ID |
| `title` | VARCHAR(150) | Issue title |
| `description` | TEXT | Issue details |
| `type` | VARCHAR(100) | Issue type |
| `status` | VARCHAR(100) | Issue workflow status |
| `reporter_id` | INT | User ID of the issue reporter |
| `created_at` | TIMESTAMP | Issue creation time |
| `updated_at` | TIMESTAMP | Issue update time |

Table creation query used in the project:

```sql
CREATE TABLE IF NOT EXISTS issues(
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(100),
  status VARCHAR(100) DEFAULT 'open',
  reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

## Auth Module

Base route:

```txt
/api/auth
```

---

### Register User

```http
POST /api/auth/signup
```

Access: Public

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

Successful response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00.000Z",
    "updated_at": "2026-01-20T09:00:00.000Z"
  }
}
```

Implementation summary:

- Checks if the email already exists
- Hashes password using bcrypt with 12 salt rounds
- Inserts user into the `users` table
- Returns user data without password

---

### Login User

```http
POST /api/auth/login
```

Access: Public

Request body:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00.000Z",
      "updated_at": "2026-01-20T09:00:00.000Z"
    }
  }
}
```

Implementation summary:

- Finds user by email
- Compares given password with hashed password
- Generates JWT token with user `id`, `name`, `email`, and `role`
- Token expiry is set to `1d`
- Returns token and user information without password

---

## Issue Module

Base route:

```txt
/api/issues
```

---

### Create Issue

```http
POST /api/issues
```

Access: Authenticated users with role `contributor` or `maintainer`

Headers:

```txt
Authorization: <JWT_TOKEN>
```

Request body:

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Issue Created Scucessfully",
  "data": {
    "id": 1,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00.000Z",
    "updated_at": "2026-01-20T10:30:00.000Z"
  }
}
```

Implementation summary:

- Requires JWT authentication
- Allows only `contributor` and `maintainer`
- Gets user ID from decoded JWT token
- Validates that the user exists in the database
- Inserts issue into the `issues` table
- Default issue status is `open`

---

### Get All Issues

```http
GET /api/issues
```

Access: Public

Supported query parameters:

| Query | Example | Description |
|---|---|---|
| `sort` | `?sort=newest` | Sort by newest first |
| `sort` | `?sort=oldest` | Sort by oldest first |
| `type` | `?type=bug` | Filter by issue type |
| `status` | `?status=open` | Filter by issue status |

Example:

```http
GET /api/issues?type=bug&status=open&sort=newest
```

Successful response:

```json
{
  "success": true,
  "message": "Issues Retrived Scucessfully",
  "data": [
    {
      "id": 1,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00.000Z",
      "updated_at": "2026-01-20T10:30:00.000Z"
    }
  ]
}
```

Implementation summary:

- Fetches issues from the `issues` table
- Applies optional `type` and `status` filtering
- Applies sorting by `created_at`
- Fetches reporter details separately from the `users` table
- Returns issue data with nested reporter information

---

### Get Single Issue

```http
GET /api/issues/:id
```

Access: Public

Example:

```http
GET /api/issues/1
```

Successful response:

```json
{
  "success": true,
  "message": "Single Issue Retrived Scucessfully",
  "data": [
    {
      "id": 1,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00.000Z",
      "updated_at": "2026-01-20T10:30:00.000Z"
    }
  ]
}
```

Implementation summary:

- Finds issue by ID
- Fetches reporter information separately
- Returns the issue with nested reporter details
- Throws `Issue Not Found` if no issue exists

Note: The current service returns the single issue inside an array because it maps through `issueResult.rows`.

---

### Update Single Issue

```http
PUT /api/issues/:id
```

Access:

- `maintainer` can update any issue
- `contributor` can update only their own issue if the issue status is `open`

Headers:

```txt
Authorization: <JWT_TOKEN>
```

Request body:

```json
{
  "title": "Updated issue title",
  "description": "Updated issue description",
  "type": "bug"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Issue Updated Scucessfully",
  "data": {
    "id": 1,
    "title": "Updated issue title",
    "description": "Updated issue description",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00.000Z",
    "updated_at": "2026-01-20T14:45:00.000Z"
  }
}
```

Implementation summary:

- Requires JWT authentication
- Allows `contributor` and `maintainer`
- Checks if the issue exists
- Checks contributor ownership using `reporter_id`
- Checks that contributor can update only `open` issues
- Updates title, description, type, and `updated_at`
- Uses `RETURNING *` to return the updated issue

---

### Delete Single Issue

```http
DELETE /api/issues/:id
```

Access: Maintainer only

Headers:

```txt
Authorization: <JWT_TOKEN>
```

Successful response:

```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

Implementation summary:

- Requires JWT authentication
- Allows only `maintainer`
- Checks if the issue exists
- Deletes the issue from the database
- Returns a success message

Note: The controller currently sends status code `204`. A `204 No Content` response usually does not return a response body. If you want to see the success message in the response, use status code `200` instead.

---

## Authentication and Authorization Flow

### Authentication Flow

1. User logs in with email and password.
2. Server checks if the user exists.
3. Server compares the password using bcrypt.
4. Server creates a JWT token using user information.
5. Client sends the token in the `Authorization` header.
6. Auth middleware verifies the token.
7. Decoded user data is attached to `req.user`.
8. Protected routes use `req.user` for permission checks.

### JWT Payload

The JWT payload contains:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "contributor"
}
```

---

## Middleware Used in This Project

### auth.middleware.ts

This middleware:

- Reads token from `req.headers.authorization`
- Verifies the token using `JWT_SECRET`
- Stores decoded user information in `req.user`
- Allows only valid `contributor` or `maintainer` roles

### authorizeRoles.ts

This middleware:

- Accepts allowed roles as arguments
- Checks if `req.user.role` is allowed
- Throws forbidden error if the role is not permitted

Example usage:

```ts
authorizeRoles("contributor", "maintainer")
```

### errorHandler.ts

This middleware:

- Handles errors globally
- Sends error response with status code and message
- Shows error stack only in development mode

---

## Reusable Utilities

### asyncHandler

Used to catch errors from async route handlers and pass them to the global error handler.

### sendResponse

Used to send consistent API responses.

Response format:

```json
{
  "success": true,
  "message": "Response message",
  "data": {}
}
```

---

## Error Response Format

Example error response:

```json
{
  "success": false,
  "message": "Error message",
  "error": {},
  "stack": "Error stack shown only in development"
}
```

---

## Important Code Notes

- This project uses raw SQL queries through `pool.query()`.
- No ORM or query builder is used.
- Passwords are hashed before saving into the database.
- Passwords are not returned in API responses.
- JWT token is required for protected issue routes.
- User role is checked before restricted actions.
- Reporter information is fetched manually from the `users` table.
- The project uses a modular folder structure for better maintainability.

---

## Current Route Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Health check route |
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login user and get JWT token |
| POST | `/api/issues` | Contributor, Maintainer | Create a new issue |
| GET | `/api/issues` | Public | Get all issues with optional filters |
| GET | `/api/issues/:id` | Public | Get a single issue by ID |
| PUT | `/api/issues/:id` | Contributor, Maintainer | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer | Delete an issue |

---

## Testing the API

You can test the API using Postman, Thunder Client, or any REST client.

For protected routes, add the JWT token in the request headers:

```txt
Authorization: <JWT_TOKEN>
```

---

## Author

Suvra Deb Paul

---

## Project Summary

DevPulse is a TypeScript-based Express API for tracking internal software issues and feature requests. It includes user authentication, JWT-based authorization, role-based access control, PostgreSQL database operations using raw SQL, and centralized error handling. The project is structured into separate modules, middleware, shared utilities, configuration, and database layers to keep the code organized and maintainable.
