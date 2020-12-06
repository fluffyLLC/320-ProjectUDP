//I installed a vector class. type `npm install -g victor --save` to install, or the repo is in a zip in game the classes folder. Go to http://victorjs.org/ to learn more
const NetworkObj = require("./class-networkobject.js").NetworkObject;
//const Vector = require('victor');


exports.Player = class Player extends NetworkObj{
	constructor(){
		super();
		this.classID = "PLYR";

		this.pos = {x:0,y:0}
		this.Heath;

	}



}