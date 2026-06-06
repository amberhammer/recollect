CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, name)
);

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

CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY,
  user_book_id INTEGER NOT NULL REFERENCES user_books(id) ON DELETE CASCADE,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE RESTRICT,
  loaned_date DATE NOT NULL,
  returned_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (returned_date IS NULL OR returned_date >= loaned_date)
);

CREATE UNIQUE INDEX IF NOT EXISTS loans_one_active_per_book
  ON loans (user_book_id)
  WHERE returned_date IS NULL;

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

CREATE INDEX IF NOT EXISTS user_books_user_id_idx ON user_books(user_id);
CREATE INDEX IF NOT EXISTS user_books_status_idx ON user_books(user_id, status);
CREATE INDEX IF NOT EXISTS user_books_favorites_idx ON user_books(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts(user_id);
CREATE INDEX IF NOT EXISTS loans_user_book_id_idx ON loans(user_book_id);
CREATE INDEX IF NOT EXISTS borrowed_books_user_id_idx ON borrowed_books(user_id);
CREATE INDEX IF NOT EXISTS borrowed_books_active_idx ON borrowed_books(user_id, returned_date);
