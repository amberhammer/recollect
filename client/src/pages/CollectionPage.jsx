import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";
import BackButton from "../components/layout/BackButton";
import BookGrid from "../components/books/BookGrid";

export default function CollectionPage() {
  const { collection } = useParams();
  const { token } = useAuth();

  const [books, setBooks] = useState([]);
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

    borrowed: {
      displayName: "Borrowed",
    },

    borrowing: {
      displayName: "Borrowing",
    },
  };

  const currentCollection = collection || "all";
  const currentConfig = collections[currentCollection] || collections.all;
  const displayName = currentConfig.displayName;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        let endpoint = "/api/library";
        if (currentCollection !== "all") {
          endpoint = `/api/library/${currentCollection}`;
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
            <div className="grid grid-cols-[96px_1fr_96px] items-center mb-6">
              <BackButton to="/" />
              <h2 className="text-2xl font-bold text-center">{displayName}</h2>
              <div aria-hidden="true" />
            </div>
            <p className="text-center">No books found in this collection.</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <BookGrid displayName={displayName} books={books} backTo="/" />

      <Footer />
    </div>
  );
}
