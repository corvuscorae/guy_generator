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

    //*** look for ${A} patterns ***//
    let slotPatternB = /\$(\w+)/;

    while (template.match(slotPatternB)) {
      template = template.replace(slotPatternB, (match, capture) => {
        // captureGroup -> "noun"
        let fillerKey = capture; // "noun"
        let param = this.g.getHighLevelWorm(); // "fear"

        let options = json[param][fillerKey];
        if (options == null || options.size === 0) {
          options = json.all[fillerKey];  // get generic fill

          if (options == null || options.size === 0) { return capture; } // if still null
        }

        let word = random(options);
        return word;
      });
    }

    template = this.handlePlurals(template);      // handle plurals
    template = this.handleIndefArticle(template); // handle words that need a/an before it

    return template;
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
