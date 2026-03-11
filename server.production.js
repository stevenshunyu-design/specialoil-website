var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// server.ts
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

// src/storage/database/supabase-client.ts
import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
var envLoaded = false;
function loadEnv() {
  const hasUrl = process.env.COZE_SUPABASE_URL || process.env.SUPABASE_URL;
  const hasKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (envLoaded || hasUrl && hasKey) {
    return;
  }
  try {
    try {
      __require("dotenv").config();
      const hasUrlNow = process.env.COZE_SUPABASE_URL || process.env.SUPABASE_URL;
      const hasKeyNow = process.env.COZE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
      if (hasUrlNow && hasKeyNow) {
        envLoaded = true;
        return;
      }
    } catch {
    }
    const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;
    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, `'"'"'`)}'`, {
      encoding: "utf-8",
      timeout: 1e4,
      stdio: ["pipe", "pipe", "pipe"]
    });
    const lines = output.trim().split("\n");
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const eqIndex = line.indexOf("=");
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex);
        let value = line.substring(eqIndex + 1);
        if (value.startsWith("'") && value.endsWith("'") || value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    envLoaded = true;
  } catch {
  }
}
function getSupabaseCredentials() {
  loadEnv();
  const url = process.env.COZE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }
  return { url, anonKey };
}
function getSupabaseClient(token) {
  const { url, anonKey } = getSupabaseCredentials();
  if (token) {
    return createClient(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      },
      db: {
        timeout: 6e4
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return createClient(url, anonKey, {
    db: {
      timeout: 6e4
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// server.ts
import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var distPath = process.env.NODE_ENV === "production" ? path.join(__dirname, "dist") : path.join(process.cwd(), "dist");
console.log("========================================");
console.log("Starting server with security features...");
console.log("PORT:", process.env.PORT || 3001);
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "SET" : "NOT SET");
console.log("Static files path:", distPath);
console.log("dist directory exists:", fs.existsSync(distPath));
console.log("========================================");
var app = express();
var httpServer = createServer(app);
var PORT = process.env.PORT || 3001;
var io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5000", "http://localhost:3000", process.env.SITE_URL].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/socket.io/"
});
app.use(cors());
app.use(express.json());
app.use(express.static(distPath, {
  index: false,
  // 禁止自动返回 index.html，让 SPA 路由处理
  maxAge: "1d"
  // 静态资源缓存
}));
var FEISHU_CHAT_WEBHOOK = process.env.FEISHU_CHAT_WEBHOOK;
var FEISHU_INQUIRY_WEBHOOK = process.env.FEISHU_INQUIRY_WEBHOOK;
var FEISHU_WEBHOOK_URL = FEISHU_CHAT_WEBHOOK || process.env.FEISHU_WEBHOOK_URL;
var FEISHU_APP_ID = process.env.FEISHU_APP_ID || process.env.FEISHU_CHAT_APP_ID;
var FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || process.env.FEISHU_CHAT_APP_SECRET;
var FEISHU_CHAT_ID = process.env.FEISHU_CHAT_ID;
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var OPENAI_API_HOST = process.env.OPENAI_API_HOST || "api.openai.com";
console.log("========================================");
console.log("Server Configuration:");
console.log("FEISHU_APP_ID:", FEISHU_APP_ID || "NOT SET");
console.log("FEISHU_APP_SECRET:", FEISHU_APP_SECRET ? "SET" : "NOT SET");
console.log("FEISHU_CHAT_ID:", FEISHU_CHAT_ID || "NOT SET");
console.log("FEISHU_CHAT_WEBHOOK (\u5BA2\u670D\u901A\u77E5):", FEISHU_CHAT_WEBHOOK ? `SET` : "NOT SET");
console.log("FEISHU_INQUIRY_WEBHOOK (\u8BE2\u76D8\u901A\u77E5):", FEISHU_INQUIRY_WEBHOOK ? `SET` : "NOT SET");
console.log("OPENAI_API_KEY:", OPENAI_API_KEY ? "SET" : "NOT SET");
console.log("========================================");
var feishuAccessToken = null;
var tokenExpireTime = 0;
async function getFeishuAccessToken() {
  if (feishuAccessToken && Date.now() < tokenExpireTime) {
    return feishuAccessToken;
  }
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    return null;
  }
  try {
    const response = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET
      })
    });
    const data = await response.json();
    if (data.code === 0) {
      feishuAccessToken = data.tenant_access_token;
      tokenExpireTime = Date.now() + (data.expire - 300) * 1e3;
      console.log("\u2705 Feishu access token obtained");
      return feishuAccessToken;
    }
    return null;
  } catch (error) {
    console.error("Error getting Feishu token:", error);
    return null;
  }
}
async function sendFeishuMessage(openId, message) {
  const token = await getFeishuAccessToken();
  if (!token) return false;
  try {
    const response = await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        receive_id: openId,
        msg_type: "text",
        content: JSON.stringify({ text: message })
      })
    });
    const data = await response.json();
    return data.code === 0;
  } catch (error) {
    console.error("Error sending Feishu message:", error);
    return false;
  }
}
async function sendFeishuGroupMessage(sessionId, visitorName, visitorEmail, message) {
  if (!FEISHU_WEBHOOK_URL) {
    console.log("Feishu webhook not configured");
    return false;
  }
  const shortId = sessionId.substring(0, 8);
  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "interactive",
        card: {
          header: {
            title: { tag: "plain_text", content: `\u{1F4AC} \u6765\u81EA\u8BBF\u5BA2: ${visitorName || "\u533F\u540D"}` },
            template: "blue"
          },
          elements: [
            {
              tag: "div",
              fields: [
                { is_short: true, text: { tag: "lark_md", content: `**\u4F1A\u8BDDID:**
${shortId}` } },
                { is_short: true, text: { tag: "lark_md", content: `**\u90AE\u7BB1:**
${visitorEmail || "\u672A\u63D0\u4F9B"}` } }
              ]
            },
            {
              tag: "div",
              text: { tag: "lark_md", content: `**\u6D88\u606F\u5185\u5BB9:**
${message}` }
            },
            {
              tag: "note",
              elements: [
                { tag: "plain_text", content: `\u56DE\u590D\u683C\u5F0F: /reply ${shortId} \u60A8\u7684\u56DE\u590D\u5185\u5BB9` }
              ]
            }
          ]
        }
      })
    });
    return response.ok;
  } catch (error) {
    console.error("Error sending Feishu group message:", error);
    return false;
  }
}
async function sendFeishuChatMessage(sessionId, customerNo, customerName, customerEmail, customerPhone, message, rootMessageId) {
  const token = await getFeishuAccessToken();
  if (!token || !FEISHU_CHAT_ID) {
    console.log("Feishu API not configured, falling back to webhook");
    const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
    return { success: webhookSuccess };
  }
  const shortId = sessionId.substring(0, 8);
  const timestamp = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const card = {
    config: { wide_screen_mode: true },
    header: {
      title: { tag: "plain_text", content: rootMessageId ? `\u{1F4AC} ${customerNo}` : `\u{1F514} \u65B0\u5BA2\u6237\u54A8\u8BE2 ${customerNo}` },
      template: "blue"
    },
    elements: [
      {
        tag: "div",
        fields: [
          { is_short: true, text: { tag: "lark_md", content: `**\u5BA2\u6237\u59D3\u540D**
${customerName}` } },
          { is_short: true, text: { tag: "lark_md", content: `**\u65F6\u95F4**
${timestamp}` } },
          { is_short: true, text: { tag: "lark_md", content: `**\u90AE\u7BB1**
${customerEmail || "\u672A\u63D0\u4F9B"}` } },
          { is_short: true, text: { tag: "lark_md", content: `**\u7535\u8BDD**
${customerPhone || "\u672A\u63D0\u4F9B"}` } }
        ]
      },
      { tag: "hr" },
      { tag: "div", text: { tag: "lark_md", content: `**\u6D88\u606F\u5185\u5BB9**
${message}` } },
      { tag: "hr" },
      { tag: "note", text: { tag: "lark_md", content: rootMessageId ? `\u{1F4AC} \u76F4\u63A5\u5728\u8BDD\u9898\u4E0B\u56DE\u590D\u5BA2\u6237` : `\u{1F4AC} \u76F4\u63A5\u5728\u8BDD\u9898\u4E0B\u56DE\u590D\u5BA2\u6237` } }
    ]
  };
  try {
    const requestBody = {
      receive_id: FEISHU_CHAT_ID,
      msg_type: "interactive",
      content: JSON.stringify(card)
    };
    if (rootMessageId) {
      requestBody.root_id = rootMessageId;
    }
    const response = await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    if (data.code === 0 && data.data?.message_id) {
      console.log(`\u2705 Feishu message sent: ${data.data.message_id}`);
      return { success: true, messageId: data.data.message_id };
    } else {
      console.error("Feishu API error:", data);
      const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
      return { success: webhookSuccess };
    }
  } catch (error) {
    console.error("Error sending Feishu API message:", error);
    const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
    return { success: webhookSuccess };
  }
}
var connectedVisitors = /* @__PURE__ */ new Map();
var sessionSocketMap = /* @__PURE__ */ new Map();
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("visitor:join", async (data) => {
    const { visitorId, name, email } = data;
    const client = getSupabaseClient();
    let session = null;
    const { data: existingSession } = await client.from("chat_sessions").select("*").eq("visitor_id", visitorId).in("status", ["waiting", "active"]).order("created_at", { ascending: false }).limit(1).single();
    if (existingSession) {
      session = existingSession;
    } else {
      const { data: newSession, error } = await client.from("chat_sessions").insert({
        visitor_id: visitorId,
        visitor_name: name || null,
        visitor_email: email || null,
        status: "waiting"
        // 新会话设为等待状态
      }).select().single();
      if (!error && newSession) {
        session = newSession;
      }
    }
    if (session) {
      socket.join(`session:${session.id}`);
      connectedVisitors.set(visitorId, socket.id);
      sessionSocketMap.set(session.id, socket.id);
      socket.data.visitorId = visitorId;
      socket.data.sessionId = session.id;
      socket.emit("session:created", session);
      const { data: messages } = await client.from("chat_messages").select("*").eq("session_id", session.id).order("created_at", { ascending: true });
      socket.emit("messages:history", messages || []);
      socket.emit("session:active", { message: "Connected to support" });
    }
  });
  socket.on("visitor:message", async (data) => {
    const { sessionId, message } = data;
    const client = getSupabaseClient();
    const { data: savedMessage, error } = await client.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "visitor",
      sender_name: "Visitor",
      message
    }).select().single();
    if (!error && savedMessage) {
      socket.emit("message:received", savedMessage);
      const { data: session } = await client.from("chat_sessions").select("*").eq("id", sessionId).single();
      if (session) {
        const visitorName = session.visitor_name || "Visitor";
        const visitorEmail = session.visitor_email || "Not provided";
        const visitorPhone = session.visitor_phone || "Not provided";
        const customerNo = session.customer_no || `#${sessionId.substring(0, 8)}`;
        const rootMessageId = session.feishu_root_message_id;
        console.log(`Sending message to Feishu for session ${sessionId}`);
        const result = await sendFeishuChatMessage(
          sessionId,
          customerNo,
          visitorName,
          visitorEmail,
          visitorPhone,
          message,
          rootMessageId
          // 如果有 root_message_id，则作为话题回复
        );
        if (result.success && result.messageId && !rootMessageId) {
          await client.from("chat_sessions").update({ feishu_root_message_id: result.messageId }).eq("id", sessionId);
          console.log(`\u2705 Saved root message ID: ${result.messageId}`);
        }
      }
      await client.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    }
  });
  socket.on("session:close", async (sessionId) => {
    const client = getSupabaseClient();
    await client.from("chat_sessions").update({ status: "closed" }).eq("id", sessionId);
    socket.emit("session:closed");
    sessionSocketMap.delete(sessionId);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    if (socket.data.visitorId) connectedVisitors.delete(socket.data.visitorId);
    if (socket.data.sessionId) sessionSocketMap.delete(socket.data.sessionId);
  });
});
app.post("/feishu/webhook", async (req, res) => {
  console.log("=== Received Feishu webhook ===");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  const { type, challenge, event } = req.body;
  if (type === "url_verification") {
    console.log("URL verification, challenge:", challenge);
    return res.status(200).json({ challenge });
  }
  if (event?.message) {
    const message = event.message;
    const senderId = event.sender?.sender_id?.open_id;
    const rootId = message.root_id;
    const parentId = message.parent_id;
    let messageText = "";
    try {
      const content = JSON.parse(message.content || "{}");
      messageText = content.text || "";
    } catch {
      messageText = message.content || "";
    }
    console.log(`Feishu message from ${senderId}: ${messageText}, root_id: ${rootId}, parent_id: ${parentId}`);
    const client = getSupabaseClient();
    if (rootId) {
      console.log(`Looking for session with feishu_root_message_id: ${rootId}`);
      const { data: sessionByRootId } = await client.from("chat_sessions").select("*").eq("feishu_root_message_id", rootId).eq("status", "active").single();
      if (sessionByRootId) {
        console.log(`Found session ${sessionByRootId.id} by root_id`);
        await client.from("chat_messages").insert({
          session_id: sessionByRootId.id,
          sender_type: "admin",
          sender_name: "Support",
          message: messageText
        });
        io.to(`session:${sessionByRootId.id}`).emit("message:new", {
          id: Date.now().toString(),
          session_id: sessionByRootId.id,
          sender_type: "admin",
          sender_name: "Support",
          message: messageText,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        console.log(`\u2705 Topic reply sent to visitor: ${messageText}`);
        return res.status(200).json({ code: 0, msg: "success" });
      }
    }
    const replyMatch = messageText.match(/^\/reply\s+(\w+)\s+(.+)/is);
    if (replyMatch) {
      const sessionShortId = replyMatch[1];
      const replyMessage = replyMatch[2];
      const { data: sessions } = await client.from("chat_sessions").select("*").eq("status", "active");
      const targetSession = sessions?.find(
        (s) => s.id.startsWith(sessionShortId)
      );
      if (targetSession) {
        console.log(`Found session ${targetSession.id} for reply`);
        await client.from("chat_messages").insert({
          session_id: targetSession.id,
          sender_type: "admin",
          sender_name: "Support",
          message: replyMessage
        });
        io.to(`session:${targetSession.id}`).emit("message:new", {
          id: Date.now().toString(),
          session_id: targetSession.id,
          sender_type: "admin",
          sender_name: "Support",
          message: replyMessage,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        console.log(`\u2705 Reply sent to visitor: ${replyMessage}`);
        if (senderId) {
          await sendFeishuMessage(senderId, `\u2705 \u6D88\u606F\u5DF2\u53D1\u9001\u7ED9\u8BBF\u5BA2`);
        }
      } else {
        console.log(`Session not found: ${sessionShortId}`);
        if (senderId) {
          await sendFeishuMessage(senderId, `\u274C \u672A\u627E\u5230\u4F1A\u8BDD: ${sessionShortId}`);
        }
      }
    }
  }
  res.status(200).json({ code: 0, msg: "success" });
});
app.get("/feishu/webhook", (req, res) => {
  res.status(200).json({ status: "ok", message: "Feishu webhook endpoint is working" });
});
var WEBSITE_KNOWLEDGE = `
You are an AI assistant for Zhongrun Special Oil (Chinese Special Oil Supply Platform).

**IMPORTANT: You MUST respond in English only. Never respond in Chinese or any other language.**

About the Company:
- Leading Chinese supplier of specialty lubricants and oils
- Products: Transformer Oil, Rubber Process Oil, White Oil, Finished Lubricants
- Services: Quality assurance, global logistics, custom solutions

Contact Information:
- Email: steven.shunyu@gmail.com
- Phone: +8613793280176
- Website: https://cnspecialtyoils.com

When to Transfer to Human Agent:
If user asks about: pricing, quotes, custom orders, complaints, partnership, bulk orders, or requests human help - respond: "I'll connect you with a human agent. Please wait..."
`;
function needsHumanAgent(message) {
  const keywords = [
    "price",
    "pricing",
    "quote",
    "quotation",
    "cost",
    "discount",
    "negotiate",
    "complaint",
    "complain",
    "human",
    "agent",
    "person",
    "speak to",
    "talk to",
    "manager",
    "supervisor",
    "urgent",
    "emergency",
    "custom order",
    "special order",
    "partnership",
    "bulk order",
    "wholesale",
    "distributor"
  ];
  return keywords.some((k) => message.toLowerCase().includes(k));
}
app.get("/api/chat/messages", async (req, res) => {
  try {
    const { sessionId, after } = req.query;
    console.log(`\u{1F4E8} Polling messages for session: ${sessionId}`);
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      console.log("\u26A0\uFE0F Database not configured");
      return res.json({ messages: [] });
    }
    let targetSession = null;
    const { data: exactSession } = await client.from("chat_sessions").select("id, status").eq("id", sessionId).single();
    if (exactSession) {
      targetSession = exactSession;
      console.log(`\u2705 Found exact session: ${targetSession.id}`);
    } else {
      const { data: sessions } = await client.from("chat_sessions").select("id, status").eq("status", "active");
      targetSession = sessions?.find((s) => s.id.startsWith(sessionId));
      if (targetSession) {
        console.log(`\u2705 Found session by prefix match: ${targetSession.id}`);
      } else {
        console.log(`\u26A0\uFE0F Session not found: ${sessionId}`);
        return res.json({ messages: [] });
      }
    }
    let query = client.from("chat_messages").select("*").eq("session_id", targetSession.id).order("created_at", { ascending: true });
    if (after) {
      const { data: afterMessage } = await client.from("chat_messages").select("created_at").eq("id", after).single();
      if (afterMessage) {
        query = query.gt("created_at", afterMessage.created_at);
      }
    }
    const { data: messages, error } = await query;
    if (error) {
      console.error("Error fetching messages:", error);
      return res.json({ messages: [] });
    }
    console.log(`\u{1F4EC} Returning ${messages?.length || 0} messages`);
    res.json({ messages: messages || [] });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});
app.get("/api/chat/sessions", async (req, res) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }
    const { data: sessions, error } = await client.from("chat_sessions").select("*").order("updated_at", { ascending: false });
    if (error) {
      console.error("Error fetching sessions:", error);
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: sessions || [] });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Failed to get sessions" });
  }
});
app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }
    const { data: messages, error } = await client.from("chat_messages").select("*").eq("session_id", sessionId).order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching messages:", error);
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: messages || [] });
  } catch (error) {
    console.error("Get session messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});
app.get("/api/chat/sessions/:sessionId/status", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: false, error: "Database not configured" });
    }
    const { data: session, error } = await client.from("chat_sessions").select("status").eq("id", sessionId).single();
    if (error || !session) {
      return res.json({ success: false, error: "Session not found" });
    }
    res.json({ success: true, status: session.status });
  } catch (error) {
    console.error("Get session status error:", error);
    res.status(500).json({ error: "Failed to get session status" });
  }
});
app.post("/api/chat/admin/message", async (req, res) => {
  try {
    const { sessionId, message, adminName } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: "Session ID and message are required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { error: insertError } = await client.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "admin",
      sender_name: adminName || "Support",
      message
    });
    if (insertError) {
      console.error("Error saving admin message:", insertError);
      return res.status(500).json({ error: "Failed to save message" });
    }
    await client.from("chat_sessions").update({
      status: "active",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", sessionId).eq("status", "waiting");
    await client.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    res.json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error("Admin message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
app.post("/api/chat/sessions/:sessionId/close", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { error } = await client.from("chat_sessions").update({ status: "closed", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    if (error) {
      console.error("Error closing session:", error);
      return res.status(500).json({ error: "Failed to close session" });
    }
    res.json({ success: true, message: "Session closed" });
  } catch (error) {
    console.error("Close session error:", error);
    res.status(500).json({ error: "Failed to close session" });
  }
});
app.delete("/api/chat/sessions/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { error: messagesError } = await client.from("chat_messages").delete().eq("session_id", sessionId);
    if (messagesError) {
      console.error("Error deleting session messages:", messagesError);
      return res.status(500).json({ error: "Failed to delete session messages" });
    }
    const { error: sessionError } = await client.from("chat_sessions").delete().eq("id", sessionId);
    if (sessionError) {
      console.error("Error deleting session:", sessionError);
      return res.status(500).json({ error: "Failed to delete session" });
    }
    console.log(`\u2705 Session ${sessionId} deleted successfully`);
    res.json({ success: true, message: "Session deleted" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
});
app.post("/api/chat/human", async (req, res) => {
  try {
    const { message, sessionId, customerInfo } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { data: existingSession } = await client.from("chat_sessions").select("*").eq("id", sessionId).single();
    if (!existingSession) {
      return res.status(404).json({ error: "Session not found" });
    }
    await client.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "visitor",
      sender_name: existingSession.visitor_name || "Visitor",
      message
    });
    await client.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    if (FEISHU_WEBHOOK_URL) {
      const customerNo = existingSession.customer_no || `#${sessionId.substring(0, 8)}`;
      const visitorName = existingSession.visitor_name || "Visitor";
      const notification = {
        msg_type: "interactive",
        card: {
          header: {
            title: { tag: "plain_text", content: `\u{1F4AC} \u65B0\u6D88\u606F ${customerNo}` },
            template: "blue"
          },
          elements: [
            {
              tag: "div",
              text: {
                tag: "lark_md",
                content: `**${visitorName}**: ${message.substring(0, 200)}${message.length > 200 ? "..." : ""}`
              }
            },
            { tag: "divider" },
            {
              tag: "action",
              actions: [
                {
                  tag: "button",
                  text: { tag: "plain_text", content: "\u524D\u5F80\u540E\u53F0\u56DE\u590D" },
                  url: `${process.env.SITE_URL || "https://cnspecialtyoils.com"}/admin/chat`,
                  type: "primary"
                }
              ]
            }
          ]
        }
      };
      try {
        console.log(`\u{1F4E4} Sending Feishu notification for new message from ${customerNo}`);
        const feishuResponse = await fetch(FEISHU_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification)
        });
        const feishuResult = await feishuResponse.text();
        console.log(`\u{1F4E5} Feishu response status: ${feishuResponse.status}`);
        console.log(`\u{1F4E5} Feishu response: ${feishuResult}`);
        if (feishuResponse.ok) {
          console.log(`\u2705 Feishu notification sent successfully for ${customerNo}`);
        } else {
          console.error(`\u274C Feishu notification failed: ${feishuResult}`);
        }
      } catch (feishuError) {
        console.error("\u274C Failed to send Feishu notification:", feishuError);
      }
    } else {
      console.log("\u26A0\uFE0F FEISHU_WEBHOOK_URL not configured, skipping notification");
    }
    res.json({
      success: true,
      message: "Message sent",
      session: existingSession
    });
  } catch (error) {
    console.error("Human chat error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message, customerInfo } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });
    if (needsHumanAgent(message)) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shortId = sessionId.substring(0, 8);
      const customerNo = customerInfo?.customerNo || `#${shortId}`;
      const customerName = customerInfo?.name || "Unknown";
      const customerEmail = customerInfo?.email || "Not provided";
      const customerPhone = customerInfo?.phone || "Not provided";
      const client = getSupabaseClient();
      if (client) {
        await client.from("chat_sessions").insert({
          id: sessionId,
          visitor_id: sessionId,
          visitor_name: customerName,
          visitor_email: customerEmail,
          visitor_phone: customerPhone,
          customer_no: customerNo,
          status: "waiting"
          // 新会话设为等待状态，管理员回复后变为 active
        });
        await client.from("chat_messages").insert({
          session_id: sessionId,
          sender_type: "visitor",
          sender_name: customerName,
          message
        });
        console.log(`\u2705 Session saved: ${customerNo}`);
      }
      if (FEISHU_WEBHOOK_URL) {
        const notification = {
          msg_type: "interactive",
          card: {
            header: {
              title: { tag: "plain_text", content: `\u{1F514} \u65B0\u5BA2\u6237\u54A8\u8BE2 ${customerNo}` },
              template: "blue"
            },
            elements: [
              {
                tag: "div",
                text: {
                  tag: "lark_md",
                  content: `**\u5BA2\u6237\u4FE1\u606F**
\u{1F464} \u59D3\u540D: ${customerName}
\u{1F4E7} \u90AE\u7BB1: ${customerEmail}
\u{1F4F1} \u7535\u8BDD: ${customerPhone}
\u{1F4AC} \u6D88\u606F: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`
                }
              },
              { tag: "divider" },
              {
                tag: "action",
                actions: [
                  {
                    tag: "button",
                    text: { tag: "plain_text", content: "\u524D\u5F80\u540E\u53F0\u56DE\u590D" },
                    url: `${process.env.SITE_URL || "https://cnspecialtyoils.com"}/admin/chat`,
                    type: "primary"
                  }
                ]
              },
              {
                tag: "note",
                elements: [
                  { tag: "plain_text", content: `\u8BF7\u767B\u5F55\u540E\u53F0\u5BA2\u670D\u7CFB\u7EDF\u56DE\u590D\u5BA2\u6237\u6D88\u606F` }
                ]
              }
            ]
          }
        };
        try {
          console.log(`\u{1F4E4} Sending Feishu notification for new customer: ${customerNo}`);
          console.log(`   Webhook URL: ${FEISHU_WEBHOOK_URL?.substring(0, 50)}...`);
          const feishuResponse = await fetch(FEISHU_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notification)
          });
          const feishuResult = await feishuResponse.text();
          console.log(`\u{1F4E5} Feishu response status: ${feishuResponse.status}`);
          console.log(`\u{1F4E5} Feishu response body: ${feishuResult}`);
          if (feishuResponse.ok) {
            console.log(`\u2705 Feishu notification sent successfully: ${customerNo}`);
          } else {
            console.error(`\u274C Feishu notification failed with status ${feishuResponse.status}: ${feishuResult}`);
          }
        } catch (error) {
          console.error("\u274C Feishu notification error:", error);
        }
      }
      return res.json({
        response: "I'll connect you with a human agent. Please wait...",
        needsHuman: true,
        sessionId
      });
    }
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "AI not configured" });
    }
    const response = await fetch(`https://${OPENAI_API_HOST}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: WEBSITE_KNOWLEDGE },
          { role: "user", content: message }
        ],
        max_tokens: 500
      })
    });
    const data = await response.json();
    res.json({ response: data.choices?.[0]?.message?.content || "Sorry, error occurred." });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/inquiries", async (req, res) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ data: [] });
    }
    const { data, error } = await client.from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching inquiries:", error);
      return res.json({ data: [] });
    }
    res.json({ data: data || [] });
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});
app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, company, email, productCategory, portOfDestination, estimatedQuantity, message, captchaToken } = req.body;
    if (!name || !company || !email || !portOfDestination) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (captchaToken) {
      const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;
      if (HCAPTCHA_SECRET) {
        const captchaResponse = await fetch("https://api.hcaptcha.com/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${HCAPTCHA_SECRET}&response=${captchaToken}`
        });
        const captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
          return res.status(400).json({ error: "Captcha verification failed" });
        }
      }
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { data, error } = await client.from("inquiries").insert({
      name,
      company,
      email,
      product_category: productCategory || null,
      port_of_destination: portOfDestination,
      estimated_quantity: estimatedQuantity || null,
      message: message || null,
      status: "new"
    }).select().single();
    if (error) {
      console.error("Error creating inquiry:", error);
      return res.status(500).json({ error: "Failed to save inquiry" });
    }
    console.log(`\u2705 New inquiry created: ${name} from ${company}`);
    const inquiryWebhook = FEISHU_INQUIRY_WEBHOOK || FEISHU_WEBHOOK_URL;
    if (inquiryWebhook) {
      try {
        console.log(`\u{1F4E4} Sending inquiry notification to Feishu...`);
        const notification = {
          msg_type: "interactive",
          card: {
            header: {
              title: { tag: "plain_text", content: `\u{1F4E7} \u65B0\u5BA2\u6237\u8BE2\u4EF7` },
              template: "green"
            },
            elements: [
              {
                tag: "div",
                text: {
                  tag: "lark_md",
                  content: `**\u5BA2\u6237\u4FE1\u606F**
\u{1F464} \u59D3\u540D: ${name}
\u{1F3E2} \u516C\u53F8: ${company}
\u{1F4E7} \u90AE\u7BB1: ${email}
\u{1F4E6} \u4EA7\u54C1: ${productCategory || "\u672A\u6307\u5B9A"}
\u{1F6A2} \u76EE\u7684\u6E2F: ${portOfDestination}
\u{1F4CA} \u6570\u91CF: ${estimatedQuantity || "\u672A\u6307\u5B9A"}

\u{1F4AC} \u6D88\u606F: ${message || "\u65E0"}`
                }
              }
            ]
          }
        };
        const response = await fetch(inquiryWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification)
        });
        const result = await response.text();
        console.log(`\u{1F4E5} Feishu inquiry notification response: ${response.status} - ${result}`);
      } catch (feishuError) {
        console.error("\u274C Failed to send Feishu inquiry notification:", feishuError);
      }
    } else {
      console.log("\u26A0\uFE0F No inquiry webhook configured");
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});
app.patch("/api/inquiries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const updateData = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (status) updateData.status = status;
    if (notes !== void 0) updateData.notes = notes;
    const { error } = await client.from("inquiries").update(updateData).eq("id", id);
    if (error) {
      console.error("Error updating inquiry:", error);
      return res.status(500).json({ error: "Failed to update inquiry" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Update inquiry error:", error);
    res.status(500).json({ error: "Failed to update inquiry" });
  }
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    feishu: FEISHU_APP_ID ? "configured" : "not configured",
    appId: FEISHU_APP_ID
  });
});
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/feishu/")) {
    return res.status(404).json({ error: "Not found" });
  }
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Application not built. Please run build first.");
  }
});
httpServer.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`========================================`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket: /socket.io/`);
  console.log(`Feishu webhook: POST /feishu/webhook`);
  console.log(`========================================`);
  console.log(`\u2705 Server ready to accept connections`);
  if (FEISHU_APP_ID && FEISHU_APP_SECRET) {
    getFeishuAccessToken().then((token) => {
      if (token) {
        console.log("\u2705 Feishu bot connected successfully");
      }
    });
  }
});
