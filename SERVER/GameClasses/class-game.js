const Render = require('./class-asciirender.js').Render;
const World = require('./class-world.js').World; 
const AppLayer = require('D:/320/320-ProjectUDP/SERVER/NetCode/class-applayer.js').AppLayer;

//const readline = require('readline');
//readline.emitKeypressEvents(process.stdin);
//process.stdin.setRawMode(true);



exports.Game = class Game {
	constructor(/*server*/){

		this.time = 0;
		this.dt = 16/1000;
		//this.server = server;
		this.world = new World();
		//this.ascii = new Render();

		//this.true = true;

		this.initalizeMap();


		this.update();

	}

	initalizeMap(){
		this.mapWidth = 2000; 
		this.mapHeight = 500; 
		//console.log(this.world.generateWorld(3,2));
		this.world.generateWorld(this.mapWidth,this.mapHeight);


	//	this.playerPos = {x:this.mapWidth/2,y:this.mapHeight/2};
	//	this.ascii.render(this.playerPos,this.world);
	//	this.rl = readline.createInterface(process.stdin);

	//	process.stdin.on('keypress', (chunk, key) => {
		//	this.handleKeyInput(key);

			//console.log("chunk: " + chunk + ", key: " + key.name);
			//console.log(this.rl.line);
		//});

	}

	update(){//Do I need an update in the map class?
		//console.log("generating");
		this.time += this.dt;
		//this.ascii.render(this.playerPos,this.world);

		setTimeout(()=>this.update(), 16);
	}


	handleKeyInput(key){
		//console.log(key.name);



		switch(key.name){
			case "w":
			case "up":
				if(this.playerPos.y <=0){
					this.playerPos.y = 0;
				}else{
					this.playerPos.y--;
				}
				//console.log(this.playerPos.x);
			break;
			
			case "s":
			case "down":
				if(this.playerPos.y >= this.mapHeight-1){
					this.playerPos.y = this.mapHeight-1;
				}else{
					this.playerPos.y++;
				}
				//console.log(this.playerPos.x);
			break;
			
			case "a":
			case "left":
				if(this.playerPos.x <= 0){
					this.playerPos.x = 0;
				}else{
					this.playerPos.x--;
				}
			//console.log(this.playerPos.y);
			break;

			case "d":
			case "right":
				if(this.playerPos.x >= this.mapWidth-1){
					this.playerPos.x = this.mapWidth-1;
				}else{
					this.playerPos.x++;
				}
			//console.log(this.playerPos.y);
			break;
			default:
				//console.log("key name not recognised");
			break;


		}


	}
}