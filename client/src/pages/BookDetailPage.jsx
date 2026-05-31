import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import BookDetailCard from "../components/books/BookDetailCard";

export default function BookDetailPage() {
    const { google_books_id } = useParams();
    const { token } = useAuth();

    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`/books/${google_books_id}`, {
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
    }, [google_books_id, token]);

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

    // const book = {
    //     title: "The Great Gatsby",
    //     author: "F. Scott Fitzgerald",
    //     thumbnail: "https://covers.openlibrary.org/b/id/7825252-M.jpg",
    //     rating: 4.5,
    //     format: "physical",
    //     status: "read",
    //     description: "A novel set in the Roaring Twenties that tells the story of the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan."
    // };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex justify-center p-4 pb-0">
                <BookDetailCard book={bookData} />
            </div>

            <Footer />
        </div>
    )
}