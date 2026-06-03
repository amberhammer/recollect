export default function LendModal() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Lend Book</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Borrower:</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                            <option value="">Select a borrower</option>
                            <option value="Alice">Alice</option>
                            <option value="Bob">Bob</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Add New Contact</label>
                        <input type="text" placeholder="Enter name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                    </div>
                </div>
                <div className="flex items-center justify-end mt-6">
                    <button onClick={handleSubmit} className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold h-10 py-2 px-4 rounded mr-2">
                        Save
                    </button>
                    <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold h-10 py-2 px-4 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
};