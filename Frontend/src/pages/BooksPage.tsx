import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks } from "../api";
import type { Book } from "../api";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");

  const [sortBy, setSortBy] = useState<"title" | "publishedYear">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  async function loadBooks(signal?: AbortSignal) {
    try {
      setLoading(true);
      setError("");

      const res = await getBooks(
        {
          page,
          limit,
          search: searchTitle,
          year: searchYear,
          language: searchLanguage,
          sortBy,
          sortOrder,
        },
        signal
      );

      setBooks(res.data.data);
      setTotal(res.data.total);
    } catch {
      if (!signal?.aborted) {
        setError("Raamatute laadimine ebaõnnestus");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadBooks(controller.signal);

    return () => controller.abort();
  }, [page, limit, searchTitle, searchYear, searchLanguage, sortBy, sortOrder]);

  async function handleDelete(id: number) {
    if (!confirm("Kas oled kindel, et soovid selle raamatu kustutada?")) return;

    try {
      await deleteBook(id);
      await loadBooks();
    } catch {
      setError("Kustutamine ebaõnnestus");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Raamatukogu</h1>
          <p className="text-gray-500">Raamatute nimekiri ja haldus</p>
        </div>

        <Link
          to="/books/new"
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
        >
          Lisa raamat
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-6">
        <input
          placeholder="Pealkiri..."
          className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTitle}
          onChange={(e) => {
            setSearchTitle(e.target.value);
            setPage(1);
          }}
        />

        <input
          placeholder="Aasta..."
          className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-400"
          value={searchYear}
          onChange={(e) => {
            setSearchYear(e.target.value);
            setPage(1);
          }}
        />

        <input
          placeholder="Keel..."
          className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-400"
          value={searchLanguage}
          onChange={(e) => {
            setSearchLanguage(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="rounded-xl border p-3 outline-none"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "title" | "publishedYear")}
        >
          <option value="title">Sorteeri: pealkiri</option>
          <option value="publishedYear">Sorteeri: aasta</option>
        </select>

        <select
          className="rounded-xl border p-3 outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Kasvav</option>
          <option value="desc">Kahanev</option>
        </select>

        <select
          className="rounded-xl border p-3 outline-none"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 / leht</option>
          <option value={10}>10 / leht</option>
          <option value={20}>20 / leht</option>
        </select>
      </div>

      {loading && (
        <div className="p-10 text-center font-bold text-blue-600">
          Laadin raamatuid...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-100 p-4 font-bold text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr className="text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="p-4">Raamatu info</th>
                <th className="p-4 text-center">Aasta</th>
                <th className="p-4">Žanrid</th>
                <th className="p-4 text-right">Tegevused</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.id} className="transition hover:bg-blue-50/30">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{book.title}</div>
                      <div className="mt-1 text-xs italic text-gray-500">
                        {book.author.firstName} {book.author.lastName}
                        <span className="ml-2 text-blue-500 not-italic">
                          | {book.language}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center text-sm font-medium text-gray-600">
                      {book.publishedYear}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {book.genres.length > 0 ? (
                          book.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700"
                            >
                              {genre.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs italic text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/books/${book.id}`}
                          className="text-sm font-bold text-blue-600 hover:underline"
                        >
                          Vaata
                        </Link>

                        <Link
                          to={`/books/${book.id}/edit`}
                          className="rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-orange-600"
                        >
                          Muuda
                        </Link>

                        <button
                          onClick={() => handleDelete(book.id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Kustuta
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400">
                    Raamatuid ei leitud.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg border px-4 py-2 shadow-sm disabled:opacity-30"
        >
          ← Eelmine
        </button>

        <span className="text-sm font-bold text-gray-600">
          Leht {page} / {totalPages}, limit {limit}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border px-4 py-2 shadow-sm disabled:opacity-30"
        >
          Järgmine →
        </button>
      </div>
    </div>
  );
}