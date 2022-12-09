# Multiplayer Arena

- Uses Node, Express, Socket.io to create a multiplayer arena-based game in the HTML canvas
- The client & netcode is developed from scratch, and currently does not follow many normal conventions for good and scalable service
- The HTML views are developed in pug
- **Live Demo**: N/A


### The Client

#### Overview
- It holds a local player (game) state, as defined by inputs the user makes, as well as updates received from the server
- It uses a main recursive loop `play()`, which calls itself every 20ms until turned off
- On page load, the loop is not running. When the loop toggle is flipped on, `play()` is called
- Includes a player chat feature
- Includes a debug/cheat console that lets the user easily change their own player-state instantly in various ways
- Uses a few CSS and JS libraries, mainly jquery and bootstrap, and various jquery extensions


#### Game Loop
The `play()` function will
 - process user movement
 - send a position update to the server (if needed)
 - draw the canvas state, as defined by their local game state mentioned above
 - check if the user paused before calling play again after 20 milliseconds

#### Sockets
Web sockets (socket.io) is used for client/server communication of game state
- Client sends its position to the server if it detects a keypress occurring in the current loop
- The client processes user input and sends an update to the server at virtually the same time. If there are no keypresses detected, socket update step will be skipped
- The client receives updates from the server on an individual-player basis, and updates its local game state based on that new player's information
- Even when the loop is not running, the client is still receiving socket updates from the server


### The Server

- Processes new socket connections and disconnections
- Maintains a master state (for the game canvas)
- Is constantly getting socket updates from individual players every 20ms (if theyre pressing a key)
- When a socket update is received, it will update its master state and emit that player's new state to all connected sockets


## Prerequisites
-------------
- [Node.js](http://nodejs.org)


## Getting Started
---------------

```bash
git clone https://github.com/Bango1999/Multiplayer-Arena.git
cd Multiplayer-Arena && npm i
npm start
```

## License
MIT License
