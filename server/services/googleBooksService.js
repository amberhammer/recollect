const getGoogleBookById = async (googleBooksId) => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${googleBooksId}`);
  return response.json();
};

module.exports = { getGoogleBookById };