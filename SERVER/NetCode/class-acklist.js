



exports.AckList = class AckList{//I might want to move a lot of this functionality back out to the appLayer so that I can doe things ore inteligently. ie keep this as assisted storage rather than as a handler

	constructor(){
		this.ackPacketsByID = [];
		this.ackPacketsByOrder = [];
		//this.fragGroups = [];

		
	}//TODO: add a timeout 

	ackPacket(msg){//this low key sucks, but I think that it should work for now
		if(msg.length <8) return;//check that we have all of the info

		let packetID = msg.readUInt32BE(4);
		//console.log("packetID: " + packetID);
		let isFrag = false;
		if(msg.length <= 12) isFrag = true;


		let packet = this.ackPacketsByID[packetID.toString()];//get the acked packet from it's key
		//console.log("acked packet: " + packet);

		if(!packet) return;//packet is not currently stored, ie. it probably already went through ack

		delete this.ackPacketsByID[packetID.toString()];//remove the acked packet

		var index = this.ackPacketsByOrder.indexOf(packet);//get the index of the acked packet
		//console.log("index: " + index);
		//console.log("isFrag: " + isFrag);

		if(index == 0){//things are being ack'd in the correct order 
			this.ackPacketsByOrder.splice(0,1);//remove the ack
			if(isFrag && this.ackPacketsByOrder.length > 1) return this.ackPacketsByOrder[0];//if it is a frag ack, send the next frag
			return;
		}else{//things are not being acked int eh correct order
			this.ackPacketsByOrder.splice(index,1); //remove acked packet
			return this.ackPacketsByOrder[0];//resend the most pressing ack
		}
	}

	addAck(packet){//add an ack packet at the end of the ack packet array.
		//console.log("adding packet " + packet + "\n");
		let key = packet.readUInt32BE(5).toString();
		//console.log("PaCketKy: " + key + " for " + packet);
		this.ackPacketsByOrder.push(packet);//put the poacket at the end of the ack array
		this.ackPacketsByID[key] = packet;//key the packet with it's packet ID as the key 
		//console.log(this.ackPacketsByID[key]);
	}

	storeFrag(frag,packet){
		//console.log("storing frags " + frag.length);

		for(var i = 0; i < frag.length;i++){
			//console.log("frag "+ i+ " going in: " + frag[i]);
			this.addAck(frag[i]);
		}

		this.addAck(packet);
		
		/*let fragObj = {acked:false};//each frag object starts knowing that it has not been registered
		let frags = [];
		let fragID = frag[i].readUInt8(9);

		for(let i = 0; i <= frag.length;i++){
			let packetID = frag[i].readUInt32BE(5);

			frags[packetID] = new fragObj;
			frags[packetID].frag = frag[i];


		}*/
	}

}//end class