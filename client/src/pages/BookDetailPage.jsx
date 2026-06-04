import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { addBookToLibrary, deleteLibraryEntry } from "../api/booksApi";
import { getContacts } from "../api/contactsApi";

import NavBar from "../components/layout/NavBar";
import BackButton from "../components/layout/BackButton";
import Footer from "../components/layout/Footer";
import BookDetailCard from "../components/books/BookDetailCard";
import EditLibraryEntryModal from "../components/books/EditLibraryEntryModal";
import ConfirmDeleteModal from "../components/books/ConfirmDeleteModal";
import LendModal from "../components/books/LendModal";

export default function BookDetailPage() {
    const { googleBooksId } = useParams();
    const location = useLocation();
    const { token } = useAuth();

    const [bookData, setBookData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showLendModal, setShowLendModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [contactsError, setContactsError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isInLibrary = !!bookData?.libraryEntry;
    const backTo = location.state?.from || "/library";

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`/api/books/${googleBooksId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookData(response.data);
            } catch (err) {
                setError(err.response?.data || "Error fetching book details");
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [googleBooksId, token]);

    useEffect(() => {
        if (!showLendModal) return;

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
    }, [showLendModal]);

    const handleAddToLibrary = async () => {
        try {
            const payload = {
                google_books_id: bookData.book.google_books_id,
                title: bookData.book.title,
                authors: bookData.book.authors,
                description: bookData.book.description,
                thumbnail: bookData.book.thumbnail,
                published_date: bookData.book.published_date,
                status: "to_read",
                rating: null,
                format: "physical",
            };

            await addBookToLibrary(payload, token);

            setBookData(prev => ({
                ...prev,
                libraryEntry: payload,
            }));

        } catch (err) {
            console.error(err);
        }
    };

    const handleLibraryEntryUpdate = (updatedEntry) => {
        setBookData(prev => ({
            ...prev,
            libraryEntry: {
                ...prev.libraryEntry,
                ...updatedEntry,
            },
        }));
        setShowEditModal(false);
    };

    const handleOpenDeleteConfirm = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteFromLibrary = async () => {
        try {
            await deleteLibraryEntry(bookData.libraryEntry.google_books_id, token);
            setBookData(prev => ({
                ...prev,
                libraryEntry: null,
            }));
            setShowDeleteConfirm(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavoriteUpdate = (isFavorite) => {
        setBookData(prev => ({
            ...prev,
            libraryEntry: {
                ...prev.libraryEntry,
                is_favorite: isFavorite,
            },
        }));
    };

    // const handleCreateLoan = async (contactId) => {

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar />

                <div className="flex-grow flex justify-center items-center">
                    <p>Loading...</p>
                </div>

                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar />

                <div className="flex-grow flex justify-center items-center">
                    <p className="text-red-500">{error}</p>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex justify-center p-4 pb-0">
                <div>
                    <div className="w-[600px] mt-6 mb-2">
                        <BackButton to={backTo} />
                    </div>
                    <BookDetailCard
                        bookData={bookData}
                        onAddToLibrary={handleAddToLibrary}
                        isInLibrary={isInLibrary}
                        onEdit={() => setShowEditModal(true)}
                        onLend={() => setShowLendModal(true)}
                        onDelete={() => setShowDeleteConfirm(true)}
                        onFavoriteUpdate={handleFavoriteUpdate}
                    />
                </div>
                {showEditModal && bookData?.libraryEntry && (
                    <EditLibraryEntryModal
                        book={bookData.libraryEntry}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleLibraryEntryUpdate}
                        onDelete={handleOpenDeleteConfirm}
                        isOpen={showEditModal}
                    />
                )}
                <ConfirmDeleteModal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDeleteFromLibrary}
                />
                {showLendModal && bookData?.libraryEntry && (
                    <LendModal
                        book={bookData.libraryEntry}
                        contacts={contacts}
                        contactsLoading={contactsLoading}
                        contactsError={contactsError}
                        isOpen={showLendModal}
                        onClose={() => setShowLendModal(false)}
                    // onSave={handleCreateLoan}
                    />
                )}
            </div>

            <Footer />
        </div>
    );
}
