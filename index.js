// import Libraries
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const Database = require("@replit/database")
// import PORT
const PORT = process.env['PORT'];
// set database
const db = new Database();
async function init_Database(){
  let isDatabaseSet = false;
  try{
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
  }
  catch(err){
    console.log(`Database error: ${err.message}`);
    return false;
  }
  return true;
}
// import users from database
async function init_username(){
  try{
    let isDatabaseSet = false;
    await db.get("users").then(values => {
          if(values){
            isDatabaseSet = true;
          }
    });
    if(!isDatabaseSet){
      console.log("Users database not initialized, now initializing...");
      await db.set("users",[]).then(()=>console.log("done."));
    }
    else {
      console.log("Users loaded!")
    }
  }
  catch(err){
    console.log(`Database error: ${err.message}`);
    return false;
  }
  return true;
}


// set event functions
// check username status
const selectUsername = (userData, socket) => {
    var allUsers = [];
    db.get("users").then(values => {
        allUsers = values
    }).then(()=>{
      var WantingUsername = userData.newUsername;      //the new username the user wants
      var currentUsername = userData.currentUsername ? newData.currentUsername : "";  //the user might be changing usernames

      // check valid user name status
      let isUsernameValid = true;
      for(let i = 0; i< allUsers.length; i++){
          if(allUsers[i].username == WantingUsername){
            socket.emit('validUsernameStatus', false, false);
            isUsernameValid = false;
            break;
          }
      }
      if( isUsernameValid && userData.submit ){
          socket.emit("validUsernameStatus", true, true);
          if(currentUsername.length > 0){
              for(let i = 0; i < allUsers.length; i++){
                  if(allUsers[i].username === currentUsername){
                      allUsers[i].username = WantingUsername;
                      break;
                  }
              }
          }
          else{
              var userObject = {
                  username: WantingUsername,
                  friends: [],
              }
              allUsers.push(userObject);
          }
          // update database
          db.set("users", allUsers);
      }
      else if( isUsernameValid ){
        socket.emit("validUsernameStatus", true, false);
      }
    });
}
const sendMessage = (message, socket) => {
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
}

const hello = (socket) => {
  var messages = [];
  db.get("messages").then((values)=>{
      messages = values;
  }).then(()=>{
    socket.emit('helloResponse', messages);
  });
};

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
  let status = true;
  status = status & ( await init_Database() );
  status = status & ( await init_username() );

  // if all data is accessible the initialize socket server
  if(status){
    await io.on("connection", (socket) => {
      console.log(`New connection from : ${socket.id} ( ${socket.request.connection.remoteAddress} )`);
      socket.on('hello',()=>{
        hello(socket);
      });
      socket.on("userValidator",(userData) => {
        selectUsername(userData, socket);
      });
      socket.on('disconnect',() => {
          console.log(`user disconnected : ${socket.id} ( ${socket.request.connection.remoteAddress} )`);
      });
      socket.on('sendMessage',(message)=>{
        sendMessage(message, socket);
      });
    });
    // start socket server
    console.log(`Server running at PORT ${PORT}`)
    server.listen(PORT);
  }
  else{
    console.log("Error...aborrting!");
  }
}

serve();
