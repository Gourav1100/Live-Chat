import { Divider } from "@mui/material";
import Fab from '@mui/material/Fab';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import Grid from "@mui/material/Grid";
import MessageCard from "../messagecard/messagecard";
import React from "react";
// stylesheet
import styles from "./messageContainer.module.css";

export default class MessageContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            autoscroll: true,
        };
    }
    render(){
        this.counter = 0;
        this.lastDate = "";
        return (
            <>
                <Grid container maxWidth sx={{height: "100%", padding: 2}}>
                    <Grid item xs={12} id="messageContainer" className={styles.Container}>
                        <Grid container maxWidth sx={{padding: 3,}}>
                        {
                            (this.props.data && this.props.data!=[])?this.props.data.map((item)=>{
                                this.counter++;
                                if(this.lastDate !== item.messageDate){
                                    this.lastDate = item.messageDate;
                                    return (
                                    <Grid container maxWidth key={this.counter} id={"message_"+this.counter.toString()}>
                                        <Divider sx={{width: "100%"}}></Divider>
                                        <Grid item xs={12} sx={{padding: 1, textAlign: "center"}}>
                                            {this.lastDate}
                                        </Grid>
                                        <Divider sx={{width: "100%"}}></Divider>
                                        <Grid item xs={12} sx={{padding: 1}}>
                                            <MessageCard message={item.messageData} time={item.messageTime} sender={item.messageBy}/>
                                        </Grid>
                                        <Divider sx={{width: "100%"}}></Divider>
                                    </Grid>
                                    );
                                }
                                return (
                                    <Grid container maxWidth key={this.counter} id={"message_"+this.counter.toString()}>
                                        <Grid item xs={12} sx={{padding: 1}}>
                                            <MessageCard message={item.messageData} time={item.messageTime} sender={item.messageBy}/>
                                        </Grid>
                                        <Divider sx={{width: "100%"}}></Divider>
                                    </Grid>
                                    );
                            }):(<Grid item xs={12}> Chat is clear </Grid>)
                        }
                        {
                            (!this.state.autoscroll)?(
                                <div className={styles.floatContainer}>
                                    <Fab aria-label="Scroll-Down" className={styles.scrollButton} onClick={this.scrollBottom}>
                                        <KeyboardArrowDownOutlinedIcon />
                                    </Fab>
                                </div>
                            ):(<></>)
                        }
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    }
    componentDidUpdate(){
        if(this.state.autoscroll){
            document.getElementById("message_"+this.counter.toString()).scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
    componentDidMount(){
        var container = document.getElementById("messageContainer");
        container.onscroll = (event) => {
            var element = event.target;
            if (!this.state.autoscroll && ( element.scrollHeight - element.scrollTop <= element.clientHeight + 150 )){
                this.setState({
                    autoscroll: true,
                })
            }
            else if(this.state.autoscroll && ( element.scrollHeight - element.scrollTop > element.clientHeight + 150 )){
                this.setState({
                    autoscroll: false,
                })
            }
        };
        if(this.state.autoscroll){
            document.getElementById("message_"+this.counter.toString()).scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
    scrollBottom = () => {
        this.setState({
            autoscroll: true,
        })
    }
}
