const app = require('express');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(17003, '0.0.0.0');
io.set('origins', '*:*');

// variables
let connections = [];
let workers = {};


io.sockets.on('connection', function (socket) {
  console.log(`Success connection on bug`);
  connections.push(socket);

  socket.on('addUser', function (data) {
    let bugID = data.bugID;
    let user = data.email;

    if (workers[bugID] === undefined) {
      workers[bugID] =  [];
      workers[bugID].push(user);
    } else if (workers[bugID].includes(user) !== true) {
      workers[bugID].push(user);
    }
    io.sockets.emit('showUser', workers);

    console.log('all workers', workers);
  })

  socket.on('disconnect', function (socket) {
    console.log(`Disconnect on bug`);
    connections.splice(connections.indexOf(socket), 1);
  });
})
