import { useState } from "react";

export default function LendModal({ book, contacts = [], contactsLoading = false, contactsError = null, onClose, onSave, isOpen }) {
    const [selectedContactId, setSelectedContactId] = useState("");
    const [newContactName, setNewContactName] = useState("");
    const [loanedDate, setLoanedDate] = useState(new Date().toISOString().slice(0, 10));

    if (!isOpen) return null;
    if (!book) return null;

    const handleSubmit = () => {
        onSave?.({
            user_book_id: book.id,
            google_books_id: book.google_books_id,
            contact_id: selectedContactId || null,
            contact_name: newContactName.trim() || null,
            loaned_date: loanedDate,
        });
    };

    const hasBorrower = selectedContactId || newContactName.trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-[90vw] lg:max-w-md rounded-lg bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Lend Book</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Borrower:</label>
                        <select
                            value={selectedContactId}
                            onChange={(e) => {
                                setSelectedContactId(e.target.value);
                                setNewContactName("");
                            }}
                            disabled={contactsLoading}
                            className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                            <option value="">{contactsLoading ? "Loading contacts..." : "Select a borrower"}</option>
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
                            className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loaned Date</label>
                        <input
                            type="date"
                            value={loanedDate}
                            onChange={(e) => setLoanedDate(e.target.value)}
                            className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={!hasBorrower || !loanedDate}
                        className="bg-emerald-900 hover:bg-emerald-950 disabled:bg-gray-400 text-white font-bold h-10 py-2 px-4 rounded mr-2">
                        Save
                    </button>
                    <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold h-10 py-2 px-4 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
