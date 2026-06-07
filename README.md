# Recollect 📖

## Project Overview

Recollect is a personal library tracker for managing books, reading status, favourites, loans, and borrowed books. Users can search Google Books, save books to their library, track books loaned to contacts, and record books they are borrowing from others.

Live deployment: [Recollect](https://recollectlibrary.netlify.app/)

## Features

- User registration, login, and JWT-protected routes.
- Google Books search.
- Add, edit, delete, favourite, and rate library books.
- Track reading status and book format.
- View library collections such as all books, favourites, currently reading, to read, loaned out, and borrowed.
- Lend books to contacts and track loan history.
- Return loaned books.
- Add, edit, return, and delete borrowed books.
- Responsive React UI.
- Backend route tests with Jest and Supertest.

## Installation Instructions

1. Clone the repository.

   ```bash
   git clone <repository-url>
   cd recollect
   ```

2. Install server dependencies.

   ```bash
   cd server
   npm install
   ```

3. Create `server/.env`.

   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
   JWT_SECRET=<your-jwt-secret>
   API_KEY=<your-google-books-api-key>
   PORT=3000
   ```

4. Run database migrations.

   ```bash
   npm run db:migrate
   ```

5. Start the server.

   ```bash
   npm run dev
   ```

6. Install client dependencies in a second terminal.

   ```bash
   cd client
   npm install
   ```

7. Create `client/.env`.

   ```env
   VITE_API_URL=http://localhost:3000
   ```

8. Start the client.

   ```bash
   npm run dev
   ```

## Usage

Register for an account or log in with an existing account. Search for books using the navigation search bar, then add books to your library. From a book detail page, update rating, favourite status, reading status, and format, or lend the book to a contact. Use the Borrowed collection to add books borrowed from others and mark them returned when finished.

## Technologies Used

- React
- React Router
- Vite
- Tailwind CSS
- Axios
- Node.js
- Express
- PostgreSQL
- bcrypt
- JSON Web Tokens
- Google Books API
- Jest
- Supertest
