import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default class Login extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <Box
            component="form"
           sx={{backgroundColor: 'darkgrey', width: 1600, height: 1000}}
            noValidate
            autoComplete="off"
          >
            <TextField label="Username:" variant="filled" color="success" focused sx={{ marginLeft:65, marginTop:20, marginBottom:0, width: '50ch' }}/>
            <Button variant="contained" color="success" sx={{ marginLeft:81, marginTop:6.5, width: '25ch'}}>Submit</Button>
          </Box>
        );
    }
}