import { useEffect, useState } from 'react';
import { getBooks, deleteBook, type Book } from '../api';
import { Link } from 'react-router-dom';

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- 1. FILTRID ---
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');

  // --- 2. SORTEERIMINE ---
  const [sortBy, setSortBy] = useState<'title' | 'publishedYear'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // --- 3. PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchData = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const res = await getBooks(signal);
      const data = res.data?.data || res.data;
      
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]);
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError') {
        console.error("Viga andmete pärimisel:", err);
      }
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
      const title = book.title || '';
      const year = (book.publishedYear || (book as any).year || '').toString();
      const lang = (book as any).language || '';

      return title.toLowerCase().includes(searchTitle.toLowerCase()) &&
             year.includes(searchYear) &&
             lang.toLowerCase().includes(searchLanguage.toLowerCase());
    })
    .sort((a, b) => {
      const valA = sortBy === 'title' ? (a.title || '').toLowerCase() : (a.publishedYear || 0);
      const valB = sortBy === 'title' ? (b.title || '').toLowerCase() : (b.publishedYear || 0);
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

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

      {/* FILTRID */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            placeholder="Pealkiri..." 
            className="p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {setSearchTitle(e.target.value); setCurrentPage(1);}}
          />
          <input 
            placeholder="Aasta..." 
            className="p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {setSearchYear(e.target.value); setCurrentPage(1);}}
          />
          <input 
            placeholder="Keel..." 
            className="p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {setSearchLanguage(e.target.value); setCurrentPage(1);}}
          />
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-4">
            <select className="p-2 border rounded-md" onChange={(e) => setSortOrder(e.target.value as any)}>
              <option value="asc">Kasvav</option>
              <option value="desc">Kahanev</option>
            </select>
            <select 
              className="p-2 border rounded-md"
              value={itemsPerPage}
              onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}}
            >
              <option value={5}>5 rida</option>
              <option value={10}>10 rida</option>
              <option value={20}>20 rida</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 cursor-pointer" onClick={() => setSortBy('title')}>Pealkiri</th>
              <th className="p-4">Autor</th>
              <th className="p-4 text-center cursor-pointer" onClick={() => setSortBy('publishedYear')}>Aasta</th>
              <th className="p-4">Žanrid</th>
              <th className="p-4 text-right">Tegevused</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((book) => (
                <tr key={book.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">{book.title}</td>
                  <td className="p-4 text-gray-600">{renderAuthor(book.author)}</td>
                  <td className="p-4 text-center text-gray-600">
                    {book.publishedYear || (book as any).year || '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {/* TURVALINE ŽANRITE KONTROLL (Id ja Name jaoks) */}
                      {Array.isArray((book as any).genres) ? (
                        (book as any).genres.map((g: any, i: number) => (
                          <span key={i} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded">
                            {typeof g === 'object' ? g.name : g}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">Puudub</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <Link to={`/books/${book.id}`} className="text-blue-600 font-medium hover:underline">Vaata</Link>
                    <button onClick={() => handleDelete(book.id)} className="text-red-500 font-medium hover:underline">
                      Kustuta
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Raamatuid ei leitud.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
        >
          ←
        </button>
        <span className="text-sm font-medium">Leht {currentPage} / {totalPages || 1}</span>
        <button 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default BooksPage;