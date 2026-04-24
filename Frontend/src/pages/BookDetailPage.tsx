import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createReview,
  deleteBook,
  getBookById,
  getBookRating,
  getBookReviews,
} from "../api";
import type { Book, RatingResponse, Review } from "../api";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = Number(id);

  const [book, setBook] = useState<Book | null>(null);
  const [rating, setRating] = useState<RatingResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsWarning, setReviewsWarning] = useState("");

  const [userName, setUserName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData(signal?: AbortSignal) {
    if (!id || Number.isNaN(bookId)) {
      setError("Vigane raamatu ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setReviewsWarning("");

      const bookRes = await getBookById(bookId, signal);
      setBook(bookRes.data);

      try {
        const ratingRes = await getBookRating(bookId, signal);
        setRating(ratingRes.data);
      } catch {
        setRating(null);
      }

      try {
        const reviewsRes = await getBookReviews(bookId, signal);
        setReviews(reviewsRes.data);
      } catch (err) {
        setReviews([]);

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setReviewsWarning("Arvustuste endpoint puudub backendis.");
          } else if (err.response?.status === 500) {
            setReviewsWarning("Serveri viga arvustuste laadimisel.");
          } else {
            setReviewsWarning("Arvustuste laadimine ebaõnnestus.");
          }
        } else {
          setReviewsWarning("Võrgu viga arvustuste laadimisel.");
        }
      }
    } catch {
      if (!signal?.aborted) {
        setError("Raamatu andmete laadimine ebaõnnestus");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);

    return () => controller.abort();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Kas oled kindel, et soovid selle raamatu kustutada?")) return;

    try {
      await deleteBook(bookId);
      navigate("/books");
    } catch {
      setError("Kustutamine ebaõnnestus");
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setReviewsWarning("");

      await createReview(bookId, {
        userName,
        rating: reviewRating,
        comment,
      });

      setUserName("");
      setReviewRating(5);
      setComment("");

      await loadData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setReviewsWarning("Arvustuse lisamise endpoint puudub backendis.");
        } else if (err.response?.status === 400) {
          setReviewsWarning("Arvustuse andmed on vigased.");
        } else if (err.response?.status === 500) {
          setReviewsWarning("Serveri viga arvustuse lisamisel.");
        } else {
          setReviewsWarning("Arvustuse lisamine ebaõnnestus.");
        }
      } else {
        setReviewsWarning("Võrgu viga arvustuse lisamisel.");
      }
    }
  }

  if (loading) {
    return <div className="p-20 text-center text-xl font-bold">Laadin...</div>;
  }

  if (error) {
    return <div className="p-20 text-center font-bold text-red-600">{error}</div>;
  }

  if (!book) {
    return <div className="p-20 text-center font-bold text-red-600">Raamatut ei leitud</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <Link to="/books" className="mb-6 inline-block font-bold text-blue-600 hover:underline">
        ← Tagasi nimekirja
      </Link>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6 bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-white">
          <div>
            <h1 className="text-4xl font-black">{book.title}</h1>
            <p className="mt-2 text-xl opacity-90">
              {book.author.firstName} {book.author.lastName}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to={`/books/${book.id}/edit`}
              className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-orange-600"
            >
              MUUDA
            </Link>

            <button
              onClick={handleDelete}
              className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-red-600"
            >
              KUSTUTA
            </button>
          </div>
        </div>

        <div className="p-10">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                Kirjeldus
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {book.description || "Kirjeldus puudub."}
              </p>
            </div>

            <div className="space-y-4 rounded-2xl bg-gray-50 p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Andmed
              </h3>

              <p className="flex justify-between border-b pb-2">
                <strong>ISBN:</strong> <span>{book.isbn}</span>
              </p>

              <p className="flex justify-between border-b pb-2">
                <strong>Aasta:</strong> <span>{book.publishedYear}</span>
              </p>

              <p className="flex justify-between border-b pb-2">
                <strong>Lehekülgi:</strong> <span>{book.pageCount ?? book.pages ?? "—"}</span>
              </p>

              <p className="flex justify-between border-b pb-2">
                <strong>Keel:</strong> <span>{book.language}</span>
              </p>

              <p className="flex justify-between border-b pb-2">
                <strong>Kirjastus:</strong> <span>{book.publisher.name}</span>
              </p>

              <p className="flex justify-between">
                <strong>Keskmine hinnang:</strong>
                <span>
                  {rating
                    ? `${rating.averageRating.toFixed(1)} / 5 (${rating.reviewCount})`
                    : "Puudub"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {book.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-black">Arvustused</h2>

        {reviewsWarning && (
          <p className="mt-4 rounded-xl bg-yellow-100 p-3 text-sm font-bold text-yellow-800">
            {reviewsWarning}
          </p>
        )}

        <div className="mt-4 space-y-4">
          {reviews.length === 0 && <p className="text-gray-500">Arvustusi pole.</p>}

          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl bg-gray-100 p-4">
              <p className="font-bold">{review.userName}</p>
              <p>Hinnang: {review.rating}/5</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleReviewSubmit} className="mt-8 space-y-4">
          <h3 className="text-xl font-black">Lisa arvustus</h3>

          <input
            required
            className="w-full rounded-xl bg-gray-100 p-3 outline-none"
            placeholder="Kasutajanimi"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <select
            className="w-full rounded-xl bg-gray-100 p-3 outline-none"
            value={reviewRating}
            onChange={(e) => setReviewRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <textarea
            required
            className="w-full rounded-xl bg-gray-100 p-3 outline-none"
            placeholder="Kommentaar"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="rounded-xl bg-gray-900 px-5 py-3 font-bold text-white">
            Lisa arvustus
          </button>
        </form>
      </div>
    </div>
  );
}