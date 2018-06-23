const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let {generateMessage, generateLocationMessage} = require('./utils/message');
let users = new Users();

io.on('connection', (socket)=>{
  // console.log('new user connect');

  socket.on('join', (params, cb)=>{
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return cb(`Name and Room Name are required`);
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage(`Admin`, `Welcome to the chat app!`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage(`Admin`, `${params.name} joined the chat!`));
    cb();
  });

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
    var userThatLeft = users.removeUser(socket.id);
    console.log(users);
    if(userThatLeft){
      io.to(userThatLeft.room).emit('updateUserList', users.getUserList(userThatLeft.room));
      io.to(userThatLeft.room).emit('newMessage', generateMessage('Admin', `${userThatLeft.name} has left`));
    }
  });
});

app.use(express.static(publicPath));

server.listen(port, ()=>{
  console.log(`Server is listening on ${port}`);
});