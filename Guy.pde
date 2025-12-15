class Guy{
  HashMap<String, Slider> worms = new HashMap<>();
  ArrayList<String> wormName = new ArrayList<>();// = new ArrayList<>(Arrays.asList("joy", "whimsy", "demons", "raincloud", "stargazing", "magma", "fear", "concrete"));
  int[] range = {0, 10};
  int radius = 200;
  
  private ArrayList<String> bigWorms = new ArrayList<>();
  private int highLevel = range[1] + 1;
  private Radar radar;
  private Voice voice;

  Guy(ArrayList<String> names, int[] _range){
    if(names != null && names.size() > 0) wormName = names;
    range = _range;

    initWormMap();
    
    voice = new Voice(this);
    radar = new Radar(worms, wormName, range, 200);
  }
  
  Guy(HashMap<String, Slider> w, int[] _range){
    worms = w;
    range = _range;
    
    wormName.clear();
    for(String n : w.keySet()){
      wormName.add(n);
    }
    
    voice = new Voice(this);
    radar = new Radar(worms, wormName, range, 200);
  }
  
  void speak(int lines){
    //LinkedHashSet<String> message = voice.speak(wormName, lines);
    
    // TEMP: just get the worms whose lines have been grammar-ed
    JSONObject CONFIG = messages.getJSONObject("CONFIG");
    JSONArray _gWORMS = CONFIG.getJSONArray("DYNAMO_WORMS");
    ArrayList<String> gWORMS = new ArrayList<>();
    for(int i = 0; i < _gWORMS.size(); i++){
    gWORMS.add(_gWORMS.getString(i));
  }
    LinkedHashSet<String> message = voice.speak(gWORMS, lines);
    
    // put message on screen
    String msg = "";
    for(String bar : message){
      msg += bar + ". ";
    }
    
    push();
    fill(25);
    rect(30, height - 100, width - 60, 100);
    fill(255);
    text(msg, 45, height - 110, width - 90, 100);  // Text wraps within text box
    pop();
    
    currentMessage = msg; // update global message var
    println(msg);
  }
  
  int getLevel(String name){
    return worms.get(name).level;
  }
  
  void initWormMap(){
    for(int i = 0; i < wormName.size(); i++){
      String worm = wormName.get(i);
      int val = (int)random(range[0], range[1]);
      Slider s = new Slider(val, radius, range[1], new PVector(0,0));
      worms.put(worm, s);
    }
  }
  
  void self(Boolean firstInit){
    //printMe();

    radar.initRadar();
    if(firstInit) radar.initLabels();
    radar.mapValues();
    radar.moveSliders(firstInit);
  }

  void printMe(){
    for(String name : wormName){
      Slider worm = worms.get(name);
      
      println(name + ": " + worm.level);
    }
  }
  
  String getHighLevelWorm(){
    while(bigWorms.size() < 2){
      highLevel--;
      
      // fill bigWorms
      for(String name : wormName){
        int wormLevel = worms.get(name).level;
        
        if(wormLevel >= highLevel) bigWorms.add(name);
      }
    }
    //println(bigWorms);
    return bigWorms.get((int)random(bigWorms.size()));
  }
}
