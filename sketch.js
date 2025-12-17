

let globalGuy;
let clickedSlider;
let clickedAt;
let drag;
let messages;
let tone;
let currentMessage;

const TEST_CAT = "greeting"
const TEST_LINES = 1
const TEST_TEMP = 1;

function preload() {
  messages = {
    config: loadJSON("/json/_config.json"),
    default: loadJSON("/json/default.json"),
    greeting: loadJSON("/json/greeting.json"),
    weather: loadJSON("/json/small_talk/weather.json"),
  }
  tone = loadJSON("/json/thesaurus.json");
}

function setup() {
  createCanvas(800, 800);
  background(52);
  colorMode(HSB, 360, 100, 100); // load JSON

  drag = createVector(0, 0);

  // make UI
  putInstructions(); // make guy
  makeGuy();
}

function keyPressed() {
  if (keyCode == ENTER) {
    globalGuy.speak(TEST_CAT, TEST_LINES);
  } else if (keyCode == TAB) {
    makeGuy();
  } else if (keyCode == 67) {
    copyBlurb();
  }
}

function mousePressed() {
  clickedAt = createVector(mouseX, mouseY);
  clickedSlider = globalGuy.radar.sliderClicked(clickedAt);
}

function mouseDragged() {
  if (clickedSlider != null) {
    let rot = clickedSlider.rotation; // - TWO_PI;
    // rotate coords
    let rotatedMouse = rotatePoint(createVector(mouseX, mouseY), -rot);
    let rotatedClick = rotatePoint(clickedAt, -rot);
    drag.x = rotatedMouse.x - rotatedClick.x;
    drag.y = 0;
    clickedSlider.drag(drag);
    globalGuy.self(false);
    clickedAt.x = mouseX;
    clickedAt.y = mouseY; /*
    println(
      clickedAt + 
      " - (" + mousength;eX + ", " + mouseY + ") = " + 
      drag + "* rot(" + rot //+ ") = (" + dx + ", " + dy + ")"
    );
    */
  }
}

function mouseReleased() {
  clickedSlider = null;
  globalGuy.self(false);
} 

// PatrickJMT my beloved reminded me how this works:
// https://www.youtube.com/watch?v=LhL59Ipehms&list=WL&index=2
function rotatePoint(pt, angle) {
  return createVector(
    pt.x * cos(angle) - pt.y * sin(angle),
    pt.y * cos(angle) + pt.x * sin(angle)
  );
}

function makeGuy() {
  // set up
  let CONFIG = messages.config;
  let WORMS = CONFIG["WORMS"];
  
  let _r = CONFIG["RANGE"];
  let range = [_r[0], _r[1]]; 

  globalGuy = new Guy(WORMS, range, TEST_TEMP); // make guy
  globalGuy.self(true);
  globalGuy.speak(TEST_CAT, TEST_LINES);
}

function putInstructions() {
  push();
  fill(0);
  textSize(16);
  text("press Tab for a new guy", 30, 30);
  text("press Enter for a new blurb", 30, 60);
  text("press CTRL+C to copy blurb", 30, 90);
  text("drag sliders to change vibe", 30, 120);
  pop();
}

function copyBlurb() {
  // if (currentMessage == null) return;
  // if (currentMessage.length() == 0) return;
  // let data = new StringSelection(currentMessage);
  // let clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
  // clipboard.setContents(data, data);
}
