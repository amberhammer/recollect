import { Route, Routes } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import BookDetailPage from "./pages/BookDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/library" element={<CollectionPage />} />
      <Route path="/book" element={<BookDetailPage />} />
    </Routes>
  );
}

export default App