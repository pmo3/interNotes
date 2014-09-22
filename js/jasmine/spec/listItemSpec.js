describe("ListItem", function(){
  var listItem;

  beforeEach(function(){
    listItem = new ListItem("foo", "google");
  });

  describe("buildURL", function(){
    it("should build a well-formed link to given site", function(){
      expect(listItem.site).toEqual("google");
      listItem.buildURL();
      expect(listItem.url).toEqual("https://www.google.com/search?q=foo");
      listItem = new ListItem("bar", "youtube");
      listItem.buildURL();
      expect(listItem.url).toEqual("https://www.youtube.com/results?search_query=bar");
    });
    it("should escape spaces and other characters", function(){
      listItem = new ListItem("foo and/or bar", "google");
      listItem.buildURL();
      expect(listItem.url).toEqual("https://www.google.com/search?q=foo%20and%2For%20bar");
    });
  });
});