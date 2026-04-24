import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Autorid
  const author1 = await prisma.author.create({
    data: {
      firstName: "Jaan",
      lastName: "Kross",
      birthYear: 1920,
      nationality: "Eesti",
    },
  });

  const author2 = await prisma.author.create({
    data: {
      firstName: "Andrus",
      lastName: "Kivirähk",
      birthYear: 1970,
      nationality: "Eesti",
    },
  });

  // Kirjastused
  const publisher1 = await prisma.publisher.create({
    data: {
      name: "Varrak",
      country: "Eesti",
      foundedYear: 1991,
    },
  });

  const publisher2 = await prisma.publisher.create({
    data: {
      name: "Eesti Raamat",
      country: "Eesti",
      foundedYear: 1964,
    },
  });

  // Raamatud
  await prisma.book.createMany({
    data: [
      {
        title: "Keisri hull",
        isbn: "111111111",
        publishedYear: 1978,
        pageCount: 300,
        language: "Eesti",
        description: "Ajalooline romaan",
        authorId: author1.id,
        publisherId: publisher1.id,
      },
      {
        title: "Rehepapp",
        isbn: "222222222",
        publishedYear: 2000,
        pageCount: 250,
        language: "Eesti",
        description: "Humoorikas romaan",
        authorId: author2.id,
        publisherId: publisher2.id,
      },
    ],
  });

  console.log("🌱 Seed edukalt tehtud");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });