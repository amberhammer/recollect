import { useState } from "react";
import { editLibraryEntry } from "../../api/booksApi";

export default function EditLibraryEntryModal({ isOpen, onClose, book, onSave, onDelete }) {
    const [status, setStatus] = useState(book.status);
    const [rating, setRating] = useState(book.rating ?? "");
    const [format, setFormat] = useState(book.format);
    const [isFavorite, setIsFavorite] = useState(!!book.is_favorite);

    const handleSubmit = async () => {
        const payload = {
            ...book,
            status: status,
            rating: rating === "" ? null : Number(rating),
            format: format,
            is_favorite: isFavorite,
        };
        await editLibraryEntry(book.google_books_id, payload);
        const updatedEntry = payload;
        onSave(updatedEntry);
    }

    if (!isOpen) return null;
    if (!book) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-[90vw] lg:max-w-md rounded-lg bg-white p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Library Entry</h2>
                    <button onClick={onClose} className="text-gray-500 text-xl hover:text-gray-700">&times;</button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reading Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                            <option value="to_read">To Be Read</option>
                            <option value="currently_reading">Currently Reading</option>
                            <option value="read">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Format</label>
                        <select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                            <option value="physical">Physical</option>
                            <option value="ebook">eBook</option>
                            <option value="audiobook">Audiobook</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                        <label className="ml-3 block text-sm text-gray-700">Mark as Favorite</label>
                    </div>
                </div>
                <div className="mt-6 flex items-center">
                    <button type="button" onClick={handleSubmit} className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold h-10 py-2 px-4 rounded mr-2">
                        Save
                    </button>
                    <button type="button" onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
