export default function BorrowedBookControls({ book, onEdit, onFavoriteToggle, onReturn }) {
    const ratingDisplay = book.rating == null ? "No rating" : `${book.rating} / 5`;
    const status = book.status || "borrowed";

    return (
        <div className="flex flex-row justify-end">
            <div className="flex flex-col w-80">
                <div className="flex items-center gap-5 mb-2">
                    <p className="text-xl font-semibold"><span className="text-yellow-500 text-2xl">★</span> {ratingDisplay}</p>
                    <button
                        type="button"
                        onClick={onFavoriteToggle}
                        className="text-3xl text-red-500 hover:scale-110 transition-transform"
                    >
                        {book.is_favorite ? "♥" : "♡"}
                    </button>
                </div>
                <p className="text-xl mb-4"><span className="font-semibold">STATUS:</span> {status.replaceAll("_", " ").toUpperCase()}</p>
                {!book.returned_date && (
                    <button
                        type="button"
                        onClick={onReturn}
                        className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2 px-4 rounded w-22"
                    >
                        Return
                    </button>
                )}
            </div>
            <div>
                <button
                    type="button"
                    className="bg-taupe-300 hover:bg-taupe-400 text-black text-sm font-bold py-2 px-2 rounded"
                    onClick={onEdit}
                >
                    ...
                </button>
            </div>
        </div>
    );
}
