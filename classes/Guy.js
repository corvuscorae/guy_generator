class Guy {
	constructor(names, range, temperature){
		this.worms = {};
		this.wormName = names;
		this.range = (range) ? range : [0 ,10]
		this.radius = 200;
	
		this.radar = null;
		this.voice = null;

		// how wild is this guy. 
		// higher temperature => single statements draw from more high-level worms
		// so a joyful, angry person will say things that encasulate that entire range of worms
		// lower temp will have more grounded statements; statements are only angry or only joyful
		this.temperature = Math.min(temperature, this.range[1]) || 2;
		
		this.initWormMap();
		
		this.voice = new Voice(this, messages);
		this.radar = new Radar(this.worms, this.wormName, this.range, 200);
	}

	speak(type, lines) {
		let message = this.voice.speak(type, lines);

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

	getHighLevelWorms(poolSize) {
		if(!poolSize || poolSize === 0) return null;

		let bigWorms = [];
		let highLevel = this.range[1] + 1;

		while (bigWorms.length < poolSize && highLevel > this.range[1] / 2) {
			highLevel--;

			// fill bigWorms
			for (let name of this.wormName) {
				let wormLevel = this.worms[name].level;
				if (wormLevel >= highLevel) {
					bigWorms.push(name);
					if(bigWorms.length === poolSize) break;
				}
			}
		}

		if(bigWorms.length === 0) return null;

		//console.log(bigWorms);
		return bigWorms;
	}
}