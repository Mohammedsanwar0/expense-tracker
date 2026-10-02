# Phase 0 – Self-Study Tasks (Expense Tracker)

This folder has the 3 small practice tasks for Phase 0 of the Expense Tracker
project. The goal is to learn JSON, fetch/async/await, Express, and
Node + PostgreSQL before building the real backend in Phase 1.

```
phase0/
├── task1-fetch-cards/          # fetch + Bootstrap cards
│   └── index.html
├── task2-express-server/       # first Express server
│   ├── package.json
│   └── server.js
└── task3-express-postgres/     # Express + PostgreSQL
    ├── .env.example
    ├── init.sql
    ├── package.json
    └── server.js
```

---

## Task 1 — fetch + Bootstrap cards

**What it does:** gets 10 users from a public API
(`jsonplaceholder.typicode.com/users`) with `fetch`, and shows each one as a
Bootstrap card (name, email, city, company).

**How to run:**
Just open `task1-fetch-cards/index.html` in the browser (or right-click →
Open with Live Server). No install needed — Bootstrap is loaded from a CDN.

**Try this:** change `API_URL` at the top of the `<script>` to a wrong link
and reload — you should see a red Bootstrap alert instead of a blank page.

---

## Task 2 — First Express server

**What it does:** a small server with two routes, `GET /api/hello` and
`GET /api/expenses`, that return JSON. Used to see CORS in action.

**How to run:**
```bash
cd task2-express-server
npm install
node server.js
```
Then open `http://localhost:3000/api/hello` in the browser, or test it with
the Thunder Client extension in VS Code.

**Try this:** visit a route that doesn't exist (e.g. `/api/nope`) and see the
`Cannot GET /api/nope` message with a 404 status. Also try commenting out
`app.use(cors())` and fetching this server from a page opened on a different
port — you'll see the CORS error in the console.

---

## Task 3 — Express + PostgreSQL

**What it does:** connects the Express server to a real PostgreSQL database
and reads from a `students` table, using parameterized queries (`$1`).

**How to run:**
```bash
cd task3-express-postgres
cp .env.example .env          # then open .env and set PGPASSWORD to your own postgres password
```
Then in pgAdmin:
1. Create a database named `expense_tracker_practice`.
2. Open a Query Tool on it and run `init.sql` (creates the `students` table
   and adds 2 sample rows).

Then in the terminal:
```bash
npm install
node server.js
```
- `GET /api/hello` → all students, from the database.
- `GET /api/hello/:id` → one student. A non-numeric id (e.g. `/api/hello/abc`)
  returns a clean `404` instead of crashing the server.

**Note:** `.env` is never committed or submitted — only `.env.example`
(without the real password) is.

---

## Common errors

| Message | Likely cause |
|---|---|
| `password authentication failed for user` | Wrong password in `.env` |
| `database "..." does not exist` | You didn't create `expense_tracker_practice` in pgAdmin, or the name in `.env` doesn't match |
| `relation "students" does not exist` | You forgot to run `init.sql` on that database |
| `Failed to fetch` (Task 1/2) | The server isn't running, or the URL/port is wrong |
| CORS error in console | `app.use(cors())` is missing or commented out |
