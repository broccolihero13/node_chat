const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket)=>{
  console.log('new user connect');
  socket.emit('newMessage', {from: `Admin`, text: `Welcome to the chat app!`, createdAt: new Date()});
  socket.broadcast.emit('newMessage', {from: `Admin`, text: `New user has joined`, createdAt: new Date()});
  socket.on('createMessage', (msg)=>{
    console.log(msg);
    socket.broadcast.emit('newMessage',{
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', ()=>{
    console.log(`user disconnected`);
  });
});

app.use(express.static(publicPath));

server.listen(port, ()=>{
  console.log(`Server is listening on ${port}`);
});