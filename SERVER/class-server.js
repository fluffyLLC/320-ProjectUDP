const Game = require("./class-game.js").Game;
const Client = require("./class-client.js").Client;
const Pawn = require("./GameClasses/class-player.js").Player;
//const UDP = require('dgram');

exports.Server = class Server{

	constructor(){

		this.clients = [];

		//create socket
		this.sock = require('dgram').createSocket("udp4");
		console.log(this.sock.on);

		//setup event listeners
		this.sock.on("error",(e)=>this.onError(e));
		this.sock.on("listening",()=>this.onStartListen());
		this.sock.on("message",(msg,rinfo)=>this.onPacket(msg,rinfo));

		this.game = new Game(this);

		//this.game.objs.

		this.port = 320;
		this.sock.bind(this.port);
		// start listening
	}

	onError(e){

		console.log("ERROR: " + e);

	}

	onStartListen(){

		console.log("server is listening on port " + this.port);
	}
	
	onPacket(msg,rinfo){
		//we would normally check if the client alredy existed and thattehy actually wanted to play this game
		//console.log("message recived");

		if(msg.length < 4) return;

		const packetID = msg.slice(0,4).toString();

		const c = this.lookupClient(rinfo);

		if(c) {
			//console.log("client exists")
			c.onPacket(msg,this.game);

		} else {
			if(packetID == "JOIN"){
				this.makeClient(rinfo);
			}

		}

		//this.showClientList();

	}

	getKeyFromRinfo(rinfo){
		return rinfo.address + ":" + rinfo.port; 
	}

	lookupClient(rinfo){
		const key = this.getKeyFromRinfo(rinfo);
		return this.clients[key];
	}

	makeClient(rinfo){
		const key = this.getKeyFromRinfo(rinfo);
		const client = new Client(rinfo);

		//depending on scene (and other conditions) spawn pawn
		client.spawnPawn(this.game);

		this.clients[key] = client;



		this.showClientList();


		// TODO: sent CREATE replication packets for every object...
		const packet = this.game.makeREPL(false);
		this.sendPacketToClient(packet,client);// TODO: needs ACK!! 


		return client;

	}

	disconnectClient(client){
		//console.log("disconnect called");

		if(client.pawn) this.game.removeObject(client.pawn);
		const key = this.getKeyFromRinfo(client.rinfo);
		delete this.clients[key];

		this.showClientList();
	}

	showClientList(){
		console.log("======= "+Object.keys(this.clients).length + " =======") //this.clients.length will not work becuse our objects are refrenced via keys

		for (var key in this.clients) {
			console.log(key)
		}

	}

	getPlayer(num = 0){

		num = parseInt(num);
		let i = 0;
		for(var key in this.clients){
			if(num == i) return this.clients[key];
			return this.clients[num];
			i++;
		}

	}


	sendPacketToAll(packet){//<<<<<<<<<confusing name, more advanced programmers whould not use this
		/*this.clients.forEach(c=>{
			//this.sock.send(packet,0,packet.length,c.port,c.address,()=>{});

			sendPacketToClient(packet,c);
			
			});*/

		for(var key in this.clients){
			this.sendPacketToClient(packet, this.clients[key]);
		}




	}

	sendPacketToClient(packet,client){
		//console.log("sending Pakcet");
		this.sock.send(packet, 0, packet.length, client.rinfo.port, client.rinfo.address,()=>{});

	}

	update(game){
		for (let key in this.clients){
			this.clients[key].update(game);

		}

	}

}

/*
exports.Server = class Server {
	constructor(){

		this.clients = [];

		// create socket:
		this.sock = require("dgram").createSocket("udp4");

		// setup event-listeners:
		this.sock.on("error", (e)=>this.onError(e));
		this.sock.on("listening", ()=>this.onStartListen());
		this.sock.on("message", (msg,rinfo)=>this.onPacket(msg,rinfo));

		this.game = new Game(this);

		// start listening:
		this.port = 320;
		this.sock.bind(this.port);
	}
	onError(e){
		console.log("ERROR: "+e);
	}
	onStartListen(){
		console.log("Server is listening on port "+this.port);
	}
	onPacket(msg, rinfo){


		if(msg.length < 4) return;

		const packetID = msg.slice(0,4).toString();

		switch(packetID){
			case "JOIN":
				if(!this.doesClientExist(rinfo)) this.clients.push(rinfo);
				break;
		}

		//console.log("message received from "+rinfo.address+" : "+rinfo.port);
	}
	doesClientExist(rinfo){

		let value = false;

		this.clients.forEach(c=>{
			if(c.address == rinfo.addess && c.port == rinfo.port) value = true;
		});

		return value;
	}
	broadcastToConnectedClients(packet){

		this.clients.forEach(c=>{
			this.sock.send(packet, 0, packet.length, c.port, c.address, ()=>{});
		});
	}
}
*/