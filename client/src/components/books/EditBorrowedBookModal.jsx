import { useState } from "react";

export default function EditBorrowedBookModal({ isOpen, onClose, onDelete, book, contacts = [], contactsLoading = false, contactsError = null, onSave }) {
    const [status, setStatus] = useState(book.status || "borrowed");
    const [rating, setRating] = useState(book.rating ?? "");
    const [isFavorite, setIsFavorite] = useState(!!book.is_favorite);
    const [selectedContactId, setSelectedContactId] = useState(book.contact_id || "");
    const [newContactName, setNewContactName] = useState("");
    const [borrowedDate, setBorrowedDate] = useState(book.borrowed_date ? String(book.borrowed_date).slice(0, 10) : new Date().toISOString().slice(0, 10));

    if (!isOpen) return null;
    if (!book) return null;

    const handleSubmit = () => {
        onSave({
            ...book,
            status,
            rating: rating === "" ? null : Number(rating),
            is_favorite: isFavorite,
            contact_id: selectedContactId || null,
            contact_name: newContactName.trim() || null,
            borrowed_date: borrowedDate,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Borrowed Book</h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                            <option value="borrowed">Borrowed</option>
                            <option value="currently_reading">Currently Reading</option>
                            <option value="read">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lender</label>
                        <select
                            value={selectedContactId}
                            onChange={(e) => {
                                setSelectedContactId(e.target.value);
                                setNewContactName("");
                            }}
                            disabled={contactsLoading}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">{contactsLoading ? "Loading contacts..." : "Select a lender"}</option>
                            {contacts.map((contact) => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.name}
                                </option>
                            ))}
                        </select>
                        {contactsError && <p className="mt-1 text-sm text-red-500">{contactsError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Add New Contact</label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={newContactName}
                            onChange={(e) => {
                                setNewContactName(e.target.value);
                                setSelectedContactId("");
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Borrowed Date</label>
                        <input type="date" value={borrowedDate} onChange={(e) => setBorrowedDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-700">Mark as Favorite</label>
                    </div>
                </div>

                <div className="mt-6 flex items-center">
                    <button type="button" onClick={handleSubmit} className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold h-10 py-2 px-4 rounded mr-2">
                        Save
                    </button>
                    <button type="button" onClick={onDelete} className="bg-gray-500 hover:bg-gray-600 text-white font-bold h-10 py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
