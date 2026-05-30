import BookCard from "./BookCard";

export default function BookGrid({ displayName, books }) {
    return (
        <div className="flex-grow flex justify-center p-4">
            <div>
                <h2 className="text-2xl font-bold mb-6 text-center">{displayName}</h2>
                <div className="grid grid-cols-2 gap-5 max-h-[570px] w-[700px] overflow-y-auto no-scrollbar">
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            title={book.title}
                            author={book.authors[0]}
                            thumbnail={book.thumbnail}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}