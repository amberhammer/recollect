import LibraryBookControls from "./LibraryBookControls";
import AddToLibraryButton from "./AddToLibraryButton";
import ReturnButton from "./ReturnButton";
import NoThumbnailPlaceholder from "./NoThumbnailPlaceholder";

export default function BookDetailCard({ bookData, isInLibrary, onAddToLibrary, onEdit, onDelete, onLend, onFavoriteUpdate, onReturnLoan }) {
    const currentLoan = bookData.currentLoan;
    const loanHistoryRows = (bookData.loanHistory || [])
        .filter((loan) => loan.id !== currentLoan?.id)
        .sort((a, b) => new Date(b.loaned_date) - new Date(a.loaned_date));
    const hasAnyLoans = bookData.loanHistory.length > 0;

    const getContactName = (loan) => loan?.contact_name || loan?.name || "—";
    const formatDate = (date) => date ? String(date).slice(0, 10) : "—";
    const getLoanDate = (loan, dateKey) => formatDate(loan?.[dateKey]);

    return (
        <div className="bg-taupe-200 rounded-4xl rounded-b-none shadow-md w-[600px] mt-6">
            <div className="flex gap-6 m-8 mb-6 pt-8">
                {bookData.book.thumbnail ? (
                    <img src={bookData.book.thumbnail} alt={`${bookData.book.title} cover`} className="h-52 rounded" />
                ) : (
                    <NoThumbnailPlaceholder />
                )}
                {isInLibrary ? (
                    <LibraryBookControls book={bookData.libraryEntry} onEdit={onEdit} onDelete={onDelete} onLend={onLend} onFavoriteUpdate={onFavoriteUpdate} />
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
                <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400">
                    <p className="text-xl font-semibold">BORROWER:</p>
                </div>
                <div className="w-1/4 px-6 py-3 border-r-3 border-taupe-400">
                    <p className="text-xl font-semibold">LOANED:</p>
                </div>
                <div className="w-1/4 px-6 py-3">
                    <p className="text-xl font-semibold">RETURNED:</p>
                </div>
            </div>
            {currentLoan ? (
                <div className="flex border-b-3 border-taupe-300">
                    <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400">
                        <p className="text-lg">{getContactName(currentLoan)}</p>
                    </div>
                    <div className="w-1/4 px-6 py-3 border-r-3 border-taupe-400">
                        <p className="text-lg">{getLoanDate(currentLoan, "loaned_date")}</p>
                    </div>
                    <div className="w-1/4 px-6 py-3">
                        <ReturnButton onReturn={onReturnLoan} />
                    </div>
                </div>
            ) : !hasAnyLoans ? (
                <div className="flex">
                    <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400">
                        <p className="text-lg">—</p>
                    </div>
                    <div className="w-1/4 px-6 py-3 border-r-3 border-taupe-400">
                        <p className="text-lg">—</p>
                    </div>
                    <div className="w-1/4 px-6 py-3">
                        <p className="text-lg">—</p>
                    </div>
                </div>
            ) : null}
            <div>
                {loanHistoryRows.map((loan) => (
                    <div key={loan.id} className="flex border-b-3 border-taupe-300">
                        <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400">
                            <p className="text-lg">{getContactName(loan)}</p>
                        </div>
                        <div className="w-1/4 px-6 py-3 border-r-3 border-taupe-400">
                            <p className="text-lg">{getLoanDate(loan, "loaned_date")}</p>
                        </div>
                        <div className="w-1/4 px-6 py-3">
                            <p className="text-lg">{getLoanDate(loan, "returned_date")}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="min-h-100 flex">
                <div className="w-1/2 px-8 py-3 border-r-3 border-taupe-400" />
                <div className="w-1/4 px-6 py-3 border-r-3 border-taupe-400" />
                <div className="w-1/4 px-6 py-3" />
            </div>
        </div>
    );
}
