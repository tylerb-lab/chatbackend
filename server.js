const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let users = [];

io.on('connection', socket => {
  const name = socket.handshake.query.name;
  if (users.length >= 5) {
    socket.emit('message', 'Chat is full. Try again later.');
    socket.disconnect();
    return;
  }

  users.push({ id: socket.id, name });
  io.emit('message', `${name} joined the chat.`);

  socket.on('message', msg => {
    io.emit('message', `${name}: ${msg}`);
  });

  socket.on('disconnect', () => {
    users = users.filter(u => u.id !== socket.id);
    io.emit('message', `${name} left the chat.`);
  });
});

app.use(express.static(__dirname + '/public'));

server.listen(3000, () => console.log('Tinyy Chat running on port 3000'));
