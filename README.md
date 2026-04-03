# Finance Backend

A REST API for a personal finance dashboard. Built with Node.js, Express, and PostgreSQL.
Supports role-based access so different users can view, manage, or fully control financial data.

---

## Tech Stack

- **Node.js** with **Express.js** — handles routing and middleware
- **PostgreSQL** — relational database for users and transactions
- **JWT** — stateless authentication with token expiry
- **bcrypt** — password hashing before storing in DB

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd finance-backend
npm install
```

### 2. Set up the database

```bash
createdb finance_db
psql -d finance_db -f sql/schema.sql
```

### 3. Create your `.env` file

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

### 4. Start the server

```bash
npm run dev
```

Runs on `http://localhost:3000`

---

## Role-Based Access Control

The system has three roles. Every new user starts as a **VIEWER** by default.
An ADMIN must manually upgrade a user's role.

| Permission | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View transactions | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| Create transaction | ❌ | ✅ | ✅ |
| Update transaction | ❌ | ✅ (own only) | ✅ (any) |
| Delete transaction | ❌ | ❌ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## API Reference

### Auth

#### `POST /api/auth/register`
Creates a new user account. Role is set to `VIEWER` by default.

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

#### `POST /api/auth/login`
Authenticates user and returns a JWT token. Use this token in all protected routes.

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

### Transactions
> All routes require `Authorization: Bearer <token>`

#### `GET /api/transactions`
Returns all active (non-deleted) transactions. Supports multiple query filters:

```
?type=INCOME           → filter by type
?type=EXPENSE
?category=Salary       → filter by category
?from=2026-01-01       → date range filter
?to=2026-12-31
?search=keyword        → search in notes/category
?page=1&limit=20       → pagination
```

#### `POST /api/transactions`
Creates a new transaction. Requires ANALYST or ADMIN role.

```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

#### `PUT /api/transactions/:id`
Updates an existing transaction. ANALYSTs can only update their own transactions. ADMINs can update any.

```json
{
  "amount": 6000,
  "category": "Freelance",
  "notes": "Updated amount"
}
```

#### `DELETE /api/transactions/:id`
Soft deletes a transaction — sets `deleted_at` timestamp, does NOT remove from DB.
Restricted to ADMIN only. Deleted transactions are excluded from all queries.

---

### Users
> ADMIN only

#### `GET /api/users`
Returns a list of all registered users.

#### `PATCH /api/users/:id/role`
Updates a user's role. Valid values: `VIEWER`, `ANALYST`, `ADMIN`.

```json
{
  "role": "ANALYST"
}
```

> Note: The user must log in again after a role change to get a new token.

#### `PATCH /api/users/:id/status`
Activates or deactivates a user account.

```json
{
  "status": "INACTIVE"
}
```

---

### Dashboard
> All routes require authentication

#### `GET /api/dashboard/summary`
Returns total income, total expenses, and net balance. Accessible to all roles.

#### `GET /api/dashboard/by-category`
Returns totals grouped by category (e.g. Salary, Food, Transport).
Useful for building pie/bar charts on the frontend.

#### `GET /api/dashboard/trends`
Returns month-wise income and expense breakdown.
Restricted to ANALYST and ADMIN — used for trend analysis.

#### `GET /api/dashboard/recent`
Returns the last 5 transactions. Quick overview for the dashboard home screen.

---

## Key Design Decisions

- **Soft delete** — transactions are never permanently deleted. `deleted_at` is set instead, and all queries filter with `WHERE deleted_at IS NULL`
- **RBAC middleware** — role checks are handled in a separate `rbac.js` middleware, keeping controllers clean
- **JWT expiry** — tokens expire in 7 days. Role changes require re-login to reflect in the token
- **Amount validation** — negative amounts are rejected at the database constraint level
- **Pagination** — transaction listing supports `page` and `limit` params to avoid heavy payloads

---

## Project Structure

```
finance-backend/
├── sql/
│   └── schema.sql
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── transaction.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rbac.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── transaction.model.js
│   │   └── dashboard.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── transaction.routes.js
│   │   └── dashboard.routes.js
│   └── utils/
│       └── jwt.js
├── app.js
├── server.js
├── .env
├── .env.example
└── README.md
```
