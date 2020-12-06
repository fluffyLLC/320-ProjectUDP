const NetworkObj = require("./GameClasses/class-networkobject.js").NetworkObject;
const Game = require("./class-game.js").Game;
const Pawn = require("./GameClasses/class-player.js").Player;


exports.Client = class Client {

	static TIMEOUT = 8;

	constructor(rinfo){
		this.rinfo = rinfo;
		this.input = {
			axisH:0,
			axisV:0,

		};

		this.pawn = null;

		this.timeOfLastPacket = Game.Singleton.time;//mesured in seconds

	}

	spawnPawn(game){
		if(this.pawn) return; //if pawn exists do nothing
		//console.log("making client");

		this.pawn = new Pawn();
		game.spawnObject(this.pawn);

	}

	update(game){
		if(game.time > this.timeOfLastPacket + Client.TIMEOUT){
			
			// send a "KICK" packet to client // not yet in protocol

			//remove spawn (and send repl delete packts)
			game.server.disconnectClient(this);
			//remove client (self)


		}
	}

	onPacket(packet, game){//calle message in server
		//console.log("packetrecieved");

		this.timeSinceLastPacket = game.time;

		if(packet.length < 4) return; // ignore packet
		const packetID = packet.slice(0,4).toString();

		switch(packetID){
			
			case "INPT":

				if(packet.length < 5) return;
				this.input.axisH = packet.readInt8(4);

				if(this.pawn) this.pawn.input = this.input;

				break;

			default:
			console.log("ERROR: packetID not recognised");
		}
	}



}

exports.Client = class Client {

			constructor(socket, server){
			this.socket = socket;
			this.server = server;
			this.role = 0;
			this.username = "Unknown";

			this.buffer = Buffer.alloc(0);

			this.socket.on("error",e=>this.onError(e));
			this.socket.on("close",()=>this.onClose());
			this.socket.on("message",d=>this.onMessage(d));
		}

		onError(errmsg){
			console.log("ERROR:" + errmsg);

		}

		onClose(){
			this.server.onClientDisonnect(this);

		}

		onMessage(data){
			
			//console.log(this.buffer);
			console.log("data recived");

			if(this.buffer.length < 4) return; // not enough data

			const packetIdentifier = data.slice(0,4).toString();

			console.log("packet identifyer: " + packetIdentifier);

			switch(packetIdentifier){
				
				default:
					console.log("ERROR: packet identifyer not recognised (" +packetIdentifier+")");
					break;
			}
		}
		sendPacket(packet){
			console.log("sending packet: " + packet);
			this.socket.write(packet);
		}
}