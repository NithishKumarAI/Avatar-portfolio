import { spawn, execSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const RECORDING_DIR = path.resolve('qa-recordings');
const SCREENS_DIR = path.join(RECORDING_DIR, 'raw_screencast_v3');
const TARGET_URL = 'http://localhost:3001/';

if (!fs.existsSync(RECORDING_DIR)) fs.mkdirSync(RECORDING_DIR, { recursive: true });
if (!fs.existsSync(SCREENS_DIR)) fs.mkdirSync(SCREENS_DIR, { recursive: true });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class FastFrameRecorder {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  waitOpen() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async captureFrame(frameIdx) {
    const res = await this.send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 85,
    });
    const filename = `frame_${String(frameIdx).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(SCREENS_DIR, filename), Buffer.from(res.data, 'base64'));
  }

  close() {
    try {
      this.ws.close();
    } catch (e) {}
  }
}

async function run() {
  console.log('--- STARTING V3 HIGH-FIDELITY SCREEN RECORDING ---');

  // Clean old frame files
  for (const f of fs.readdirSync(SCREENS_DIR)) {
    fs.unlinkSync(path.join(SCREENS_DIR, f));
  }

  const userDataDir = path.resolve('.chrome-v3-rec-profile');
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  let client;

  try {
    for (let i = 0; i < 30; i++) {
      try {
        await getJson(`http://127.0.0.1:${PORT}/json/version`);
        break;
      } catch {
        await sleep(200);
      }
    }

    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    client = new FastFrameRecorder(pageTarget.webSocketDebuggerUrl);
    await client.waitOpen();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log(`Navigating to ${TARGET_URL}...`);
    await client.send('Page.navigate', { url: TARGET_URL });
    await sleep(3500); // Allow WebGL assets to load

    let frameCount = 0;

    // 1. Scene 1 Welcome Hold (15 frames)
    console.log('Recording Scene 1: Welcome & Wave Greeting...');
    await client.eval('window.scrollTo(0, 0)');
    for (let i = 0; i < 15; i++) {
      await client.captureFrame(frameCount++);
      await sleep(60);
    }

    // 2. Forward Scroll: Scene 1 -> Scene 2 -> Scene 3 -> Scene 4 -> Scene 5 (60 frames)
    console.log('Recording Forward Scroll through all 5 scenes...');
    for (let p = 0.02; p <= 1.0; p += 0.02) {
      await client.eval(`window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * ${p})`);
      await sleep(40);
      await client.captureFrame(frameCount++);
    }

    // Scene 5 Hold (10 frames)
    for (let i = 0; i < 10; i++) {
      await client.captureFrame(frameCount++);
      await sleep(60);
    }

    // 3. Reverse Scroll: Scene 5 back to Scene 1 (40 frames)
    console.log('Recording Reverse Scroll back to Scene 1...');
    for (let p = 0.96; p >= 0.0; p -= 0.03) {
      await client.eval(`window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * ${p})`);
      await sleep(40);
      await client.captureFrame(frameCount++);
    }

    // Scene 1 End Hold (10 frames)
    for (let i = 0; i < 10; i++) {
      await client.captureFrame(frameCount++);
      await sleep(60);
    }

    console.log(`Captured total ${frameCount} high-resolution video frames.`);

    // Encode to MP4 with FFmpeg
    const outputVideo = path.join(RECORDING_DIR, 'nithish_ai_v3_scroll.mp4');
    console.log(`Compiling MP4 video via FFmpeg: ${outputVideo}...`);
    const ffmpegCmd = `ffmpeg -y -framerate 18 -i "${path.join(SCREENS_DIR, 'frame_%05d.jpg')}" -c:v libx264 -pix_fmt yuv420p -crf 20 "${outputVideo}"`;
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log(`Video encoding complete: ${outputVideo}`);

    // Copy to artifact directory
    const artifactVideo = path.resolve('C:\\Users\\nithi\\.gemini\\antigravity\\brain\\c46e464f-61d0-46fc-8148-e50d1193f177\\nithish_ai_v3_scroll.mp4');
    fs.copyFileSync(outputVideo, artifactVideo);
    console.log(`Copied artifact video to: ${artifactVideo}`);

  } catch (err) {
    console.error('Recording error:', err);
  } finally {
    if (client) client.close();
    try {
      spawn('taskkill', ['/PID', chromeProc.pid.toString(), '/F', '/T'], { stdio: 'ignore' });
    } catch (e) {}
  }
}

run();
