const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let users = [];

io.on('connection', socket => {
  const name = socket.handshake.query.name;

  // Add user to list
  users.push({ id: socket.id, name });

  // Announce join
  io.emit('message', {
    sender: 'System',
    content: `${name} has joined the chat`
  });

  // Handle incoming messages
  socket.on('message', msg => {
    io.emit('message', {
      sender: name,
      content: msg
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    users = users.filter(u => u.id !== socket.id);
    io.emit('message', {
      sender: 'System',
      content: `${name} has left the chat`
    });
  });
});

app.get('/', (req, res) => {
  res.send('Tinyy Chat Backend is running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
  res.send('Tinyy Chat Backend is running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
