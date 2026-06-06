CREATE UNIQUE INDEX IF NOT EXISTS loans_one_active_per_book
  ON loans (user_book_id)
  WHERE returned_date IS NULL;

CREATE INDEX IF NOT EXISTS user_books_user_id_idx ON user_books(user_id);
CREATE INDEX IF NOT EXISTS user_books_status_idx ON user_books(user_id, status);
CREATE INDEX IF NOT EXISTS user_books_favorites_idx ON user_books(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts(user_id);
CREATE INDEX IF NOT EXISTS loans_user_book_id_idx ON loans(user_book_id);
CREATE INDEX IF NOT EXISTS borrowed_books_user_id_idx ON borrowed_books(user_id);
CREATE INDEX IF NOT EXISTS borrowed_books_active_idx ON borrowed_books(user_id, returned_date);
