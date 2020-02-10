This framework has a few key parts
* __Server__, which serves the client files via http, provides websocket connections
* __Client Netcode__, handles connecting to the server
* __Event Queue__, A queue which contains a list of actions from each client, for each game tic. when a tic is processed - this queue runs callbacks for each event in order.
* __Networked Game__, A parent class for making networked games, handles saving and reloading of states, creation and deletion of peer clients.

also this readme is likely out of date, sorry.

### Todo
* Synchronize game state for clients that connect late (either send a serialized gamestate, or catch clients up using entire event queue?)
* Handle serverTic synchronizing propperly (currently it is just set, causing lost events)
* Identify clients on clientside correctly? right now when a new client connects the existing clients get the new clients ID?
* Handle client disconnections


### Notes
I have not looked at the code for GGPO, but I originally set out to make something similar to that (except I was planning on predicting every possible game state and storing it... very bad idea)
After finding out about GGPO I took some inspiration from how I heard that works.

Each component only talks to the components to the left and right of them, the Networked Game is independant of any netcode, relying only on the EventQueue
![Current Architecture](/notes/Iteration3.png)

### Usage
make a game class that extends NetworkedGame, the game must be fully deterministic. only event queue events can be used as inputs, and the game state must be fully serializable.

web client example
```javascript
let socket = new WebSocket(window.location.href.replace('http','ws'));

//Create netcode using a websocket as a transport
let clientNetcode = new ClientNetcode(socket)

//Create an event queue which can use the netcode
let eventQueue = new LocalEventQueue(clientNetcode)

//Create a game which only communicates with the eventQueue
let tankGame = new TankGame(eventQueue)
```

run the server using node.js and hope for the best.
