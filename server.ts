import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getAllMovementsFromDb, insertMovementToDb } from "./src/db/movements.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", cloudSql: Boolean(process.env.SQL_HOST) });
  });

  // Get all movements
  app.get("/api/movements", async (req, res) => {
    try {
      if (!process.env.SQL_HOST) {
        return res.json({ success: true, source: "mock", data: [] });
      }
      const data = await getAllMovementsFromDb();
      res.json({ success: true, source: "cloudsql", data });
    } catch (error: any) {
      console.error("GET /api/movements error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to fetch movements" });
    }
  });

  // Post a new movement
  app.post("/api/movements", async (req, res) => {
    try {
      const record = req.body;
      if (!record || !record.id) {
        return res.status(400).json({ error: "Invalid movement record data" });
      }

      if (!process.env.SQL_HOST) {
        return res.json({ success: true, source: "mock", record });
      }

      const saved = await insertMovementToDb(record);
      res.json({ success: true, source: "cloudsql", record: saved });
    } catch (error: any) {
      console.error("POST /api/movements error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to save movement record" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
