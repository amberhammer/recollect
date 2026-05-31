import { useState } from "react";
import LibraryBookControls from "./LibraryBookControls";
import AddToLibraryButton from "./AddToLibraryButton";

import useAuth from "../../hooks/useAuth";
import { addBookToLibrary } from "../../api/booksApi";

export default function BookDetailCard({ bookData }) {
    const [isFavorited, setIsFavorited] = useState(bookData.libraryEntry?.isFavorite || false);
    const [isInLibrary, setIsInLibrary] = useState(bookData.libraryEntry !== null);

    const { token } = useAuth();

    const handleAddToFavorites = () => {
        setIsFavorited(!isFavorited);
        // TODO: Add API call to save to user's favorites
    };

    const handleAddToLibrary = async () => {
        try {
            const payload = {
                google_books_id: bookData.book.google_books_id,
                title: bookData.book.title,
                authors: bookData.book.authors,
                description: bookData.book.description,
                thumbnail: bookData.book.thumbnail,
                published_date: bookData.book.published_date,
                status: "to_read",
                rating: null,
                format: "physical",
            };

            const savedBook = await addBookToLibrary(payload, token);
            console.log(savedBook);

        } catch (err) {
            console.error(err);
        } finally {
            setIsInLibrary(true);
        }
    };

    return (
        <div className="bg-taupe-200 rounded-4xl rounded-b-none shadow-md w-[600px] mt-6">
            <div className="flex gap-6 m-8 mb-6">
                <img src={bookData.book.thumbnail} alt={`${bookData.book.title} cover`} className="h-52 rounded" />
                {isInLibrary ? (
                    <LibraryBookControls book={bookData.libraryEntry} isFavorited={isFavorited} onFavoriteToggle={handleAddToFavorites} />
                ) : (
                    <AddToLibraryButton onAdd={handleAddToLibrary} />
                )}
            </div>
            <div>
                <p className="text-xl border-t-3 border-taupe-400 px-8 py-3"><span className="font-semibold">TITLE:</span> {bookData.book.title}</p>
            </div>
            <div>
                <p className="text-xl border-t-3 border-b-3 border-taupe-400 px-8 py-3"><span className="font-semibold">AUTHOR:</span> {bookData.book.authors.join(", ") || "Unknown"}</p>
            </div>
            <div className="flex border-b-3 border-taupe-400">
                <div className="w-2/3 px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-xl font-semibold">BORROWER:</p>
                </div>
                <div className="w-1/3 px-8 py-3">
                    <p className="text-xl font-semibold">DATE:</p>
                </div>
            </div>
            <div className="flex">
                <div className="w-2/3 px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-lg">{bookData.libraryEntry?.borrower || "—"}</p>
                </div>
                <div className="w-1/3 px-8 py-3">
                    <p className="text-lg">{bookData.libraryEntry?.borrowDate || "—"}</p>
                </div>
            </div>
            <div className="flex h-100">
                <div className="w-2/3 px-8 py-3 border-r-3 border-taupe-400">
                </div>
                <div className="w-1/3 px-8 py-3">
                </div>
            </div>
        </div>
    )
}