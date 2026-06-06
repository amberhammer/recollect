CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY,
  user_book_id INTEGER NOT NULL REFERENCES user_books(id) ON DELETE CASCADE,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE RESTRICT,
  loaned_date DATE NOT NULL,
  returned_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (returned_date IS NULL OR returned_date >= loaned_date)
);