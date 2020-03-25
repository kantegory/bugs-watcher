const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(17003);

app.get('/bugs/:id/workers', function (request, response) {
  let bugId = request.params.id;
  response.sendFile(__dirname + '/views/bug.html');
})


app.get('/workers/:email/bugs', function (request, response) {
  let email = request.params.email;
  response.sendFile(__dirname + '/views/worker-bugs.html');
})


app.get('/bugs', function (request, response) {
  response.sendFile(__dirname + '/views/all-bugs.html');
})

