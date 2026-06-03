import { useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import BookGrid from "../components/books/BookGrid";
import { searchBooks } from "../api/booksApi";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const query = searchParams.get("q") || "";
    const backTo = location.state?.from || "/";

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
                const results = await searchBooks(query);
                setResults(results);
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

            <BookGrid books={results} displayName={`Search results for "${query}"`} backTo={backTo} />

            <Footer />
        </div>
    );
}
