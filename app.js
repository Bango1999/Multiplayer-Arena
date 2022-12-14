/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var dotenv = require('dotenv');
const pug = require('pug');
var path = require('path');

/**
 * load .env
 */
dotenv.load({ path: path.join(__dirname, '.env') });

/**
 * Controllers (route handlers).
 */
var multiplayerController = require('./controllers/multiplayer');


/**
 * Create Express server.
 */
var app = express();


/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', multiplayerController.multiplayer);


/**
 * Error Handler.
 */
app.use(errorHandler());

var allClients = [];
var index = 0;
var server  = require('http').createServer(app);
var io      = require('socket.io')(server, {
  cors: {
       origin: "https://arena.swango.xyz",
       methods: ["GET", "POST"],
       transports: ['websocket'],
       credentials: false
   },
   allowEIO3: true
});

//someone connected
io.on('connection', function(socket){
  console.log('someone connected');
  var az = Math.floor((Math.random() * 360) + 1);
  if (az % 2 == 1) {
    az = (az + 1) % 360;
  }
  //set up the new player
  var player = {
    'id': (index++).toString(),
    'x': (Math.floor((Math.random() * 500) + 1)).toString(),
    'y': (Math.floor((Math.random() * 500) + 1)).toString(),
    'az': az.toString(),
    'r': (Math.floor((Math.random() * 255) + 1)).toString(),
    'g': (Math.floor((Math.random() * 255) + 1)).toString(),
    'b': (Math.floor((Math.random() * 255) + 1)).toString(),
    'h': "1"
  };
  //i shall call him index
  socket.id = player.id;
  socket.player = player;
  //make array of everyone before him, to send him
  var players = [];
  for (var i = 0; i < allClients.length; i++) {
    players.push(allClients[i].player);
  }
  socket.emit('you', player.id);
  socket.emit('get bearings', players);
  allClients.push(socket);
  //everyone now has him
  io.emit('new player', socket.player);


  /*
   * SOCKET RECEIVE FUNCTIONS
   */

  //someone sent a chat message
  socket.on('chat message', function(arr){
    io.emit('chat message', arr);
  });

  //someone disconnected
  socket.on('disconnect', function(){
     console.log('someone disconnected');
    var i = allClients.indexOf(socket);
    io.emit('player disconnect', allClients[i].player.id);
    allClients.splice(i, 1);
  });

  //someone updated themselves
  socket.on('update', function(arr) {
    for (var i = 0; i < allClients.length; i++) {
      if (allClients[i].player.id == arr.id) {
        allClients[i].player.x = arr.x;
        allClients[i].player.y = arr.y;
        allClients[i].player.az = arr.az;
        allClients[i].player.r = arr.r;
        allClients[i].player.g = arr.g;
        allClients[i].player.b = arr.b;
        allClients[i].player.h = arr.h;
        var player = allClients[i].player;
        player.forceUpdate = arr.forceUpdate ? true : false;
        io.emit('update player', player);
        break;
      }
    }
  });
});


server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
/**
 * Start Express server.
 */
// app.listen(app.get('port'), function() {
//   console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
// });

module.exports = app;
