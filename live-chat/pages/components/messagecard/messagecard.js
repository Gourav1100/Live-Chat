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
                    <Grid item xs={12} sx={{display: "flex"}} justifyContent="right">
                        <Avatar sx={{bgcolor: AvatarColor[ColorIndex][500], height: 30, width: 30}}>{Sender}</Avatar>
                    </Grid>
                    <Grid item xs={12} sx={{display: "flex"}} justifyContent="right">
                        {this.props.message}
                    </Grid>
                    <Grid item xs={12} sx={{display: "flex"}} justifyContent="right" fontSize={9}>
                        <b>{this.props.time}</b>
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default MessageCard;
