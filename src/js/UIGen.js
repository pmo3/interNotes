import $ from './jquery-2.1.1.min.js';
import ListItem from './listItem.js';

class UIGen {
  constructor(opts = {}) {
    this.userItems = {};
    this.chrome = opts.chrome || chrome;
  }

  makeElement(item) {
    if (document.getElementById("list") == null){
      var ul = "<ul id='list'></ul>";
      $(ul).appendTo($(".main"));
    }
    var li = "<li class='lookup-item' id='"+item.ID+"'><a href='"+item.url+"'>"+item.txt+"</a><span><i class='fa fa-close' id='"+item.ID+"-close'></i></span></li>";
    $(li).appendTo($("#list"));
    this.addClickListeners(item);
  }

  addClickListeners(item) {
    var gen = this;
    var li = document.getElementById(item.ID);
    li.firstChild.addEventListener("click", function(){
      this.chrome.tabs.create({"url" : item.url});
    });
    var span = document.getElementById(item.ID+"-close");
    span.addEventListener("click", function(){
      gen.deleteItem(item);
    });
  }

  addItem(input) {
    //only run if input field is not empty
    if (input.length > 0){
      var site = $("#site-choice").data("choice");
      var item = new ListItem(input, site); // eslint-disable-line no-undef
      this.userItems[item.ID] = item;
      this.makeElement(item);
      this.saveChanges();
      $("#item-input")[0].value = '';
      this.chrome.browserAction.setBadgeText({text: Object.keys(this.userItems).length.toString()});
    }
  }

  saveChanges() {
    this.chrome.storage.sync.set({"items" : this.userItems}, function(){
      console.log("Items saved");
    });
  }

  hideElement(element) {
    element.style.height = "0px";
  }

  showElement(element, h) {
    element.style.height = h;
  }

  chooseSite(site) {
    var current = $("#site-choice").data("choice");
    $("#site-icon").removeClass("fa-"+current);
    $("#site-choice").data("choice", site);
    $("#site-icon").addClass("fa-"+site);
  }

  deleteItem(item) {
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
    this.saveChanges();
  }

  getItems() {
    try {
      this.chrome.storage.sync.get("items", function(object){
        var items = object.items;
        for (var item in items){
          gen.addItem(items[item].txt);
        }
      });
    } catch(err) {
      return;
    }
  }

  initAll() {
    try {
      var gen = this;
      this.getItems();
      this.chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
      $('#add-icon').click(function(){
        gen.addItem(document.getElementById("item-input").value);
      });
      $('#item-input').keypress(function(e){
        var key = e.which || e.keyCode;
        if (key == 13){
          gen.addItem(document.getElementById("item-input").value);
        }
      });
      $("#site-choice").click(function(){
        $(".arrow_box").toggle("fast");
      });
      $(".site").click(function(){
        var choice = $(this).data("site");
        gen.chooseSite(choice);
      });
    } catch(err) {
      return;
    }

  }

  removeElement(event) {
    var gen = this;
    if (event.animationName === 'disappear'){
      event.target.parentNode.removeChild(event.target);
      // remove ul so border doesn't show up in window
      if (Object.keys(gen.userItems).length === 0){
        $("#list").remove();
      }
    }
    if (Object.keys(gen.userItems).length > 0) {
      this.chrome.browserAction.setBadgeText({text: Object.keys(gen.userItems).length.toString()});
    }else{
      this.chrome.browserAction.setBadgeText({text: ''});
    }
  }
}

//Run generator as soon as DOM is ready
var gen = new UIGen()
document.addEventListener("DOMContentLoaded", function(){
  gen.initAll();
});

document.addEventListener('animationEnd', gen.removeElement);
document.addEventListener('webkitAnimationEnd', gen.removeElement);
$(document).ready(function(){
  $('#item-input').keyup(function(){
    if ( $(this).val() == ""){
      $('#add-icon').css('color', '#D8D8D8');
    }else{
      $('#add-icon').css('color', '#26a69a');
    }
  });
});

export default UIGen;
