export default function Cabinet({ collectionName }) {
    return (
        <div className="bg-taupe-800 h-44 p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-taupe-400 rounded-sm flex items-center justify-center">
                <h3 className="text-lg text-center bg-taupe-200 p-4 mt-3 mb-5 mx-8 w-full rounded-lg">{collectionName}</h3>
            </div>
        </div>
    )
}