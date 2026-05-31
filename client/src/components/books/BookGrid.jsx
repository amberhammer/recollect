import { Link } from "react-router-dom";
import BookCard from "./BookCard";

export default function BookGrid({ displayName, books }) {
    return (
        <div className="flex-grow flex justify-center p-4">
            <div>
                <h2 className="text-2xl font-bold mb-6 text-center">{displayName}</h2>
                <div className="grid grid-cols-2 gap-5 max-h-[570px] w-[700px] overflow-y-auto no-scrollbar">
                    {books.map((book) => (
                        <Link key={book.id || book.google_books_id} to={`/books/${book.google_books_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <BookCard
                                title={book.title}
                                author={book.authors?.[0] || "Unknown Author"}
                                thumbnail={book.thumbnail}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}