function ListItem(txt, site){
  this.txt = txt;
  this.site = site;
  this.url = null;
  this.baseURLs = {
    google: "https://www.google.com/search?q=",
    youtube: "https://www.youtube.com/results?search_query="
  };
  this.ID = this.generateID();
  this.url = this.buildURL();
}

ListItem.prototype.buildURL = function(){
  query = encodeURIComponent(this.txt);
  baseURL = this.baseURLs[this.site];
  return baseURL + query;
};


// Implement Fisher-Yates algorithm to shuffle array
Array.prototype.shuffle = function(){
  var currentIndex = this.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    this[randomIndex] = temporaryValue;
  }

  return this;
};

// Use shuffle to generate random ID for ListItem -- helps avoid duplication of IDs
// and issues arising from multiple-word entries

ListItem.prototype.generateID = function(){
  letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
          "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  return letters.shuffle().slice(0, 8).join("");
};