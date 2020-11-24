const Render = require('./GameClasses/class-asciirender.js').Render;
const World = require('./GameClasses/class-world.js').World; 

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);



exports.Game = class Game {
	constructor(server){

		this.time = 0;
		this.dt = 16/1000;
		this.server = server;
		this.world = new World();
		this.ascii = new Render();

		this.true = true;

		this.initalizeMap();


		this.update();

	}

	initalizeMap(){
		this.mapWidth = 2000;
		this.mapHeight = 500; 
		//console.log(this.world.generateWorld(3,2));
		this.world.generateWorld(this.mapWidth,this.mapHeight);


		this.playerPos = {x:this.mapWidth/2,y:this.mapHeight/2};
		//this.ascii.render(this.playerPos,this.world);
		this.rl = readline.createInterface(process.stdin);

		process.stdin.on('keypress', (chunk, key) => {
			this.handleKeyInput(key);

			//console.log("chunk: " + chunk + ", key: " + key.name);
			//console.log(this.rl.line);
		});

	}

	update(){

		this.time += this.dt;

		
		this.ascii.render(this.playerPos,this.world);

		








		//console.log("getfucked");

		//console.clear();
		//this.screen += this.screen;
		//for (var i = 0; i < this.screenDepth; i++) {
		//console.log(this.screen);
		//}
		//console.log(process.stdout.isTTY);
		
		//console.log("\n" + tty.WriteStream);
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