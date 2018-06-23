let socket = io();

let scrollToBottom = ()=>{
  let messages = $('#messageBoard');
  let newMessage = messages.children('li:last-child');


  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', ()=>{
  let params = $.deparam(window.location.search);
  socket.emit('join', params, (err)=>{
    if(err){
      alert(err);
      window.location.href = '/';
    } else {
      console.log(`No error`);
    }
  });
});
socket.on('disconnect', ()=>{
  console.log(`server disconnected`);0
});

socket.on('updateUserList',(users)=>{
  $('#userList').html(``);
  users.forEach((user)=>{
    $('#userList').append(`<li>${user}</li>`)
  });
});

socket.on('newMessage', (msg)=>{
  let formattedTime = moment(msg.createdAt).format('h:mm a');
  let template = $('#message-template').html();
  let html = Mustache.render(template,{
    formattedTime,
    text: msg.text,
    from: msg.from
  });

  $('#messageBoard').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', (msg)=>{
  let formattedTime = moment(msg.createdAt).format('h:mm a');
  let template = $('#location-message-template').html();
  let html = Mustache.render(template,{
    formattedTime,
    url: msg.url,
    from: msg.from
  });
  $('#messageBoard').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', (e)=>{
  e.preventDefault();
  socket.emit('createMessage', {
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