import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AdminPage from './pages/AdminPage'; // 1. IMPORTI AdminPage
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* NAVIGATSIOONIRIBA */}
        <nav className="bg-white border-b border-gray-200 py-4 shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
              Raamatukogu
            </Link>
            <div className="flex gap-6">
              <Link 
                to="/books" 
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Raamatud
              </Link>
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Lisa uus
              </Link>
            </div>
          </div>
        </nav>

        {/* SISU ALA */}
        <main className="flex-grow">
          {/* Eemaldasin siit ümbritseva div-i, kuna lehtedel endal on max-w-6xl ja paddingud juba sees */}
          <Routes>
            {/* Automaatne suunamine avalehelt raamatute nimekirja */}
            <Route path="/" element={<Navigate to="/books" replace />} />
            
            {/* Nimekirja vaade */}
            <Route path="/books" element={<BooksPage />} />
            
            {/* DETAILVAADE */}
            <Route path="/books/:id" element={<BookDetailPage />} />
            
            {/* 2. ADMIN VAADE (Lisamine) */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* 3. ADMIN VAADE (Muutmine) - kasutab sama komponenti */}
            <Route path="/admin/edit/:id" element={<AdminPage />} />
            
            {/* 404 VEATEADE */}
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">404 - Lehte ei leitud</h2>
                <p className="text-gray-500 mt-2">Seda aadressi meie raamatukogus ei eksisteeri.</p>
                <Link to="/books" className="text-blue-600 underline mt-4 inline-block font-medium">
                  Tagasi raamatute nimekirja
                </Link>
              </div>
            } />
          </Routes>
        </main>

        {/* JALUS */}
        <footer className="py-6 border-t border-gray-200 text-center text-gray-400 text-sm bg-white mt-auto">
          &copy; {new Date().getFullYear()} Raamatukogu Infosüsteem • TalTech
        </footer>
      </div>
    </Router>
  );
}

export default App;