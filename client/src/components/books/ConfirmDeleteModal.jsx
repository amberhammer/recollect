export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white p-6">
                <h2 className="mb-4 text-xl font-bold">Remove Book from Library</h2>
                <p>Are you sure you want to remove this book from your library?</p>
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