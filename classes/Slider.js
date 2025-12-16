class Slider {
	constructor(l, md, ml, p) {
		this.level = l;
		this.rotation = 0;
		this.pos = p;

		this.center = createVector(width/2, height/2);
		this.radius = 8;
		this.maxDist = md;
		this.maxLevel = ml;
	}

	move(dx, dy) {
		if (this.pos.x + dx < width && this.pos.y + dy < height) {
			this.pos.x += dx;
			this.pos.y += dy;
			this.show();
		}
	}

	// mouse event
	drag(delta) {
		let rotatedDelta = rotatePoint(delta, this.rotation);
		this.pos = p5.Vector.add(this.pos, rotatedDelta); 
		let dir = p5.Vector.sub(this.pos, this.center);

		if(!this.inQuadrant(dir)){
			this.pos = this.center;
		}

		// got ChatGPT help on constraining to max (first query):
		// https://chatgpt.com/share/68e5ebff-6410-8012-9985-8b676ab1a5ef
		let dist = p5.Vector.dist(this.pos, this.center);
		if (dist > this.maxDist) {
			// move this.pos back onto circle edge
			dir.normalize();
			dir.mult(this.maxDist);
			this.pos = p5.Vector.add(this.center, dir);
		}

		// update level
		this.level = this.calculateLevel();
		this.show();
	}

	calculateLevel() {
		let newLevel = Math.abs(this.maxDist - dist(this.pos.x, this.pos.y, this.center.x, this.center.y));
		newLevel = map(newLevel, 0, this.maxDist, this.maxLevel, 0);
		return newLevel;
	}

	show() {
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.rotation);
		noStroke();
		fill(0);
		ellipse(0, 0, this.radius, this.radius);
		pop();
	}

	near(pt) {
		let threshold = 20;

		return (
			pt.x <= this.pos.x + threshold &&
			pt.x >= this.pos.x - threshold &&
			pt.y <= this.pos.y + threshold &&
			pt.y >= this.pos.y - threshold
		);
	}

	inQuadrant(dir){
		// bottom right
		if(this.rotation >= 0 && this.rotation < Math.PI / 2){
			if(dir.x >= 0 && dir.y >= 0) return true;
			else return false;
		}

		// bottom left
		if(this.rotation >= Math.PI / 2 && this.rotation < Math.PI){
			if(dir.x <= 0 && dir.y >= 0) return true;
			else return false;
		}

		// top left
		if(this.rotation >= Math.PI && this.rotation < 3 * Math.PI / 2){
			if(dir.x <= 0 && dir.y <= 0) return true;
			else return false;
		}

		// top right
		if(this.rotation >= 3 * Math.PI / 2 && this.rotation < 2 * Math.PI){
			if(dir.x >= 0 && dir.y <= 0) return true;
			else return false;
		}
	}
}