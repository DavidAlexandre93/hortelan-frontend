import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 4173);

const mimeByExt = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.html': 'text/html',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const sendFile = async (res, filePath) => {
  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeByExt[ext] || 'application/octet-stream' });
    res.end(file);
    return true;
  } catch {
    return false;
  }
};

async function bootstrap() {
  let vite;
  if (!isProd) {
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    });
  }

  const server = createHttpServer(async (req, res) => {
    const url = req.url || '/';

    if (isProd && (url.startsWith('/assets/') || url.startsWith('/favicon/') || url.startsWith('/fonts/'))) {
      const staticPath = path.resolve(root, 'build', `.${url}`);
      if (await sendFile(res, staticPath)) {
        return;
      }
    }

    if (!isProd && vite) {
      let handledByVite = false;
      await new Promise((resolve) => {
        vite.middlewares(req, res, () => {
          resolve();
        });

        const originalEnd = res.end;
        res.end = function wrappedEnd(...args) {
          handledByVite = true;
          return originalEnd.apply(this, args);
        };
      });

      if (handledByVite) {
        return;
      }
    }

    try {
      let template;
      let ssrModule;

      if (!isProd) {
        template = await fs.readFile(path.resolve(root, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        ssrModule = await vite.ssrLoadModule('/src/entry-server.js');
      } else {
        template = await fs.readFile(path.resolve(root, 'build/index.html'), 'utf-8');
        ssrModule = await import(path.resolve(root, 'build-ssr/entry-server.js'));
      }

      const useSsr = ssrModule.shouldUseSsr(url);
      const ssrResult = useSsr ? ssrModule.render(url) : { appHtml: '', headTags: '' };
      const html = template
        .replace('<div id="root"></div>', `<div id="root">${ssrResult.appHtml}</div>`)
        .replace('</head>', `${ssrResult.headTags}</head>`);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(error);
      }
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(error.stack);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`SSR server running on http://localhost:${port}`);
  });
}

bootstrap();
