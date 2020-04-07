const app = require('express');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(17003, '0.0.0.0');
io.set('origins', '*:*');

// variables
let connections = [];
let workers = {};
let worker;
let bugID;


io.sockets.on('connection', function (socket) {
  console.log(`Success connection on bug`);

  socket.on('addUser', function (data) {
    let bugID = data.bugID;
    let user = data.email;
    socket.bugID = bugID;
    socket.user = user;
    bugID = bugID;
    worker = user;

    if (workers[bugID] === undefined) {
      workers[bugID] =  [];
      workers[bugID].push(user);
    } else if (workers[bugID].includes(user) !== true) {
      workers[bugID].push(user);
    }
    io.sockets.emit('showUser', workers);
    connections.push(socket);
    console.log(connections);
    console.log('all workers', workers);
  })

  console.warn('all conns', connections);
  socket.on('disconnect', function (socket) {
    if (bugID !== undefined && worker !== undefined) {
      workers[bugID].splice(workers[bugID].indexOf(worker), 1);
      console.log(`${worker} disconnect on bug ${bugID}`);
    }

    connections.splice(connections.indexOf(socket), 1);
  });
})
