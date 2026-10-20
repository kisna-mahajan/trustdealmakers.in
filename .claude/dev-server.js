// Local preview server. Serves the project root, or the built site when given a folder
// (`node .claude/dev-server.js _site`, after `node tools/build-site.mjs`).
// Folders serve their index.html; any other path gets 404.html, as on GitHub Pages,
// with its redirect pointed at "/" instead of the live domain so it stays on localhost.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', process.argv[2] || '.');
const port = Number(process.env.PORT) || 8765;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain'
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(root, urlPath);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const idx = path.join(file, 'index.html');
    if (fs.existsSync(idx)) {
      file = idx;
    } else {
      const html = fs.readFileSync(path.join(root, '404.html'), 'utf8')
        .replace('https://trustdealmakers.in/', '/');
      res.writeHead(404, { 'Content-Type': types['.html'], 'Cache-Control': 'no-store' });
      return res.end(html);
    }
  }
  res.writeHead(200, {
    'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log('Serving ' + root + ' on http://localhost:' + port));
