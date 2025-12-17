class Voice {
  constructor(_g) {
    this.g = _g;
  }

  speak(json, lines) {
    // pick a base
    let soliloquy = [];

    while (soliloquy.length < lines) {
      const base = random(json.base);
      soliloquy.push(this.fillGrammarTemplate(base, json));
    }

    return soliloquy;
  }

  levelToIntensity(level, max) {
    let div = max / 3;

    // bottom third = "low"
    if (level <= div) return "low";

    // top third = "high"
    if (level > div * 2) return "high";

    // mid third = "medium"
    return "medium";
  }

  getIDs(num, maxID) {
    let ids = {};
    if (maxID < num) {
      println(
        "getIDs() -- WARNING: maxID (" +
          maxID +
          ") less than " +
          num +
          ". Returning " +
          maxID +
          " IDs."
      );

      num = maxID;
    }

    while (ids.length < num) {
      ids.add(andom(maxID));
    }

    return ids;
  }

  // using a reworked version of a grammar handler from a past project of mine:
  // https://github.com/llwatkin/final-project/blob/main/js/lore/grammar_handling.js
  fillGrammarTemplate(template, json) {
    // console.log(template);

    template = this.handleFills(template, json, ">");
    template = this.handleFills(template, json);

    template = this.handlePlurals(template);      // handle plurals
    template = this.handleIndefArticle(template); // handle words that need a/an before it

    return template;
  }

  handleFills(template, json, separator){
    if(!separator){ separator = ""; }
    let slotPattern = new RegExp(`\\$(\\w+${separator}\\w+)`);

    while (template.match(slotPattern)) {
      template = template.replace(slotPattern, (match, capture) => {
        let parts = (separator.length > 0) ? capture.split(separator) : capture;
        // captureGroup -> "noun"
        
        const param = this.g.getHighLevelWorms(this.g.temperature) || "all"; 
        if(typeof(parts) === "object") return this.fillSplit(parts, json, param);
        else return this.fillSingle(parts, json, param);
      });
    }

    return template;
  }

  fillSplit(fill, json, param){
    const pickedParam = random(param);
    const fillA = this.fillSingle(fill[0], json, pickedParam); 
    const fillB = this.fillSingle(fill[1], json, pickedParam); 

    return fillA + fillB;
  }

  fillSingle(filler, json, param){
    let pickedParam = (typeof(param) === "object") ? random(param) : param;

    let options = json[pickedParam][filler];
    if (options == null || options.length === 0) {
      options = json.all[filler];  // get generic fill

      if (options == null || options.length === 0) { return capture; } // if still null
    }

    let word = random(options);
    return word;
  }

  handlePlurals(template){
    //*** NEXT, look for words that need to be pluralized ***///
    let slotPatternP = /\{\s*(\w+)\s*:(\w+)\s*\}/;

    while (template.match(slotPatternP)) {
      template = template.replace(slotPatternP, (match, word, modifier) => {
        // match: "{ ghoul :s}"
        // word: "ghoul"
        // modifier: "s"

        let plural = pluralize(word);
        // plural = English.plural(plural);

        return plural;
      });
    }

    return template;
  }

  handleIndefArticle(template){
    let slotPatternV = /\[\s*(\w+)\s*:(\w+)\s*\]/;

    while (template.match(slotPatternV)) {
      template = template.replace(slotPatternV, (match, word, modifier) => {
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
      });
    }

    return template;
  }

  toHashMap(data) {
    let hm = {};

    let keys = data["CONFIG"]["keys"];
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let kVals = data[k];

      let nested = {};
      for (let worm of this.g.wormName) {
        let arr = kVals[worm];
        if (arr == null) continue; // worm not defined

        nested[worm] = this.toArrayList(arr);
      }

      // check for "all" keyword
      let arr = kVals["all"];
      if (arr != null) {
        nested["all"] = this.toArrayList(arr);
      }

      hm[k] = nested;
    }

    return hm;
  }

  toArrayList(ja) {
    let al = [];

    for (let i = 0; i < ja.length; i++) {
      al.push(ja[i]);
    }

    return al;
  }

  isVowel(c) {
    c = c.toLowerCase();
    return c == "a" || c == "e" || c == "i" || c == "o" || c == "u";
  }
}
