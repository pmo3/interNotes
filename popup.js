var listGenerator = {

  userItems : [],

  constructListItems : function(items){
    /** Build List Items containing links to google search
    and add them to the DOM
    */
    if (items.length > 0){
      var list = document.getElementById("list");
      for (var i=0; i<items.length; i++){
        var item = items[i];
        var li = document.createElement("li");
        list.appendChild(li);
        var aTag = document.createElement("a");
        aTag.setAttribute("href", listGenerator.constructSearchLink(item));
        aTag.setAttribute("id", item);
        aTag.innerHTML = item;
        li.appendChild(aTag);
        span = document.createElement("span");
        icon = document.createElement("i");
        icon.setAttribute("id", item + "-close");
        icon.setAttribute("class", "fa fa-close");
        span.appendChild(icon);
        li.appendChild(span)
      }
    }
  },

  constructSearchLink : function(query){
    var baseURL = "https://www.google.com/search?q=";
    return baseURL + query;
  },

  saveChanges : function(items){
    chrome.storage.sync.set({"items" : items}, function(){
      console.log("Items saved");
    });
  },

  getItems : function(){
    /** retrieve items to look up from chrome storage, add them
    to the DOM, and allow them to be clicked
    */
    chrome.storage.sync.get("items", function(object){
      listGenerator.userItems = object.items;
      listGenerator.constructListItems(listGenerator.userItems);
      for (var i=0; i<listGenerator.userItems.length; i++){
        item = listGenerator.userItems[i];
        document.getElementById(item).addEventListener("click", function(){
          chrome.tabs.create({"url" : listGenerator.constructSearchLink(item)});
        });
        listGenerator.createDeleteAction(item);
      };
    });
  },

  deleteItem : function(item){
    var index = listGenerator.userItems.indexOf(item);
    listGenerator.userItems.splice(index, 1);
    listGenerator.saveChanges(listGenerator.userItems);
  },

  createDeleteAction : function(item){
    var aElement = document.getElementById(item);
    var li = aElement.parentNode;
    var spanElement = document.getElementById(item+"-close");
    spanElement.addEventListener("click", function(){
      li.parentNode.removeChild(li);
      listGenerator.deleteItem(item);
    });
  },

  addItem : function(){
    var item = document.getElementById("item-input").value;
    if (item != '') {
      listGenerator.userItems.push(item);
      // add only the new item to the DOM
      listGenerator.constructListItems([item]);
      listGenerator.saveChanges(listGenerator.userItems);
      listGenerator.createDeleteAction(item);
      document.getElementById("item-input").value = '';
      document.getElementById("new-div").style.height = "0";
    }
  }
};

// Run list generation script as soon as DOM is ready.
document.addEventListener("DOMContentLoaded", function(){
  listGenerator.getItems();
  document.getElementById("add-button").addEventListener("click", function(){
    document.getElementById("new-div").style.height = "50px";
  });
  document.getElementById("submitItem").addEventListener("click", function(){
    listGenerator.addItem();
  });
  document.getElementById("item-input").addEventListener("keypress", function(e) {
    var key = e.which || e.keyCode;
    console.log(key)
    if (key == 13) {
      listGenerator.addItem();
    }
  });
});