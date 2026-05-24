import { useState } from "react";

export default function SearchBar() {
    const [searchType, setSearchType] = useState("books");
    const [query, setQuery] = useState("");

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
            </div>
        </div>
    );
}