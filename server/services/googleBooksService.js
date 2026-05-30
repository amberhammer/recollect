import axios from "axios";

export const getGoogleBookById =
  async (googleBooksId) => {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${googleBooksId}`);
    return response.data;
};