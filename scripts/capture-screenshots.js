import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import puppeteer from 'puppeteer-core'; // Stripped for environment compatibility

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const outDir = path.join(rootDir, 'docs', 'screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function startServer(port = 4188) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      
      let filePath = path.join(distDir, reqPath);
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(port, () => {
      resolve(server);
    });
  });
}

async function capture() {
  console.log('Starting local static server on port 4188...');
  const server = await startServer(4188);
  const baseUrl = 'http://localhost:4188';

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  if (!fs.existsSync(chromePath)) {
    throw new Error(`Chrome not found at ${chromePath}`);
  }

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

  // 1. Landing Page: Hero & 3D Sensor Monitor
  console.log('Capturing 01-hero-radar.png...');
  await page.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: `
    html, body { scroll-behavior: auto !important; }
    #hud { position: absolute !important; }
  ` });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(outDir, '01-hero-radar.png'),
    clip: { x: 0, y: 0, width: 1400, height: 760 }
  });

  // 1b. Landing Page: System Architecture (4-Tier Pipeline)
  console.log('Capturing 01b-system-architecture.png...');
  const archEl = await page.$('#architecture');
  if (archEl) {
    await archEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await archEl.screenshot({
      path: path.join(outDir, '01b-system-architecture.png')
    });
  }

  // 2. Landing Page: Blueprint Feature Cards
  console.log('Capturing 02-feature-cards.png...');
  const featuresEl = await page.$('#features');
  if (featuresEl) {
    await featuresEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await featuresEl.screenshot({
      path: path.join(outDir, '02-feature-cards.png')
    });
  }

  // Navigate to Component Catalog
  console.log('Navigating to components.html...');
  await page.goto(`${baseUrl}/components.html`, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: `
    html, body { scroll-behavior: auto !important; }
    #hud { position: absolute !important; }
  ` });
  await new Promise(r => setTimeout(r, 1500));

  // 3. Components Catalog: Buttons, Inputs, Badges
  console.log('Capturing 03-components-catalog.png...');
  await page.evaluate(() => {
    const el = document.getElementById('buttons');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outDir, '03-components-catalog.png'),
    clip: { x: 180, y: 20, width: 1040, height: 780 }
  });

  // 4. Oscilloscope & Spectrogram (with live tone generator)
  console.log('Capturing 04-oscilloscope.png...');
  await page.evaluate(() => {
    const el = document.getElementById('oscilloscope');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  // Turn on carrier tone
  await page.evaluate(() => {
    document.getElementById('sigCarrierBtn')?.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const oscSection = await page.$('#oscilloscope');
  if (oscSection) {
    await oscSection.screenshot({
      path: path.join(outDir, '04-oscilloscope.png')
    });
  }
  // Turn off carrier tone
  await page.evaluate(() => {
    document.getElementById('sigCarrierBtn')?.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // 5. High-Density Telemetry Table
  console.log('Capturing 05-telemetry-table.png...');
  const tableSection = await page.$('#telemetry');
  if (tableSection) {
    await tableSection.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await tableSection.screenshot({
      path: path.join(outDir, '05-telemetry-table.png')
    });
  }

  // 6. Multi-Framework Exporter Modal (shadcn/ui style)
  console.log('Capturing 06-code-exporter.png...');
  await page.evaluate(() => {
    window.componentExporter?.open('button');
  });
  await new Promise(r => setTimeout(r, 700));
  const exporterModal = await page.$('#componentExportModal > div');
  if (exporterModal) {
    await exporterModal.screenshot({
      path: path.join(outDir, '06-code-exporter.png')
    });
  }
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 7. Node Flow Graph & Circuit Pipeline
  console.log('Capturing 07-pipeline-graph.png...');
  const pipelineSection = await page.$('#pipeline');
  if (pipelineSection) {
    await pipelineSection.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await pipelineSection.screenshot({
      path: path.join(outDir, '07-pipeline-graph.png')
    });
  }

  // 8. Global Command Palette (⌘K)
  console.log('Capturing 08-command-palette.png...');
  const paletteTrigger = await page.$('[data-open-palette]');
  if (paletteTrigger) {
    await paletteTrigger.click();
    await new Promise(r => setTimeout(r, 600));
    const paletteBox = await page.$('#commandPaletteOverlay > div');
    if (paletteBox) {
      await paletteBox.screenshot({
        path: path.join(outDir, '08-command-palette.png')
      });
    }
  }

  console.log('Successfully captured all 8 high-resolution screenshots!');
  await browser.close();
  server.close();
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
