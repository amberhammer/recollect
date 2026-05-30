import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";
import BookCard from "../components/books/BookCard";

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

                <div className="flex-grow flex justify-center items-center">
                    <p>No books found in this collection.</p>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex justify-center p-4">
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-center">{displayName}</h2>
                    <div className="grid grid-cols-2 gap-5 max-h-[570px] w-[700px] overflow-y-auto no-scrollbar">
                        {books.map((book) => (
                            <BookCard
                                key={book.id}
                                title={book.title}
                                author={book.authors[0]}
                                thumbnail={book.thumbnail}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}