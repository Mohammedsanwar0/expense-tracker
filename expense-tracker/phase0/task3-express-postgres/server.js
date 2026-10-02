require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(cors());

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

// GET /api/hello now reads real rows from PostgreSQL
app.get("/api/hello", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// GET /api/hello/:id -> one student, with a parameterized query
app.get("/api/hello/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Check the id BEFORE querying, so PostgreSQL never sees text where it
  // expects an integer (that would throw "invalid input syntax for type integer").
  if (!Number.isInteger(id)) {
    return res.status(404).json({ message: "Invalid id" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
