import { Route, Routes } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import BookDetailPage from "./pages/BookDetailPage";
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />

      <Route path="/library" element={
        <ProtectedRoute>
          <CollectionPage />
        </ProtectedRoute>
      } />

      <Route path="/library/:collection" element={
        <ProtectedRoute>
          <CollectionPage />
        </ProtectedRoute>
      } />

      <Route path="/library/books" element={

        <BookDetailPage />

      } />

      <Route path="/books/:googleBooksId" element={
        <ProtectedRoute>
          <BookDetailPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App