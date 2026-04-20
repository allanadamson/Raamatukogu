import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, createBook, updateBook, type Book } from '../api';

const AdminPage = () => {
  const { id } = useParams<{ id: string }>(); // Kui ID on olemas, oleme "Muuda" režiimis
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    pages: 0,
    language: 'Eesti',
    description: '',
    authorId: '', // Eeldame, et backend ootab ID-sid
    publisherId: '',
    genres: [] as string[]
  });

  useEffect(() => {
    if (isEditMode && id) {
      getBookById(id).then(res => {
        const b = res.data.data || res.data;
        setFormData({
          title: b.title || '',
          isbn: b.isbn || '',
          publishedYear: b.publishedYear || b.year || 2024,
          pages: b.pages || 0,
          language: b.language || 'Eesti',
          description: b.description || '',
          authorId: b.author?.id || '',
          publisherId: b.publisher?.id || '',
          genres: b.genres || []
        });
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await updateBook(id, formData);
      } else {
        await createBook(formData);
      }
      navigate('/books'); // Suuna tagasi nimekirja
    } catch (err) {
      alert("Salvestamine ebaõnnestus. Kontrolli andmeid.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-8 text-gray-900">
        {isEditMode ? 'Muuda raamatut' : 'Lisa uus raamat'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Pealkiri *</label>
            <input 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ISBN</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.isbn}
              onChange={e => setFormData({...formData, isbn: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Aasta</label>
            <input 
              type="number"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.publishedYear}
              onChange={e => setFormData({...formData, publishedYear: Number(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lehekülgi</label>
            <input 
              type="number"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.pages}
              onChange={e => setFormData({...formData, pages: Number(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Keel</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-xl outline-none"
              value={formData.language}
              onChange={e => setFormData({...formData, language: e.target.value})}
            >
              <option value="Eesti">Eesti</option>
              <option value="Inglise">Inglise</option>
              <option value="Saksa">Saksa</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Kirjeldus</label>
          <textarea 
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            Tühista
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
          >
            {isEditMode ? 'Salvesta muudatused' : 'Lisa raamat'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;