import Head from "next/head";
import styles from "../styles/Home.module.css";
import MessageCard from "./components/messagecard/messagecard";
import io from "socket.io-client";
import React from "react";

export default class Home extends React.Component {
	appendLater = [];
	socketInitializer = () => {
		const socket = io("http://localhost:3001");
		socket.on('connect', () => {
			console.log("connected");
		});
		socket.on('recieveMessage', (message) => {
			if(!this.state.loaded){
				this.appendLater.push(message);
			}
			else{
				this.setState({
					chatMessages: [...messages, message],
				})
			}

		});
		socket.on('helloResponse', (messages) => {
			this.setState({
				loaded: true,
				chatMessages: [messages, ...this.appendLater],
			});
		})
		this.socket = socket;
	}
	constructor(props){
		super(props);
		this.state = {
			loaded: false,
			chatMessages: []
		}
	}
	render(){
		if(this.state.loaded === false){
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
		return (
			<div className={styles.container}>
				<Head>
					<title>Live Chat</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<main>
					{this.state.chatMessages}
					<MessageCard sender="admin" time="12:00" message="This component is working" />
				</main>
			</div>
		);
	}
	componentDidMount() {
		window.onbeforeunload = (event) =>{
			this.socket.disconnect();
		}
		this.state = {
			loaded: false,
			chatMessages: []
		}
		if(this.socket){
			this.socket.disconnect();
		}
		this.socketInitializer();
		this.socket.emit('hello');
	}
}
