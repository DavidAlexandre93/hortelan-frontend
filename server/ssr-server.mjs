import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import { SECURITY_HEADERS } from './security-headers.mjs';
import { composeHtml } from './html-template.mjs';

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
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': mimeByExt[ext] || 'application/octet-stream' });
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
    const pathname = new URL(url, 'http://localhost').pathname;

    if (
      isProd &&
      (pathname.startsWith('/assets/') ||
        pathname.startsWith('/favicon/') ||
        pathname.startsWith('/fonts/') ||
        pathname.startsWith('/static/'))
    ) {
      const staticPath = path.resolve(root, 'build', `.${pathname}`);
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
        ssrModule = await import(pathToFileURL(path.resolve(root, 'build-ssr/entry-server.mjs')).href);
      }

      const useSsr = ssrModule.shouldUseSsr(url);
      const ssrResult = useSsr ? ssrModule.render(url) : { appHtml: '', headTags: '' };
      const html = composeHtml({
        template,
        appHtml: ssrResult.appHtml,
        headTags: ssrResult.headTags,
        useSsr,
      });

      res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (error) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(error);
      }
      // Keep diagnostics server-side while returning a sanitized production response.
      console.error('SSR request failed', error);
      res.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(isProd ? 'Falha temporaria ao renderizar a pagina.' : error.stack);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`SSR server running on http://localhost:${port}`);
  });
}

bootstrap();
