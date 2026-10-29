import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const SCREENSHOT_DIR = path.resolve('qa-screenshots');
const TARGET_URL = 'http://localhost:3001/';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

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

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.consoleLogs = [];
    this.errors = [];

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method) {
        if (msg.method === 'Runtime.consoleAPICalled') {
          this.consoleLogs.push(msg.params);
        } else if (msg.method === 'Runtime.exceptionThrown') {
          this.errors.push(msg.params);
        }
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

  send(method, params = {}, timeoutMs = 15000) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id);
          reject(new Error(`CDP command ${method} timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);

      this.callbacks.set(id, {
        resolve: (val) => {
          clearTimeout(timer);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    try {
      this.ws.close();
    } catch (e) {}
  }
}

async function captureScreenshot(cdp, filename) {
  const res = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  const filePath = path.join(SCREENSHOT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  console.log(`Saved screenshot: ${filePath}`);
}

async function run() {
  console.log('--- LAUNCHING CHROME HEADLESS FOR NITHISH.AI V3 VERIFICATION ---');
  const tempProfile = path.resolve('.chrome-v3-profile');
  if (!fs.existsSync(tempProfile)) {
    fs.mkdirSync(tempProfile, { recursive: true });
  }

  const chromeProc = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${PORT}`,
      '--headless=new',
      '--disable-gpu-shader-disk-cache',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      `--user-data-dir=${tempProfile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1920,1080',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let cdp = null;

  try {
    let connected = false;
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      try {
        const version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
        if (version && version.webSocketDebuggerUrl) {
          connected = true;
          break;
        }
      } catch (e) {}
    }

    if (!connected) {
      throw new Error('Could not connect to Chrome debugging port 9222');
    }

    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    console.log('Connecting to page target:', pageTarget.title || pageTarget.url);

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.waitOpen();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log(`Navigating to ${TARGET_URL}...`);
    await cdp.send('Page.navigate', { url: TARGET_URL });
    await sleep(4000); // Wait for Three.js canvas & GLB load

    // Check for any runtime exceptions
    console.log(`Recorded console logs: ${cdp.consoleLogs.length}`);
    if (cdp.errors.length > 0) {
      console.warn('Recorded runtime exceptions:', JSON.stringify(cdp.errors, null, 2));
    } else {
      console.log('Zero runtime exceptions recorded!');
    }

    // 1. Scene 1: Welcome / Introduction
    console.log('Capturing Scene 1 (Welcome)...');
    await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await sleep(800);
    await captureScreenshot(cdp, 'v3_01_scene1_welcome.png');

    // 2. Scene 2: Walking & About Me (t = 0.35)
    console.log('Scrubbing to Scene 2 (Walking & About Me)...');
    await cdp.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * 0.35, behavior: "instant" });',
    });
    await sleep(1000);
    await captureScreenshot(cdp, 'v3_02_scene2_walking_about.png');

    // 3. Scene 3: Workstation Transition & Seating (t = 0.55)
    console.log('Scrubbing to Scene 3 (Workstation Seating)...');
    await cdp.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * 0.55, behavior: "instant" });',
    });
    await sleep(1000);
    await captureScreenshot(cdp, 'v3_03_scene3_workstation_sit.png');

    // 4. Scene 4: Flagship Projects (Robin PA) (t = 0.74)
    console.log('Scrubbing to Scene 4 (Robin Flagship)...');
    await cdp.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * 0.74, behavior: "instant" });',
    });
    await sleep(1000);
    await captureScreenshot(cdp, 'v3_04_scene4_robin_projects.png');

    // 5. Scene 5: Technical Toolkit, Journey & Contact (t = 0.95)
    console.log('Scrubbing to Scene 5 (Toolkit, Journey & Contact)...');
    await cdp.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * 0.95, behavior: "instant" });',
    });
    await sleep(1000);
    await captureScreenshot(cdp, 'v3_05_scene5_toolkit_journey.png');

    // 6. Reverse Scrub: Back to Scene 1
    console.log('Testing Reverse Scrubbing back to Scene 1...');
    await cdp.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 0, behavior: "instant" });',
    });
    await sleep(800);
    await captureScreenshot(cdp, 'v3_06_reverse_scrub_return.png');

    // 7. Test Mobile Viewport (393 x 851, DPR 3.0)
    console.log('Testing Mobile Portrait Viewport (393 x 851)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 393,
      height: 851,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await sleep(800);
    await captureScreenshot(cdp, 'v3_07_mobile_scene1.png');

    await cdp.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * 0.74, behavior: "instant" });',
    });
    await sleep(800);
    await captureScreenshot(cdp, 'v3_08_mobile_scene4_robin.png');

    // Measure Performance & DOM Memory Metrics
    const perfEval = await cdp.send('Runtime.evaluate', {
      expression: `JSON.stringify({
        timing: performance.getEntriesByType('navigation')[0],
        memory: window.performance.memory ? {
          usedJSHeapSize: (window.performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB',
          totalJSHeapSize: (window.performance.memory.totalJSHeapSize / 1048576).toFixed(1) + ' MB',
        } : null,
      })`,
    });
    console.log('Browser Performance Metrics:');
    console.log(perfEval.result.value);

    console.log('--- ALL AUTOMATED VERIFICATION CAPTURES COMPLETED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    if (cdp) cdp.close();
    if (chromeProc.pid) {
      try {
        spawn('taskkill', ['/PID', chromeProc.pid.toString(), '/F', '/T'], { stdio: 'ignore' });
      } catch (e) {}
    }
  }
}

run();
