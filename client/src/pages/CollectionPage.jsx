import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { apiUrl } from "../api/apiConfig";
import { createBorrowedBook } from "../api/borrowedBooksApi";

import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";
import BackButton from "../components/layout/BackButton";
import BookGrid from "../components/books/BookGrid";
import AddBorrowedBookModal from "../components/books/AddBorrowedBookModal";

export default function CollectionPage() {
  const { collection } = useParams();
  const { token } = useAuth();

  const [books, setBooks] = useState([]);
  const [showAddBorrowedBookModal, setShowAddBorrowedBookModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const collections = {
    all: {
      displayName: "All Books",
    },

    favorites: {
      displayName: "Favorites",
    },

    "currently-reading": {
      displayName:
        "Currently Reading",
    },

    "to-read": {
      displayName:
        "To Read",
    },

    "loaned-out": {
      displayName: "Loaned Out",
    },

    "borrowed-books": {
      displayName: "Borrowed",
    },
  };

  const currentCollection = collection || "all";
  const currentConfig = collections[currentCollection] || collections.all;
  const displayName = currentConfig.displayName;
  const isBorrowedBooksCollection = currentCollection === "borrowed-books";

  const addBorrowedBookButton = isBorrowedBooksCollection ? (
    <button
      type="button"
      onClick={() => setShowAddBorrowedBookModal(true)}
      className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2 px-3 rounded text-sm"
    >
      <span className="hidden sm:inline">Add Borrowed Book</span>
      <span className="sm:hidden">+ Add</span>
    </button>
  ) : null;

  const handleCreateBorrowedBook = async ({ book, contact_id, contact_name, borrowed_date }) => {
    try {
      const payload = {
        google_books_id: book.google_books_id,
        title: book.title,
        author: Array.isArray(book.authors) ? book.authors.join(", ") : book.authors,
        thumbnail: book.thumbnail,
        published_date: book.published_date,
        rating: null,
        status: "borrowed",
        is_favorite: false,
        contact_id,
        contact_name,
        borrowed_date,
      };

      const createdBorrowedBook = await createBorrowedBook(payload, token);
      setBooks(prev => [createdBorrowedBook, ...prev]);
      setShowAddBorrowedBookModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        let endpoint = apiUrl("/api/library");
        if (currentCollection !== "all") {
          endpoint = apiUrl(`/api/library/${currentCollection}`);
        }

        const response =
          await axios.get(
            endpoint,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setBooks(response.data);

      } catch (err) {
        console.error(err);
        setError(
          "Failed to load books."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchBooks();

  }, [currentCollection, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />

        <div className="flex-grow flex justify-center items-center">
          <p>Loading...</p>
        </div>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />

        <div className="flex-grow flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>

        <Footer />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />

        <div className="flex-grow flex justify-center p-4">
          <div className="w-[700px]">
            <div className="grid grid-cols-[170px_1fr_170px] items-center mb-6">
              <BackButton to="/" />
              <h2 className="text-2xl font-bold text-center">{displayName}</h2>
              <div className="flex justify-end">{addBorrowedBookButton}</div>
            </div>
            <p className="text-center">No books found in this collection.</p>
          </div>
        </div>

        {showAddBorrowedBookModal && (
          <AddBorrowedBookModal
            isOpen={showAddBorrowedBookModal}
            onClose={() => setShowAddBorrowedBookModal(false)}
            onSave={handleCreateBorrowedBook}
          />
        )}

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <BookGrid
        displayName={displayName}
        books={books}
        backTo="/"
        headerAction={addBorrowedBookButton}
        getBookLink={isBorrowedBooksCollection ? (book) => `/borrowed-books/${book.id}` : null}
      />

      {showAddBorrowedBookModal && (
        <AddBorrowedBookModal
          isOpen={showAddBorrowedBookModal}
          onClose={() => setShowAddBorrowedBookModal(false)}
          onSave={handleCreateBorrowedBook}
        />
      )}

      <Footer />
    </div>
  );
}
