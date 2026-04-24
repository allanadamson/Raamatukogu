import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import prisma from "./lib/prisma.js";
import bookRoutes from "./routes/book.routes.js";

const app: Application = express();
const PORT: number = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});

// Andmebaasi ühenduse kontroll
async function testDb() {
  try {
    await prisma.$connect();
    console.log("✅ Ühendus Supabase'iga on edukas!");
  } catch (error) {
    console.error("❌ Andmebaasi viga:", error);
  }
}
testDb();

// Marsruudid
app.use("/api/v1/books", bookRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server on elus" });
});

// 404 käitleja
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server jookseb: http://localhost:${PORT}`);
});