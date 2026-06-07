import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import net from 'net'

// Copy the custom AI chat icon to public folder
try {
  const srcImg = "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ef0b971e-f05a-45b3-a7f9-63484a8125e9\\media__1780669884364.png"
  const destImg = "e:\\gen 2026\\omega\\public\\omega-ai-chat-icon.png"
  if (fs.existsSync(srcImg)) {
    fs.copyFileSync(srcImg, destImg)
    console.log("=== SUCCESS: COPIED OMEGA CHAT ICON ===")
  } else {
    console.log("=== WARNING: OMEGA CHAT ICON NOT FOUND AT SRC ===", srcImg)
  }
} catch (err) {
  console.error("=== ERROR COPYING OMEGA CHAT ICON ===", err)
}

// Start python AI server if not already running on port 8000
const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(err.code === 'EADDRINUSE');
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port, '127.0.0.1');
  });
};

const startAiServer = async () => {
  try {
    if (process.platform === 'win32') {
      try {
        const { execSync } = await import('child_process');
        const netstatOut = execSync('netstat -ano | findstr :8000').toString();
        const lines = netstatOut.split('\n');
        for (const line of lines) {
          if (line.includes('LISTENING') || line.includes('127.0.0.1:8000') || line.includes('0.0.0.0:8000')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0' && !isNaN(Number(pid))) {
              console.log(`=== Killing process ${pid} on port 8000... ===`);
              execSync(`taskkill /F /PID ${pid}`);
            }
          }
        }
      } catch (e) {
        // ignore errors if netstat doesn't find anything
      }
    }

    const inUse = await checkPort(8000);
    if (inUse) {
      console.log("=== AI Server is already running on port 8000 ===");
      return;
    }
    console.log("=== Starting AI Server (ai_server.py)... ===");
    const pyProcess = spawn('python', ['ai_server.py'], {
      cwd: 'e:\\gen 2026\\omega',
      detached: true,
      stdio: 'ignore'
    });
    pyProcess.unref();
  } catch (err) {
    console.error("=== ERROR STARTING AI SERVER ===", err);
  }
};
startAiServer();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    allowedHosts: 'all',
    proxy: {
      '/api/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        timeout: 1000,
        proxyTimeout: 1000,
      },
      '/api/db': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        timeout: 1000,
        proxyTimeout: 1000,
      }
    },
    watch: {
      ignored: [
        '**/db.json',
        'db.json',
        '**\\db.json',
        '**/*.gguf',
        '**/omega 2tb/**',
        '**/node_modules/**'
      ]
    }
  }
})