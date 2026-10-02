

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ALLOWED_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

// pg returns NUMERIC as a string and DATE as a JS Date object (which can
// shift a day depending on timezone). Casting/formatting them in the SQL
// itself avoids both problems.
const SELECT_COLUMNS = `
  id,
  title,
  amount::float8 AS amount,
  category,
  to_char(date, 'YYYY-MM-DD') AS date
`;

function validateExpenseBody(body) {
  const errors = [];
  const { title, amount, category, date } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("title is required");
  }
  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
    errors.push("amount must be a number greater than 0");
  }
  if (!ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`);
  }
  if (!date || isNaN(Date.parse(date))) {
    errors.push("date is required and must be a valid date");
  }

  return errors;
}

function parseId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/expenses - all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${SELECT_COLUMNS} FROM expenses ORDER BY date DESC, id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// GET /api/expenses/:id - one expense
app.get("/api/expenses/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ message: "Expense not found" });
  }

  try {
    const result = await pool.query(
      `SELECT ${SELECT_COLUMNS} FROM expenses WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// POST /api/expenses - add a new expense
app.post("/api/expenses", async (req, res) => {
  const errors = validateExpenseBody(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  const { title, amount, category, date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category, date)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_COLUMNS}`,
      [title.trim(), amount, category, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// PUT /api/expenses/:id - update an expense
app.put("/api/expenses/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const errors = validateExpenseBody(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  const { title, amount, category, date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE expenses
       SET title = $1, amount = $2, category = $3, date = $4
       WHERE id = $5
       RETURNING ${SELECT_COLUMNS}`,
      [title.trim(), amount, category, date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// DELETE /api/expenses/:id - delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ message: "Expense not found" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM expenses WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Expense Tracker API running on http://localhost:${PORT}`);
});
