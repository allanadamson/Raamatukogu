import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, type Book } from '../api';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await getBookById(id, controller.signal);
        const data = response.data.data || response.data;
        setBook(data);
      } catch (err: any) {
        if (err.name !== 'CanceledError') {
          setError('Raamatu andmete laadimine ebaõnnestus.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold">Laadin raamatu andmeid...</div>;
  if (error || !book) return (
    <div className="p-10 text-center text-red-500">
      <p>{error || 'Raamatut ei leitud.'}</p>
      <Link to="/books" className="text-blue-600 underline">Tagasi nimekirja</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
      >
        ← Tagasi
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <h1 className="text-4xl font-extrabold">{book.title}</h1>
          <p className="text-blue-100 text-xl mt-2">
            Autor: {typeof book.author === 'object' && book.author !== null
              ? `${book.author.firstName || ''} ${book.author.lastName || ''}`.trim()
              : book.author || 'Tundmatu autor'}
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-500 uppercase tracking-wider text-sm font-bold">Väljaandmise aasta</h3>
              {/* PARANDUS: Kasutame publishedYear */}
              <p className="text-2xl font-semibold text-gray-900">
                {book.publishedYear || (book as any).year || '—'}
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-500 uppercase tracking-wider text-sm font-bold">Žanrid</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {/* PARANDUS: Kasutame genres ja kontrollime objekte */}
                {Array.isArray((book as any).genres) && (book as any).genres.length > 0 ? (
                  (book as any).genres.map((g: any, i: number) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                      {typeof g === 'object' ? g.name : g}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">Žanrid puuduvad</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-gray-800 font-bold mb-3">Süsteemne info</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong>Andmebaasi ID:</strong> {book.id}</li>
              <li><strong>Staatus:</strong> Kättesaadav</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;