const AppHelper = require("./class-apphelper.js").AppHelper;
const PHelper = new AppHelper();
/*
let limit = 1000;
let info = Math.floor(8000 + (Math.random()*1000));

console.log(`Packet number is ${Math.ceil(info/limit)}`);
*/


//sending should be done through the app layer and all reciving shuold come throught ht eapp layer
exports.AppLayer = class AppLayer{

	static Singleton;

	static _MTU = 1000;//the MTU should be publicly available but not editable

	get mtu(){

		return AppLayer._MTU;
	}
	//static Server; //???? should the server be static?

	constructor(server){
		this.server = server;
		AppLayer.Singleton = this;

		//this.appHelper = new super();//.AppHelper();
		//console.log(this.mtu);
		//TODO: send packets in a buffer

		//this.

	}
	



	handlePacketRecived(msg,rinfo){
		if(msg.length < 4) return;

		const packetID = msg.slice(0,4).toString();

		const c = this.server.lookupClient(rinfo);

		if(c) {
			//console.log("client exists")
			if(packetID == "ACKN"){
				//console.log(`packet ${msg.readUInt32BE(4)} Acknowleged`);
				let unagnowleged = c.ack.ackPacket(msg);
				//console.log("ack response " + unagnowleged);
				if(unagnowleged){
					//console.log("responding to Ack");
					this.sendPacketToClientNoAckCheck(unagnowleged,c);

				}


			}else{
				
				c.onPacket(msg,this.game);
			}

		} else {
			if(packetID == "JOIN"){
				this.server.makeClient(rinfo);
			}
		}
	}//On Packet Recived


	sendPacketToClientNoAckCheck(packet,client){
		this.server.sendPacketToClient(packet,client);
	}



	sendPacketToClient(packet,client){//TODO: unify vernacular. specifically the term packet and message
		
		if(packet.length > this.mtu){
			packet.writeUInt8(1,4);//this packet will now require ack

			let fragPackets = this.fragPacket(packet); //fragment the packet
			client.ack.storeFrag(fragPackets,packet);

			packet = fragPackets[0];//send the first frag packet

		}else if(packet.readUInt8(4) == 1){

			client.addAck(packet);

		}


		this.server.sendPacketToClient(packet,client);
	}



	sendPacketToAll(packet){

		this.server.sendPacketToAll(packet);
	}


	fragPacket(packet){//fragments an incomin packet
		console.log("packet length: " + packet.length);
		const packetLength = packet.length;
		const fragHLength = 18;
		const maxPacketBytes = this.mtu - fragHLength;
		const fragNum = Math.ceil(packet.length/(maxPacketBytes));//figure out how many frag packets we need to make
		//console.log("fragNum: " + fragNum)
		let frags = [];
		//const packetID = packet.
		const fragID = PHelper.nextFragID;	


		for(var i = 0; i < fragNum;i++ ){
			const imax = i*maxPacketBytes;

			let contentsSize = (i == fragNum-1)? packet.length - imax : maxPacketBytes;

			let fragContents = Buffer.alloc(contentsSize);//????
			let dataLength = packet.copy(fragContents,0,imax,imax+maxPacketBytes);//????
			//console.log(i+".) is "+ fragContents.length + " long and contains: \n"  +fragContents);


			let header;

			if(i == 0){
				console.log("packet length: " + packet.length);
				header = this.makeFragHeader(fragID,i+1,packetLength,dataLength);
			} else{
				header = this.makeFragHeader(fragID,i+1,imax,dataLength);
			}

			 

			frags[i] = Buffer.concat([header,fragContents]);

			//console.log(frags[i]);
		}



		return frags;

	}

	makeFragHeader(fragID,fragOrder,totalOffset,bytesSent){
		let baseheader = PHelper.makeHeader("FRAG",1);
		//console.log(totalOffset);

		let fragInfo = Buffer.alloc(9);

		fragInfo.writeUInt8(fragID,0);//which frag sequence does this frag packet belong to
		fragInfo.writeUInt16BE(fragOrder,1);//this frag packet's sequence number(ie. 1st,2nd,3rd...ect)
		fragInfo.writeUInt32BE(totalOffset,3);//the total number of bytes occupied by the frag packet, or the offset of this frag packet
		fragInfo.writeUInt16BE(bytesSent,7);//the number of bytes that will be sent by this packet


		return Buffer.concat([baseheader,fragInfo]);
	}





}//end app layer


/*
let appLayer = new this.AppLayer(null);//test code 
let nums = [];
for(let i = 0;i < 3000;i++){
	nums[i] = Math.floor(Math.random()*253);
}

let bsFragPacket = Buffer.from(nums);



appLayer.fragPacket(bsFragPacket);

*/
