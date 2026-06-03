import LibraryBookControls from "./LibraryBookControls";
import AddToLibraryButton from "./AddToLibraryButton";

export default function BookDetailCard({ bookData, isInLibrary, onAddToLibrary, onEdit, onDelete, onFavoriteUpdate }) {
    return (
        <div className="bg-taupe-200 rounded-4xl rounded-b-none shadow-md w-[600px] mt-6">
            <div className="flex gap-6 m-8 mb-6">
                <img src={bookData.book.thumbnail} alt={`${bookData.book.title} cover`} className="h-52 rounded" />
                {isInLibrary ? (
                    <LibraryBookControls book={bookData.libraryEntry} onEdit={onEdit} onDelete={onDelete} onFavoriteUpdate={onFavoriteUpdate} />
                ) : (
                    <AddToLibraryButton onAdd={onAddToLibrary} />
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