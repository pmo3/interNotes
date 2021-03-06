import $ from '../../jquery-2.1.1.min.js';
import ListItem from '../../list_item.js';
import UIGen from '../../ui_gen.js';

describe("listGen", function(){
  var foo,
      bar,
      items,
      gen,
      fakeChrome;

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
      },
      toBeInDOM: function () {
        return {
          compare: function (actual) {
            return { pass: $.contains(document.documentElement, $(actual)[0]) }
          }
        }
      }
    });
    $('<div id="everything"><div class="header"><p>InterNotes</p><button type="button" class="addButton" id="add-button" data-count="0">+</button></div><div class="new-item" id="new-div"><input type="text" id="item-input" value="bonobos"><button type="button" class="addButton" id="add-icon">Add</button></div><div class="main"></div></div>').appendTo('body');
    $("<div class='all'><span id='site-choice' data-choice='google'><i id='site-icon' class='fa fa-google'></i><i class='fa fa-angle-down'></i></span><ul class='site-choice'><li data-site='google'><i></i></li><li data-site='youtube'><i></i></li></ul></div>").appendTo('body');

    // chrome specific objects seem to cause errors (probably permissions-related)
    // so we'll stub that out entirely
    fakeChrome = {
      storage : {
        sync : {
          set : function(){
            return;
          },
          get : function() {
            return;
          }
        }
      },
      browserAction: {
        setBadgeText: function(){
          return;
        },
        setBadgeBackgroundColor: function() {
          return;
        }
      }
    };

    gen = new UIGen({chrome: fakeChrome});
  });

  afterEach(function(){
    $("#everything").remove();
    $(".all").remove();
  });

  describe("makeElement", function(){
    it("should add a ul element to the DOM is one doesn't already exist", function(){
      gen.makeElement(foo);
      expect($("#list")[0]).toBeInDOM();
    });
    it("should add an li element to DOM", function(){
      gen.makeElement(foo);
      expect($("#"+foo.ID)[0]).toBeInDOM();
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
      var ID = Object.keys(gen.userItems)[0];
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

  describe("chooseSite", function(){
    it("should data-choice attribute to correct site", function(){
      var choice = $("#site-choice").data("choice");
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
  describe("deleteItem", function(){
    //TODO: also hacky, same thing;
    var ID;
    beforeEach(function(){
      gen.addItem("foo");
      ID = Object.keys(gen.userItems)[0];
    });
    it("should remove the item from userItems", function(){
      gen.deleteItem(gen.userItems[ID]);
      expect(gen.userItems[ID]).not.toBeDefined();
    });
  });
});
