import Grid from "@mui/material/Grid";
import React from "react";
import styles from "./messageContainer.module.css";
import MessageCard from "../messagecard/messagecard";
import { Divider } from "@mui/material";
export default class MessageContainer extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <>
                <Grid container maxWidth sx={{height: "100%", padding: 2}}>
                    <Grid item xs={12}  className={styles.Container}>
                        <Grid container maxWidth sx={{padding: 3,}}>
                        {
                            this.props.data?this.props.data.map((item)=>{
                                return (
                                <>
                                <Grid item xs={12} sx={{padding: 1}}>
                                    <MessageCard message={item.messageData} time={item.messageTime} sender={item.messageBy}/>
                                </Grid>
                                <Divider sx={{width: "100%"}}></Divider>
                                </>
                                );
                            }):(<Grid item xs={12}> Chat is clear </Grid>)
                        }
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    }
}
