import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import BookDetailCard from "../components/books/BookDetailCard";

export default function BookDetailPage() {
    const book = {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        thumbnail: "https://covers.openlibrary.org/b/id/7825252-M.jpg",
        rating: 4.5,
        format: "physical",
        status: "read",
        description: "A novel set in the Roaring Twenties that tells the story of the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan."
    };
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex justify-center p-4">
                <BookDetailCard book={book} />
            </div>

            <Footer />
        </div>
    )
}