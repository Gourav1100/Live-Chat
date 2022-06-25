// import Libraries
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const dotenv = require("dotenv").config();
const Database = require("@replit/database")
// import PORT
const PORT = process.env['PORT'];
// set database
const db = new Database();
async function init_Database(){
  let isDatabaseSet = false;
  await db.get("messages").then((values)=>{
    if(values){
      isDatabaseSet = true;
    }
  });
  if(!isDatabaseSet){
    console.log("Database not initialized, now initializing...")
    await db.set("messages",[]).then(()=>console.log("done."));
  }
  else{
    console.log("Database is ready!")
  }
  return true;
}
// set app configurations
let app = express();
app.use(require('cors'));
let server = http.createServer(app);
let io = socketIO(server, {
    cors: {
        origin: `*`,
        methods: ["HEAD","GET", "POST"],
    }
});
// set socket functions and server
async function serve() {
  await init_Database();
  await io.on("connection", (socket) => {
    console.log(`New connection from : ${socket.id} ( ${socket.request.connection.remoteAddress} )`);
    socket.on('hello',()=>{
      var messages = [];
      db.get("messages").then((values)=>{
          messages = values;
      }).then(()=>{
        socket.emit('helloResponse', messages);
      });
    })
    socket.on('disconnect',() => {
        console.log(`user disconnected : ${socket.id} ( ${socket.request.connection.remoteAddress} )`);
    });
    socket.on('sendMessage',(message)=>{
        try{
            const dateTime = new Date();
            let date = dateTime.getDate().toString();
            if(date.length === 1){
                date = "0" + date;
            }
            let month = (dateTime.getMonth() + 1).toString();
            if(month.length === 1){
                month = "0" + month;
            }
            let year = dateTime.getFullYear().toString();
            let minutes = ((dateTime.getMinutes()+30)%60).toString();
            if(minutes.length === 1){
                minutes = '0' + minutes;
            }
            let hours = ((dateTime.getHours()+5)%24);
            if((dateTime.getMinutes()+30)>=60){
              hours += 1;
            }
            hours = hours.toString();
            if(hours.length === 1){
                hours = '0' + hours;
            }
            const msg = {
                messageDate: date+'/'+month+'/'+year,
                messageTime: hours+':'+minutes,
                messageBy: message.sender,
                messageData: message.msg,
            }
            let messages = [];
            db.get("messages").then((value)=>{
              messages = value;
            }).then(()=>{
              messages.push(msg);
              db.set("messages",messages);
            })
            socket.broadcast.emit('recieveMessage',msg);
            socket.emit('recieveMessage', msg);
        } catch(err) {
            console.log(err.message);
        }
    })
  });
  // start socket server
  console.log(`Server running at PORT ${PORT}`)
  server.listen(PORT);
}

serve();
