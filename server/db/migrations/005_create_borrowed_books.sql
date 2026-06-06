CREATE TABLE IF NOT EXISTS borrowed_books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  google_books_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  thumbnail TEXT,
  published_date TEXT,
  rating INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE RESTRICT,
  borrowed_date DATE NOT NULL,
  returned_date DATE,
  status TEXT NOT NULL DEFAULT 'borrowed',
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (status IN ('borrowed', 'currently_reading', 'read')),
  CHECK (returned_date IS NULL OR returned_date >= borrowed_date)
);