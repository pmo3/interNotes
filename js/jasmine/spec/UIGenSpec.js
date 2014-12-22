describe("listGen", function(){
  var foo,
      bar,
      items;


  beforeEach(function(){
    foo = new ListItem("foo", "google");
    bar = new ListItem("bar", "youtube");
    items = {
      foo : foo,
      bar: bar
    };
    jasmine.addMatchers({
      // got this function definition from jasmine-jquery library.
      // you can find it on github: https://github.com/velesin/jasmine-jquery
      toHaveClass: function(){
        return {
          compare: function(actual, className){
            return {pass: $(actual).hasClass(className)}
          }
        }
      }
    });
    gen = UIGen;
    $('<div id="everything"><div class="header"><p>InterNotes</p><button type="button" class="addButton" id="add-button" data-count="0">+</button></div><div class="new-item" id="new-div"><input type="text" id="item-input" value="bonobos"><button type="button" class="addButton" id="submitItem">Add</button></div><div class="main"></div></div>').appendTo('body');
    $("<div class='all'><span id='site-choice' data-choice='google'><i id='site-icon' class='fa fa-google'></i><i class='fa fa-angle-down'></i></span><ul class='site-choice'><li data-site='google'><i></i></li><li data-site='youtube'><i></i></li></ul></div>").appendTo('body');
    
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
    $(".all").remove();
  });

  describe("makeElement", function(){
    it("should add a ul element to the DOM is one doesn't already exist", function(){
      gen.makeElement(foo);
      expect(("#list")).toBeInDOM();
    });
    it("should add an li element to DOM", function(){
      gen.makeElement(foo);
      expect($("#"+foo.ID)).toBeInDOM();
    });
    it("should add click event listeners", function(){
      spyOn(gen, "addClickListeners");
      gen.makeElement(foo);
      expect(gen.addClickListeners).toHaveBeenCalled();
    });
  });
  describe("addItem", function(){
    it("should add the item to userItems object", function(){
      // TODO: this is hacky, solve later
      // Issue figuring out how to deal with randomly generated ID
      gen.addItem("foo");
      ID = Object.keys(gen.userItems)[0];
      expect(gen.userItems[ID]).toBeDefined();
    });
    it("should call makeElement", function(){
      spyOn(gen, "makeElement").and.callThrough();
      gen.addItem("foo");
      expect(gen.makeElement).toHaveBeenCalled();
    });
    it("should call saveChanges", function(){
      spyOn(gen, "saveChanges");
      gen.addItem("foo");
      expect(gen.saveChanges).toHaveBeenCalled();
    });
    it("should do nothing if input value is empty string", function(){
      gen.userItems = {};
      gen.addItem("");
      expect(gen.userItems).toEqual({});
    });
  });
  describe("hideElement", function(){
    it("should set element height to 0px", function(){
      newdiv = $("#new-div")[0];
      newdiv.style.height = "50px";
      gen.hideElement(newdiv);
      expect(newdiv.style.height).toEqual("0px");
    });
  });
  describe("showElement", function(){
    it("should set element height to given height", function(){
      el = $("#new-div")[0];
      gen.showElement(el, "80px");
      expect(el.style.height).toEqual("80px");
    });
  });
  describe("chooseSite", function(){
    it("should data-choice attribute to correct site", function(){
      choice = $("#site-choice").data("choice");
      expect(choice).toEqual("google");
      gen.chooseSite("youtube");
      expect($("#site-choice").data("choice")).toEqual("youtube");
    });
    it("should set icon to chosen site", function(){
      expect($("#site-icon")).toHaveClass("fa fa-google");
      gen.chooseSite("youtube");
      expect($("#site-icon")).toHaveClass("fa fa-youtube");
      expect($("#site-icon")).not.toHaveClass("fa-google");
    });
  });
  describe("toggleNew", function(){
    it("should show input when clicked for the first time", function(){
      var newdiv = document.getElementById("new-div");
      spyOn(gen, "showElement");
      gen.toggleNew();
      expect(gen.showElement).toHaveBeenCalledWith(newdiv, "65px");
    });
    it("should increase add-button's data-count attribute by 1", function(){
      expect($("#add-button").data("count")).toEqual(0);
      gen.toggleNew();
      expect($("#add-button").data("count")).toEqual(1);
    });
    it("should only call showElement if count % 2 == 0", function(){
      var addbutton = $("#add-button");
      spyOn(gen, "showElement");
      gen.toggleNew();
      expect(gen.showElement).toHaveBeenCalled();
      expect(addbutton.data("count")).toEqual(1);
      gen.toggleNew();
      expect(gen.showElement.calls.count()).toEqual(1);
    });
    it("should call hideElement when count % 2 != 0", function(){
      var addbutton = $("#add-button");
      spyOn(gen, "hideElement");
      gen.toggleNew();
      expect(gen.hideElement).not.toHaveBeenCalled();
      gen.toggleNew();
      expect(gen.hideElement).toHaveBeenCalledWith($("#new-div").get(0));
    });
    it("should add class 'cancel-to-add' to addbutton and remove 'add-to-cancel'", function(){
      var addbutton = $("#add-button");
      addbutton.data("count", 1);
      gen.toggleNew();
      expect(addbutton).toHaveClass("cancel-to-add");
      expect(addbutton).not.toHaveClass("add-to-cancel");
    });
  });
  describe("deleteItem", function(){
    //TODO: also hacky, same thing;
    beforeEach(function(){
      gen.addItem("foo");
      ID = Object.keys(gen.userItems)[0];
    });
    it("should remove the item from userItems", function(){
      gen.deleteItem(gen.userItems[ID]);
      expect(gen.userItems[ID]).not.toBeDefined();
    });
    it("should remove element from the DOM", function(){
      expect($("#"+ID)).toBeInDOM();
      gen.deleteItem(gen.userItems[ID]);
      expect($("#"+ID)).not.toBeInDOM();
    });
    it("should remove the ul from the DOM if there are no more li elements after deletion", function(){
      expect($("#list")).toBeInDOM();
      gen.deleteItem(gen.userItems[ID]);
      expect($("#list")).not.toBeInDOM();
      gen.addItem("foo");
      ID = Object.keys(gen.userItems)[0];
      gen.addItem("bar");
      gen.deleteItem(gen.userItems[ID]);
      expect($("#list")).toBeInDOM();
    });
  });
});