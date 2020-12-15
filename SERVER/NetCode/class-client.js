//const NetworkObj = require("./GameClasses/class-networkobject.js").NetworkObject;
//const Game = require("./class-game.js").Game;
//const Pawn = require("./GameClasses/class-player.js").Player;
const AckList = require("./class-acklist.js").AckList;




exports.Client = class Client {//handles net code 


	static TIMEOUT = 8;


	constructor(rinfo){
		this.rinfo = rinfo;
		//this.
		this.ack = new AckList();
		
		/*
		this.input = {
			axisH:0,
			axisV:0,
		};*/

	}


	update(game){
		
	}


	onPacket(packet, game){//calle message in server
		//console.log("packetrecieved");
		
		//
		if(packet.length < 4) return; // ignore packet
		const packetID = packet.slice(0,4).toString();

		switch(packetID){
			
			case "INPT":
				//if(packet.length < 5) return;
				//this.input.axisH = packet.readInt8(4);

				//if(this.pawn) this.pawn.input = this.input;
				break;

			default:
			//console.log("ERROR: packetID not recognised");
		}
	}

}



/*
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
*/