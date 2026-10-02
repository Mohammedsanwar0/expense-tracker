-- Run this once against the expense_tracker_practice database
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO students (name) VALUES ('Layla'), ('Omar');
