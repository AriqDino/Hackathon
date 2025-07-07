import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, insertChatSessionSchema } from "@shared/schema";
import { z } from "zod";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const systemPrompts = {
  id: "Anda adalah chatbot edukasi keuangan resmi yang ditugaskan untuk memberikan pemahaman yang akurat tentang layanan keuangan yang disediakan oleh Bank Indonesia (BI) dan Otoritas Jasa Keuangan (OJK). Fokus Anda adalah memberikan jawaban yang edukatif, jelas, dan sopan, tanpa menyebarkan opini pribadi atau spekulasi. Topik yang harus Anda jelaskan hanya meliputi layanan keuangan resmi Indonesia, seperti: QRIS (Quick Response Code Indonesian Standard), BI-FAST (sistem transfer dana real-time Bank Indonesia), Sistem pembayaran resmi Indonesia, Fintech yang terdaftar dan diawasi OJK, Perbankan Indonesia, Perlindungan konsumen jasa keuangan, Pencegahan kejahatan keuangan seperti penipuan dan pencucian uang. Selalu jawab dalam bahasa Indonesia dengan bahasa yang mudah dipahami oleh berbagai kalangan masyarakat.",
  en: "You are an official financial education chatbot tasked with providing accurate understanding of financial services provided by Bank Indonesia (BI) and Financial Services Authority (OJK). Your focus is to provide educational, clear, and polite answers, without spreading personal opinions or speculation. Topics you should explain only include official Indonesian financial services, such as: QRIS (Quick Response Code Indonesian Standard), BI-FAST (Bank Indonesia real-time fund transfer system), Official Indonesian payment systems, Fintech registered and supervised by OJK, Indonesian banking, Financial services consumer protection, Prevention of financial crimes such as fraud and money laundering. Always answer in English with language that is easy to understand by various groups of people.",
  zh: "您是官方金融教育聊天机器人，负责提供有关印尼银行(BI)和金融服务监管局(OJK)提供的金融服务的准确理解。您的重点是提供教育性、清晰和礼貌的答案，不传播个人意见或投机。您应该解释的主题仅包括印尼官方金融服务，如：QRIS（印尼标准快速响应码）、BI-FAST（印尼银行实时资金转账系统）、印尼官方支付系统、OJK注册和监管的金融科技、印尼银行业、金融服务消费者保护、预防金融犯罪如欺诈和洗钱。始终用中文回答，使用各界人士都容易理解的语言。"
};

async function callGroqAPI(userMessage: string, language: string, conversationHistory: any[]): Promise<string> {
  const messages = [
    {
      role: "system",
      content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.id
    },
    ...conversationHistory,
    {
      role: "user",
      content: userMessage
    }
  ];

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Create or get chat session
  app.post("/api/chat/session", async (req, res) => {
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

  // Send chat message
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, sessionId, language } = chatRequestSchema.parse(req.body);
      
      // Ensure session exists
      let session = await storage.getChatSession(sessionId);
      if (!session) {
        session = await storage.createChatSession({ sessionId, language });
      }

      // Store user message
      await storage.createChatMessage({
        sessionId,
        content: message,
        role: 'user',
        language
      });

      // Get recent conversation history (last 10 exchanges)
      const recentMessages = await storage.getRecentChatMessages(sessionId, 20);
      const conversationHistory = recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get AI response
      const aiResponse = await callGroqAPI(message, language, conversationHistory.slice(0, -1)); // Exclude the current message

      // Store AI response
      const savedResponse = await storage.createChatMessage({
        sessionId,
        content: aiResponse,
        role: 'assistant',
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

  // Get chat history
  app.get("/api/chat/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
