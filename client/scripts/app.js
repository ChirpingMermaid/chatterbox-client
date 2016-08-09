// YOUR CODE HERE:
var app = {};
var esc = {
  '<': '&#60',
  '!': '&#33',  
  '"': '&#34',
  '#': '&#35',  
  '$': '&#36',  
  '%': '&#37',  
  '&': '&#38',
  '(': '&#40',
  ')': '&#41',
  '/': '&#47',
  '>': '&#62'
};

app.handleSubmit = function() {
  var text = $('input[placeholder="Comment"]').val();
  var username = $('input[placeholder="Username"]').val();
  var message = {text: text, username: username};
  $('input[placeholder="Comment"]').val('');
  app.send(message);
};

var clickHandler = function() {
};

app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      // app.fetch();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  //return true;
};

app.fetch = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      $('#chats').html('');
      data.results.forEach(function(message) {
        app.addMessage(message);
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    }
  });
};

app.server = 'https://api.parse.com/1/classes/messages';

app.clearMessages = function() {
  $('#chats').html('');
};

app.addMessage = function(message) {
  var escapeHelper = function(key) {
    if (message[key] !== undefined) {
      var stringArray = message[key].split('');
      //var string = message[key];
      for (var i = 0; i < stringArray.length; i++) {
        if (stringArray[i] in esc) {
          stringArray[i] = esc[stringArray[i]];
        }
      }
      return stringArray.join('');
    } else {
      return '';
    }
  };

  // message.text = escapeHelper('text');
  // message.username = escapeHelper('username');

  $('#chats').append(`
  <div>
    <span class="username">
      ${escapeHelper('username')}:&nbsp
    </span>
    <span class="message">
      ${escapeHelper('text')}
    </span>
  </div>`);
};

app.addRoom = function(room) {
  $('#roomSelect').append(`<div id='${room}'></div>`);
};

app.addFriend = function(friend) {

};

app.eventHandlers = function() {
  $('#send').off().on('submit', function(e) {
    e.preventDefault();
    app.handleSubmit();
  });
  $('.username').on('click', function(event) {
    app.addFriend($(this).text());  
  });
};

app.init = function() {
  $( document ).ready(function() {
    app.fetch();
    app.eventHandlers();
    window.setInterval(app.fetch, 5000);
  });
};

app.init();