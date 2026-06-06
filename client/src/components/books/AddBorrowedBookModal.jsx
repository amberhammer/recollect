import { useEffect, useState } from "react";
import { getContacts } from "../../api/contactsApi";
import { searchBooks } from "../../api/booksApi";
import SearchBar from "../layout/SearchBar";
import BookCard from "./BookCard";
import NoThumbnailPlaceholder from "./NoThumbnailPlaceholder";

export default function AddBorrowedBookModal({ isOpen, onClose, onSave }) {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [borrowedDate, setBorrowedDate] = useState(new Date().toISOString().slice(0, 10));

  const hasContact = selectedContactId || newContactName.trim();
  const canSave = selectedBook && hasContact && borrowedDate;

  useEffect(() => {
    if (!isOpen) return;

    const fetchContacts = async () => {
      try {
        setContactsLoading(true);
        setContactsError(null);
        const contacts = await getContacts();
        setContacts(contacts);
      } catch (err) {
        console.error(err);
        setContactsError("Failed to load contacts.");
      } finally {
        setContactsLoading(false);
      }
    };

    fetchContacts();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (query) => {
    try {
      setSearchLoading(true);
      setSearchError(null);
      setSelectedBook(null);
      const results = await searchBooks(query);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setSearchError("Failed to search books.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setSearchResults([]);
  };

  const handleSave = () => {
    if (!canSave) return;

    onSave?.({
      book: selectedBook,
      contact_id: selectedContactId || null,
      contact_name: newContactName.trim() || null,
      borrowed_date: borrowedDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Borrowed Book</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search Google Books..."
            />

            {(searchLoading || searchError || searchResults.length > 0) && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                {searchLoading && <p className="px-3 py-2 text-sm text-gray-600">Searching...</p>}
                {searchError && <p className="px-3 py-2 text-sm text-red-500">{searchError}</p>}
                {!searchLoading && !searchError && searchResults.map((book) => (
                  <button
                    key={book.google_books_id}
                    type="button"
                    onClick={() => handleSelectBook(book)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-taupe-200"
                  >
                    {book.thumbnail && (
                      <img src={book.thumbnail} alt={`${book.title} cover`} className="h-12 w-8 rounded object-cover" />
                    )}
                    {!book.thumbnail && (<NoThumbnailPlaceholder />)}
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{book.title}</span>
                      <span className="block truncate text-sm text-gray-600">
                        {book.authors?.join(", ") || "Unknown Author"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedBook && (
            <BookCard
              title={selectedBook.title}
              author={selectedBook.authors || "Unknown Author"}
              thumbnail={selectedBook.thumbnail}
              publishedDate={selectedBook.published_date}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Borrowed From</label>
            <select
              value={selectedContactId}
              onChange={(e) => {
                setSelectedContactId(e.target.value);
                setNewContactName("");
              }}
              disabled={contactsLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">{contactsLoading ? "Loading contacts..." : "Select a contact"}</option>
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
            <input
              type="date"
              value={borrowedDate}
              onChange={(e) => setBorrowedDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="mr-2 h-10 rounded bg-emerald-900 px-4 py-2 font-bold text-white hover:bg-emerald-950 disabled:bg-gray-400"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
