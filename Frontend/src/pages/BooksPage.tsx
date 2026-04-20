import { useEffect, useState } from 'react';
import { getBooks, deleteBook, type Book } from '../api';
import { Link } from 'react-router-dom';

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getBooks();
      setBooks(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Viga andmete pärimisel:", err);
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

  const filteredBooks = books.filter(book => {
    const title = (book.title || '').toLowerCase();
    const year = (book.publishedYear || (book as any).year || '').toString();
    const lang = ((book as any).language || '').toLowerCase();

    return title.includes(searchTitle.toLowerCase()) &&
           year.includes(searchYear) &&
           lang.includes(searchLanguage.toLowerCase());
  });

  const currentItems = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  if (loading) return <div className="p-10 text-center font-bold">Laadin raamatuid...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* PEALKIRI ILMA LISANUPUTA */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Raamatukogu</h1>
        <p className="text-gray-500 mt-1">Kõik süsteemis registreeritud teosed</p>
      </div>

      {/* FILTRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border">
        <input 
          placeholder="Otsi pealkirja järgi..." 
          className="p-3 border rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={e => { setSearchTitle(e.target.value); setCurrentPage(1); }} 
        />
        <input 
          placeholder="Aasta..." 
          className="p-3 border rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={e => { setSearchYear(e.target.value); setCurrentPage(1); }} 
        />
        <input 
          placeholder="Keel..." 
          className="p-3 border rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={e => { setSearchLanguage(e.target.value); setCurrentPage(1); }} 
        />
      </div>

      {/* TABEL */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Pealkiri</th>
              <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Tegevused</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map(book => (
                <tr key={book.id} className="hover:bg-blue-50/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{book.title}</div>
                    <div className="text-xs text-gray-400">ID: {book.id}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Link 
                        to={`/books/${book.id}`} 
                        className="text-blue-600 font-bold hover:text-blue-800 text-sm"
                      >
                        Vaata
                      </Link>
                      <Link 
                        to={`/admin/edit/${book.id}`} 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm transition"
                      >
                        Muuda
                      </Link>
                      <button 
                        onClick={() => handleDelete(book.id)} 
                        className="text-red-400 hover:text-red-600 transition"
                        title="Kustuta"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-20 text-center text-gray-400 italic">
                  Ühtegi raamatut ei leitud.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 bg-white border rounded-lg disabled:opacity-30 shadow-sm"
          >
            ←
          </button>
          <span className="text-sm font-bold text-gray-600">Leht {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 bg-white border rounded-lg disabled:opacity-30 shadow-sm"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default BooksPage;