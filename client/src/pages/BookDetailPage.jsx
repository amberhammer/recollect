import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import BookDetailCard from "../components/books/BookDetailCard";

export default function BookDetailPage() {
    const { googleBooksId } = useParams();
    const { token } = useAuth();

    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <BookDetailCard bookData={bookData} />
            </div>

            <Footer />
        </div>
    )
}