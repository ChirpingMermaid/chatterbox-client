// YOUR CODE HERE:
var app = {};
var friendList = {};
var selectedRoom = "Lobby";
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
  '>': '&#62',
  '[': '&#91',
  ']': '&#93'
};

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

app.handleSubmit = function() {
  var text = $('input[placeholder="Comment"]').val();
  var username = $('input[placeholder="Username"]').val();
  var roomname = $('select').val();
  var message = {text: text, username: username, roomname: roomname};
  $('input[placeholder="Comment"]').val(''); // clearing the input
  app.send(message);
};

app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      app.fetch();
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
        app.addRoom('roomname', message);
        if (selectedRoom === message.roomname || selectedRoom === 'Lobby') {
          app.addMessage(message);
        }
      });
      app.eventHandlers();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    }
  });
};

app.getMessages = function() {
};

app.server = 'https://api.parse.com/1/classes/messages';

app.clearMessages = function() {
  $('#chats').html('');
};

var escapeHelper = function(message, key) {
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

app.addMessage = function(message) {
  var extraClass = '';
  console.log('hiii', 'friendList: ', friendList, 'username: ', message.username);  
  if (message.username in friendList) {
    extraClass = 'friend';
  }
  $('#chats').append(`
  <div>
    <span class="username ${extraClass}">
      ${escapeHelper(message, 'username')}</span><!--
      --><span class="message">:&nbsp
      ${escapeHelper(message, 'text')}
    </span>
  </div>`);
  // console.log(escapeHelper(message, 'username'));
};

var rooms = {Lobby: 'Lobby', newroom: 'New room...'};

app.addRoom = function(roomname, message) {
  if (message) {
    roomname = escapeHelper(message, roomname);
    roomname = roomname.capitalizeFirstLetter();
  }
  if (!(roomname in rooms) && roomname) {
    rooms[roomname] = roomname;
    $('#roomSelect').append(`<option value="${roomname}">${roomname}</option>`);
  }
};

app.eventHandlers = function() {
  $('#send').off().on('submit', function(e) {
    e.preventDefault();
    app.handleSubmit();
  });

  $('.username').on('click', function(event) {
    var username = this.innerText;
    $('.username').each(function() {
      if (this.innerText === username) {
        //var friendKey = username.split(':').slice(0, 1).join('');
        // after clicking username, store in an object 
        if (username in friendList) {
          console.log(friendList);
          delete friendList[username];
        } else {
          friendList[username] = true;
          console.log(friendList);
        }
        $(this).toggleClass('friend');
      }
    });
    // app.addFriend($(this));  
  });
  $('select').off().on('change', function(e) {
    if ($('select').val() === 'newroom') {
      var newroom = prompt('Enter a new room name: ');
      newroom = newroom.capitalizeFirstLetter();
      app.addRoom(newroom);
      $('select').val(newroom);
      selectedRoom = $('select').val();
      app.fetch();
    } else {
      selectedRoom = $('select').val();
      app.fetch();
    }
  });

  // $('option[value="newroom"').on('select', function() {
  // });
};

app.init = function() {
  $(document).ready(function() {
    app.fetch();
    // window.setInterval(app.fetch, 3000);
  });
};

app.init();