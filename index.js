const express = require('express');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(17003, '0.0.0.0');
io.set('origins', '*:*');

// variables
let connections = [];
let workers = [];


io.sockets.on('connection', function (socket) {
  console.log(`Success connection on bug`);
  connections.push(socket);

  socket.on('addUser', function (data) {
    workers.push(data);
    console.log('New worker on bug', data);
    io.sockets.emit('showUser', data);
  })

  socket.on('disconnect', function (socket) {
    console.log(`Disconnect on bug`);
    connections.splice(connections.indexOf(socket), 1);
  });
})
