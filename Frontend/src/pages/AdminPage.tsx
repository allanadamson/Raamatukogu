import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBook, getBookById, updateBook } from "../api";

type BookFormData = {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  authorId: string;
  publisherId: string;
};

type BookPayload = {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  authorId: number;
  publisherId: number;
};

export default function AdminPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    isbn: "",
    publishedYear: new Date().getFullYear(),
    pageCount: 0,
    language: "Eesti",
    description: "",
    authorId: "",
    publisherId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode || !id) return;

    const controller = new AbortController();

    async function loadBook() {
      try {
        setLoading(true);
        setError("");

        const res = await getBookById(Number(id), controller.signal);
        const book = res.data;

        setFormData({
          title: book.title ?? "",
          isbn: book.isbn ?? "",
          publishedYear: book.publishedYear ?? new Date().getFullYear(),
          pageCount: book.pageCount ?? book.pages ?? 0,
          language: book.language ?? "Eesti",
          description: book.description ?? "",
          authorId: book.author?.id?.toString() ?? "",
          publisherId: book.publisher?.id?.toString() ?? "",
        });
      } catch {
        if (!controller.signal.aborted) {
          setError("Raamatu andmete laadimine ebaõnnestus");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => controller.abort();
  }, [id, isEditMode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");

      const payload: BookPayload = {
        title: formData.title.trim(),
        isbn: formData.isbn.trim(),
        publishedYear: Number(formData.publishedYear),
        pageCount: Number(formData.pageCount),
        language: formData.language,
        description: formData.description.trim(),
        authorId: Number(formData.authorId),
        publisherId: Number(formData.publisherId),
      };

      if (isEditMode && id) {
        await updateBook(Number(id), payload);
      } else {
        await createBook(payload);
      }

      navigate("/books");
    } catch {
      setError("Salvestamine ebaõnnestus. Kontrolli väljasid.");
    }
  }

  if (loading) {
    return <div className="p-20 text-center text-xl font-bold">Laadin...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-3xl font-black text-gray-900">
        {isEditMode ? "Muuda raamatut" : "Lisa uus raamat"}
      </h1>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-100 p-4 font-bold text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl"
      >
        <div>
          <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
            Raamatu pealkiri
          </label>
          <input
            required
            className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
            ISBN
          </label>
          <input
            required
            className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
              Ilmumisaasta
            </label>
            <input
              required
              type="number"
              className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.publishedYear}
              onChange={(e) =>
                setFormData({ ...formData, publishedYear: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
              Lehekülgede arv
            </label>
            <input
              required
              type="number"
              className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.pageCount}
              onChange={(e) =>
                setFormData({ ...formData, pageCount: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
              Keel
            </label>
            <select
              className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="Eesti">Eesti</option>
              <option value="Inglise">Inglise</option>
              <option value="Saksa">Saksa</option>
              <option value="Vene">Vene</option>
            </select>
          </div>

          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
              Autor ID
            </label>
            <input
              required
              type="number"
              className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.authorId}
              onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
              Kirjastaja ID
            </label>
            <input
              required
              type="number"
              className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.publisherId}
              onChange={(e) =>
                setFormData({ ...formData, publisherId: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-2 ml-1 block text-xs font-bold uppercase text-gray-400">
            Kirjeldus
          </label>
          <textarea
            required
            rows={4}
            className="w-full rounded-2xl bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/books")}
            className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-600 hover:bg-gray-200"
          >
            Tühista
          </button>

          <button
            type="submit"
            className="flex-1 rounded-2xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700"
          >
            Salvesta
          </button>
        </div>
      </form>
    </div>
  );
}