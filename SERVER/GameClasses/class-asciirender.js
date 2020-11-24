//const tty = require('tty');

exports.Render = class Render{
	constructor(){
		this.width;
		this.height;
		this.playerPosPrev = {x:0,y:0};
		this.edges = {tcx:0,tcy:0,bcx:0,bcx:0};
		this.center = {x:0,y:0};
		this.resize();

		process.stdout.on('resize',()=>this.resize());
	}	

//char code for player:9786:☺

	resize(){
		//console.log('screen size has changed!');
 		//console.log(`${process.stdout.columns}x${process.stdout.rows}`);
 		//if()
 		console.log("resize");
 		this.width = process.stdout.columns;
 		this.height = process.stdout.rows-1;
 		this.center.x = this.width/2;
 		this.center.y = this.height/2;

	}

	render(playerPos,map){
		console.clear();
		var screen = "";

		if(playerPos != this.playerPosPrev){
			this.calcEdges(playerPos,map);
		}
		//console.log(map.width);
		//console.log(playerPos.x);
		//console.log(this.edges.tcx);
		for(var y = this.edges.tcy; y < this.edges.tcy + this.height; y++){
			for (var x = this.edges.tcx; x < this.edges.tcx + this.width; x++) {

				if(x == playerPos.x && y == playerPos.y){
					screen += String.fromCharCode(9786);
				}else{
					screen += map.terrain[y][x];
				}


			}
		}
		//console.log(playerPos + "rendering");
		console.log(screen);

	}

	calcEdges(playerPos,map){
		this.edges.tcx = Math.floor(playerPos.x - (this.width/2));
		this.edges.tcy = Math.floor(playerPos.y - (this.height/2));

		//this.edges.bcx = playerPos.x + (this.width/2);
		//this.edges.bcy = playerPos.y + (this.height/2);

		if(this.edges.tcx < 0){//catch null refrence errors and clamp map rendering to the edges of the world
			this.edges.tcx = 0;
		}else if(this.edges.tcx + this.width > map.width){
			this.edges.tcx = map.width - this.width;
		}

		if(this.edges.tcy < 0){
			this.edges.tcy = 0;
		}else if(this.edges.tcy + this.height > map.height){
			this.edges.tcy = map.height - this.height;
		}

/*
		if(this.edges.bcx < 0){
			this.edges.bcx = 0;
		}else if(this.edges.bcx > map.width){
			this.edges.bcx = map.width;
		}

		if(this.edges.bcy < 0){
			this.edges.bcy = 0;
		}else if(this.edges.bcy > map.height){
			this.edges.bcy = map.height;
		}
*/




	}


}