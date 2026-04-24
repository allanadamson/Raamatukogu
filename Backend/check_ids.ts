import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL!
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🔍 Kontrollin olemasolevaid andmeid...');
  
  const authors = await prisma.author.findMany({ select: { id: true, lastName: true } });
  const publishers = await prisma.publisher.findMany({ select: { id: true, name: true } });

  console.log('\n--- AUTORID ---');
  console.table(authors);

  console.log('\n--- KIRJASTAJAD ---');
  console.table(publishers);
}

main().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});