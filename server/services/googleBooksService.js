require("dotenv").config();

const getGoogleBookById = async (google_books_id) => {
  console.log(`${process.env.API_KEY}`);
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${google_books_id}?key=${process.env.API_KEY}`);
  return response.json();
};

module.exports = { getGoogleBookById };