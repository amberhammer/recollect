import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`, {
                state: {
                    from: {
                        pathname: location.pathname,
                        search: location.search,
                    },
                },
            });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-3 py-2 text-gray-700 focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm">
                    Search
                </button>
            </div>
        </div>
    );
}
