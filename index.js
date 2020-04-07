const app = require('express');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(17003, '0.0.0.0');
io.set('origins', '*:*');

// variables
let connections = [];
let workers = {};
let bugs = {};


io.sockets.on('connection', function (socket) {
  console.log(`Success connection on bug`);

  socket.on('addUser', function (data) {
    let bugID = data.bugID;
    let user = data.email;

    if (workers[socket.id] === undefined) {
      workers[socket.id] = user;
    } else {
      workers[socket.id] = user;
    }

    bugs[bugID] = workers;

    io.sockets.emit('showAllUsers', bugs);
    connections.push(socket);
    console.log(connections);
    console.log('all workers', workers);
    console.log('all bugs', bugs)
  })

  socket.on('disconnect', function () {
    console.log(`disconnected socket ${socket.id}`);

    if (workers[socket.id] !== undefined) {
      socket.broadcast.emit('deleteUser', { id: socket.id, email: workers[socket.id] });

      delete workers[socket.id];
      console.log("workers after disconn", workers);
    }

    connections.splice(connections.indexOf(socket), 1);

  });
})
