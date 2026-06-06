import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header>
      <nav className="bg-taupe-200 text-black p-4">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">recollect</a>
          <SearchBar />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="bg-taupe-300 px-3 py-2 rounded-lg hover:bg-taupe-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
