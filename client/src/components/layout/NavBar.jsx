import SearchBar from "./SearchBar";

export default function NavBar() {
  return (
    <header>
        <nav className="bg-taupe-200 text-black p-4">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="text-2xl font-bold">recollect</a>
                <SearchBar />
                <div className="flex items-center gap-4">
                    <button className="bg-taupe-300 px-3 py-2 rounded-lg hover:border hover:border-taupe-400">Friends</button>
                    <button className="bg-taupe-300 px-3 py-2 rounded-lg hover:border hover:border-taupe-400">Notifications</button>
                    <button className="bg-taupe-300 px-3 py-2 rounded-lg hover:border hover:border-taupe-400">Profile</button>
                </div>
            </div>
        </nav>
    </header>
  );
}