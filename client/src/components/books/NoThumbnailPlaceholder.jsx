export default function NoThumbnailPlaceholder({ className = "w-40 h-52", textClassName = "text-gray-900" }) {
    return (
        <div className={`${className} bg-taupe-400 p-4 flex items-center text-center justify-center rounded`}>
            <p className={textClassName}>No Image Available</p>
        </div>
    );
}
