const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let {generateMessage, generateLocationMessage} = require('./utils/message');

io.on('connection', (socket)=>{
  console.log('new user connect');
  socket.emit('newMessage', generateMessage(`Admin`, `Welcome to the chat app!`));
  socket.broadcast.emit('newMessage', generateMessage(`Admin`, `New user joined the chat!`));
  socket.on('createMessage', (msg,cb)=>{
    io.emit('newMessage',{
      from: msg.from,
      text: msg.text,
      createdAt: new Date()
    });
    cb();
  });

  socket.on('createLocationMessage', (coords)=>{
    io.emit('newLocationMessage',generateLocationMessage(`Admin`, coords.lat, coords.long));
  });

  socket.on('disconnect', ()=>{
    console.log(`user disconnected`);
  });
});

app.use(express.static(publicPath));

server.listen(port, ()=>{
  console.log(`Server is listening on ${port}`);
});