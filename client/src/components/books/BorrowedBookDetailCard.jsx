import BorrowedBookControls from "./BorrowedBookControls";
import NoThumbnailPlaceholder from "./NoThumbnailPlaceholder";

export default function BorrowedBookDetailCard({ book, onEdit, onFavoriteToggle, onReturn }) {
    const formatDate = (date) => date ? String(date).slice(0, 10) : "—";

    return (
        <div className="bg-taupe-200 rounded-4xl rounded-b-none shadow-md w-[600px] mt-6">
            <div className="flex gap-6 m-8 mb-6 pt-8">
                {book.thumbnail ? (
                    <img src={book.thumbnail} alt={`${book.title} cover`} className="h-52 rounded" />
                ) : (
                    <NoThumbnailPlaceholder />
                )}
                <BorrowedBookControls
                    book={book}
                    onEdit={onEdit}
                    onFavoriteToggle={onFavoriteToggle}
                    onReturn={onReturn}
                />
            </div>
            <div>
                <p className="text-xl border-t-3 border-taupe-400 px-8 py-3"><span className="font-semibold">TITLE:</span> {book.title}</p>
            </div>
            <div>
                <p className="text-xl border-t-3 border-b-3 border-taupe-400 px-8 py-3"><span className="font-semibold">AUTHOR:</span> {book.author || "Unknown Author"}</p>
            </div>
            <div className="flex border-b-3 border-taupe-400">
                <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-xl font-semibold">LENDER:</p>
                </div>
                <div className="w-1/2 px-8 py-3">
                    <p className="text-xl font-semibold">BORROWED:</p>
                </div>
            </div>
            <div className="flex">
                <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-lg">{book.contact_name || book.lender_name || "—"}</p>
                </div>
                <div className="w-1/2 px-8 py-3">
                    <p className="text-lg">{formatDate(book.borrowed_date)}</p>
                </div>
            </div>
            <div className="min-h-100 flex">
                <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400" />
                <div className="w-1/2 px-8 py-3" />
            </div>
        </div>
    );
}
