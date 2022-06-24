import Grid from "@mui/material/Grid";
import Head from "next/head";
import io from "socket.io-client";
import MessageContainer from "./components/messageContainer/messageContainer";
import SendContainer from "./components/sendContainer/sendContainer";
import React from "react";
// stylesheet
import styles from "../styles/Home.module.css";

export default class Home extends React.Component {
	appendLater = [];
	socketInitializer = () => {
		const socket = io("https://SocketServer.gauravbidhuri.repl.co");
		socket.on('connect', () => {
			console.log("connected");
		});
		socket.on('recieveMessage', (message) => {
			if (!this.state.loaded) {
				this.appendLater.push(message);
			}
			else if(!this.message) {
				let oldmessage = this.state.chatMessages;
				oldmessage.push(message);
				this.setState({
					chatMessages: oldmessage,
				});
			}

		});
		socket.on('helloResponse', (messages) => {
			this.setState({
				loaded: true,
				chatMessages: [...messages, ...this.appendLater],
			});
		})
		this.socket = socket;
	}
	constructor(props) {
		super(props);
		this.setState({
			username: "",
			loaded: false,
			chatMessages: [],
		});
	}
	render() {
		if(!this.state){
			return (<>Loading state</>);
		}
		if (this.state.loaded===null || this.state.loaded === false) {
			return (
				<div className={styles.container}>
					<Head>
						<title>Live Chat</title>
						<link rel="icon" href="/favicon.ico" />
						<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
					</Head>

					<main className={styles.main}>
						Loading Messages
					</main>
				</div>
			);
		}
		return (
			<div>
				<Head>
					<title>Live Chat</title>
					<link rel="icon" href="/favicon.ico" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
				</Head>

				<main>
					<Grid container maxWidth sx={{padding: {xs: 2,md: 3,}, backgroundColor: "#2d3436", height: "100vh"}}>
						<Grid item xs={8} height="3%" sx={{display: "flex", padding: 2}} justifyContent="right">
						<h1><i><span style={{fontWeight: 500, color: "#353b48"}}>LiveChat</span></i></h1>
						</Grid>
						<Grid item xs={4} height="3%" sx={{display: "flex", color: "White", padding: 2}} justifyContent="right">
							<b>Hi, </b><i>{this.state.username}</i>
						</Grid>
						<Grid item xs={12} height="87%">
							<MessageContainer data = {this.state.chatMessages} />
						</Grid>
						<Grid item xs={12} >
							<SendContainer onSubmit={this.sendMessage}/>
						</Grid>
					</Grid>
				</main>
			</div>
		);
	}
	componentDidMount() {
		window.onbeforeunload = (event) => {
			this.socket.disconnect();
		}
		this.setState ({
			username: "",
			loaded: false,
			chatMessages: []
		})
		if (this.socket) {
			this.socket.disconnect();
		}
		if( sessionStorage.getItem("UserName") === "" || sessionStorage.getItem("UserName") === null ){
			window.location.replace("/login");
		}
		this.setState({
			username: sessionStorage.getItem("UserName"),
		});
		this.socketInitializer();
		this.socket.emit('hello');
	}

	sendMessage = (event) => {
		event.preventDefault();
		const msg = event.target.message.value;
		if(this.socket){
			if(msg){
				this.socket.emit("sendMessage", {
					sender: this.state.username,
					msg: msg,
				})
			}
			else{
				alert("Message cannot be Empty!");
			}
		}
		else{
			alert("Socket Connection not Initialized");
		}
		// clear send message
		event.target.message.value="";
	}
}
