#!/usr/bin/node

const app = require('express');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(17003, '0.0.0.0');
io.set('origins', '*:*');

// variables
let connections = [];
let workers = {};
let bugs = {};


function isWorker(workersObj, worker) {
  for (let id in workersObj) {
    if (worker === workersObj[id]) {
      return true
    }
  }
  return false
}


function getBugWorkers(bugID) {
  let bugWorkers = {};
  
  for (let id in workers) {
    if (bugID === workers[id].bugID) {
      if (bugWorkers[id] === undefined && isWorker(bugWorkers, workers[id].email) !== true) {
          bugWorkers[id] = workers[id].email;
      }
    }
  }

  return bugWorkers
}


io.sockets.on('connection', function (socket) {
  console.log(`Success connection on bug`);

  socket.on('addUser', function (data) {
    let bugID = data.bugID;
    let user = data.email;
  
    if (workers[socket.id] === undefined) {
      workers[socket.id] = { email: user, bugID: bugID };
    } else {
      workers[socket.id] = { email: user, bugID: bugID };
    }

    bugs[bugID] = getBugWorkers(bugID);

    io.sockets.emit('showAllUsers', bugs);
    connections.push(socket);

    console.log('all workers', workers);
    console.log('all bugs', bugs)
  })

  socket.on('disconnect', function () {
    console.log(`disconnected socket ${socket.id}`);

    if (workers[socket.id] !== undefined) {
      socket.broadcast.emit('deleteUser', { id: socket.id, email: workers[socket.id].email });
      
      let bugID = workers[socket.id].bugID;

      delete workers[socket.id];

      console.log("workers after disconn", workers);
      // update bug workers
      bugs[bugID] = getBugWorkers(bugID);
      socket.broadcast.emit('showAllUsers', bugs);
    }

    connections.splice(connections.indexOf(socket), 1);

  });
})
