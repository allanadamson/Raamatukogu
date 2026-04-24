import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL
  },
  migrations: {
    // See rida ütleb Prismale, kuidas seederit käivitada
    seed: 'tsx --env-file=.env ./prisma/seed.ts',
  }
});