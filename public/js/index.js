let socket = io();

socket.on('connect', ()=>{
  console.log(`server connected`);
});
socket.on('disconnect', ()=>{
  console.log(`server disconnected`);0
});

socket.on('newMessage', (msg)=>{
  let li = `<li>${msg.from}: ${msg.text}</li>`;
  $('#messageBoard').append(li)
});

socket.on('newLocationMessage', (msg)=>{
  let li = `<li>${msg.from}: <a target="_blank" href="${msg.url}">${msg.url}</a>`;
  $('#messageBoard').append(li)
});

$('#message-form').on('submit', (e)=>{
  e.preventDefault();
  socket.emit('createMessage', {
    from: `User`,
    text: $('input[name="primaryText"]').val()
  }, ()=>{
    $('input[name="primaryText"]').val(" ");
  });
});

$('#sendLocation').on('click', ()=>{
  if(!navigator.geolocation) {
    return alert(`Geolocation is not available or is unsupported by your browswer.`)
  }

  $('#sendLocation').attr('disabled', 'disabled').text('Sending Location...');
  
  navigator.geolocation.getCurrentPosition((position)=>{
    $('#sendLocation').removeAttr('disabled').text('Send Location');
    console.log(position);
    socket.emit('createLocationMessage', {
      long: position.coords.longitude,
      lat: position.coords.latitude
    })
  },()=>{
    alert(`Unable to fetch location`);
  });
});