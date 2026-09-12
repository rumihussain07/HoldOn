const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const clients = new Set();
const port = Number(process.env.PORT || 5173);
const reload = `<script>new EventSource('/__dev/events').onmessage=()=>location.reload()</script>`;
const server = http.createServer((req, res) => {
  let route;
  try { route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end(); }
  if (route === '/__dev/events') {
    res.writeHead(200, {'Content-Type':'text/event-stream','Cache-Control':'no-cache'});
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  const file = path.resolve(root, '.' + (route === '/' ? '/index.html' : route));
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p => p.startsWith('.'))) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(file);
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'})[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control','no-store');
    res.end(ext === '.html' ? data.toString().replace('</body>', reload + '</body>') : data);
  });
});
let debounce;
const watcher = fs.watch(root, {recursive:true}, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => { for (const client of clients) client.write('data: reload\n\n'); }, 150);
});
server.on('error', err => { console.error(err.message); watcher.close(); process.exitCode = 1; });
server.listen(port,'127.0.0.1',()=>console.log(`Wait Simulator: http://127.0.0.1:${port}\nLive reload enabled. Press Ctrl+C to stop.`));
process.on('SIGINT', () => { watcher.close(); clearTimeout(debounce); for(const client of clients) client.end(); server.close(() => process.exit(0)); });
