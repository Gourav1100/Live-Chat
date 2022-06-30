const Database = require("@replit/database");
const db = new Database();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

async function removeFriend(req, res)
{
    var userData = [];

    var toRemove = req.body.friendDel; //DEPENDS ON THE FRONTEND NAME

    await db.get("users").then((values)=>
    {
        userData = JSON.parse(values); //JSON object extraction
    });

    var currentFriends = userData.friends; //JSON KEY
    for(let i = 0; i< currentFriends.length; i++)
    {
        //ERROR PRONE -> DEPENDS ON HOW WE SAVE DATA
        
        //(userData[i].friends);
        //list of friends (stored in data base as :)
        // currentUser ->(maps) [] of his friends

        if(toRemove == currentFriends[i])
        {
            delete currentFriends[i];
            break; //because users are unique
        }
        //extracting the friends from the userData (stored in JSON format)
    }
    
    values.friends = currentFriends;

    res.send(JSON.stringify(userData)); //sending back the JSON object
    //updating JSON

}

exports.execute = removeFriend;