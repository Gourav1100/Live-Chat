import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Head from "next/head";
// stylesheet
import styles from "../styles/Home.module.css";
import { Grid } from "@mui/material";

export default class Login extends React.Component {
  handleUser = (event) => {
    event.preventDefault();
    window.sessionStorage.setItem("UserName", event.target.username.value);
    window.location.replace("/");
    event.target.username.value="";
  }
  constructor(props){
      super(props);
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
                <TextField name="username" label="Username" variant="filled" color="success" sx={{ width: "100%", backgroundColor: "white" }}/>
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
  componentDidMount(){
    if( sessionStorage.getItem("UserName")!==null && sessionStorage.getItem("UserName")!=="" ){
      window.location.replace("/");
    }
  }
}
