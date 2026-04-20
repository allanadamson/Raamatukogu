import { useEffect, useState } from 'react';
import { getBooks, deleteBook, type Book } from '../api';
import { Link } from 'react-router-dom';

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- 1. FILTRID (Nõue: Pealkiri, Aasta, Keel) ---
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchLanguage, setSearchLanguage] = useState(''); // UUS: Keele filter

  // --- 2. SORTEERIMINE (Nõue: Pealkiri/Aasta, kasvav/kahanev) ---
  const [sortBy, setSortBy] = useState<'title' | 'releaseYear'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // --- 3. PAGINATION (Nõue: Page ja Limit) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Muudetud: Dünaamiline limiit

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchData = async (signal?: AbortSignal) => {
    try {
      const res = await getBooks(signal);
      const data = res.data.data || res.data;
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Kas oled kindel, et soovid raamatu kustutada?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter(b => b.id !== id));
      } catch (err) {
        alert("Kustutamine ebaõnnestus.");
      }
    }
  };

  const renderAuthor = (author: any) => {
    if (author && typeof author === 'object') {
      return `${author.firstName || ''} ${author.lastName || ''}`.trim();
    }
    return author || 'Tundmatu autor';
  };

  // --- FILTREERIMISE JA SORTEERIMISE LOOGIKA ---
  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesTitle = book.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchesYear = searchYear === '' || (book.releaseYear || book.year)?.toString().includes(searchYear);
      // Eeldame, et backend saadab 'language' välja, kui mitte, jääb see alati tõeseks
      const matchesLanguage = searchLanguage === '' || (book as any).language?.toLowerCase().includes(searchLanguage.toLowerCase());
      
      return matchesTitle && matchesYear && matchesLanguage;
    })
    .sort((a, b) => {
      const valA = sortBy === 'title' ? a.title.toLowerCase() : (a.releaseYear || 0);
      const valB = sortBy === 'title' ? b.title.toLowerCase() : (b.releaseYear || 0);
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // --- PAGINATIONI ARVUTUS ---
  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);
  const currentItems = filteredAndSortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="p-10 text-center text-xl font-semibold">Laadin raamatuid...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Raamatukogu</h1>
        <Link to="/admin" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
          + Lisa raamat
        </Link>
      </div>

      {/* FILTRITE JA SORTEERIMISE ALA */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pealkiri</label>
            <input 
              type="text"
              placeholder="Otsi pealkirja..." 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => {setSearchTitle(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aasta</label>
            <input 
              type="text"
              placeholder="Otsi aasta järgi..." 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => {setSearchYear(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keel</label>
            <input 
              type="text"
              placeholder="Otsi keele järgi..." 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => {setSearchLanguage(e.target.value); setCurrentPage(1);}}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <select 
              className="p-2 border border-gray-300 rounded-md bg-white"
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="asc">Kasvav</option>
              <option value="desc">Kahanev</option>
            </select>
            <select 
              className="p-2 border border-gray-300 rounded-md bg-white"
              value={itemsPerPage}
              onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}}
            >
              <option value={5}>5 rida</option>
              <option value={10}>10 rida</option>
              <option value={20}>20 rida</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 font-medium">Leitud: {filteredAndSortedBooks.length} raamatut</p>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => setSortBy('title')}>
                Pealkiri {sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th className="p-4">Autor</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition text-center" onClick={() => setSortBy('releaseYear')}>
                Aasta {sortBy === 'releaseYear' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th className="p-4">Žanrid</th>
              <th className="p-4 text-right">Tegevused</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map(book => (
                <tr key={book.id} className="hover:bg-blue-50 transition-colors group">
                  <td className="p-4 font-semibold text-gray-900">{book.title}</td>
                  <td className="p-4 text-gray-600">{renderAuthor(book.author)}</td>
                  <td className="p-4 text-center text-gray-600 font-mono">{book.releaseYear || book.year}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {book.genre?.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <Link to={`/books/${book.id}`} className="text-blue-600 hover:text-blue-800 font-medium">Vaata</Link>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Kustuta
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 italic bg-gray-50">
                  Ühtegi raamatut ei leitud valitud filtritega.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center items-center gap-6">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ← Eelmine
        </button>
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                {currentPage}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">{totalPages || 1}</span>
        </div>
        <button 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Järgmine →
        </button>
      </div>
    </div>
  );
};

export default BooksPage;