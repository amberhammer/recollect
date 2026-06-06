import { useState } from "react";
import { editLibraryEntry } from "../../api/booksApi";

export default function LibraryBookControls({ book, onEdit, onFavoriteUpdate, onLend }) {
    const [isFavorited, setIsFavorited] = useState(book?.is_favorite || false);
    const ratingDisplay = book.rating == null ? "No rating" : `${book.rating} / 5`;
    const statusDisplay = book.status?.replaceAll("_", " ").toUpperCase();

    const handleFavoriteToggle = async () => {
        try {
            const nextFavorite = !isFavorited;
            setIsFavorited(nextFavorite);
            const payload = {
                title: book.title,
                authors: book.authors,
                description: book.description,
                thumbnail: book.thumbnail,
                published_date: book.published_date,
                status: book.status,
                rating: book.rating,
                format: book.format,
                is_favorite: nextFavorite,
            };
            await editLibraryEntry(book.google_books_id, payload);
            onFavoriteUpdate(nextFavorite);
        } catch (err) {
            console.error("Error updating favorite status:", err);
            setIsFavorited(isFavorited);
        }
    };

    return (
        <div className="flex flex-row justify-end">
            <div className="flex flex-col w-80">
                <div className="flex items-center gap-5 mb-2">
                    <p className="text-xl font-semibold"><span className="text-yellow-500 text-2xl">★</span> {ratingDisplay}</p>
                    <button onClick={handleFavoriteToggle} className="text-3xl text-red-500 hover:scale-110 transition-transform">
                        {isFavorited ? "♥" : "♡"}
                    </button>
                </div>
                <p className="text-xl mb-2"><span className="font-semibold">STATUS:</span> {statusDisplay}</p>
                <p className="text-xl mb-3"><span className="font-semibold">FORMAT:</span> {book.format?.toUpperCase()}</p>
                <button onClick={onLend} className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2 px-4 rounded w-20">Lend</button>
            </div>
            <div>
                <button
                    className="bg-taupe-300 hover:bg-taupe-400 text-black text-sm font-bold py-2 px-2 rounded"
                    onClick={onEdit}>
                    ...
                </button>
            </div>
        </div>
    );
}
