var UIGen = {
  userItems : {},

  makeElement : function(item){
    if (document.getElementById("list") == null){
      ul = "<ul id='list'></ul>";
      $(ul).appendTo($(".main"));
    }
    li = "<li class='lookupItem' id='"+item.ID+"'><a href='"+item.url+"'>"+item.txt+"</a><span><i class='fa fa-close' id='"+item.ID+"-close'></i></span></li>";
    $(li).appendTo($("#list"));
    this.addClickListeners(item);
  },

  addClickListeners : function(item){
    li = document.getElementById(item.ID);
    li.firstChild.addEventListener("click", function(){
      chrome.tabs.create({"url" : item.url});
    });
    var span = document.getElementById(item.ID+"-close");
    span.addEventListener("click", function(){
      UIGen.deleteItem(item);
    });
  },

  addItem : function(input){
    //only run if input field is not empty
    if (input.length > 0){
      site = $("#site-choice").data("choice");
      item = new ListItem(input, site);
      this.userItems[item.ID] = item;
      this.makeElement(item);
      this.saveChanges();
      this.hideElement($("#new-div")[0]);
      $("#item-input")[0].value = '';
    }
  },

  saveChanges : function(){
    chrome.storage.sync.set({"items" : UIGen.userItems}, function(){
      console.log("Items saved");
    });
  },


  hideElement : function(element){
    element.style.height = "0px";
  },

  showElement : function(element, h){
    element.style.height = h;
  },

  chooseSite : function(site){
    current = $("#site-choice").data("choice");
    $("#site-icon").removeClass("fa-"+current);
    $("#site-choice").data("choice", site);
    $("#site-icon").addClass("fa-"+site);
  },

  toggleNew : function(){
    var newdiv = $("#new-div");
    var addbutton = $("#add-button");
    var count = addbutton.data("count");
    if (count % 2 == 0){
      this.showElement(newdiv.get(0), "90px");
      addbutton.removeClass("cancel-to-add");
      addbutton.addClass("add-to-cancel");
    } else {
      this.hideElement(newdiv.get(0));
      addbutton.removeClass("cancel-to-add");
      addbutton.addClass("cancel-to-add");
    }
    addbutton.data("count", count + 1)
  },

  deleteItem : function(item){
    //TODO: remove border from ul if no more items
    var key = item.ID;
    var li = $("#"+key).get(0);
    li.parentNode.removeChild(li);
    delete this.userItems[key];
    // remove ul so border doesn't show up in window
    if (Object.keys(this.userItems).length === 0){
      $("#list").remove();
    }
    this.saveChanges();
  },

  getItems : function(){
    chrome.storage.sync.get("items", function(object){
      items = object.items;
      console.log(items);
      for (var item in items){
        UIGen.makeElement(items[item]);
      }
    });
  },

  initAll : function(){
    this.getItems();
    document.getElementById("add-button").addEventListener("click", function(){
      UIGen.toggleNew();
    });
    document.getElementById("submitItem").addEventListener("click", function(){
      UIGen.addItem(document.getElementById("item-input").value);
      UIGen.toggleNew();
    });
    document.getElementById("item-input").addEventListener("keypress", function(e){
      var key = e.which || e.keyCode;
      if (key == 13){
        UIGen.addItem(document.getElementById("item-input").value);
        UIGen.toggleNew();
      }
    });
    $("#site-choice").click(function(){
      $(".arrow_box").toggle("fast");
    });
    $(".site").click(function(){
      var choice = $(this).data("site");
      UIGen.chooseSite(choice);
    });
  }
};

//Run generator as soon as DOM is ready
document.addEventListener("DOMContentLoaded", function(){
  UIGen.initAll();
});