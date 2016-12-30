var UIGen = {
  userItems : {},
  replacementPattern : /\{\{height\}\}/g,

  makeElement : function(item){
    if (document.getElementById("list") == null){
      var ul = "<ul id='list'></ul>";
      $(ul).appendTo($(".main"));
    }
    var li = "<li class='lookup-item' id='"+item.ID+"'><a href='"+item.url+"'>"+item.txt+"</a><span><i class='fa fa-close' id='"+item.ID+"-close'></i></span></li>";
    $(li).appendTo($("#list"));
    this.addClickListeners(item);
  },

  addClickListeners : function(item){
    var li = document.getElementById(item.ID);
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
      var site = $("#site-choice").data("choice");
      var item = new ListItem(input, site); // eslint-disable-line no-undef
      this.userItems[item.ID] = item;
      this.makeElement(item);
      this.saveChanges();
      $("#item-input")[0].value = '';
      chrome.browserAction.setBadgeText({text: Object.keys(UIGen.userItems).length.toString()});
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
    var current = $("#site-choice").data("choice");
    $("#site-icon").removeClass("fa-"+current);
    $("#site-choice").data("choice", site);
    $("#site-icon").addClass("fa-"+site);
  },

  deleteItem : function(item){
    var key = item.ID;
    var li = $("#"+key);
    li.addClass("removed");
    delete this.userItems[key];
    var remaining = Object.keys(this.userItems).length;
    if (remaining === 0) {
      $('#list').addClass('removed');
    }
    setTimeout(function(){
      li.remove();
      if (remaining == 0) {
        $('#list').remove();
      }
    }, 400);
    // li.remove();
    this.saveChanges();
  },

  getItems : function(){
    chrome.storage.sync.get("items", function(object){
      var items = object.items;
      for (var item in items){
        UIGen.addItem(items[item].txt);
      }
    });
  },

  initAll : function(){
    this.getItems();
    chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
    $('#add-icon').click(function(){
      UIGen.addItem(document.getElementById("item-input").value);
    });
    $('#item-input').keypress(function(e){
      var key = e.which || e.keyCode;
      if (key == 13){
        UIGen.addItem(document.getElementById("item-input").value);
      }
    });
    $("#site-choice").click(function(){
      $(".arrow_box").toggle("fast");
    });
    $(".site").click(function(){
      var choice = $(this).data("site");
      UIGen.chooseSite(choice);
    });
  },

  insertKeyFrames: function(height){
    var styleElement = document.createElement('style');
    styleElement.textContent = UIGen.keyframesTemplate.replace(UIGen.replacementPattern, height + 'px');
    document.head.appendChild(styleElement);
  },

  removeElement : function(event){
    console.log(Object.keys(UIGen.userItems).length);
    if (event.animationName === 'disappear'){
      event.target.parentNode.removeChild(event.target);
      // remove ul so border doesn't show up in window
      if (Object.keys(UIGen.userItems).length === 0){
        $("#list").remove();
      }
    }
    if (Object.keys(UIGen.userItems).length > 0) {
      chrome.browserAction.setBadgeText({text: Object.keys(UIGen.userItems).length.toString()});
    }else{
      chrome.browserAction.setBadgeText({text: ''});
    }
  }
};

//Run generator as soon as DOM is ready
document.addEventListener("DOMContentLoaded", function(){
  UIGen.initAll();
});

document.addEventListener('animationEnd', UIGen.removeElement);
document.addEventListener('webkitAnimationEnd', UIGen.removeElement);
$(document).ready(function(){
  $('#item-input').keyup(function(){
    if ( $(this).val() == ""){
      $('#add-icon').css('color', '#D8D8D8');
    }else{
      $('#add-icon').css('color', '#26a69a');
    }
  });
})
