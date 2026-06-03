import { Link } from "react-router-dom";

import Cabinet from "../components/books/Cabinet";
import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex justify-center p-4">
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-center">your library</h2>
                    <div className="grid grid-cols-2 gap-5 h-[550px] w-[700px]">
                        <Link to="/library" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="All Books" />
                        </Link>
                        <Link to="/library/favorites" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="Favourites" />
                        </Link>
                        <Link to="/library/currently-reading" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="Currently Reading" />
                        </Link>
                        <Link to="/library/to-read" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="To Read" />
                        </Link>
                        <Link to="/library/borrowed" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="Borrowed" />
                        </Link>
                        <Link to="/library/borrowing" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="Borrowing" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}