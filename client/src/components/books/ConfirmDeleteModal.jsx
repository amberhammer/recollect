export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Remove Book from Library",
    message = "Are you sure you want to remove this book from your library?",
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="rounded-lg bg-white p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-4 text-xl font-bold">{title}</h2>
                <p>{message}</p>
                <div className="mt-4 flex gap-4">
                    <button onClick={onClose} className="bg-gray-300 text-gray-700">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-700 text-white">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
