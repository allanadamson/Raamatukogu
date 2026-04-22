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
    }).catch(err => {
      console.error("Viga laadimisel:", err);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Kas oled kindel, et soovid selle raamatu kustutada?')) {
      try {
        await deleteBook(Number(id));
        navigate('/books');
      } catch (err) {
        alert("Kustutamine ebaõnnestus.");
      }
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-xl">Laadin andmeid...</div>;
  if (!book) return <div className="p-20 text-center text-red-500 font-bold">Raamatut ei leitud!</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button 
        onClick={() => navigate('/books')} 
        className="text-blue-600 font-bold hover:underline mb-6 flex items-center gap-2"
      >
        ← Tagasi nimekirja
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* PÄIS */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-white flex justify-between items-center flex-wrap gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tight">{book.title}</h1>
            <p className="text-xl opacity-90 mt-2 font-medium">
              {typeof book.author === 'object' ? `${book.author?.firstName} ${book.author?.lastName}` : book.author}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              to={`/admin/edit/${id}`} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition active:scale-95"
            >
              MUUDA ANDMEID
            </Link>
            <button 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition active:scale-95"
            >
              KUSTUTA
            </button>
          </div>
        </div>

        {/* SISU */}
        <div className="p-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Kirjeldus</h3>
              <p className="text-gray-700 text-lg leading-relaxed italic">
                "{book.description || 'Kirjeldus puudub.'}"
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Andmed</h3>
              <p className="flex justify-between border-b pb-2"><strong>ISBN:</strong> <span>{book.isbn || '—'}</span></p>
              <p className="flex justify-between border-b pb-2"><strong>Keel:</strong> <span>{(book as any).language || (book as any).lang || '—'}</span></p>
              <p className="flex justify-between border-b pb-2"><strong>Aasta:</strong> <span>{book.publishedYear || (book as any).year || '—'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;