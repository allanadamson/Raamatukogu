import prisma from "../lib/prisma.js";

export async function getAllGenres() {
  return await prisma.genre.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createGenre(name: string) {
  return await prisma.genre.upsert({
    where: { name },
    update: {},
    create: { name }
  });
}