class Voice{ 
  constructor(_g){ 
    this.g = _g; 
    this.fillers = tone; 
  }

  speak(categories, lines){
    let soliloquy = []
  
    while(soliloquy.length < lines){
      let category = categories[Math.floor(random(categories.length))];
      let message = messages[category];
      
      let level = this.g.getLevel(category);
      if(level == 0) continue;
      
      let intensity = message[this.levelToIntensity(level, this.g.range[1])];
      
      let line = intensity[Math.floor(random(intensity.length))];
      soliloquy.push(this.fillGrammarTemplate(line));
    }
    
    return soliloquy;
  }
  
  levelToIntensity(level, max){
    let div = (max / 3);

    // bottom third = "low"
    if(level <= div) return "low";
    
    // top third = "high"
    if(level > div*2) return "high";
    
    // mid third = "medium"
    return "medium";
  }
  
  getIDs(num, maxID){
    let ids = {}
    if(maxID < num){
      println(
        "getIDs() -- WARNING: maxID (" + maxID + ") less than " + 
        num + ". Returning " + maxID + " IDs."
      );
      
      num = maxID;
    }
    
    while(ids.length < num){
      ids.add(andom(maxID));
    }
    
    return ids;
  }
  
    // using a reworked version of a grammar handler from a past project of mine:
    // https://github.com/llwatkin/final-project/blob/main/js/lore/grammar_handling.js
    fillGrammarTemplate(template) {
        console.log(template)
        let slotPatternA = /\$(\w+\.\w+)/;

        while (template.match(slotPatternA)) {
            template = template.replace(
                slotPatternA, 
                (match, capture) => {
                    // captureGroup -> "noun.fear"
                    let parts = capture.split('.');

                    if (parts.length != 2){ 
                        return capture; // return unchanged if invalid
                    }
                    
                    let fillerKey = parts[0]; // "noun"
                    let param = parts[1];     // "fear"
                    
                    let options = this.fillers[fillerKey];
                    if (options == null || options.size === 0){ 
                        return capture;
                    }
                    let mood = [];
                    
                    // add param-specific options
                    let paramOptions = options[param];
                    if (paramOptions != null) mood.push(...paramOptions);

                    // add general options
                    let all = options["all"];  
                    if (all != null) mood.push(...all);
                    
                    if (mood.length == 0) mood.push(fillerKey + "." + param);
                    
                    let word = mood[Math.floor(random() * mood.length)];
                    return word;
                }
            );
        }
    
    
    //*** NEXT, look for ${A} patterns ***//
    // let slotPatternB = Pattern.compile("\\$(\\w+)");
    let slotPatternB = /\$(\w+)/;
    
    while (template.match(slotPatternB)) {
        template = template.replace(
            slotPatternB, 
            (match, capture) => {
                // captureGroup -> "noun"
                let fillerKey = capture; // "noun"
                let param = this.g.getHighLevelWorm();     // "fear"
                
                let options = this.fillers[fillerKey];
                if (options == null || options.size === 0) {
                    return capture;
                }
                
                let mood = [];
                
                // add param-specific options
                let paramOptions = options[param];
                if (paramOptions != null) mood.push(...paramOptions);
                
                // add general options
                let all = options["all"];  
                if (all != null) mood.push(...all);
                
                if (mood.length == 0) mood.push(fillerKey + "." + param);
                
                let word = mood[Math.floor(random() * mood.length)];
                return word;
            }
        ); 
    }

    
    //*** NEXT, look for words that need to be pluralized ***///
    let slotPatternP = /\{\s*(\w+)\s*:(\w+)\s*\}/;

    while (template.match(slotPatternP)) {
        template = template.replace(
            slotPatternP,
            (match, word, modifier) => {
                // match: "{ ghoul :s}"
                // word: "ghoul"
                // modifier: "s"
                
                let plural = pluralize(word);
                // plural = English.plural(plural);
                
                return plural;
            }
        );
    }
    
    //*** NEXT, look for words that need a/an before it ***///
    let slotPatternV = /\[\s*(\w+)\s*:(\w+)\s*\]/;

    while (template.match(slotPatternV)) {
    template = template.replace(
        slotPatternV,
        (match, word, modifier) => {
        // match: "[ eye :a]"
        // word: "eye"
        // modifier: "a"
        
        if (this.isVowel(word.charAt(0))) {
            // put "an" before it
            word = "an " + word;
        } else {
            // put "a" before it
            word = "a " + word;
        }
        
        return word;
        }
    );
    }
      
      return template;
    }
  
  
  toHashMap(data){
    let hm = {}
    
    let keys = data["CONFIG"]["keys"];
    for(let i = 0; i < keys.length; i++){
      let k = keys[i];
      let kVals = data[k];
      
      let nested = {}
      for(let worm of this.g.wormName){
        let arr = kVals[worm];
        if(arr == null) continue;  // worm not defined
        
        nested[worm] = this.toArrayList(arr);
      }
      
      // check for "all" keyword
      let arr = kVals["all"];
      if(arr != null){ nested["all"] = this.toArrayList(arr); }
      
      hm[k] = nested;
    }
    
    return hm;
  }

  toArrayList(ja){
    let al = []
    
    for(let i = 0; i < ja.length; i++){
      al.push(ja[i]);
    }
    
    return al;
  }
  
  isVowel(c){
    c = c.toLowerCase();
    return (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u');
  }
}
