import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchType, setSearchType] = useState("books");
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
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border-r border-gray-300 text-gray-700 focus:outline-none cursor-pointer text-sm font-medium">
                    <option value="books" className="text-gray-700">Books</option>
                    <option value="users" className="text-gray-700">Users</option>
                </select>
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
