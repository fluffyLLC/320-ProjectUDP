


exports.AppHelper = class AppHelper{
	//TODO: refactor packet builder into AppHelper
	
	static _idCount = 0;

	static _fragID  = 0

	get nextPacketID(){//TODO:rename this to getNewPacketID
		//if(AppHelper._idCount >= 4294967295){//if we hit the UInt32 max num wrap teh value
			//console.log("reseting PacketID");
			//AppHelper._idCount = 0;
		//}
		//console.log("ID :" + AppHelper._idCount);
		return ++AppHelper._idCount;
	}

	get nextFragID(){//TODO:rename this to getNewPacketID
		if(AppHelper._fragID >= 255){//if we hit the UInt32 max num wrap teh value
			AppHelper._fragID = 0;
		}

		return ++AppHelper._fragID;
	}


	constructor(){
		//PacketBuilder.Singleton = this;
		//console.log(this.makeHeader("TEST",0));

		//this.test;

	}

	makeHeader(packetType,requiresResponse){
		let packet = Buffer.alloc(9);

		packet.write(packetType,0);
		packet.writeUInt8(requiresResponse,4);
		//console.log("packetID-1: " + this.nextPacketID);
		packet.writeUInt32BE(this.nextPacketID,5);


		return packet;
		
	}






}