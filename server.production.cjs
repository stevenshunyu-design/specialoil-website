"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.6.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs2 = require("fs");
    var path2 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (debug || !quiet) {
        const keysCount = Object.keys(parsedAll).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/env-options.js"(exports2, module2) {
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module2.exports = options;
  }
});

// node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/cli-options.js"(exports2, module2) {
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

// server.ts
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_http = require("http");
var import_socket = require("socket.io");

// src/storage/database/supabase-client.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_child_process = require("child_process");
var envLoaded = false;
function loadEnv() {
  if (envLoaded || process.env.COZE_SUPABASE_URL && process.env.COZE_SUPABASE_ANON_KEY) {
    return;
  }
  try {
    try {
      require_main().config();
      if (process.env.COZE_SUPABASE_URL && process.env.COZE_SUPABASE_ANON_KEY) {
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
    const output = (0, import_child_process.execSync)(`python3 -c '${pythonCode.replace(/'/g, `'"'"'`)}'`, {
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
  const url = process.env.COZE_SUPABASE_URL;
  const anonKey = process.env.COZE_SUPABASE_ANON_KEY;
  if (!url) {
    throw new Error("COZE_SUPABASE_URL is not set");
  }
  if (!anonKey) {
    throw new Error("COZE_SUPABASE_ANON_KEY is not set");
  }
  return { url, anonKey };
}
function getSupabaseClient(token) {
  const { url, anonKey } = getSupabaseCredentials();
  if (token) {
    return (0, import_supabase_js.createClient)(url, anonKey, {
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
  return (0, import_supabase_js.createClient)(url, anonKey, {
    db: {
      timeout: 6e4
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// server.ts
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
var distPath = process.env.NODE_ENV === "production" ? import_path.default.join(__dirname, "dist") : import_path.default.join(process.cwd(), "dist");
console.log("========================================");
console.log("Starting server with security features...");
console.log("PORT:", process.env.PORT || 3001);
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "SET" : "NOT SET");
console.log("Static files path:", distPath);
console.log("dist directory exists:", import_fs.default.existsSync(distPath));
console.log("========================================");
var app = (0, import_express.default)();
var httpServer = (0, import_http.createServer)(app);
var PORT = process.env.PORT || 3001;
var io = new import_socket.Server(httpServer, {
  cors: {
    origin: ["http://localhost:5000", "http://localhost:3000", process.env.SITE_URL].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/socket.io/"
});
app.use((0, import_cors.default)());
app.use(import_express.default.json());
app.use(import_express.default.static(distPath, {
  index: false,
  // 禁止自动返回 index.html，让 SPA 路由处理
  maxAge: "1d"
  // 静态资源缓存
}));
var FEISHU_WEBHOOK_URL = process.env.FEISHU_CHAT_WEBHOOK || process.env.FEISHU_WEBHOOK_URL;
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
        status: "active"
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
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ messages: [] });
    }
    const { data: sessions } = await client.from("chat_sessions").select("id").eq("status", "active");
    const targetSession = sessions?.find((s) => s.id.startsWith(sessionId));
    if (!targetSession) {
      return res.json({ messages: [] });
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
    const { data: sessions, error } = await client.from("chat_sessions").select("*").in("status", ["waiting", "active"]).order("updated_at", { ascending: false });
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
app.post("/api/chat/human", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const sid = sessionId || `human_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (FEISHU_WEBHOOK_URL) {
      const shortId = sid.substring(0, 8);
      const card = {
        msg_type: "interactive",
        card: {
          header: { title: { tag: "plain_text", content: "\u{1F4AC} \u65B0\u5BA2\u6237\u6D88\u606F" }, template: "blue" },
          elements: [
            { tag: "div", text: { tag: "lark_md", content: `**\u4F1A\u8BDDID**
${shortId}` } },
            { tag: "div", text: { tag: "lark_md", content: `**\u6D88\u606F\u5185\u5BB9**
${message}` } },
            { tag: "div", text: { tag: "lark_md", content: `**\u65F6\u95F4**
${(/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}` } },
            { tag: "note", elements: [{ tag: "plain_text", content: `\u56DE\u590D\u683C\u5F0F: /reply ${shortId} \u60A8\u7684\u56DE\u590D\u5185\u5BB9` }] }
          ]
        }
      };
      try {
        await fetch(FEISHU_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(card)
        });
        console.log(`\u2705 Human chat message sent to Feishu: ${shortId}`);
      } catch (error) {
        console.error("Error sending to Feishu:", error);
      }
    }
    const client = getSupabaseClient();
    if (client) {
      const { data: existingSession } = await client.from("chat_sessions").select("*").eq("id", sid).single();
      if (!existingSession) {
        await client.from("chat_sessions").insert({
          id: sid,
          visitor_id: sid,
          status: "active"
        });
      }
      await client.from("chat_messages").insert({
        session_id: sid,
        sender_type: "visitor",
        message
      });
    }
    res.json({
      success: true,
      session: { id: sid, status: "active" },
      message: "Message sent to support team"
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
      if (FEISHU_WEBHOOK_URL) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const shortId = sessionId.substring(0, 8);
        const customerNo = customerInfo?.customerNo || `#${shortId}`;
        const customerName = customerInfo?.name || "Unknown";
        const customerEmail = customerInfo?.email || "Not provided";
        const customerPhone = customerInfo?.phone || "Not provided";
        const card = {
          msg_type: "interactive",
          card: {
            header: { title: { tag: "plain_text", content: `\u{1F514} New Customer Inquiry ${customerNo}` }, template: "blue" },
            elements: [
              { tag: "div", text: { tag: "lark_md", content: `**Customer Info**
\u{1F464} Name: ${customerName}
\u{1F4E7} Email: ${customerEmail}
\u{1F4F1} Phone: ${customerPhone}` } },
              { tag: "divider" },
              { tag: "note", elements: [{ tag: "plain_text", content: `Reply format: /reply ${shortId} Your reply message` }] }
            ]
          }
        };
        try {
          await fetch(FEISHU_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(card)
          });
          console.log(`\u2705 Feishu notification sent: ${customerNo}`);
        } catch (error) {
          console.error("Feishu notification error:", error);
        }
        return res.json({
          response: "I'll connect you with a human agent. Please wait...",
          needsHuman: true,
          sessionId
        });
      }
      return res.json({
        response: "I'll connect you with a human agent. Please wait...",
        needsHuman: true
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
app.get("/api/chat/sessions", async (req, res) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from("chat_sessions").select("*").order("updated_at", { ascending: false });
    if (error) return res.status(500).json({ error: "Failed to fetch" });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    const { data, error } = await client.from("chat_messages").select("*").eq("session_id", sessionId).order("created_at", { ascending: true });
    if (error) return res.status(500).json({ error: "Failed to fetch" });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
  const indexPath = import_path.default.join(distPath, "index.html");
  if (import_fs.default.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Application not built. Please run build first.");
  }
});
httpServer.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket: /socket.io/`);
  console.log(`Feishu webhook: POST /feishu/webhook`);
  console.log(`========================================`);
  if (FEISHU_APP_ID && FEISHU_APP_SECRET) {
    getFeishuAccessToken().then((token) => {
      if (token) {
        console.log("\u2705 Feishu bot connected successfully");
      }
    });
  }
});
