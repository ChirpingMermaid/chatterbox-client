// YOUR CODE HERE:
var app = {};

app.handleSubmit = function() {
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
      console.log('chatterbox: Message sent');
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
      console.log(data.results);
      // addMessage(data)
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.server = 'https://api.parse.com/1/classes/messages';

app.clearMessages = function() {
  $('#chats').html('');
};

app.addMessage = function(message) {
  $('#chats').append(`
  <div>
    <span class="username">
      ${message.username}
    </span>
    <span class="message">
      ${message.text}
    </span>
  </div>`);
};

app.addRoom = function(room) {
  $('#roomSelect').append(`<div id='${room}'></div>`);
};

app.addFriend = function(friend) {

};

app.eventHandlers = function() {
  $('.username').on('click', function(event) {
    app.addFriend($(this).text());  
  });
  $('#send .submit').off().on('submit', function(e) {
    console.log('hi');  
    app.handleSubmit();
  });
};

app.init = function() {
  $( document ).ready(function() {
    app.fetch();
    app.eventHandlers();
  });
};

app.init();