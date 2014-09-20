var listGenerator = {
  
  userItems : [],

  baseURLs : {
    google : "https://www.google.com/search?q=",
    youtube : "https://www.youtube.com/results?search_query="
  },

  buildLink : function(query){
    query = encodeURIComponent(query);
    site = $("#site-choice").data("choice");
    var baseURL = listGenerator.baseURLs[site];
    return baseURL + query;
  },

  makeElements : function(items){
    if (document.getElementById("list") == null){
      ul = "<ul id=list></ul>";
      $(ul).appendTo($(".main"));
    };
    for (var i=0;i<items.length;i++){
      item = items[i];
      li = "<li class='lookupItem' id='"+ item + "'><a href='#'>"+item+"</a><span><i class='fa fa-close' id='"+item+"-close'></i></span></li>";
      $(li).appendTo($("#list"));
      this.addClickListeners(item);
    }
  },

  addClickListeners : function(item){
      li = document.getElementById(item);
      li.firstChild.addEventListener("click", function(){
        chrome.tabs.create({"url" : listGenerator.buildLink(item)});
      });
      var span = document.getElementById(item+"-close");
      span.addEventListener("click", function(){
        listGenerator.deleteItem(item);
      });
  },

  deleteItem : function(item){
    var index = listGenerator.userItems.indexOf(item);
    var li = document.getElementById(item);
    // $("#"+item).addClass("bounceOutLeft");
    li.parentNode.removeChild(li);
    listGenerator.userItems.splice(index, 1);
    listGenerator.saveChanges();
  },

  saveChanges : function(){
    chrome.storage.sync.set({"items" : listGenerator.userItems}, function(){
      console.log("Items saved");
    });
  },

  getItems : function(){
    chrome.storage.sync.get("items", function(object){
      listGenerator.userItems = object.items;
      listGenerator.makeElements(listGenerator.userItems);
    });
  },

  addItem : function(item){
    if (item.length > 0){
      link = listGenerator.buildLink(item)
      // obj = {
      //   text: item,
      //   url: link
      // }
      listGenerator.userItems.push(item);
      //add only the new item to DOM
      listGenerator.makeElements([item]);
      listGenerator.saveChanges();
      listGenerator.hideElement(document.getElementById("new-div"));
      document.getElementById("item-input").value = '';
    }
  },

  hideElement : function(element){
    element.style.height = "0px";
  },

  showElement : function(element, h){
    element.style.height = h;
  },

  chooseSite : function(site){
    current = document.getElementById("site-choice").dataset.choice;
    document.getElementById("site-choice").dataset.choice = site;
    $("#site-icon").removeClass("fa-"+current);
    $("#site-icon").addClass("fa-"+site);
  },

  initAll : function(){
    this.getItems();
    document.getElementById("add-button").addEventListener("click", function(){
      // listGenerator.showElement(document.getElementById("new-div"), "60px");
      // $("#new-div").addClass("fadeInDown");
      // $("#add-button").addClass("add-to-cancel");
      listGenerator.toggleNew();
    });
    document.getElementById("submitItem").addEventListener("click", function(){
      listGenerator.addItem(document.getElementById("item-input").value);
    });
    document.getElementById("item-input").addEventListener("keypress", function(e){
      var key = e.which || e.keyCode;
      if (key == 13){
        listGenerator.addItem(document.getElementById("item-input").value);
      }
    });
    $("#site-choice").click(function(){
      $(".arrow_box").toggle("fast");
    });
    $(".site").click(function(){
      var choice = $(this).data("site");
      listGenerator.chooseSite(choice);
    });
  },

  toggleNew : function(){
    var newdiv = $("#new-div");
    var addbutton = $("#add-button");
    var count = addbutton.data("count");
    if (count % 2 == 0){
      this.showElement(newdiv.get(0), "60px");
      addbutton.removeClass("cancel-to-add");
      addbutton.addClass("add-to-cancel");
    } else {
      this.hideElement(newdiv.get(0));
      addbutton.removeClass("cancel-to-add");
      addbutton.addClass("cancel-to-add");
    }
    addbutton.data("count", count + 1)
  }
};

//Run list generation as soon as DOM is ready
document.addEventListener("DOMContentLoaded", function(){
  listGenerator.initAll();
});