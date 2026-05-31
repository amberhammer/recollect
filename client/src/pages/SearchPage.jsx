import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BookGrid from "../components/books/BookGrid";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(`/api/books/search?q=${encodeURIComponent(query)}`);
                setResults(response.data);
            } catch (err) {
                setError(err.response?.data || "Failed to search book.");
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

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

            <BookGrid books={results} displayName={`Search results for "${query}"`} />

            <Footer />
        </div>
    );
}