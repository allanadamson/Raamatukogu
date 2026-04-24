import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/books/new" element={<AdminPage />} />
        <Route path="/books/:id/edit" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}