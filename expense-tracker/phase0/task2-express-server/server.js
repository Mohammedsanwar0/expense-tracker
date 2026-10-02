const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Without this line, a page opened with Live Server on a different port
// (e.g. http://127.0.0.1:5500) would get a CORS error in the console
// when it tries to fetch() this server. Comment it out to reproduce that
// error on purpose, then uncomment it to fix it.
app.use(cors());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/api/expenses", (req, res) => {
  res.json([
    { id: 1, title: "Lunch", amount: 4.5, category: "Food", date: "2026-01-15" },
    { id: 2, title: "Bus ticket", amount: 1.25, category: "Transport", date: "2026-01-16" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Try http://localhost:3000/api/doesnotexist in the browser -> Express
// answers with a plain "Cannot GET /api/doesnotexist" and status 404.
