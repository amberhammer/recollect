CREATE TABLE IF NOT EXISTS user_books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  google_books_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  thumbnail TEXT,
  published_date TEXT,
  status TEXT NOT NULL DEFAULT 'to_read',
  rating INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  format TEXT NOT NULL DEFAULT 'physical',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (user_id, google_books_id),
  CHECK (status IN ('to_read', 'currently_reading', 'read')),
  CHECK (format IN ('physical', 'ebook', 'audiobook'))
);