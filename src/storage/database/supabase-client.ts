import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

let envLoaded = false;

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function loadEnv(): void {
  // 首先尝试从 dotenv 加载 .env 文件
  try {
    require('dotenv').config();
  } catch {
    // dotenv not available
  }

  // 检查是否已经有环境变量（优先使用 SUPABASE_URL，然后 COZE_SUPABASE_URL）
  const hasUrl = process.env.SUPABASE_URL || process.env.COZE_SUPABASE_URL;
  const hasKey = process.env.SUPABASE_ANON_KEY || process.env.COZE_SUPABASE_ANON_KEY;
  
  if (envLoaded || (hasUrl && hasKey)) {
    envLoaded = true;
    return;
  }

  try {
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

    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const lines = output.trim().split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex);
        let value = line.substring(eqIndex + 1);
        if ((value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }

    envLoaded = true;
  } catch {
    // Silently fail
  }
}

function getSupabaseCredentials(): SupabaseCredentials {
  loadEnv();

  // 优先使用 .env 文件中的 SUPABASE_*，然后才使用 COZE_SUPABASE_*
  const url = process.env.SUPABASE_URL || process.env.COZE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.COZE_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('SUPABASE_URL is not set');
  }
  if (!anonKey) {
    throw new Error('SUPABASE_ANON_KEY is not set');
  }

  return { url, anonKey };
}

function getSupabaseClient(token?: string): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  if (token) {
    return createClient(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      db: {
        timeout: 60000,
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createClient(url, anonKey, {
    db: {
      timeout: 60000,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { loadEnv, getSupabaseCredentials, getSupabaseClient };
