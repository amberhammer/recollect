export default function BorrowedBookControls({ book, onEdit, onFavoriteToggle, onReturn }) {
    const rating = book.rating ?? "—";
    const status = book.status || "borrowed";

    return (
        <div className="flex flex-row justify-end">
            <div className="flex flex-col w-80">
                <div className="flex items-center gap-4 mb-2">
                    <p className="text-xl font-semibold">★ {rating} / 5</p>
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
                        className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2 px-4 rounded w-20"
                    >
                        Return
                    </button>
                )}
            </div>
            <div>
                <button
                    type="button"
                    className="bg-taupe-400 hover:bg-taupe-500 text-black font-bold py-2 px-4 rounded"
                    onClick={onEdit}>
                    ...
                </button>
            </div>
        </div>
    );
}
