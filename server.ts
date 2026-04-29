import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import { createServer } from "http";
import helmet from "helmet";
import { z } from "zod";
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || "aura.db";
const db = new Database("aura.db");

// Validate Environment at Startup
const REQUIRED_ENV = ["GEMINI_API_KEY"];
if (process.env.NODE_ENV === "production") {
  const missingVars = REQUIRED_ENV.filter(v => !process.env[v] || process.env[v] === "REPLACEME");
  if (missingVars.length > 0) {
    console.error(`CRITICAL: Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
}

// Input Validation Schemas
const ChatSchema = z.object({
  prompt: z.string().min(1).max(5000),
  context: z.string().max(10000).optional(),
});

const AlertReadSchema = z.object({
  id: z.string().min(1).max(128).regex(/^[a-zA-Z0-9_\-]+$/),
});

const UpgradePlanSchema = z.object({
  plan: z.enum(["intelligence", "vision", "nexus"]),
});

// Hardened Multer Configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, CSV, XLSX, and TXT are permitted."));
    }
  }
});

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    role TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    title TEXT,
    severity TEXT,
    strategy TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS ingested_data (
    id TEXT PRIMARY KEY,
    filename TEXT,
    mimetype TEXT,
    size INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Helper to get fresh AI instance
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === "REPLACEME" || apiKey.length < 10) {
    console.error("Critical: API Key is missing or invalid placeholder");
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenerativeAI(apiKey);
};

const auraModel = "gemini-1.5-flash";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  // 1. Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Vite handles this in dev
    crossOriginEmbedderPolicy: false,
  }));

  // 2. Payload size limits
  app.use(express.json({ limit: "15kb" }));

  // 3. API Rate Limiting
  const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // 50 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many intelligence requests. Please slow down." }
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({
      status: "Operational",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0-enterprise"
    });
  });

  // WebSocket for War Room
  const clients = new Set<WebSocket>();
  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("message", (data) => {
      // Broadcast to all other clients
      const message = data.toString();
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
    ws.on("close", () => clients.delete(ws));
  });

  // API Routes
  // Health check already defined above

  // Intelligence API
  app.get("/api/intelligence/history", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY timestamp ASC").all();
    res.json(messages);
  });

  app.post("/api/intelligence/chat", aiLimiter, async (req, res) => {
    const validation = ChatSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid input", details: validation.error.format() });
    }

    const { prompt, context } = validation.data;

    try {
      const genAI = getAI();
      const model = genAI.getGenerativeModel({
        model: auraModel,
        systemInstruction: `You are Aura, a world-class executive intelligence assistant. 
        Your goal is to provide high-leverage strategic insights, financial analysis, and decision-making support.
        Keep responses professional, concise, and data-driven. 
        Use markdown for formatting. 
        Always focus on ROI and strategic impact.`,
      });

      const promptWithContext = context ? `Context: ${context}\n\nPrompt: ${prompt}` : prompt;

      const result = await model.generateContent(promptWithContext);
      const assistantContent = result.response.text();

      // Store in DB
      const userMsgId = Date.now().toString();
      const assistantMsgId = (Date.now() + 1).toString();

      try {
        db.prepare("INSERT INTO messages (id, role, content) VALUES (?, ?, ?)").run(userMsgId, "user", prompt);
        db.prepare("INSERT INTO messages (id, role, content) VALUES (?, ?, ?)").run(assistantMsgId, "assistant", assistantContent);
      } catch (dbError) {
        console.error("Database error:", dbError);
      }

      res.json({ content: assistantContent, id: assistantMsgId });
    } catch (error: any) {
      console.error("Aura Intelligence Error:", error.message || "Unknown error");

      if (error.message === "API_KEY_MISSING" || error.message?.includes("API key not valid")) {
        return res.status(401).json({
          error: "Intelligence Layer Restricted",
          details: "A valid Gemini API key is required to power Aura Intelligence. Please configure it in your project settings.",
          isApiKeyError: true
        });
      }

      // Production error sanitization
      res.status(500).json({ error: "Intelligence layer temporarily unavailable." });
    }
  });

  app.delete("/api/intelligence/history", (req, res) => {
    db.prepare("DELETE FROM messages").run();
    res.json({ status: "cleared" });
  });

  // Alerts API
  app.get("/api/alerts", (req, res) => {
    const alerts = db.prepare("SELECT * FROM alerts ORDER BY timestamp DESC").all();
    res.json(alerts);
  });

  app.post("/api/alerts/generate", aiLimiter, async (req, res) => {
    const prompt = `Generate a strategic mitigation strategy for these business alerts:
    - Revenue is down 4.2%
    - Churn is up 1.5%
    Provide a concise, executive-level strategy.`;

    try {
      const genAI = getAI();
      const model = genAI.getGenerativeModel({ model: auraModel });
      const result = await model.generateContent(prompt);
      const strategy = result.response.text();

      const id = Date.now().toString();
      db.prepare("INSERT INTO alerts (id, title, severity, strategy) VALUES (?, ?, ?, ?)").run(
        id,
        "Revenue & Churn Alert",
        "High",
        strategy
      );
      res.json({ id, strategy });
    } catch (error: any) {
      console.error("Alert generation error:", error);
      if (error.message === "API_KEY_MISSING" || error.message?.includes("API key not valid")) {
        return res.status(401).json({ error: "A valid Gemini API key is required to perform strategic scans. Please configure it in your settings." });
      }
      res.status(500).json({ error: "Alert generation failed: " + error.message });
    }
  });

  app.delete("/api/alerts", (req, res) => {
    db.prepare("DELETE FROM alerts").run();
    res.json({ status: "cleared" });
  });

  app.patch("/api/alerts/:id/read", (req, res) => {
    const validation = AlertReadSchema.safeParse({ id: req.params.id });
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid resource identifier" });
    }
    const { id } = validation.data;
    db.prepare("UPDATE alerts SET is_read = 1 WHERE id = ?").run(id);
    res.json({ status: "updated" });
  });

  // Data Ingestion API - Hardened
  app.post("/api/ingest", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    // Sanitize filename to prevent path traversal/injection
    const safeFilename = path.basename(req.file.originalname).replace(/[^a-z0-9.]/gi, '_');
    const id = Date.now().toString();

    try {
      db.prepare("INSERT INTO ingested_data (id, filename, mimetype, size) VALUES (?, ?, ?, ?)").run(
        id,
        safeFilename,
        req.file.mimetype,
        req.file.size
      );

      res.json({
        status: "Strategically Ingested",
        id,
        filename: safeFilename
      });
    } catch (error) {
      console.error("Ingestion storage failure");
      res.status(500).json({ error: "Ingestion pipeline interrupted" });
    }
  });

  app.get("/api/ingested", (req, res) => {
    const data = db.prepare("SELECT * FROM ingested_data ORDER BY timestamp DESC").all();
    res.json(data);
  });

  // Market Data API
  app.get("/api/market/data", (req, res) => {
    res.json({
      assets: [
        { name: 'Aura Core Index', price: '$42,105.20', change: '+4.2%', volume: '$1.2B', status: 'Bullish' },
        { name: 'Global Tech ETF', price: '$185.40', change: '-1.2%', volume: '$450M', status: 'Bearish' },
        { name: 'Energy Futures', price: '$92.15', change: '+0.5%', volume: '$890M', status: 'Neutral' },
        { name: 'Emerging Markets', price: '$3,420.00', change: '+2.8%', volume: '$2.1B', status: 'Bullish' },
      ]
    });
  });

  // Billing API
  app.get("/api/billing/status", (req, res) => {
    type PlanRow = { value: string };

    const result = db
      .prepare("SELECT value FROM user_settings WHERE key = 'active_plan'")
      .get() as PlanRow | undefined;

    const activePlan = result?.value ?? 'intelligence';

    res.json({ activePlan });
  });

  app.post("/api/billing/upgrade", (req, res) => {
    const validation = UpgradePlanSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid strategy selection" });
    }
    const { plan } = validation.data;
    db.prepare("INSERT OR REPLACE INTO user_settings (key, value) VALUES ('active_plan', ?)").run(plan);
    res.json({ status: "upgraded", plan });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const serverInstance = server.listen(PORT, "0.0.0.0", () => {
    console.log(`
    -------------------------------------------------
    AURUM INTELLIGENCE SUITE - PRODUCTION KERNEL
    Port: ${PORT}
    Mode: ${process.env.NODE_ENV || 'development'}
    System Status: SECURE
    -------------------------------------------------
    `);
  });

  // Graceful Shutdown Handling
  const shutdown = () => {
    console.log("\nAURA: Initiating graceful shutdown...");
    serverInstance.close(() => {
      console.log("AURA: Web server terminated.");
      db.close();
      console.log("AURA: Intelligence database disconnected.");
      process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
      console.error("AURA: Forced shutdown timed out.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer();
