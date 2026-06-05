import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getBorrowedBookById, updateBorrowedBook } from "../api/borrowedBooksApi";
import { getContacts } from "../api/contactsApi";

import NavBar from "../components/layout/NavBar";
import BackButton from "../components/layout/BackButton";
import Footer from "../components/layout/Footer";
import BorrowedBookDetailCard from "../components/books/BorrowedBookDetailCard";
import EditBorrowedBookModal from "../components/books/EditBorrowedBookModal";

export default function BorrowedBookDetailPage() {
    const { borrowedBookId } = useParams();
    const location = useLocation();
    const { token } = useAuth();

    const [book, setBook] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [contactsError, setContactsError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backTo = location.state?.from || "/library/borrowed-books";

    useEffect(() => {
        const fetchBorrowedBook = async () => {
            try {
                setLoading(true);
                const borrowedBook = await getBorrowedBookById(borrowedBookId, token);
                setBook(borrowedBook);
            } catch (err) {
                console.error(err);
                setError("Error fetching borrowed book details");
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowedBook();
    }, [borrowedBookId, token]);

    useEffect(() => {
        if (!showEditModal) return;

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
    }, [showEditModal]);

    const handleBorrowedBookUpdate = async (updatedBook) => {
        try {
            const savedBook = await updateBorrowedBook(updatedBook.id, updatedBook, token);
            setBook(savedBook);
            setShowEditModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!book) return;

        const updatedBook = {
            ...book,
            is_favorite: !book.is_favorite,
            status: book.status || "borrowed",
            borrowed_date: book.borrowed_date ? String(book.borrowed_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
        };

        await handleBorrowedBookUpdate(updatedBook);
    };

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
                    <BorrowedBookDetailCard
                        book={book}
                        onEdit={() => setShowEditModal(true)}
                        onFavoriteToggle={handleFavoriteToggle}
                    />
                </div>

                {showEditModal && book && (
                    <EditBorrowedBookModal
                        book={book}
                        contacts={contacts}
                        contactsLoading={contactsLoading}
                        contactsError={contactsError}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleBorrowedBookUpdate}
                    />
                )}
            </div>

            <Footer />
        </div>
    );
}
