const Database = require("@replit/database");
const db = new Database();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

async function search(req, res)
{
    var target = req.body.toBeSearched; //make sure frontend has the same name
    var JSONmessages = [];

    await db.get("messages").then((values)=>{
        JSONmessages = values;
    });
    //messages are assumed to be of the form
    //["mesaage1", "message2"....]
    var messages = [];
    for(let i = 0; i< JSONmessages.length; ++i)
    {
        messages.push(JSONmessages[i].messageData);
    }
    var i = 0;

    var messageIndices = [];
    var regex = new RegExp(target, "g"); 

    var indices = new Map();
    while(i < messages.length)
    {
        if(messages[i].match(regex) != null) 
        {
            indices.set(i, []);
        }
        while ((match = regex.exec(messages[i])) != null)
        {
            indices.get(i).push(match.index);
        }
        i++;
    }

    res.send(messageIndices);

    //recieving a map, where the message index is the key and the STARTING index of the
    //keyword are the values.
    //in case of multiple presence, each of the starting value is stored
    //keyword to be ectracted by highlighting start index + target.length

}

exports.execute = search;