const moment = require('moment');
let generateMessage = (from, text)=>{
  return {from,text,createdAt: moment()}
};

let generateLocationMessage = (from, lat, long)=>{
  let url = `https://www.google.com/maps?q=${lat},${long}`;
  return {from,url,createdAt: moment()}
};

module.exports = {generateMessage, generateLocationMessage};