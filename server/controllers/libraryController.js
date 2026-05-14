require("dotenv").config();

const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${process.env.API_KEY}`
    );

    const data = await response.json();
    const books = data.items?.map((item) => ({
      google_books_id: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || "",
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      published_date: item.volumeInfo.publishedDate || "",
    })) || [];
    res.json(books);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error searching books",
    });
  }
};

module.exports = { searchBooks };