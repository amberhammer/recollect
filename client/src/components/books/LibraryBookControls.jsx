export default function LibraryBookControls({ book, isFavorited, onFavoriteToggle }) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-2">
                <p className="text-xl font-semibold">★  {book.rating} / 5</p>
                <button onClick={onFavoriteToggle} className="text-3xl hover:scale-110 transition-transform">
                    {isFavorited ? "♥" : "♡"}
                </button>
            </div>
            <p className="text-xl mb-2"><span className="font-semibold">STATUS:</span> {book.status?.toUpperCase()}</p>
            <p className="text-xl mb-3"><span className="font-semibold">FORMAT:</span> {book.format?.toUpperCase()}</p>
            <button className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2 px-4 rounded">Borrow</button>
        </div>
    );
}
