export default function Cabinet( { collectionName } ) {
    return (
        <div className="bg-taupe-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-center bg-taupe-200 border-8 border-taupe-400 p-4">{collectionName}</h3>
        </div>
    )
}