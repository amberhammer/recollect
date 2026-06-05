export default function BookCard({ title, author, thumbnail }) {
    console.log("BookCard props:", { author });
    let authorName = "Unknown Author";
    if (Array.isArray(author) && author.length > 0) {
        authorName = author[0];
    } else if (typeof author === "string" && author.trim()) {
        if (author.startsWith("[") && author.endsWith("]")) {
            try {
                const authors = JSON.parse(author);
                authorName = authors[0] || "Unknown Author";
            } catch {
                authorName = author;
            }
        } else if (author.startsWith("{") && author.endsWith("}")) {
            authorName = author.slice(1, -1).split(",")[0]?.replaceAll('"', "") || "Unknown Author";
        } else {
            authorName = author;
        }
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
