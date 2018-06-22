let socket = io();
// let $ = jQuery;
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
  let li = `<li>${msg.from}: ${msg.text}</li>`
  $('#messageBoard').append(li)
})

$('#message-form').on('submit', (e)=>{
  e.preventDefault();
  socket.emit('createMessage', {
    from: `User`,
    text: $('input[name="primaryText"]').val()
  }, (fromServer)=>{
    console.log(fromServer);
  });
});