import Grid from "@mui/material/Grid";
import Avatar from '@mui/material/Avatar';
import React from "react";
import {deepOrange, red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, brown, grey} from '@mui/material/colors';
class MessageCard extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        console.log(this.props);
        console.log("props");
        const AvatarColor = [deepOrange, pink, purple, red, indigo, deepPurple, cyan, green, blue, grey, amber, lightBlue, lightGreen, teal, lime, brown, yellow, amber];
        const ColorIndex = (((this.props.sender).length)+Math.floor(Math.random() * 19))%18;
        const Sender = (this.props.sender).slice(0,1).toUpperCase();
        return (
            <>
                <Grid container maxWidth >
                    <Grid item xs={0.4} sx={{display: "flex", paddingRight: 2}} justifyContent="left">
                        <Avatar sx={{bgcolor: AvatarColor[ColorIndex][500], height: 30, width: 30}}>{Sender}</Avatar>
                    </Grid>
                    <Grid item xs={9} sx={{display: "flex", paddingTop:0.2}} justifyContent="left">
                        {this.props.message}
                    </Grid>
                    <Grid item xs={5} sx={{display: "flex", paddingLeft:0.47, paddingTop:1, paddingBottom:2}} justifyContent="left" fontSize={9}>
                        <b>{this.props.time}</b>
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default MessageCard;
