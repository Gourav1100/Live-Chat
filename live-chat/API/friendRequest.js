const Database = require("@replit/database");
const db = new Database();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

async function friendRequest (req, res)
{
    var target = req.body.reqto;
    //the variable name will be changed according to name in the frontend

    var JSONusers = [];

    await db.get("users").then((values)=>{
        JSONusers = values;
    });

    var users = [];

    for(let i = 0; i< JSONusers.length; i++)
    {
        users.push(JSONusers[i].userKey); //storing the user key
    }

    var i = 0;
    var flag = 0;

    for(i = 0; i< users.length; ++i)
    {
        if(target === users[i])
        {
            flag = 1;
            console.log("USER FOUND !");
            break;            
        }
    }

    if(flag === 0)
    {
        console.log("No such user!!");

        res.send("No such user :(, kindly check the username!!");
        //res.send(__dirname + "/failure.html"); // with time a failure page
    }

    //logic on adding friend

    //make a post request to the friend
    //the request status is -> pending, successful or rejected
    //send the request to the /friend page
    //register user.from, user.to
    
    function addFriend(name)
    {
        $.ajax({
            url: "/addfriend",
            type: "POST",
            data:{
                reciever: name,
            }
        });
    }

    $(document).ready(function(){
        
        $("#acceptRequest").on("Click", function(){
            var sender = $("#Sender").val();
            var sentTo = $("#Receiver").val();

            $.ajax({
                url: "/success",
                type: "POST",
                data:{
                    Sender: sender,
                    Reciever: sentTo,
                },
                success: async function(){
                    console.log("FRIEND REQUEST ACCEPTED");

                    //update the user data base

                    //ERROR PRONE !!!!!
                    await db.get("users").then((values) =>{
                        for(key in db.keys) 
                        //reference from https://docs.replit.com/hosting/database-faq
                        {
                            if(key === sender)
                            {
                                db.put(key, sentTo);
                                //updating the database against te key
                            }
                        }

                        res.send("Friend was successfully added");
                    }); 

                }
            })
        });

        //needs to reload after doing one 
        $("#reload").load(location.href + " #reload");
        //reference https://stackoverflow.com/questions/20002352/how-to-reload-a-div-on-a-button-click-using-jquery-or-javascript

        $("#cancelRequest").on("Click", function(){

            $ajax({
                url:"/failure",
                type: "POST"
            })
            //that's it 

            res.send("Request denied");
        }); 

        $("#reload").load(location.href + " #reload");
    });

    //one function for accept friend
    //one for reject


}

exports.execute = friendRequest;