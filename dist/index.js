// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  chatSessions;
  chatMessages;
  sessionIdCounter;
  messageIdCounter;
  constructor() {
    this.chatSessions = /* @__PURE__ */ new Map();
    this.chatMessages = /* @__PURE__ */ new Map();
    this.sessionIdCounter = 1;
    this.messageIdCounter = 1;
  }
  async createChatSession(insertSession) {
    const session = {
      ...insertSession,
      id: this.sessionIdCounter++,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.chatSessions.set(session.sessionId, session);
    this.chatMessages.set(session.sessionId, []);
    return session;
  }
  async getChatSession(sessionId) {
    return this.chatSessions.get(sessionId);
  }
  async updateChatSessionLanguage(sessionId, language) {
    const session = this.chatSessions.get(sessionId);
    if (session) {
      session.language = language;
      session.updatedAt = /* @__PURE__ */ new Date();
      this.chatSessions.set(sessionId, session);
    }
  }
  async createChatMessage(insertMessage) {
    const message = {
      ...insertMessage,
      id: this.messageIdCounter++,
      createdAt: /* @__PURE__ */ new Date()
    };
    const messages = this.chatMessages.get(message.sessionId) || [];
    messages.push(message);
    this.chatMessages.set(message.sessionId, messages);
    return message;
  }
  async getChatMessages(sessionId) {
    return this.chatMessages.get(sessionId) || [];
  }
  async getRecentChatMessages(sessionId, limit) {
    const messages = this.chatMessages.get(sessionId) || [];
    return messages.slice(-limit);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(),
  // 'user' or 'assistant'
  language: text("language").notNull(),
  // 'id', 'en', 'zh'
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  language: text("language").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true
});
var insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var chatRequestSchema = z.object({
  message: z.string().min(1).max(1e3),
  sessionId: z.string().min(1),
  language: z.enum(["id", "en", "zh"])
});

// server/routes.ts
var GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
var GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
var MODEL = "llama-3.1-8b-instant";
var systemPrompts = {
  id: "Anda adalah chatbot edukasi keuangan resmi yang ditugaskan untuk memberikan pemahaman yang akurat tentang layanan keuangan yang disediakan oleh Bank Indonesia (BI) dan Otoritas Jasa Keuangan (OJK). Fokus Anda adalah memberikan jawaban yang edukatif, jelas, dan sopan, tanpa menyebarkan opini pribadi atau spekulasi. Topik yang harus Anda jelaskan hanya meliputi layanan keuangan resmi Indonesia, seperti: QRIS (Quick Response Code Indonesian Standard), BI-FAST (sistem transfer dana real-time Bank Indonesia), Sistem pembayaran resmi Indonesia, Fintech yang terdaftar dan diawasi OJK, Perbankan Indonesia, Perlindungan konsumen jasa keuangan, Pencegahan kejahatan keuangan seperti penipuan dan pencucian uang. Selalu jawab dalam bahasa Indonesia dengan bahasa yang mudah dipahami oleh berbagai kalangan masyarakat.",
  en: "You are an official financial education chatbot tasked with providing accurate understanding of financial services provided by Bank Indonesia (BI) and Financial Services Authority (OJK). Your focus is to provide educational, clear, and polite answers, without spreading personal opinions or speculation. Topics you should explain only include official Indonesian financial services, such as: QRIS (Quick Response Code Indonesian Standard), BI-FAST (Bank Indonesia real-time fund transfer system), Official Indonesian payment systems, Fintech registered and supervised by OJK, Indonesian banking, Financial services consumer protection, Prevention of financial crimes such as fraud and money laundering. Always answer in English with language that is easy to understand by various groups of people.",
  zh: "\u60A8\u662F\u5B98\u65B9\u91D1\u878D\u6559\u80B2\u804A\u5929\u673A\u5668\u4EBA\uFF0C\u8D1F\u8D23\u63D0\u4F9B\u6709\u5173\u5370\u5C3C\u94F6\u884C(BI)\u548C\u91D1\u878D\u670D\u52A1\u76D1\u7BA1\u5C40(OJK)\u63D0\u4F9B\u7684\u91D1\u878D\u670D\u52A1\u7684\u51C6\u786E\u7406\u89E3\u3002\u60A8\u7684\u91CD\u70B9\u662F\u63D0\u4F9B\u6559\u80B2\u6027\u3001\u6E05\u6670\u548C\u793C\u8C8C\u7684\u7B54\u6848\uFF0C\u4E0D\u4F20\u64AD\u4E2A\u4EBA\u610F\u89C1\u6216\u6295\u673A\u3002\u60A8\u5E94\u8BE5\u89E3\u91CA\u7684\u4E3B\u9898\u4EC5\u5305\u62EC\u5370\u5C3C\u5B98\u65B9\u91D1\u878D\u670D\u52A1\uFF0C\u5982\uFF1AQRIS\uFF08\u5370\u5C3C\u6807\u51C6\u5FEB\u901F\u54CD\u5E94\u7801\uFF09\u3001BI-FAST\uFF08\u5370\u5C3C\u94F6\u884C\u5B9E\u65F6\u8D44\u91D1\u8F6C\u8D26\u7CFB\u7EDF\uFF09\u3001\u5370\u5C3C\u5B98\u65B9\u652F\u4ED8\u7CFB\u7EDF\u3001OJK\u6CE8\u518C\u548C\u76D1\u7BA1\u7684\u91D1\u878D\u79D1\u6280\u3001\u5370\u5C3C\u94F6\u884C\u4E1A\u3001\u91D1\u878D\u670D\u52A1\u6D88\u8D39\u8005\u4FDD\u62A4\u3001\u9884\u9632\u91D1\u878D\u72AF\u7F6A\u5982\u6B3A\u8BC8\u548C\u6D17\u94B1\u3002\u59CB\u7EC8\u7528\u4E2D\u6587\u56DE\u7B54\uFF0C\u4F7F\u7528\u5404\u754C\u4EBA\u58EB\u90FD\u5BB9\u6613\u7406\u89E3\u7684\u8BED\u8A00\u3002"
};
async function callGroqAPI(userMessage, language, conversationHistory) {
  const messages = [
    {
      role: "system",
      content: systemPrompts[language] || systemPrompts.id
    },
    ...conversationHistory,
    {
      role: "user",
      content: userMessage
    }
  ];
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.3,
      stream: false
    })
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}
async function registerRoutes(app2) {
  app2.post("/api/chat/session", async (req, res) => {
    try {
      const { sessionId, language } = insertChatSessionSchema.parse(req.body);
      let session = await storage.getChatSession(sessionId);
      if (!session) {
        session = await storage.createChatSession({ sessionId, language });
      } else if (session.language !== language) {
        await storage.updateChatSessionLanguage(sessionId, language);
        session.language = language;
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });
  app2.post("/api/chat/message", async (req, res) => {
    try {
      const { message, sessionId, language } = chatRequestSchema.parse(req.body);
      let session = await storage.getChatSession(sessionId);
      if (!session) {
        session = await storage.createChatSession({ sessionId, language });
      }
      await storage.createChatMessage({
        sessionId,
        content: message,
        role: "user",
        language
      });
      const recentMessages = await storage.getRecentChatMessages(sessionId, 20);
      const conversationHistory = recentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }));
      const aiResponse = await callGroqAPI(message, language, conversationHistory.slice(0, -1));
      const savedResponse = await storage.createChatMessage({
        sessionId,
        content: aiResponse,
        role: "assistant",
        language
      });
      res.json({
        message: savedResponse,
        success: true
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to process message"
      });
    }
  });
  app2.get("/api/chat/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get chat history" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
