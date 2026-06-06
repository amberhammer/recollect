import BorrowedBookControls from "./BorrowedBookControls";
import NoThumbnailPlaceholder from "./NoThumbnailPlaceholder";

export default function BorrowedBookDetailCard({ book, onEdit, onFavoriteToggle, onReturn }) {
    const emptyValue = "\u2014";
    const formatDate = (date) => date ? String(date).slice(0, 10) : emptyValue;
    const publishedYear = book.published_date ? new Date(book.published_date).getFullYear() : "Unknown";
    const detailGridColumns = "grid grid-cols-[minmax(0,1fr)_128px] sm:grid-cols-2";
    const controlsWrapperClass = "w-full min-w-0 [&>div]:w-full [&>div]:flex-col sm:[&>div]:flex-row [&>div]:items-start sm:[&>div]:items-stretch [&>div]:gap-2 sm:[&>div]:gap-0 [&_.w-80]:w-full sm:[&_.w-80]:w-80 [&_.text-xl]:text-base sm:[&_.text-xl]:text-xl [&_.text-3xl]:text-2xl sm:[&_.text-3xl]:text-3xl";

    return (
        <div className="bg-taupe-200 rounded-4xl rounded-b-none shadow-md w-full max-w-[600px] mt-4 sm:mt-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 m-4 sm:m-8 mb-4 sm:mb-6 pt-4 sm:pt-8 min-w-0">
                {book.thumbnail ? (
                    <img src={book.thumbnail} alt={`${book.title} cover`} className="h-36 sm:h-52 w-fit max-w-full rounded" />
                ) : (
                    <NoThumbnailPlaceholder className="w-28 h-36 sm:w-40 sm:h-52" />
                )}
                <div className={controlsWrapperClass}>
                    <BorrowedBookControls
                        book={book}
                        onEdit={onEdit}
                        onFavoriteToggle={onFavoriteToggle}
                        onReturn={onReturn}
                    />
                </div>
            </div>
            <div>
                <p className="text-base sm:text-lg border-t-3 border-taupe-400 px-4 sm:px-8 py-3"><span className="font-semibold">TITLE:</span> {book.title} ({publishedYear})</p>
            </div>
            <div>
                <p className="text-base sm:text-lg border-t-3 border-b-3 border-taupe-400 px-4 sm:px-8 py-3"><span className="font-semibold">AUTHOR:</span> {book.author || "Unknown Author"}</p>
            </div>
            <div className={`${detailGridColumns} border-b-3 border-taupe-400`}>
                <div className="min-w-0 px-4 sm:px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-sm sm:text-lg font-semibold">LENDER:</p>
                </div>
                <div className="px-3 sm:px-8 py-3">
                    <p className="text-sm sm:text-lg font-semibold">BORROWED:</p>
                </div>
            </div>
            <div className={detailGridColumns}>
                <div className="min-w-0 px-4 sm:px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-sm sm:text-lg truncate">{book.contact_name || book.lender_name || emptyValue}</p>
                </div>
                <div className="px-3 sm:px-8 py-3">
                    <p className="text-sm sm:text-lg">{formatDate(book.borrowed_date)}</p>
                </div>
            </div>
            <div className={`${detailGridColumns} min-h-100`}>
                <div className="min-w-0 px-4 sm:px-8 py-3 border-r-3 border-taupe-400" />
                <div className="px-3 sm:px-8 py-3" />
            </div>
        </div>
    );
}
