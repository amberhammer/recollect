export default function ReturnButton({ onReturn }) {
    return (
        <button className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm py-2 px-4 rounded w-full" onClick={onReturn}>
            Returned
        </button>
    );
}