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
      console.error("Viga andmete laadimisel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Kas oled kindel, et soovid selle raamatu kustutada?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter(b => b.id !== id));
      } catch (err) {
        alert("Kustutamine ebaõnnestus.");
      }
    }
  };

  // FILTREERIMINE (parandatud keele ja aasta kontrolliga)
  const filteredBooks = books.filter(book => {
    const bookTitle = (book.title || '').toLowerCase();
    const bookYear = (book.publishedYear || (book as any).year || '').toString();
    const bookLang = ((book as any).language || (book as any).lang || '').toLowerCase();

    return bookTitle.includes(searchTitle.toLowerCase()) && 
           bookYear.includes(searchYear) && 
           bookLang.includes(searchLanguage.toLowerCase());
  });

  const currentItems = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  if (loading) return <div className="p-10 text-center font-bold text-blue-600">Laadin raamatukogu...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Raamatukogu</h1>
      </div>

      {/* FILTRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input 
          placeholder="Otsi pealkirja..." 
          className="p-3 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400" 
          onChange={e => {setSearchTitle(e.target.value); setCurrentPage(1);}} 
        />
        <input 
          placeholder="Aasta..." 
          className="p-3 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400" 
          onChange={e => {setSearchYear(e.target.value); setCurrentPage(1);}} 
        />
        <input 
          placeholder="Keel (nt: Eesti)..." 
          className="p-3 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400" 
          onChange={e => {setSearchLanguage(e.target.value); setCurrentPage(1);}} 
        />
      </div>

      {/* TABEL */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">Raamatu info</th>
              <th className="p-4 text-center">Aasta</th>
              <th className="p-4">Žanrid</th>
              <th className="p-4 text-right">Tegevused</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map(book => (
                <tr key={book.id} className="hover:bg-blue-50/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-gray-900 leading-tight">{book.title}</div>
                    <div className="text-xs text-gray-500 mt-1 italic">
                      {typeof book.author === 'object' ? `${book.author?.firstName || ''} ${book.author?.lastName || ''}` : book.author || 'Tundmatu autor'}
                      <span className="ml-2 text-blue-500 not-italic">| {(book as any).language || (book as any).lang || 'Keel puudub'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-medium text-gray-600">
                    {book.publishedYear || (book as any).year || '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray((book as any).genres) ? (
                        (book as any).genres.map((g: any, i: number) => (
                          <span key={i} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                            {typeof g === 'object' ? g.name : g}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Link to={`/books/${book.id}`} className="text-blue-600 font-bold hover:underline text-sm">Vaata</Link>
                      
                      <Link 
                        to={`/admin/edit/${book.id}`} 
                        className="bg-orange-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:bg-orange-600 transition"
                      >
                        Muuda
                      </Link>

                      <button 
                        onClick={() => handleDelete(book.id)} 
                        className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-red-500 hover:text-white transition"
                      >
                        Kustuta
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center text-gray-400">Raamatuid ei leitud.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded-lg shadow-sm disabled:opacity-30">←</button>
          <span className="text-sm font-bold text-gray-600">Leht {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded-lg shadow-sm disabled:opacity-30">→</button>
        </div>
      )}
    </div>
  );
};

export default BooksPage;