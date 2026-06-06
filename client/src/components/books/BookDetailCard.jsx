import LibraryBookControls from "./LibraryBookControls";
import AddToLibraryButton from "./AddToLibraryButton";
import ReturnButton from "./ReturnButton";
import NoThumbnailPlaceholder from "./NoThumbnailPlaceholder";

export default function BookDetailCard({ bookData, isInLibrary, onAddToLibrary, onEdit, onDelete, onLend, onFavoriteUpdate, onReturnLoan }) {
    const currentLoan = bookData.currentLoan;
    const loanHistoryRows = (bookData.loanHistory || [])
        .filter((loan) => loan.id !== currentLoan?.id)
        .sort((a, b) => new Date(b.loaned_date) - new Date(a.loaned_date));
    const hasAnyLoans = (bookData.loanHistory || []).length > 0;

    const emptyValue = "\u2014";
    const getContactName = (loan) => loan?.contact_name || loan?.name || emptyValue;
    const formatDate = (date) => date ? String(date).slice(0, 10) : emptyValue;
    const getLoanDate = (loan, dateKey) => formatDate(loan?.[dateKey]);
    const loanGridColumns = "grid grid-cols-[minmax(0,1fr)_96px_96px] sm:grid-cols-[minmax(0,1fr)_128px_128px]";
    const controlsWrapperClass = "w-full min-w-0 [&>div]:w-full [&>div]:flex-col sm:[&>div]:flex-row [&>div]:items-start sm:[&>div]:items-stretch [&>div]:gap-2 sm:[&>div]:gap-0 [&_.w-80]:w-full sm:[&_.w-80]:w-80 [&_.text-xl]:text-base sm:[&_.text-xl]:text-xl [&_.text-3xl]:text-2xl sm:[&_.text-3xl]:text-3xl";

    return (
        <div className="bg-taupe-200 rounded-4xl rounded-b-none shadow-md w-full max-w-[600px] mt-4 sm:mt-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 m-4 sm:m-8 mb-4 sm:mb-6 pt-4 sm:pt-8 min-w-0">
                {bookData.book.thumbnail ? (
                    <img src={bookData.book.thumbnail} alt={`${bookData.book.title} cover`} className="h-36 sm:h-52 w-fit max-w-full rounded" />
                ) : (
                    <NoThumbnailPlaceholder className="w-28 h-36 sm:w-40 sm:h-52" />
                )}
                {isInLibrary ? (
                    <div className={controlsWrapperClass}>
                        <LibraryBookControls book={bookData.libraryEntry} onEdit={onEdit} onDelete={onDelete} onLend={onLend} onFavoriteUpdate={onFavoriteUpdate} />
                    </div>
                ) : (
                    <AddToLibraryButton onAdd={onAddToLibrary} />
                )}
            </div>
            <div>
                <p className="text-base sm:text-lg border-t-3 border-taupe-400 px-4 sm:px-8 py-3"><span className="font-semibold">TITLE:</span> {bookData.book.title} ({bookData.book.published_date ? new Date(bookData.book.published_date).getFullYear() : "Unknown"})</p>
            </div>
            <div>
                <p className="text-base sm:text-lg border-t-3 border-b-3 border-taupe-400 px-4 sm:px-8 py-3"><span className="font-semibold">AUTHOR:</span> {bookData.book.authors.join(", ") || "Unknown"}</p>
            </div>
            <div className={`${loanGridColumns} border-b-3 border-taupe-400`}>
                <div className="min-w-0 px-4 sm:px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-sm sm:text-xl font-semibold">BORROWER:</p>
                </div>
                <div className="px-3 sm:px-6 py-3 border-r-3 border-taupe-400">
                    <p className="text-sm sm:text-xl font-semibold">LOANED:</p>
                </div>
                <div className="px-3 sm:px-6 py-3">
                    <p className="text-sm sm:text-xl font-semibold">RETURNED:</p>
                </div>
            </div>
            {currentLoan ? (
                <div className={`${loanGridColumns} border-b-3 border-taupe-300`}>
                    <div className="min-w-0 px-4 sm:px-8 py-3 border-r-3 border-taupe-400 items-center flex">
                        <p className="text-sm sm:text-base truncate">{getContactName(currentLoan)}</p>
                    </div>
                    <div className="px-3 sm:px-6 py-3 border-r-3 border-taupe-400 items-center flex">
                        <p className="text-sm sm:text-base">{getLoanDate(currentLoan, "loaned_date")}</p>
                    </div>
                    <div className="px-3 sm:px-6 py-3">
                        <ReturnButton onReturn={onReturnLoan} />
                    </div>
                </div>
            ) : !hasAnyLoans ? (
                <div className={loanGridColumns}>
                    <div className="min-w-0 px-4 sm:px-8 py-4 border-r-3 border-taupe-400">
                        <p className="text-base sm:text-lg">{emptyValue}</p>
                    </div>
                    <div className="px-3 sm:px-6 py-4 border-r-3 border-taupe-400">
                        <p className="text-base sm:text-lg">{emptyValue}</p>
                    </div>
                    <div className="px-3 sm:px-6 py-4">
                        <p className="text-base sm:text-lg">{emptyValue}</p>
                    </div>
                </div>
            ) : null}
            <div>
                {loanHistoryRows.map((loan) => (
                    <div key={loan.id} className={`${loanGridColumns} border-b-3 border-taupe-300`}>
                        <div className="min-w-0 px-4 sm:px-8 py-4 border-r-3 border-taupe-400">
                            <p className="text-sm sm:text-base truncate">{getContactName(loan)}</p>
                        </div>
                        <div className="px-3 sm:px-6 py-4 border-r-3 border-taupe-400">
                            <p className="text-sm sm:text-base">{getLoanDate(loan, "loaned_date")}</p>
                        </div>
                        <div className="px-3 sm:px-6 py-4">
                            <p className="text-sm sm:text-base">{getLoanDate(loan, "returned_date")}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${loanGridColumns} min-h-100`}>
                <div className="min-w-0 px-4 sm:px-8 py-4 border-r-3 border-taupe-400" />
                <div className="px-3 sm:px-6 py-4 border-r-3 border-taupe-400" />
                <div className="px-3 sm:px-6 py-4" />
            </div>
        </div>
    );
}
