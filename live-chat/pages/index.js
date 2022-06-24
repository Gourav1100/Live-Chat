import Head from "next/head";
import styles from "../styles/Home.module.css";

import io from "socket.io-client";
import React, { useEffect } from "react";

export default class Home extends React.Component {
	socket = "this will be a socket";
	chatMessages = [];
	socketInitializer = () => {
		const socket = io("http://localhost:3001");
		socket.on('connect', () => {
			console.log("connected");
		});
		socket.on('recieveMessage', (message) => {
			console.log(message);
		});
		socket.on('disconnect', () => {
			console.log("disconnected");
		});
		socket.on('helloResponse', (messages) => {
			this.chatMessages = messages;
		})
		this.socket = socket;
	}
	constructor(){
		super();
		this.socketInitializer();
	}
	render(){
		
		return (
			<div className={styles.container}>
				<Head>
					<title>Live Chat</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<main className={styles.main}>
					Next @ MUI ready!

				</main>
			</div>
		);
	}
}
