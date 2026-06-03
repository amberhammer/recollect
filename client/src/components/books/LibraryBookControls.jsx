import { useState } from "react";
import { editLibraryEntry } from "../../api/booksApi";

export default function LibraryBookControls({ book, onEdit, onFavoriteUpdate }) {
    const [isFavorited, setIsFavorited] = useState(book?.is_favorite || false);

    const handleFavoriteToggle = async () => {
        try {
            setIsFavorited(!isFavorited);
            const payload = {
                title: book.title,
                authors: book.authors,
                description: book.description,
                thumbnail: book.thumbnail,
                published_date: book.published_date,
                status: book.status,
                rating: book.rating,
                format: book.format,
                is_favorite: !isFavorited,
            }
            await editLibraryEntry(book.google_books_id, payload);
            onFavoriteUpdate(!isFavorited);
        } catch (err) {
            console.error("Error updating favorite status:", err);
            setIsFavorited(isFavorited);
        }
    };

    return (
        <div className="flex flex-row">
            <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-2">
                    <p className="text-xl font-semibold">★  {book.rating} / 5</p>
                    <button onClick={handleFavoriteToggle} className="text-3xl text-red-500 hover:scale-110 transition-transform">
                        {isFavorited ? "♥" : "♡"}
                    </button>
                </div>
                <p className="text-xl mb-2"><span className="font-semibold">STATUS:</span> {book.status?.toUpperCase()}</p>
                <p className="text-xl mb-3"><span className="font-semibold">FORMAT:</span> {book.format?.toUpperCase()}</p>
                <button className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2 px-4 rounded">Borrow</button>
            </div>
            <div>
                <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={() => {
                    console.log("Edit clicked");
                    onEdit();
                }}>...</button>
            </div>
        </div>
    );
}
