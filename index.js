const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(17003, '0.0.0.0');
io.set('origins', '*:*');

// variables
let connections = [];


app.get('/bugs/:id', function (request, response) {
  let bugId = request.params.id;

  io.sockets.on('connection', function (socket) {
    console.log(`Success connection on bug ${bugId}`);
    connections.push({'bug': bugId, 'socket': socket});
    console.log('new conn', socket);
    io.sockets.emit('success', {success: 'success'});
    
    socket.on('disconnect', function (socket) {
      console.log(`Disconnect on bug ${bugId}`);
      connections.splice(connections.indexOf({'bug': bugId, 'socket': socket}), 1);
    });
  })

  response.writeHead(200);
  response.write('hi');
  response.end();
})


app.get('/bugs/:id/workers', function (request, response) {
  let bugId = request.params.id;
  response.sendFile(__dirname + '/views/bug-workers.html');
})


app.get('/workers/:email/bugs', function (request, response) {
  let email = request.params.email;
  response.sendFile(__dirname + '/views/worker-bugs.html');
})


app.get('/bugs', function (request, response) {
  response.sendFile(__dirname + '/views/all-bugs.html');
})

