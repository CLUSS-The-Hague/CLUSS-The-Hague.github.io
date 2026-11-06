// A tiny local preview server for dist/. Not used in production.
// Reads each file fresh, so it keeps working while the site is being rebuilt.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.env.SITE_DIR || 'dist');
const port = Number(process.env.PORT || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };

async function read(file) {
  const stat = await fs.stat(file);
  const target = stat.isDirectory() ? path.join(file, 'index.html') : file;
  return { target, body: await fs.readFile(target) };
}

const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root, url);
  if (!file.startsWith(root)) { res.statusCode = 403; return res.end(); }
  try {
    const { target, body } = await read(file);
    res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', types['.html']);
    res.end(await fs.readFile(path.join(root, '404.html')).catch(() => 'Not found'));
  }
});

server.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') throw err;
  console.log(`Port ${port} is already in use, so the site is probably running: http://localhost:${port}`);
  console.log('If that shows something else, choose another port: PORT=4322 npm run dev');
});

server.listen(port, () => console.log(`CLÜSS on http://localhost:${port}`));
