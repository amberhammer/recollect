import { Link } from "react-router-dom";

import Cabinet from "../components/books/Cabinet";
import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex justify-center p-4">
                <div className="w-full max-w-[700px] md:max-w-[560px] lg:max-w-[700px]">
                    <h2 className="text-2xl font-bold mb-6 text-center">Your Library</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 h-auto sm:h-[550px] w-full">
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
                        <Link to="/library/borrowed-books" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="Borrowed" />
                        </Link>
                        <Link to="/library/loaned-out" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cabinet collectionName="Loaned Out" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
