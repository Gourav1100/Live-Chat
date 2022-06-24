import Grid from "@mui/material/Grid";
import React from "react";
class MessageCard extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        console.log(this.props);
        console.log("props");
        return (
            <>
                <Grid container maxWidth sx={{border: "2px solid black"}}>
                    <Grid item xs={12} sx={{display: "flex"}} justifyContent="right">
                        <b>{this.props.sender?this.props.sender:"123"}</b>
                    </Grid>
                    <Grid item xs={12} sx={{display: "flex"}} justifyContent="right">
                        {this.props.message?this.props.message:"123"}
                    </Grid>
                    <Grid item xs={12} sx={{display: "flex"}} justifyContent="right">
                        <b>{this.props.time?this.props.time:"123"}</b>
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default MessageCard;
