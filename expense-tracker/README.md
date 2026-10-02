# Expense Tracker

A full-stack expense tracker: Node.js + Express + PostgreSQL backend, Bootstrap
front-end. Built following the Dalil Academy 11-day roadmap (Phase 0 → Phase 3).

## Project structure

```
expense-tracker/
├── phase0/                     # Phase 0 self-study tasks (not part of the app)
│   ├── task1-fetch-cards/
│   ├── task2-express-server/
│   └── task3-express-postgres/
├── backend/                    # Phase 1: the API
│   ├── server.js
│   ├── db.js
│   ├── schema.sql
│   ├── package.json
│   └── .env.example
├── frontend/                   # Phase 2: the UI
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── README.md
```

## Run it from zero

1. **Database**
   ```
   createdb expense_tracker        # or create it in pgAdmin
   psql -d expense_tracker -f backend/schema.sql
   ```
2. **Backend**
   ```
   cd backend
   cp .env.example .env            # then edit PGPASSWORD
   npm install
   npm start                       # http://localhost:3000
   ```
3. **Frontend**
   Open `frontend/index.html` with the Live Server extension (the backend
   must already be running, since the front-end has no offline/in-memory mode).

## API

| Method | Path                | Success | Errors   |
|--------|---------------------|---------|----------|
| GET    | /api/expenses       | 200     | —        |
| GET    | /api/expenses/:id   | 200     | 404      |
| POST   | /api/expenses       | 201     | 400      |
| PUT    | /api/expenses/:id   | 200     | 400, 404 |
| DELETE | /api/expenses/:id   | 200     | 404      |

Expense shape:
```json
{ "id": 1, "title": "Lunch", "amount": 4.5, "category": "Food", "date": "2026-01-15" }
```
Allowed categories: `Food`, `Transport`, `Bills`, `Entertainment`, `Other`.

> Note: the Arabic and English versions of the roadmap disagree on the date
> format (`DD-MM-YYYY` vs `YYYY-MM-DD`). This implementation returns ISO
> `YYYY-MM-DD`, which is unambiguous — change the `to_char` format string in
> `backend/server.js` if your instructor wants `DD-MM-YYYY` instead.

## Bonus implemented

- Category chart (Chart.js) below the expenses table.

## Hardest part / what to watch for

- `pg` returns `NUMERIC` columns as strings and `DATE` columns as JS `Date`
  objects (which can shift a day depending on timezone). Both are fixed in
  the SQL itself with `amount::float8` and `to_char(date, 'YYYY-MM-DD')`
  rather than in JavaScript, so every route returns clean, consistent JSON.
- Every `:id` is validated (`Number.isInteger`) **before** it reaches a
  query, so a non-numeric id returns a clean 404 instead of crashing the
  server with a PostgreSQL type error.


Video Link :
