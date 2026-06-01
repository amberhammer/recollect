import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { addBookToLibrary } from "../api/booksApi";

import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import BookDetailCard from "../components/books/BookDetailCard";

export default function BookDetailPage() {
    const { googleBooksId } = useParams();
    const { token } = useAuth();

    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isInLibrary = !!bookData?.libraryEntry;

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
                <BookDetailCard bookData={bookData} onAddToLibrary={handleAddToLibrary} isInLibrary={isInLibrary} />
            </div>

            <Footer />
        </div>
    )
}