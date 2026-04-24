import prisma from "../lib/prisma.js";
import type { Prisma } from "@prisma/client";

type SortBy = "title" | "publishedYear";
type SortOrder = "asc" | "desc";

export type BookFilters = {
  search?: string;
  year?: string;
  language?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
};

export type BookInput = {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  authorId: number;
  publisherId: number;
};

export type BookUpdateInput = Partial<BookInput>;

export async function getBooks(
  page = 1,
  limit = 10,
  filters: BookFilters = {}
) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  const search = filters.search?.trim();
  const year = filters.year?.trim();
  const language = filters.language?.trim();

  const where: Prisma.BookWhereInput = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        isbn: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        author: {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  if (year && !Number.isNaN(Number(year))) {
    where.publishedYear = Number(year);
  }

  if (language) {
    where.language = {
      contains: language,
      mode: "insensitive",
    };
  }

  const sortBy: SortBy = filters.sortBy ?? "title";
  const sortOrder: SortOrder = filters.sortOrder ?? "asc";

  const orderBy: Prisma.BookOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: safeLimit,
      include: {
        author: true,
        publisher: true,
        genres: true,
        reviews: true,
      },
      orderBy,
    }),
    prisma.book.count({ where }),
  ]);

  return {
    data: books,
    total,
    page: safePage,
    limit: safeLimit,
  };
}

export async function getBookById(id: number) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      author: true,
      publisher: true,
      genres: true,
      reviews: true,
    },
  });
}

export async function addBook(data: BookInput) {
  return prisma.book.create({
    data: {
      title: data.title,
      isbn: data.isbn,
      publishedYear: Number(data.publishedYear),
      pageCount: Number(data.pageCount),
      language: data.language,
      description: data.description,
      authorId: Number(data.authorId),
      publisherId: Number(data.publisherId),
    },
    include: {
      author: true,
      publisher: true,
      genres: true,
      reviews: true,
    },
  });
}

export async function updateBook(id: number, data: BookUpdateInput) {
  const existing = await prisma.book.findUnique({
    where: { id },
  });

  if (!existing) return null;

  return prisma.book.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.isbn !== undefined && { isbn: data.isbn }),
      ...(data.publishedYear !== undefined && {
        publishedYear: Number(data.publishedYear),
      }),
      ...(data.pageCount !== undefined && {
        pageCount: Number(data.pageCount),
      }),
      ...(data.language !== undefined && { language: data.language }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.authorId !== undefined && {
        authorId: Number(data.authorId),
      }),
      ...(data.publisherId !== undefined && {
        publisherId: Number(data.publisherId),
      }),
    },
    include: {
      author: true,
      publisher: true,
      genres: true,
      reviews: true,
    },
  });
}

export async function deleteBook(id: number) {
  const existing = await prisma.book.findUnique({
    where: { id },
  });

  if (!existing) return null;

  return prisma.book.delete({
    where: { id },
  });
}

export async function getBookRating(id: number) {
  const result = await prisma.review.aggregate({
    where: {
      bookId: id,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    averageRating: result._avg.rating ?? 0,
    reviewCount: result._count.rating,
  };
}

export type ReviewInput = {
  userName: string;
  rating: number;
  comment: string;
};

export async function getBookReviews(bookId: number) {
  return prisma.review.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addBookReview(bookId: number, data: ReviewInput) {
  return prisma.review.create({
    data: {
      bookId,
      userName: data.userName,
      rating: Number(data.rating),
      comment: data.comment,
    },
  });
}