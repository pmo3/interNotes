function ListItem(item, site){
  this.item = item;
  this.site = site;
  this.url = null;
  this.baseURLs = {
    google: "https://www.google.com/search?q=",
    youtube: "https://www.youtube.com/results?search_query="
  };
}

ListItem.prototype.buildURL = function(){
  query = encodeURIComponent(this.item);
  baseURL = this.baseURLs[this.site];
  this.url = baseURL + query;
};