let socket = io();
socket.on('connect', ()=>{
  // socket.emit(`createMessage`,{
  //   to: 'myfriend@example.com',
  //   text: `This is the greatest song in the world`,
  //   createdAt: new Date(),
  //   fromURL: window.location.origin
  // });
});
socket.on('disconnect', ()=>{
  console.log(`server disconnected`);0
});

socket.on('newMessage', (msg)=>{
  console.log(msg);
})