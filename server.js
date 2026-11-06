import http from 'http';
import fs from 'fs';
import path from 'path';
import { WebSocketServer } from 'ws';

// 1. Serve the frontend index.html file
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.resolve('index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// 2. Attach WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('A user connected.');

  // Listen for incoming messages from a client
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // 1 means OPEN
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('A user disconnected.');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});