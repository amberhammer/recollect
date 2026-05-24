export default function BookCard({ title, author, thumbnail }) {
    return (
        <div className="bg-taupe-300 flex rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={thumbnail} alt={`${title} cover`} className="h-auto m-2 rounded" />
            <div className="p-4 min-w-0">
                <h3 className="text-md font-semibold truncate">{title}</h3>
                <p className="text-gray-600 truncate">{author}</p>
            </div>
        </div>
    );
}