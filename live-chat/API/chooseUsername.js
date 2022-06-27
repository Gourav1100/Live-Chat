const Database = require("@replit/database");
const db = new Database();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

async function selectUsername (req, res)
{
    var allUsers = [];
    await db.get("users").then(values => {
        allUsers = JSON.parse(values);
    }); 
    
    var WantingUsername = req.body.newUsername;//the new username the user wants 
    var currentUsername = req.body.currentUsername; //the user might be changing usernames

    if(currentUsername.length > 0)
    {
        for(let i = 0; i< allUsers.length; i++)
        {
             //extracting username from JSON object
            if(allUsers[i].username == currentUsername)
            {
                allUsers[i].username = WantingUsername;

                res.send(JSON.stringify(allUsers));//giving back the update JSON
                break;
            }
        }
    }
    else
    {
        for(let i = 0; i< allUsers.length; i++)
        {
            if(allUsers[i].username == WantingUsername)
            {
                //res.sendFile(__dirname + error.html) in the future
                res.send("USERNAME ALREADY EXIST");
                console.log("USER ALREADY EXISTS");
                break;
            }
        }

        var newObject = {
            username: WantingUsername,
            friends: [],
        }
        allUsers.push(JSON.stringify(newObject));

        console.log("USER added successfully");
        req.send(JSON.stringify(allUsers));
        //sending updated base
    }
}

exports.execute = selectUsername; 

