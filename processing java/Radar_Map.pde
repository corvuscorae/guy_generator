class Radar {
  HashMap<String, Slider> worms;
  ArrayList<String> keys;
  private float radius;
  private int cx = width/2;
  private int cy = height/2;
  private int pts;
  private float angle;
  private int[] range;
  
  Radar(HashMap<String, Slider> _worms, ArrayList<String> _keys, int[] _range, float _radius){
    worms = _worms;
    keys = _keys;
    radius = _radius;
    range = _range;
    
    pts = worms.size();
    angle = TWO_PI / pts;
  }
  
  
  // radar map background
  void initRadar(){   
    // polgygon background
    push();
    beginShape();
    fill(360);
    stroke(0);
    for(float a = 0; a < TWO_PI; a += angle){
      float sx = cx + cos(a) * radius;
      float sy = cy + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape();
    pop();
    
    // grid
    for(float a = 0; a < TWO_PI; a += angle){
      float sx = cx + cos(a) * radius;
      float sy = cy + sin(a) * radius;
      color currentColor = color(360 / TWO_PI * a, 100, 100);
      
      // grid line
      push();
      stroke(currentColor);
      line(cx, cy, sx, sy);
      pop();
    }
  }
  
  void initLabels(){
    int it = 0;
    for(float a = 0; a < TWO_PI; a += angle){
      if(it < worms.size()){
        float sx = cx + cos(a) * radius;
        float sy = cy + sin(a) * radius;
        color currentColor = color(360 / TWO_PI * a, 100, 100);

        pushMatrix();
        translate(sx, sy);
        
        // chatGPT helped me with text rotation:
        // https://chatgpt.com/share/68e1a11d-712c-8012-b78a-81550b03f8fc
        float rot = a;
        int textTranslate = 1;
        if (a > HALF_PI && a < 3 * HALF_PI) {
          rot += PI; // flip text upright
          textTranslate *= -1;
        }
        rotate(rot);

        String name = keys.get(it); 
        float halfWidth = textWidth(name) / 2;
        
        fill(currentColor);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(name, textTranslate * halfWidth, -10);
        
        popMatrix();
        it++;
      }
    }
  }
  
  void mapValues(){
    push();
    fill(60, 50, 100);
    beginShape();
    
    int it = 0;
    for(float a = 0; a < TWO_PI; a += angle){
      String name = "BLANK";
      int w = 0;
      if(it < worms.size()){
        name = keys.get(it);
      } else {
        name = keys.get(0); // loop to beginning
      }
      w = worms.get(name).level;
      it++;
      
      float v = radius * w / range[1];
      
      float sx = cx + cos(a) * v;
      float sy = cy + sin(a) * v;
      
      vertex(sx, sy);
    }   
    endShape();
    pop();
  }
  
  void moveSliders(Boolean init){
    push();
    int it = 0;
    for(float a = 0; a < TWO_PI; a += angle){
      String name = "BLANK";
      int w = 0;
      if(it < worms.size()){
        name = keys.get(it);
      } else {
        break;
        //name = wormName.get(0); // loop to beginning
      }
      w = worms.get(name).level;
      it++;
      
      float v = radius * w / range[1];

      float sx = cx + cos(a) * v;
      float sy = cy + sin(a) * v;
      
      Slider s = worms.get(name);
      s.rotation = a;
      if(init) s.move(sx, sy);
      else s.show();
    }
    pop();
  }
  
  Slider sliderClicked(PVector point){
    for(String name : keys){
      Slider worm = worms.get(name);
      
      if(worm.near(point)) return worm;
    }
    
    return null;
  }
}
