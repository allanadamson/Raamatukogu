import prisma from "../lib/prisma.js";

export async function createReview(data: {
  bookId: number;
  userName: string;
  rating: number;
  comment?: string;
}) {
  return await prisma.review.create({
    data: {
      userName: data.userName,
      rating: data.rating,
      comment: data.comment ?? "", 
      book: {
        connect: { id: Number(data.bookId) }
      }
    }
  });
}

export async function getReviewsByBookId(bookId: number) {
  return await prisma.review.findMany({
    where: { bookId: Number(bookId) },
    orderBy: { createdAt: 'desc' }
  });
}