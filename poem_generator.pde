// TODO
// - finish grammars, adding tone slots
//       > left to do: "whimsy", "demons", "raincloud", "stargazing"
// - fix patterns so we can use { :s} and { :a} (instead of [ :a])
// - maybe add a < $pronoun :be> that can put the right verb for "i am", "he is" "they are" etc
// - add grammar annotations to force or forbid repetiton
// - add grammar annotions to support mulitple slot names (like $noun|adjective would choose from the $noun list or the $adj list)
// - expand happy slots in tone_words.json to have worm-specific values!!!

import java.util.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.datatransfer.*;
import javax.swing.*;
import java.io.*;

Guy globalGuy;
Slider clickedSlider;
PVector clickedAt;
PVector drag = new PVector(0, 0);

JSONObject messages;
JSONObject tone; 

String currentMessage;

void setup(){
  size(800,800);
  background(52);
  colorMode(HSB, 360, 100, 100);
  
  // load JSON 
  messages = loadJSONObject("messages.json");
  tone = loadJSONObject("tone_words.json");
  
  // make UI
  putInstructions();

  // make guy
  makeGuy();
}

void draw(){}

void keyPressed() {
  if (keyCode == ENTER) {
    globalGuy.speak(5);
  } else if (keyCode == TAB){
    makeGuy();
  } else if(keyCode == 67){
    copyBlurb();
  }
}

void mousePressed(){
  clickedAt = new PVector(mouseX, mouseY);
  clickedSlider = globalGuy.radar.sliderClicked(clickedAt);
}

void mouseDragged(){
  if(clickedSlider != null){
    float rot = clickedSlider.rotation;// - TWO_PI;

    // rotate coords
    PVector rotatedMouse = rotatePoint(new PVector(mouseX, mouseY), -rot);
    PVector rotatedClick = rotatePoint(clickedAt, -rot);
    
    drag.x = rotatedMouse.x - rotatedClick.x;
    drag.y = 0;
    
    clickedSlider.drag(drag);
    globalGuy.self(false);
    
    clickedAt.x = mouseX;
    clickedAt.y = mouseY;
    /*
    println(
      clickedAt + 
      " - (" + mouseX + ", " + mouseY + ") = " + 
      drag + "* rot(" + rot //+ ") = (" + dx + ", " + dy + ")"
    );
    */
  }
}

void mouseReleased(){
  clickedSlider = null;
  globalGuy.self(false);
}

// PatrickJMT my beloved reminded me how this works:
// https://www.youtube.com/watch?v=LhL59Ipehms&list=WL&index=2
PVector rotatePoint(PVector pt, float angle){
    return new PVector(
      pt.x * cos(angle) - pt.y * sin(angle),
      pt.y * cos(angle) + pt.x * sin(angle)    
    );
}

void makeGuy(){
  // set up
  JSONObject CONFIG = messages.getJSONObject("CONFIG");
  JSONArray _WORMS = CONFIG.getJSONArray("WORMS");
  ArrayList<String> WORMS = new ArrayList<>();
  for(int i = 0; i < _WORMS.size(); i++){
    WORMS.add(_WORMS.getString(i));
  }
  JSONArray _range = CONFIG.getJSONArray("RANGE");
  int[] range = {_range.getInt(0), _range.getInt(1)};

  // make guy
  globalGuy = new Guy(WORMS, range);
  globalGuy.self(true);
  globalGuy.speak(5);
}

void putInstructions(){
  textSize(16);
  text("press Tab for a new guy", 30, 30);
  text("press Enter for a new blurb", 30, 60);
  text("press CTRL+C to copy blurb", 30, 90);
  text("drag sliders to change vibe", 30, 120);
}

void copyBlurb(){
  if(currentMessage == null) return;
  if(currentMessage.length() == 0) return;
  
  StringSelection data = new StringSelection(currentMessage);
  Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
  clipboard.setContents(data, data);
}
