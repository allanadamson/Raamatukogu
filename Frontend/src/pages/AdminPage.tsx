import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, createBook, updateBook } from '../api';

const AdminPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Vormi andmete seisund
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    pageCount: 0,
    language: 'Eesti',
    description: '',
    authorId: '',
    publisherId: '',
  });

  // 1. Lae olemasoleva raamatu andmed, kui oleme muutmise režiimis
  useEffect(() => {
    if (isEditMode && id) {
      getBookById(id)
        .then((res) => {
          // Sinu API võib tagastada andmed struktuuris { data: {...} } või otse {...}
          const b = res.data.data || res.data;
          
          setFormData({
            title: b.title || '',
            isbn: b.isbn || '',
            publishedYear: b.publishedYear || 2024,
            pageCount: b.pageCount || 0,
            language: b.language || 'Eesti',
            description: b.description || '',
            authorId: b.authorId?.toString() || '',
            publisherId: b.publisherId?.toString() || '',
          });
        })
        .catch((err) => {
          console.error("Viga andmete laadimisel:", err);
        });
    }
  }, [id, isEditMode]);

  // 2. Vormi saatmine
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Koostame payload-i, konverteerides stringid numbriteks, kus vaja
      const payload = {
        title: formData.title.trim(),
        isbn: formData.isbn.trim(),
        publishedYear: Number(formData.publishedYear),
        pageCount: Number(formData.pageCount),
        language: formData.language,
        description: formData.description.trim(),
        authorId: Number(formData.authorId),
        publisherId: Number(formData.publisherId),
        genres: [], // Lisa siia žanrid, kui sul on vastav väli
      };

      console.log("Saadan andmed:", payload);

      if (isEditMode && id) {
        // MUUTMINE (PATCH)
        await updateBook(id, payload);
        console.log("Raamat edukalt uuendatud");
      } else {
        // LISAMINE (POST)
        await createBook(payload);
        console.log("Uus raamat lisatud");
      }

      // Suuna tagasi raamatute nimekirja
      navigate('/books');
    } catch (err: any) {
      console.error("Viga salvestamisel:", err.response?.data || err);
      // Kui ikka tuleb 404, siis kuva teade
      const errorMsg = err.response?.data?.error || "Endpoint not found - kontrolli backendi index.ts järjekorda!";
      alert(`Viga: ${errorMsg}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-black mb-8 text-gray-900">
        {isEditMode ? 'Muuda raamatut' : 'Lisa uus raamat'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 space-y-6">
        {/* Pealkiri */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Raamatu pealkiri</label>
          <input
            required
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Näiteks: Tõde ja Õigus"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ilmumisaasta */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Ilmumisaasta</label>
            <input
              type="number"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.publishedYear}
              onChange={(e) => setFormData({ ...formData, publishedYear: Number(e.target.value) })}
            />
          </div>

          {/* Lehekülgi */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Lehekülgede arv (pageCount)</label>
            <input
              type="number"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.pageCount}
              onChange={(e) => setFormData({ ...formData, pageCount: Number(e.target.value) })}
            />
          </div>

          {/* Autor ID */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Autor ID</label>
            <input
              required
              type="number"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.authorId}
              onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
              placeholder="Autori number"
            />
          </div>

          {/* Kirjastaja ID */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Kirjastaja ID</label>
            <input
              required
              type="number"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.publisherId}
              onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
              placeholder="Kirjastaja number"
            />
          </div>
        </div>

        {/* Kirjeldus */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Kirjeldus</label>
          <textarea
            rows={4}
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Lühike kokkuvõte raamatust..."
          />
        </div>

        {/* Nupud */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition"
          >
            Tühista
          </button>
          <button
            type="submit"
            className="flex-2 px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95"
          >
            Salvesta muudatused
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;