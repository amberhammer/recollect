export default function BookCard({ title, author, thumbnail }) {
    console.log("BookCard props:", { author });
    let authorName = "Unknown Author";
    if (typeof author === "string") {
        authorName = author.slice(2).slice(0, -2);
    } else if (Array.isArray(author) && author.length > 0) {
        authorName = author[0];
    }
    return (
        <div className="bg-taupe-300 flex rounded-lg h-24 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={thumbnail} alt={`${title} cover`} className="h-auto m-2 rounded" />
            <div className="p-4 min-w-0">
                <h3 className="text-md font-semibold truncate">{title}</h3>
                <p className="text-gray-600 truncate">{authorName}</p>
            </div>
        </div>
    );
}