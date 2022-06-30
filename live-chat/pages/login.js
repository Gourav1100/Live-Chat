import React from "react";
import Box from '@mui/material/Box';
import io from "socket.io-client";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Head from "next/head";
// stylesheet
import styles from "../styles/Home.module.css";
import { Grid } from "@mui/material";

export default class Login extends React.Component {
  handleUser = (event) => {
    event.preventDefault();
    this.socket.emit("userValidator", {
      newUsername: event.target.username.value,
      currentUsername: null,
      submit: true,
    });
  }
  handleColorChange = (event) => {
    this.socket.emit("userValidator", {
      newUsername: event.target.value,
      currentUsername: null,
      submit: false,
    });
  }
  socketInitializer = () => {
		const socket = io("https://SocketServer.byakuyanomagan.repl.co");
		socket.on('connect', () => {
			console.log("connected");
		});
		socket.on('validUsernameStatus', (status,success) => {
      this.setState({
        usernameStatus: status,
        redirect: success,
      });
		});
		this.socket = socket;
	}
  constructor(props){
      super(props);
      this.state = {
        usernameStatus: false,
      }
  }

  render(){
      return(
        <div>
        <Head>
          <title>Live Chat - Login</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        </Head>
        <Box className={styles.main} sx={{backgroundColor: 'darkgrey'}}>
          <Grid container maxWidth sx={{display: "flex", textAlign: "center"}} justifyContent="center" alignContent="center">
            <Grid item xs={10} md={8} lg={6}>
              <span style={{fontStyle: "italic", fontWeight: "500"}}><h1>LiveChat</h1></span>
            </Grid>
          </Grid>
          <form onSubmit={this.handleUser} style={{width: "100%",display: "flex", justifyContent: "center"}}>
            <Grid container maxWidth sx={{display: "flex"}} justifyContent="center" alignContent="center" spacing={2}>
              <Grid item xs={0} md={3}>
                {/* Empty space */}
              </Grid>
              <Grid item xs={10} md={6}>
                <TextField id="username" name="username" label="Username" variant="filled" color="success" sx={{ width: "100%", backgroundColor: "white" }} onKeyUp={this.handleColorChange}/>
              </Grid>
              <Grid item xs={0} md={3}>
                {/* Empty space */}
              </Grid>
              <Grid item xs={10} md={6} lg={4}>
                <Button type="submit" variant="contained" color="success" sx={{width: "100%", padding: 2 }}>Submit</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </div>
      );
  }
  componentDidMount() {
		if( sessionStorage.getItem("UserName")!==null && sessionStorage.getItem("UserName")!=="" ){
      window.location.replace("/");
    }
    window.onbeforeunload = (event) => {
			this.socket?this.socket.disconnect():"Socket does not exist";
		}
		if (this.socket) {
			this.socket.disconnect();
		}
		this.socketInitializer();
	}
  componentDidUpdate(){
    let element = document.getElementById("username");
    if( this.state.redirect === true ){
      this.socket.disconnect();
      window.sessionStorage.setItem("UserName", element.value);
      window.location.replace("/");
      element.value="";
    }
    else if( this.state.usernameStatus === false ){
      element.style.backgroundColor = "#fab1a0";
    }
    else{
      element.style.backgroundColor="white";
    }
  }
}
