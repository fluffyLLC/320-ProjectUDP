



/*
Ideas for packet infistructure 
1.) create a packet object that holds all the relevent data for a packet
2.) create a packet reciver/distributer ie. aplication layer packet hanlder 
3.) create a packet helper for hanleing repeticious packet building and similar tasks 

*/

exports.PacketBuilder = class PacketBuilder{//TODO:rename this to packet Helper

	static Singleton;

	static _idCount = 0;

	get packetID(){//TODO:rename this to getNewPacketID

		return ++PacketBuilder._idCount;
	}


	constructor(){
		PacketBuilder.Singleton = this;
		console.log(this.makeHeader("TEST",0));

		//this.test;

	}

	makeHeader(packetType,requiresResponse){
		let packet = Buffer.alloc(9);

		packet.write(packetType,0);
		packet.writeUInt8(requiresResponse,4);
		packet.writeUInt32BE(this.packetID,5);

		return packet;
		
	}





}

//let builder = new this.PacketBuilder();