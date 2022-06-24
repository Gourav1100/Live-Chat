import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from 'react';

export default class SendContainer extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <>
                <Grid container maxWidth sx={{padding: 2}}>
                    <Grid item xs={12}>
                        <form onSubmit={this.props.onSubmit}>
                            <Grid container maxWidth spacing={1}>
                                <Grid item xs={10}>
                                    <TextField name="message" sx={{width: "100%", backgroundColor: "#dfe6e9"}} label="Enter Your Message" variant="filled" color="success" />
                                </Grid>
                                <Grid item xs={2}>
                                <Button sx={{padding: 2, width: "100%", textAlign: "center"}} variant="contained" color="success" type="submit">
                                    Send
                                </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </>
        );
    }
}
