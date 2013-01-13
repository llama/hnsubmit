$(document).ready(function () {

  var first = $('td.default:first').parents('tr:first').parents('tr:first');
  var last = $('td.default:last').parents('tr:first').parents('tr:first');
  
  var current = first;
  current.find('tr:first').prepend("<div class='selector'>|</div>");

  //add leading space to all comments to prevent the bump glitch
  var sibs = current.siblings('tr');
  sibs.each(function (){
    $(this).find('tr:first').prepend("<div class='selector'></div>");
  });

  $(window).keypress(function(e) {

    //if focus not on text box
    if (!$("*:focus").is("textarea")){
      var key = e.which;

      //focus on text box
      if (key == "/".charCodeAt(0)){
        $('textarea').focus();
        e.preventDefault();
      }

      //move down
      else if (key == "j".charCodeAt(0)){
        if (current.text() != last.text()){
          current.find('div.selector').replaceWith("<div class='selector'>&nbsp</div>");
          var next = current.next();
          next.find('div.selector').text('|');
          current = next;
          scroll(current);
        }
      }

      //move up
      else if (key == "k".charCodeAt(0)){
        if (current.text() != first.text()){
          current.find('div.selector').replaceWith("<div class='selector'>&nbsp</div>");
          var prev = current.prev();
          prev.find('div.selector').text('|');
          current = prev;
          scroll(current);
        }
      }

      //reply
      else if (key == "r".charCodeAt(0)){
        var link = current.find('td.default').find('u').children('a').attr('href');
        open_link(link);
      }

      //upvote
      else if (key == "v".charCodeAt(0) ){
        current.find('a[id^="up"]:first').click();
      }

      //downvote
      else if (key == "d".charCodeAt(0) ){
        current.find('a[id^="down"]').click();
      }
      
    }

  });

  //accounts for scrolling both up and down
  function scroll(current){

    //scroll down if element goes below window
    if (current.offset().top + current.height() > $(window).scrollTop() + window.innerHeight){
      var drop = current.height();        
      $('body').animate({
        scrollTop: $(window).scrollTop() + drop
      }, 0);
    }

    //scroll if element goes above window
    if (current.offset().top < $(window).scrollTop()){
      $('body').animate({
        scrollTop: current.offset().top
      }, 0);
    }

    //scroll down if element goes below window
    if (current.offset().top + current.height() > $(window).scrollTop() + window.innerHeight){
      var drop = current.height() + current.next().height() + current.next().next().height();          
      $('body').animate({
        scrollTop: $(window).scrollTop() + drop
      }, 0);
    }

    //scroll up if element goes above window
    else if (current.offset().top < $(window).scrollTop()){
      $('body').animate({
        scrollTop: current.offset().top
      }, 0);
    }

  }

  //opens the link currently selected in same window
  function open_link(link) {
    document.location.href = link;
  }

  //opens the link currently selected in new tab
  function open_link_new_tab(link) {
    chrome.extension.sendMessage({link: link});
  }

});