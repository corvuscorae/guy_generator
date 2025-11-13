class Slider{
  int level;
  float rotation = 0;
  PVector pos;

  private PVector center = new PVector(width/2, height/2);
  private int radius = 8;
  private float maxDist;  
  private float maxLevel;

  Slider(int l, float md, float ml, PVector p){
    level = l;
    maxDist = md;
    maxLevel = ml;
    pos = p;
  }
  
  void move(float dx, float dy){
    if(pos.x + dx < width && pos.y + dy < height){
      pos.x += dx;
      pos.y += dy;
      show();
    }
  }
  
  // mouse event
  void drag(PVector delta){
    PVector rotatedDelta = rotatePoint(delta, rotation);
    
    pos = pos.add(rotatedDelta);
    
    // got ChatGPT help on constraining to max:
    // https://chatgpt.com/share/68e5ebff-6410-8012-9985-8b676ab1a5ef
    // note: I have yet to get min-clamping (second question in convo) to work
    float dist = PVector.dist(pos, center);
    if (dist > maxDist) {
      // Move pos back onto circle edge
      PVector dir = PVector.sub(pos, center);
      dir.normalize();
      dir.mult(maxDist);
      pos = PVector.add(center, dir);
    } 
    
    // update level
    level = calculateLevel();
    show();
  }
  
  int calculateLevel(){
    int newLevel = (int)Math.abs(maxDist - dist(pos.x , pos.y, center.x, center.y));
    newLevel = (int)map(newLevel, 0, maxDist, maxLevel, 0);
    return newLevel;
  }

  
  void show(){
    push();
    pushMatrix();
    translate(pos.x, pos.y);
    rotate(rotation);
    noStroke();
    fill(0);
    ellipse(0, 0, radius, radius);
    popMatrix();
    pop();
  }
  
  Boolean near(PVector point){
    int threshold = 20;

    return (
      point.x <= (int)pos.x + threshold && 
      point.x >= (int)pos.x - threshold &&
      point.y <= (int)pos.y + threshold && 
      point.y >= (int)pos.y - threshold
    );
  }
}
