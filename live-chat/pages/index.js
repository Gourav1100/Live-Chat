import Grid from "@mui/material/Grid";
import Head from "next/head";
import io from "socket.io-client";
import MessageCard from "./components/messagecard/messagecard";
import SendContainer from "./components/sendContainer/sendContainer";
import React from "react";
// stylesheet
import styles from "../styles/Home.module.css";
import MessageContainer from "./components/messageContainer/messageContainer";

export default class Home extends React.Component {
	appendLater = [];
	socketInitializer = () => {
		const socket = io("http://localhost:3001");
		socket.on('connect', () => {
			console.log("connected");
		});
		socket.on('recieveMessage', (message) => {
			if (!this.state.loaded) {
				this.appendLater.push(message);
			}
			else {
				let oldmessage = this.state.chatMessages;
				console.log(oldmessage);
				oldmessage.push(message);
				console.log(message);
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
			loaded: false,
			chatMessages: [],
		}
	}
	render() {
		if (this.state.loaded === false) {
			return (
				<div className={styles.container}>
					<Head>
						<title>Live Chat</title>
						<link rel="icon" href="/favicon.ico" />
					</Head>

					<main className={styles.main}>
						Loading Messages
					</main>
				</div>
			);
		}
		console.log(this.state.chatMessages);
		return (
			<div>
				<Head>
					<title>Live Chat</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<main>
					<Grid container maxWidth sx={{padding: {xs: 2,md: 3,}, backgroundColor: "#2d3436", height: "100vh"}}>
						<Grid item xs={12} height="90%">
							<MessageContainer data = {this.state.chatMessages} />
						</Grid>
						<Grid item xs={12} >
							<SendContainer onSubmit={this.sendMessage} />
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
		this.state = {
			loaded: false,
			chatMessages: []
		}
		if (this.socket) {
			this.socket.disconnect();
		}
		this.socketInitializer();
		this.socket.emit('hello');
	}

	sendMessage = (event) => {
		event.preventDefault();
		const msg = event.target.message.value
		if(this.socket){
			if(msg){
				this.socket.emit("sendMessage", {
					sender: "admin",
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
	}
}
