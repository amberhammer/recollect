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
                    <div className="grid grid-cols-2 gap-6 h-[550px]">
                        <Cabinet collectionName="All Books" />
                        <Cabinet collectionName="Favourites" />
                        <Cabinet collectionName="Currently Reading" />
                        <Cabinet collectionName="To Be Read" />
                        <Cabinet collectionName="Borrowed" />
                        <Cabinet collectionName="Borrowing" />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}