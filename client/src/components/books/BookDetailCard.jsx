import { useState } from "react";
import LibraryBookControls from "./LibraryBookControls";
import AddToLibraryButton from "./AddToLibraryButton";

export default function BookDetailCard( { book, inLibrary = false } ) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [isInLibrary, setIsInLibrary] = useState(inLibrary);

    const handleAddToFavorites = () => {
        setIsFavorited(!isFavorited);
        // TODO: Add API call to save to user's favorites
    };

    const handleAddToLibrary = () => {
        setIsInLibrary(true);
        // TODO: Add API call to add book to user's library
    };

    return (
        <div className="bg-taupe-200 rounded-4xl shadow-md w-[600px] mt-6">
            <div className="flex gap-6 m-8 mb-6">
                <img src={book.thumbnail} alt={`${book.title} cover`} className="h-52 rounded" />
                {isInLibrary ? (
                    <LibraryBookControls book={book} isFavorited={isFavorited} onFavoriteToggle={handleAddToFavorites} />
                ) : (
                    <AddToLibraryButton book={book} onAdd={handleAddToLibrary} />
                )}
            </div>
            <div>
                <p className="text-xl border-t-3 border-taupe-400 px-8 py-3"><span className="font-semibold">TITLE:</span> {book.title}</p>
            </div>
            <div>
                <p className="text-xl border-t-3 border-b-3 border-taupe-400 px-8 py-3"><span className="font-semibold">AUTHOR:</span> {book.author}</p>
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
                    <p className="text-lg">{book.borrower || "—"}</p>
                </div>
                <div className="w-1/3 px-8 py-3">
                    <p className="text-lg">{book.borrowDate || "—"}</p>
                </div>
            </div>
        </div>
    )
}