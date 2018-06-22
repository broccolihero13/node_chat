let generateMessage = (from, text)=>{
  return {from,text,createdAt: new Date()}
};

let generateLocationMessage = (from, lat, long)=>{
  let url = `https://www.google.com/maps?q=${lat},${long}`;
  return {from,url,createdAt: new Date()}
};

module.exports = {generateMessage, generateLocationMessage};