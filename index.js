// import Libraries
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const dotenv = require("dotenv").config();
// import PORT
const PORT = process.env['PORT'];
// Messages
var messages = [];
// set app configurations
let app = express();
app.use(require('cors'));
let server = http.createServer(app);
let io = socketIO(server, {
    cors: {
        origin: `*`,
        methods: ["GET", "POST"],
    }
});
// set socket functions
io.on("connection", (socket) => {
    console.log(`New connection from : ${socket.id} ( ${socket.request.connection.remoteAddress} )`);
    socket.on('hello',()=>{
        socket.emit('helloResponse', messages);
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
            messages.push(msg);
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
