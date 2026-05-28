export default function AddToLibraryButton({ onAdd }) {
    return (
        <button onClick={onAdd} className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold h-10 py-2 px-4 rounded">
            Add To Library
        </button>
    );
}
