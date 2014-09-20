describe("listGenerator", function(){
  var items;

  beforeEach(function(){
    gen = listGenerator;
    $('<div id="everything"><div class="header"><p>My Lookup List</p><button type="button" class="addButton" id="add-button">+</button></div><div class="new-item" id="new-div"><input type="text" id="item-input" value="bonobos"><button type="button" class="addButton" id="submitItem">Add</button></div><div class="main"></div></div>').appendTo('body');
    
    // chrome specific objects seem to cause errors (probably permissions-related)
    // so we'll stub that out entirely
    chrome = {
      storage : {
        sync : {
          set : function(){
            return;
          },
          get : function() {
            return;
          }
        }
      }
    };
  });

  afterEach(function(){
    $("#everything").remove();
  });

  describe("buildLink", function(){
    it("should return a well-formed link to google search results", function(){
      link = gen.buildLink("things");
      expect(link).toEqual("https://www.google.com/search?q=things");
      link = gen.buildLink("things and/or stuff");
      expect(link).toEqual("https://www.google.com/search?q=things%20and%2For%20stuff");
    });

    it("should escape spaces and other characters", function(){
      link = gen.buildLink("things and stuff");
      expect(link).toEqual("https://www.google.com/search?q=things%20and%20stuff");
    });
  });

  describe("makeElements", function(){
    var items = ["things", "stuff"];
    it("should add a ul element to DOM if it doesn't exist", function(){
      expect(document.getElementById("list")).toBe(null);
      gen.makeElements([]);
      expect(document.getElementById("list")).not.toBe(null);
    });

    it("should add an li element to DOM for each item", function(){
      gen.makeElements(items);
      expect(document.getElementById("things")).not.toBe(null);
      expect(document.getElementById("stuff")).not.toBe(null);
    });

    it("should add click event listeners", function(){
      spyOn(gen, "addClickListeners");
      gen.makeElements(items);
      expect(gen.addClickListeners).toHaveBeenCalled();
      expect(gen.addClickListeners.calls.allArgs()).toEqual([["things"], ["stuff"]]);
    });
  });

  describe("deleteItem", function(){
    var items = ["things", "stuff"];
    it("should remove the item from gen.userItems", function(){
      gen.userItems = items;
      gen.makeElements(items);
      gen.deleteItem("things");
      expect(gen.userItems.length).toBe(1);
      expect(gen.userItems).toEqual(["stuff"]);
      gen.deleteItem("stuff");
      expect(gen.userItems.length).toBe(0);
    });

    it("and remove it from the DOM", function(){
      var items = ["things", "stuff"];
      gen.makeElements(items);
      expect(document.getElementById("things")).not.toBe(null);
      gen.deleteItem("things");
      expect(document.getElementById("things")).toBe(null);
    });
  });

  describe("addItem", function(){
    it("should add the item to userItems", function(){
      expect(gen.userItems.length).toBe(0);
      gen.addItem("things");
      expect(gen.userItems.length).toBe(1);
      expect(gen.userItems).toEqual(["things"]);
    });

    it("should call makeElements", function(){
      spyOn(gen, "makeElements").and.callThrough();
      gen.addItem("things");
      expect(gen.makeElements).toHaveBeenCalled();
      expect(gen.makeElements).toHaveBeenCalledWith(["things"]);
    });

    it("should call addClickListeners", function(){
      spyOn(gen, "addClickListeners");
      $("<ul id='list'></ul>").appendTo($(".main"));
      gen.addItem("things");
      expect(gen.addClickListeners).toHaveBeenCalled();
      expect(gen.addClickListeners).toHaveBeenCalledWith("things");
    });

    it("should save changes", function(){
      spyOn(gen, "saveChanges");
      gen.addItem("things");
      expect(gen.saveChanges).toHaveBeenCalled();
    });

    it("should call hideElement", function(){
      spyOn(gen, "hideElement");
      gen.addItem("things");
      expect(gen.hideElement).toHaveBeenCalled();
    });

    it("should set input value to ''", function(){
      input = document.getElementById("item-input");
      expect(input.value).toEqual('bonobos');
      gen.addItem("things");
      expect(input.value).toEqual('');
    })

    it("should do nothing if given empty string as parameter", function(){
      gen.userItems = [];
      gen.addItem('');
      expect(gen.userItems).toEqual([]);
    });
  });

  describe("hideElement", function(){
    it("should set element height to 0px", function(){
     document.getElementById("new-div").style.height = "50px";
      gen.hideElement(document.getElementById("new-div"));
      expect(document.getElementById("new-div").style.height).toEqual("0px");
    });
  });

  describe("showElement", function(){
    it("should set given element's height to given height", function(){
      el = document.getElementById("new-div");
      gen.showElement(el, "80px");
      expect(el.style.height).toEqual("80px");
    });
  });

  describe("chooseSite", function(){
    it("should set data-choice attribute to correct site", function(){
      markup = "<div class='all'><span id='site-choice' data-choice='google'><i class='fa fa-google'></i><i class='fa fa-angle-down'></i></span><ul class='site-choice'><li data-site='google'><i></i></li><li data-site='youtube'><i></i></li></ul></div>";
      $(markup).appendTo('body');
      choice = document.getElementById("site-choice").dataset.choice;
      expect(choice).toEqual("google");
      gen.chooseSite("youtube");
      choice = document.getElementById("site-choice").dataset.choice;
      expect(choice).toEqual("youtube");
      $(".all").remove();

    });
    it("should set icon to chosen site", function(){
      markup = "<div class='all'><span id='site-choice' data-choice='google'><i id='site-icon' class='fa fa-google'></i><i class='fa fa-angle-down'></i></span><ul class='site-choice'><li data-site='google'><i></i></li><li data-site='youtube'><i></i></li></ul></div>";
      $(markup).appendTo('body');
      expect($("#site-icon").attr("class")).toEqual("fa fa-google");
      gen.chooseSite("youtube");
      expect($("#site-icon").attr("class")).toEqual("fa fa-youtube");
      $(".all").remove();
    });
  });
});