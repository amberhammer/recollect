import SearchBar from "./SearchBar";

export default function NavBar() {
  return (
    <header>
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="text-2xl font-bold">recollect</a>
                <SearchBar />
                <div className="flex items-center gap-4">
                    <button className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600">Friends</button>
                    <button className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600">Notifications</button>
                    <button className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600">Profile</button>
                </div>
            </div>
        </nav>
    </header>
  );
}