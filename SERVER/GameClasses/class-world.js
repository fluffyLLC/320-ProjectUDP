psMaker = require('./noisejs-master/perlin.js');


//psMaker.noise.seed(1);

exports.World = class World{

	constructor(){
		//console.log('constructing');
		this.width = 2000;
		this.height = 500;
		this.seed = Math.random();
		//Math.round
		//TODO: add 'map' property that contains a visual representation of the world
		this.terrain = [];
		/*process.stdout.on('resize',() => {
			console.clear();
			this.generateWorld();
		});*/
	}	

	generateWorld(width,height){
		if(width){
			this.width = width;
		}
		if(height){
			this.height = height;
		}


		psMaker.noise.seed(this.seed);
		/*
		if(process.stdout.isTTY){
			//console.log(isTTY);
			this.width = process.stdout.columns;
			this.height = process.stdout.rows;
		}
		*/
		this.generateTerrain();

	}

	generateTerrain(){
		//var terraintest = "\n";
		//var max = .1;
		//var min = .25;
		//var total = 0;
		//var itterations;

		for (var y = 0; y < this.height; y++) {

			this.terrain[y] = [];

			for (var x = 0; x < this.width; x++) {

				var value = Math.abs(psMaker.noise.simplex2((x/100.0) ,(y/100.0)));
				//var value = Math.abs(psMaker.noise.perlin2(x/100,y/100));
				//value = Math.pow(value,5);
				//value = Math.round(value);
				value = this.map(value,0,0.65,0,1);
				//itterations++;
				//total += value;
				//if(value > max) max = value;
				//if(value < min) min = value;

				this.handleTerrainVal(value,x,y);


				

				//if(value) 

				//console.log("OG: " + value + " Rounded: " + Math.round(value) );

				
			}
		}

		//console.log(`max: ${max}, min: ${min}, average: ${total/itterations}`)

		//console.log("\n" + terraintest);


	}

	map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

	handleTerrainVal(value,x,y){
	if(value > 0.7){

			this.terrain[y][x] = String.fromCharCode(9608); 
			//terraintest += String.fromCharCode(9608);//█

	 	}else if(value > 0.5){

			this.terrain[y][x] = String.fromCharCode(9619);
			//terraintest += String.fromCharCode(9619);//▓	

	 	}else if(value > 0.25){

			this.terrain[y][x] = String.fromCharCode(9618);
			//terraintest += String.fromCharCode(9618);//▒	

	 	}else{
	 		//console.log(value);
	 		this.terrain[y][x] = String.fromCharCode(9617);
			//terraintest += String.fromCharCode(9617);//░	
		}
	}
}

//const world = new this.World();

//world.generateWorld();