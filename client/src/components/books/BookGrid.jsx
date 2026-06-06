import { Link, useLocation } from "react-router-dom";
import BookCard from "./BookCard";
import BackButton from "../layout/BackButton";

export default function BookGrid({ displayName, books, backTo = "/", headerAction = null, getBookLink = null }) {
    const location = useLocation();

    return (
        <div className="flex-grow flex justify-center p-4">
            <div>
                <div className="grid grid-cols-[170px_1fr_170px] items-center mb-6 w-[700px]">
                    <BackButton to={backTo} />
                    <h2 className="text-2xl font-bold text-center">{displayName}</h2>
                    <div className="flex justify-end">{headerAction}</div>
                </div>
                <div className="grid grid-cols-2 gap-5 max-h-[570px] w-[700px] overflow-y-auto no-scrollbar">
                    {books.map((book) => (
                        <Link
                            key={book.id || book.google_books_id}
                            to={getBookLink ? getBookLink(book) : `/books/${book.google_books_id}`}
                            state={{
                                from: {
                                    pathname: location.pathname,
                                    search: location.search,
                                },
                            }}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <BookCard
                                title={book.title}
                                author={book.authors || book.author || "Unknown Author"}
                                thumbnail={book.thumbnail}
                                publishedDate={book.published_date}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
