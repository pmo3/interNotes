var listGenerator = {
  
  userItems : [],

  buildLink : function(query){
    var baseURL = "https://www.google.com/search?q=";
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
      listGenerator.userItems.push(item);
      //add only the new item to DOM
      listGenerator.makeElements([item]);
      listGenerator.saveChanges();
      listGenerator.hideInput();
    }
  },

  hideInput : function(){
    document.getElementById("item-input").value = '';
    document.getElementById("new-div").style.height = "0px";
  },

  initAll : function(){
    this.getItems();
    document.getElementById("add-button").addEventListener("click", function(){
      document.getElementById("new-div").style.height = "50px";
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
  }
};

//Run list generation as soon as DOM is ready
document.addEventListener("DOMContentLoaded", function(){
  listGenerator.initAll();
});