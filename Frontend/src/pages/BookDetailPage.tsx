import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, deleteBook } from '../api';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBookById(id).then(res => {
      setBook(res.data?.data || res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Kustuta raamat?')) {
      await deleteBook(Number(id));
      navigate('/books');
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Laadin...</div>;
  if (!book) return <div className="p-20 text-center">Raamatut ei leitud.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => navigate('/books')} className="text-blue-600 font-bold mb-6 block">← TAGASI</button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border">
        {/* PÄIS KOOS NUPPUDEGA */}
        <div className="bg-blue-600 p-10 text-white flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black">{book.title}</h1>
            <p className="text-xl opacity-80 mt-2">ID: {id}</p>
          </div>
          
          <div className="flex gap-4">
            <Link 
              to={`/admin/edit/${id}`} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
            >
              MUUDA ANDMEID
            </Link>
            <button 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
            >
              KUSTUTA
            </button>
          </div>
        </div>

        <div className="p-10">
          <h2 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4">Kirjeldus</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{book.description || 'Kirjeldus puudub.'}</p>
          
          <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-4 text-sm text-gray-500">
             <p><strong>ISBN:</strong> {book.isbn || '—'}</p>
             <p><strong>Keel:</strong> {book.language || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;