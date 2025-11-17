class Guy {
	constructor(names, range){
		this.worms = {};
		this.wormName = names;
		this.range = (range) ? range : [0 ,10]
		this.radius = 200;
	
		this.bigWorms = []
		this.highLevel = this.range[1] + 1;
		this.radar = null;
		this.voice = null;
		
		this.initWormMap();
		
		this.voice = new Voice(this);
		this.radar = new Radar(this.worms, this.wormName, this.range, 200);
	}

	speak(lines) {
		// TEMP: just get the worms whose lines have been grammar-ed
		let CONFIG = messages["CONFIG"];
		let _gWORMS = CONFIG["DYNAMO_WORMS"];
		let gWORMS = []
		for (let i = 0; i < _gWORMS.length; i++) {
			gWORMS.push(_gWORMS[i]);
		}
		let message = this.voice.speak(gWORMS, lines);

        // put message on screen
		let msg = "";
		for (let bar of message) {
			msg += bar + ". ";
		}

		push();
		fill(25);
		rect(30, height - 100, width - 60, 100);
		fill(255);
        textSize(14)
		text(msg, 45, height - 90, width - 90, 100); // Text wraps within text box
		pop();

		currentMessage = msg; // update global message var
		console.log(msg);
	}

	getLevel(name) {
		return this.worms[name].level;
	}

	initWormMap() {
		for (let i = 0; i < this.wormName.length; i++) {
			let worm = this.wormName[i];
			let val = random(this.range[0], this.range[1]);
			let s = new Slider(val, this.radius, this.range[1], createVector(0, 0));
			this.worms[worm] = s;
		}
	}

	self(firstInit) {
		//this.printMe();
		this.radar.initRadar();
		if (firstInit) this.radar.initLabels();
		this.radar.mapValues();
		this.radar.moveSliders(firstInit);
	}

	printMe() {
		for (let name of this.wormName) {
			let worm = this.worms[name];

			console.log(name + ": " + worm.level);
		}
	}

	getHighLevelWorm() {
		while (this.bigWorms.length < 2) {
			this.highLevel--;

			// fill this.bigWorms
			for (let name of this.wormName) {
				let wormLevel = this.worms[name].level;

				if (wormLevel >= this.highLevel) this.bigWorms.push(name);
			}
		}
		//console.log(this.bigWorms);
		return this.bigWorms[Math.floor(random(this.bigWorms.length))];
	}
}