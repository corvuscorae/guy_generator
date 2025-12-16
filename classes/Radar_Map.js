class Radar {
	constructor(_worms, _keys, _range, _radius) {
		this.cx = width / 2;
		this.cy = height / 2;
		this.worms = _worms;
		this.keys = _keys;
		this.radius = _radius;
		this.range = _range;

		let pts = Object.keys(this.worms).length;
		this.angle = TWO_PI / pts;
	}

	// radar map background
	initRadar() {
        let cx = this.cx
        let cy = this.cy
        let angle = this.angle

		// polgygon background
		push();
		fill(0,0,100);
		stroke(0);
		beginShape();
		for (let a = 0; a < TWO_PI; a += angle) {
			let sx = cx + cos(a) * this.radius;
			let sy = cy + sin(a) * this.radius;
			vertex(sx, sy);
		}
		endShape(CLOSE);
		pop();

		// grid
		for (let a = 0; a < TWO_PI; a += angle) {
			let sx = cx + cos(a) * this.radius;
			let sy = cy + sin(a) * this.radius;
			let currentColor = color(360 / TWO_PI * a, 100, 100);

			// grid line
			push();
			stroke(currentColor);
			line(cx, cy, sx, sy);
			pop();
		}
	}

	initLabels() {
        let cx = this.cx
        let cy = this.cy
        let angle = this.angle

		let it = 0;
		for (let a = 0; a < TWO_PI; a += angle) {
			if (it < Object.keys(this.worms).length) {
				let sx = cx + cos(a) * this.radius;
				let sy = cy + sin(a) * this.radius;
				let currentColor = color(360 / TWO_PI * a, 100, 100);

				push();
				translate(sx, sy);

				// chatGPT helped me with text rotation:
				// https://chatgpt.com/share/68e1a11d-712c-8012-b78a-81550b03f8fc
				let rot = a;
				let textTranslate = 1;
				if (a > HALF_PI && a < 3 * HALF_PI) {
					rot += PI; // flip text upright
					textTranslate *= -1;
				}
				rotate(rot);

				let name = this.keys[it];
				let halfWidth = textWidth(name) / 2 + 10;

				fill(currentColor);
				noStroke();
				textAlign(CENTER, CENTER);
				textSize(16);
				text(name, textTranslate * halfWidth, -10);

				pop();
				it++;
			}
		}
	}

	mapValues() {
        let cx = this.cx
        let cy = this.cy
        let angle = this.angle

		push();
		fill(60, 50, 100);
		noStroke();
		beginShape();

		let it = 0;
		for (let a = 0; a < TWO_PI; a += angle) {
			let name = "BLANK";
			let w = 0;
			if (it < Object.keys(this.worms).length) {
				name = this.keys[it];
			} else {
				name = this.keys[0]; // loop to beginning
			}
			w = this.worms[name].level;
			it++;

			let v = this.radius * w / this.range[1];

			let sx = cx + cos(a) * v;
			let sy = cy + sin(a) * v;

			vertex(sx, sy);
		}
		endShape(CLOSE);
		pop();
	}

	moveSliders(init) {
        let cx = this.cx
        let cy = this.cy
        let angle = this.angle

		push();
		let it = 0;
		for (let a = 0; a < TWO_PI; a += angle) {
			let name = "BLANK";
			let w = 0;
			if (it < Object.keys(this.worms).length) {
				name = this.keys[it];
			} else {
				break;
			}
			w = this.worms[name].level;
			it++;

			let v = this.radius * w / this.range[1];

			let sx = cx + cos(a) * v;
			let sy = cy + sin(a) * v;

			let s = this.worms[name];
			s.rotation = a;
			if (init) s.move(sx, sy);
			else s.show();
		}
		pop();
	}

	sliderClicked(point) {
		for (let name of this.keys) {
			let worm = this.worms[name];

			if (worm.near(point)) return worm;
		}

		return null;
	}
}