import { chromium } from 'playwright-core';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const screenshotsDir = path.resolve(projectRoot, 'qa-screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const VIEWPORTS = [
  { name: 'mobile', label: 'Mobile (iPhone SE/13)', width: 375, height: 812 },
  { name: 'tablet', label: 'Tablet (iPad Portrait)', width: 768, height: 1024 },
  { name: 'laptop', label: 'Standard Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'desktop', label: 'Large Desktop (1920x1080)', width: 1920, height: 1080 },
];

const ROUTES = [
  { path: '/', name: 'landing' },
  { path: '/discover', name: 'discover' },
  { path: '/shortlists', name: 'shortlists' },
  { path: '/shortlists/sample-cohort', name: 'shortlist-detail' },
  { path: '/outreach', name: 'outreach' },
  { path: '/campaigns', name: 'campaigns' },
  { path: '/campaigns/sample-cohort', name: 'campaign-detail' },
  { path: '/pitch/sample-demo', name: 'pitch-demo' },
  { path: '/pricing', name: 'pricing' },
  { path: '/contact', name: 'contact' },
  { path: '/login', name: 'login' },
  { path: '/register', name: 'register' },
  { path: '/profile', name: 'profile' },
  { path: '/admin', name: 'admin' },
];

function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await checkServerReady()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function startServer() {
  const alreadyUp = await checkServerReady();
  if (alreadyUp) {
    console.log(`[QA] Next.js server already responding on ${BASE_URL}`);
    return null;
  }

  console.log(`[QA] Spawning Next.js server on port ${PORT}...`);
  const frontendDir = path.resolve(__dirname, '..');
  const serverProc = spawn('cmd.exe', ['/c', 'npm.cmd', 'run', 'start', '--', '-p', String(PORT)], {
    cwd: frontendDir,
    stdio: 'pipe',
    shell: false,
  });

  serverProc.stdout.on('data', (d) => process.stdout.write(`[Next] ${d}`));
  serverProc.stderr.on('data', (d) => process.stderr.write(`[Next ERR] ${d}`));

  const isReady = await waitForServer(60000);
  if (!isReady) {
    serverProc.kill();
    throw new Error(`Failed to start Next.js server within timeout`);
  }
  console.log(`[QA] Next.js server is online on ${BASE_URL}!`);
  return serverProc;
}

async function runVisualQA() {
  let serverProcess = null;
  let browser = null;
  const results = [];
  const popoverResults = [];

  try {
    serverProcess = await startServer();

    console.log(`[QA] Launching Chrome from: ${CHROME_PATH}`);
    browser = await chromium.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    for (const vp of VIEWPORTS) {
      console.log(`\n======================================================`);
      console.log(`[QA] Running Viewport: ${vp.label} (${vp.width}x${vp.height})`);
      console.log(`======================================================`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });

      // Inject demo auth session
      await context.addInitScript(() => {
        window.localStorage.setItem('creatorbase_token', 'mock_jwt_token_for_qa');
        window.localStorage.setItem(
          'creatorbase_user',
          JSON.stringify({
            id: 'usr_mock_qa',
            name: 'Devin Sharma',
            email: 'devin@elevationmedia.in',
            role: 'AGENCY_ADMIN',
            plan: 'AGENCY_PRO',
            companyName: 'Elevation Media Labs',
            subscriptionStatus: 'ACTIVE',
          })
        );
      });

      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(600); // Allow framer-motion and animations to stabilize

          // Measure overflow
          const layoutMetrics = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
            const innerWidth = window.innerWidth;
            const delta = scrollWidth - innerWidth;
            return {
              scrollWidth,
              innerWidth,
              delta: delta > 0 ? delta : 0,
            };
          });

          // Scan unclipped overflowing elements
          const unclippedOverflows = await page.evaluate(() => {
            const winW = window.innerWidth;
            const violations = [];
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'DEFS', 'HEAD', 'META'].includes(el.tagName)) continue;
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && rect.right > winW + 1.5) {
                let clipped = false;
                let p = el.parentElement;
                while (p && p !== document.body && p !== document.documentElement) {
                  const pStyle = window.getComputedStyle(p);
                  if (
                    pStyle.overflowX === 'hidden' ||
                    pStyle.overflowX === 'clip' ||
                    pStyle.overflow === 'hidden' ||
                    pStyle.overflow === 'clip'
                  ) {
                    const pRect = p.getBoundingClientRect();
                    if (pRect.right <= winW + 1.5) {
                      clipped = true;
                      break;
                    }
                  }
                  p = p.parentElement;
                }
                if (!clipped) {
                  violations.push({
                    tag: el.tagName.toLowerCase(),
                    className: (el.className || '').toString().slice(0, 40),
                    right: Math.round(rect.right),
                    excess: Math.round(rect.right - winW),
                  });
                }
              }
            }
            return violations.slice(0, 3);
          });

          // Take screenshot
          const screenshotFileName = `${vp.name}-${route.name}.png`;
          const screenshotPath = path.join(screenshotsDir, screenshotFileName);
          await page.screenshot({ path: screenshotPath, fullPage: false });

          const isPassed = layoutMetrics.delta === 0 && unclippedOverflows.length === 0;

          results.push({
            viewport: vp.label,
            viewportWidth: vp.width,
            route: route.path,
            routeName: route.name,
            scrollWidth: layoutMetrics.scrollWidth,
            innerWidth: layoutMetrics.innerWidth,
            delta: layoutMetrics.delta,
            violations: unclippedOverflows,
            screenshot: screenshotFileName,
            passed: isPassed,
          });

          const statusBadge = isPassed ? '✓ PASS' : '✗ FAIL';
          console.log(
            `  ${statusBadge} [${vp.name}] ${route.path.padEnd(26)} | scrollWidth: ${layoutMetrics.scrollWidth}px | innerWidth: ${layoutMetrics.innerWidth}px | delta: ${layoutMetrics.delta}px`
          );
          if (unclippedOverflows.length > 0) {
            console.log(`    ↳ Violations:`, JSON.stringify(unclippedOverflows));
          }

          // Special test on /discover: test all 5 filter pills opening and popovers visible
          if (route.path === '/discover') {
            console.log(`    [QA /discover] Testing filter pills and popovers on ${vp.label}...`);
            const filterPillSpecs = [
              { name: 'Platform', textMatch: 'Platform' },
              { name: '50+ Cities', textMatch: '50+ Cities' },
              { name: 'All Niches', textMatch: 'All Niches' },
              { name: 'Metrics', textMatch: 'Metrics' },
              { name: 'Budget', textMatch: 'Budget' },
            ];

            for (const pill of filterPillSpecs) {
              try {
                // Find button with matching text
                const buttonSelector = `button:has-text("${pill.textMatch}")`;
                const btn = page.locator(buttonSelector).first();
                const btnVisible = await btn.isVisible({ timeout: 2000 }).catch(() => false);

                if (!btnVisible) {
                  popoverResults.push({
                    viewport: vp.label,
                    pill: pill.name,
                    opened: false,
                    visibleInsideViewport: false,
                    details: 'Pill button not visible',
                  });
                  continue;
                }

                await btn.click({ force: true });
                await page.waitForTimeout(300);

                // Detect popover container (portal desktop or mobile sheet)
                const popoverMetrics = await page.evaluate(() => {
                  const winW = window.innerWidth;
                  const winH = window.innerHeight;
                  // Look for elements with high z-index and border/bg-zinc or motion.div
                  const candidates = Array.from(document.querySelectorAll('div[class*="z-50"], div[class*="z-[100]"], div[class*="backdrop-blur-2xl"], div[class*="bottom-3"]'));
                  for (const c of candidates) {
                    const r = c.getBoundingClientRect();
                    if (r.width > 120 && r.height > 80) {
                      return {
                        found: true,
                        width: Math.round(r.width),
                        height: Math.round(r.height),
                        top: Math.round(r.top),
                        left: Math.round(r.left),
                        right: Math.round(r.right),
                        bottom: Math.round(r.bottom),
                        insideX: r.left >= -5 && r.right <= winW + 5,
                        insideY: r.top >= -5 && r.bottom <= winH + 5,
                      };
                    }
                  }
                  return { found: false };
                });

                const popoverPassed = popoverMetrics.found && popoverMetrics.insideX;
                popoverResults.push({
                  viewport: vp.label,
                  pill: pill.name,
                  opened: popoverMetrics.found,
                  visibleInsideViewport: popoverPassed,
                  details: popoverMetrics.found
                    ? `${popoverMetrics.width}x${popoverMetrics.height} at (${popoverMetrics.left},${popoverMetrics.top})`
                    : 'Popover container not detected',
                });

                console.log(
                  `      ${popoverPassed ? '✓' : '✗'} Popover [${pill.name}]: opened=${popoverMetrics.found}, insideViewport=${popoverPassed} (${popoverMetrics.details || ''})`
                );

                // Close popover
                await page.keyboard.press('Escape');
                await page.waitForTimeout(200);
              } catch (err) {
                popoverResults.push({
                  viewport: vp.label,
                  pill: pill.name,
                  opened: false,
                  visibleInsideViewport: false,
                  details: err.message,
                });
              }
            }
          }
        } catch (err) {
          console.error(`  ✗ ERROR [${vp.name}] ${route.path}:`, err.message);
          results.push({
            viewport: vp.label,
            viewportWidth: vp.width,
            route: route.path,
            routeName: route.name,
            scrollWidth: -1,
            innerWidth: vp.width,
            delta: -1,
            violations: [{ tag: 'error', className: err.message.slice(0, 50), right: 0, excess: 0 }],
            screenshot: null,
            passed: false,
          });
        }
      }

      await context.close();
    }

    // Write JSON summary
    const summaryData = {
      timestamp: new Date().toISOString(),
      totalPagesTested: ROUTES.length,
      totalViewports: VIEWPORTS.length,
      totalRuns: results.length,
      passedRuns: results.filter((r) => r.passed).length,
      failedRuns: results.filter((r) => !r.passed).length,
      results,
      popoverResults,
    };

    fs.writeFileSync(
      path.join(projectRoot, 'qa-summary.json'),
      JSON.stringify(summaryData, null, 2),
      'utf-8'
    );
    console.log(`\n[QA] Summary report written to qa-summary.json`);
    console.log(`[QA] Total Runs: ${summaryData.totalRuns} | Passed: ${summaryData.passedRuns} | Failed: ${summaryData.failedRuns}`);

  } finally {
    if (browser) {
      await browser.close();
    }
    if (serverProcess) {
      console.log(`[QA] Shutting down Next.js server child process...`);
      try {
        serverProcess.kill('SIGTERM');
      } catch (_e) {
        // ignore
      }
    }
  }
}

runVisualQA().catch((e) => {
  console.error('[QA FATAL ERROR]', e);
  process.exit(1);
});
