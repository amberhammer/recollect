import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";
import BookCard from "../components/books/BookCard";

export default function CollectionPage() {
    // const books = [
    //     {
    //         id: 1,
    //         title: "To Kill a Mockingbird",
    //         authors: ["Harper Lee"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7725341-M.jpg",
    //         status: "read",
    //         isFavorite: true
    //     },
    //     {
    //         id: 2,
    //         title: "1984",
    //         authors: ["George Orwell"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7878060-M.jpg",
    //         status: "currently-reading",
    //         isFavorite: false
    //     },
    //     {
    //         id: 3,
    //         title: "The Great Gatsby",
    //         authors: ["F. Scott Fitzgerald"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7825252-M.jpg",
    //         status: "to-read",
    //         isFavorite: true
    //     },
    //     {
    //         id: 4,
    //         title: "Pride and Prejudice",
    //         authors: ["Jane Austen"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7896405-M.jpg",
    //         status: "read",
    //         isFavorite: true
    //     },
    //     {
    //         id: 5,
    //         title: "The Catcher in the Rye",
    //         authors: ["J.D. Salinger"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7825423-M.jpg",
    //         status: "to-read",
    //         isFavorite: false
    //     },
    //     {
    //         id: 6,
    //         title: "The Hobbit",
    //         authors: ["J.R.R. Tolkien"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7718610-M.jpg",
    //         status: "borrowed",
    //         isFavorite: false
    //     },
    //     {
    //         id: 7,
    //         title: "Harry Potter and the Sorcerer's Stone",
    //         authors: ["J.K. Rowling"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7725279-M.jpg",
    //         status: "currently-reading",
    //         isFavorite: true
    //     },
    //     {
    //         id: 8,
    //         title: "The Lord of the Rings: The Fellowship of the Ring",
    //         authors: ["J.R.R. Tolkien"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7898421-M.jpg",
    //         status: "borrowing",
    //         isFavorite: false
    //     },
    //     {
    //         id: 9,
    //         title: "Jane Eyre",
    //         authors: ["Charlotte Brontë"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7839455-M.jpg",
    //         status: "read",
    //         isFavorite: true
    //     },
    //     {
    //         id: 10,
    //         title: "Wuthering Heights",
    //         authors: ["Emily Brontë"],
    //         thumbnail: "https://covers.openlibrary.org/b/id/7850825-M.jpg",
    //         status: "borrowed",
    //         isFavorite: true
    //     }
    // ];

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