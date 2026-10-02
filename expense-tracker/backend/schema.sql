-- Run this once against an empty "expense_tracker" database.

CREATE TABLE IF NOT EXISTS expenses (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  amount     NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  category   TEXT NOT NULL CHECK (
                category IN ('Food', 'Transport', 'Bills', 'Entertainment', 'Other')
             ),
  date       DATE NOT NULL
);

INSERT INTO expenses (title, amount, category, date) VALUES
  ('Lunch',        4.50,  'Food',          '2026-10-01'),
  ('Bus ticket',   1.25,  'Transport',     '2026-10-01'),
  ('Electricity',  45.00, 'Bills',         '2026-10-01'),
  ('Cinema',       12.00, 'Entertainment', '2026-10-01'),
  ('Notebook',     3.75,  'Other',         '2026-10-01');
