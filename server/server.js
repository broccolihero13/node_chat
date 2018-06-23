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
    let user = users.getUser(socket.id);

    if(user && isRealString(msg.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name,msg.text));
    }
    
    cb();
  });

  socket.on('createLocationMessage', (coords)=>{
    let user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name, coords.lat, coords.long));
    }
  });

  socket.on('disconnect', ()=>{
    var userThatLeft = users.removeUser(socket.id);
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