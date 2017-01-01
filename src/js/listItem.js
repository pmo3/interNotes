import urlRegex from './urlRegex.js';
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

class ListItem {
  constructor(txt, site) {
    this.txt = txt;
    this.site = site;
    this.url = null;
    this.baseURLs = {
      google: "https://www.google.com/search?q=",
      youtube: "https://www.youtube.com/results?search_query="
    };
    this.urlRegex = urlRegex;
    this.ID = this.generateID();
    this.url = this.buildURL();
  }

  buildURL() {
    if(this.isURL()) {
      return this.txt;
    } else {
      var query = encodeURIComponent(this.txt);
      var baseURL = this.baseURLs[this.site];
      return baseURL + query;
    }
  }

  generateID() {
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
            "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

    return letters.shuffle().slice(0, 8).join("");
  }

  isURL() {
    return this.urlRegex.test(this.txt);
  }
}

export default ListItem;
