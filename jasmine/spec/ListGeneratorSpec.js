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
    it("should add the item to gen.userItems", function(){
      expect(gen.userItems.length).toBe(0);
      gen.addItem("things");
      expect(gen.userItems.length).toBe(1);
      expect(gen.userItems).toEqual(["things"]);
    });

    it("should call gen.makeElements", function(){
      spyOn(gen, "makeElements").and.callThrough();
      gen.addItem("things");
      expect(gen.makeElements).toHaveBeenCalled();
      expect(gen.makeElements).toHaveBeenCalledWith(["things"]);
    });

    it("should call gen.addClickListeners", function(){
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

    it("should call gen.hideInput", function(){
      spyOn(gen, "hideInput");
      gen.addItem("things");
      expect(gen.hideInput).toHaveBeenCalled();
    });

    it("should do nothing if given empty string as parameter", function(){
      gen.userItems = [];
      gen.addItem('');
      expect(gen.userItems).toEqual([]);
    });
  });

  describe("hideInput", function(){
    it("should set input text to ''", function(){
      expect(document.getElementById("item-input").value).toEqual("bonobos");
      gen.hideInput();
      expect(document.getElementById("item-input").value).toEqual('');
    });
    it("should set div height to 0", function(){
      document.getElementById("new-div").style.height = "50px";
      gen.hideInput();
      expect(document.getElementById("new-div").style.height).toEqual("0px");
    });
  });
});