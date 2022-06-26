import Avatar from '@mui/material/Avatar';
import Grid from "@mui/material/Grid";
import React from "react";
//colors
import {deepOrange, red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, brown, grey} from '@mui/material/colors';
// stylesheet
import styles from "./messageCard.module.css";

class MessageCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ColorIndex: 0,
        };
        this.AvatarColor = [deepOrange, pink, purple, red, indigo, deepPurple, cyan, green, blue, grey, amber, lightBlue, lightGreen, teal, lime, brown, yellow, amber];
    }
    render(){
        return (
            <>
                <Grid container maxWidth >
                    <Grid item xs={1} sx={{display: "flex", padding: 1}} justifyContent="center">
                        <Avatar sx={{bgcolor: this.AvatarColor?this.AvatarColor[(this.state&&this.state.ColorIndex)?this.state.ColorIndex:0][500]:"blue"}}>{this.props.sender?this.props.sender.slice(0,1).toUpperCase():""}</Avatar>
                    </Grid>
                    <Grid item xs={11} sx={{display: "flex", padding:2, fontWeight: 500, fontSize: 18}} justifyContent="left" className={styles.messageContainer}>
                        {this.props.message?this.props.message:""}
                    </Grid>
                    <Grid item xs={12} sx={{display: "flex", padding:1}} justifyContent="center" fontSize={11}>
                        <b>{this.props.time?this.props.time:""}</b>
                    </Grid>
                </Grid>
            </>
        );
    }
    componentDidMount(){
        if(sessionStorage.getItem(this.props.sender) !== null){
            this.setState({
                ColorIndex: sessionStorage.getItem(this.props.sender),
            });
        }
        else{
            const Index = ((this.props.sender?this.props.sender.length:0)+Math.floor(Math.random()*19))%18;
            if(this.props.sender){
                sessionStorage.setItem(this.props.sender, Index);
            }
            this.setState({
                ColorIndex: Index,
            });
        }
    }
}

export default MessageCard;
