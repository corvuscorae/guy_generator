import org.atteo.evo.inflector.English;
import java.util.regex.*;

class Voice{ 
  Guy g;
  HashMap<String, HashMap<String, ArrayList<String>>> fillers;
  

  Voice(Guy _g){ 
    g = _g; 
    fillers = toHashMap(tone); 
  }

  LinkedHashSet<String> speak(ArrayList<String> categories, int lines){
    LinkedHashSet<String> soliloquy = new LinkedHashSet<String>();
  
    while(soliloquy.size() < lines){
      String category = categories.get((int)random(categories.size()));
      JSONObject message = messages.getJSONObject(category);
      
      int level = g.getLevel(category);
      if(level == 0) continue;
      
      JSONArray intensity = message.getJSONArray(levelToIntensity(level, g.range[1]));
      
      String line = intensity.getString((int)random(intensity.size()));
      soliloquy.add(fillGrammarTemplate(line));
    }
    
    return soliloquy;
  }
  
  String levelToIntensity(int level, int max){
    int div = (int)(max / 3);

    // bottom third = "low"
    if(level <= div) return "low";
    
    // top third = "high"
    if(level > div*2) return "high";
    
    // mid third = "medium"
    return "medium";
  }
  
  LinkedHashSet<Integer> getIDs(int num, int maxID){
    LinkedHashSet<Integer> ids = new LinkedHashSet<Integer>();
    if(maxID < num){
      println(
        "getIDs() -- WARNING: maxID (" + maxID + ") less than " + 
        num + ". Returning " + maxID + " IDs."
      );
      
      num = maxID;
    }
    
    while(ids.size() < num){
      ids.add((int)random(maxID));
    }
    
    return ids;
  }
  
  // using a reworked version of a grammar handler from a past project of mine:
  // https://github.com/llwatkin/final-project/blob/main/js/lore/grammar_handling.js
  // got help from chatGPT to convert to processing/java:
  // https://chatgpt.com/share/68e5eb14-e358-8012-8622-cbcdc226293f
  String fillGrammarTemplate(String template) {
    //*** FIRST, look for ${A}.{B} patterns ***/
    // note: this allows us to force some tonality in our grammars, 
    //   as opposed to having completely random tone words
    Pattern slotPatternA = Pattern.compile("\\$(\\w+\\.\\w+)");
    Matcher matcherA = slotPatternA.matcher(template);
    
    while (matcherA.find()) {
      //println("**GRAMMAR: filling type A");
      String match = matcherA.group(1); // e.g. "noun.fear"
      String[] parts = match.split("\\.");
      if (parts.length != 2) continue;
  
      String fillerKey = parts[0]; // "noun"
      String param = parts[1];     // "fear"
      
      HashMap<String, ArrayList<String>> options = fillers.get(fillerKey);
      if (options == null || options.isEmpty()) continue;
      
      ArrayList<String> mood = new ArrayList<String>();
      
      // add param-specific options
      ArrayList<String> paramOptions = options.get(param);
      if(paramOptions != null) mood.addAll(paramOptions);
      
      // add general options
      ArrayList<String> all = options.get("all");  
      if(all != null) mood.addAll(all);

      if(mood.size() == 0) mood.add(fillerKey + "." + param);
      String word = mood.get((int)random(mood.size()));
  
      // Replace first occurrence and reset matcher
      template = matcherA.replaceFirst(Matcher.quoteReplacement(word));
      matcherA = slotPatternA.matcher(template);
    }
    
    //*** NEXT, look for ${A} patterns ***//
    Pattern slotPatternB = Pattern.compile("\\$(\\w+)");
    Matcher matcherB = slotPatternB.matcher(template);
    
    while (matcherB.find()) {
      //println("**GRAMMAR: filling type B"); //<>//
      String fillerKey = matcherB.group(1); // e.g. "noun"
  
      String param = g.getHighLevelWorm();  // e.g. "joy"
      
      HashMap<String, ArrayList<String>> options = fillers.get(fillerKey);
      if (options == null || options.isEmpty()) continue;
      
      ArrayList<String> mood = new ArrayList<String>();
      
      // add param-specific options
      ArrayList<String> paramOptions = options.get(param);
      if(paramOptions != null) mood.addAll(paramOptions);
      
      // add general options
      ArrayList<String> all = options.get("all");  
      if(all != null) mood.addAll(all);
      
      if(mood.size() == 0) mood.add(fillerKey + "." + param);
      String word = mood.get((int)random(mood.size()));
  
      // Replace first occurrence and reset matcher
      template = matcherB.replaceFirst(Matcher.quoteReplacement(word));
      matcherB = slotPatternB.matcher(template);
    }
    
    //*** NEXT, look for words that need to be pluralized ***///
    Pattern slotPatternP = Pattern.compile("\\{\\s*(\\w+)\\s*:(\\w+)\\s*\\}");
    Matcher matcherP = slotPatternP.matcher(template);
    
    while (matcherP.find()) {
      //println("**GRAMMAR: pluralizing");
      String pluralize = matcherP.group(1); // e.g. "{ ghoul :s}" --> ghoul
      pluralize = English.plural(pluralize);
      
      // Replace first occurrence and reset matcher
      template = matcherP.replaceFirst(Matcher.quoteReplacement(pluralize));
      matcherP = slotPatternP.matcher(template);
    }
    
    //*** NEXT, look for words that need a/an before it ***///
    Pattern slotPatternV = Pattern.compile("\\[\\s*(\\w+)\\s*:(\\w+)\\a*\\]");
    Matcher matcherV = slotPatternV.matcher(template);
    
    while (matcherV.find()) {
      //println("**GRAMMAR: placing a/an");
      String word = matcherV.group(1); // e.g. "{ eye :a}" --> eye
      
      if(isVowel(word.charAt(0))){
        // put "an" before it
        word = "an " + word;
      } else {
        // put "a" before it
        word = "a " + word;
      }
       
      // Replace first occurrence and reset matcher
      template = matcherV.replaceFirst(Matcher.quoteReplacement(word));
      matcherP = slotPatternV.matcher(template);
    }
      
      return template;
    }
  
  
  HashMap<String, HashMap<String, ArrayList<String>>> toHashMap(JSONObject data){
    HashMap<String, HashMap<String, ArrayList<String>>> hm = new HashMap<String, HashMap<String, ArrayList<String>>>();
    
    JSONArray keys = data.getJSONObject("CONFIG").getJSONArray("keys");
    for(int i = 0; i < keys.size(); i++){
      String k = keys.getString(i);
      JSONObject kVals = data.getJSONObject(k);
      
      HashMap<String, ArrayList<String>> nested = new HashMap<String, ArrayList<String>>();
      for(String worm : g.wormName){
        JSONArray arr = kVals.getJSONArray(worm);
        if(arr == null) continue;  // worm not defined
        
        nested.put(worm, toArrayList(arr));
      }
      
      // check for "all" keyword
      JSONArray arr = kVals.getJSONArray("all");
      if(arr != null){ nested.put("all", toArrayList(arr)); }
      
      hm.put(k, nested);
    }
    
    return hm;
  }

  ArrayList<String> toArrayList(JSONArray ja){
    ArrayList<String> al = new ArrayList<String>();
    
    for(int i = 0; i < ja.size(); i++){
      al.add(ja.getString(i));
    }
    
    return al;
  }
  
  Boolean isVowel(char c){
    c = Character.toLowerCase(c);
    return (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u');
  }
}
