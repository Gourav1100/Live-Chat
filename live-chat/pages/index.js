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
		const socket = io("https://SocketServer.byakuyanomagan.repl.co");
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
		this.state = {
			username: "",
			loaded: false,
			chatMessages: [],
		};
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
					<Grid container maxWidth className={styles.container} sx={{padding: {xs: 2,md: 4,}, backgroundColor: "#2d3436", height: "100vh"}}>
						<Grid item xs={12} height="5%" md={5} sx={{display: "flex", padding: 1}} justifyContent="center">
						<h3><i><span style={{fontWeight: 500, color: "#FFFFFF"}}>LiveChat</span></i></h3>
						</Grid>
						<Grid item xs={12} md={7} height="5%" sx={{display: "flex", color: "White", padding: 1}} justifyContent="right">
							<h3><b>Hi, </b><i>{this.state.username}</i></h3>
						</Grid>
						<Grid item xs={12} height="85%">
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
