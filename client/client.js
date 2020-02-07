console.log('loaded')

let debugMode = false;

let socket = new WebSocket(window.location.href.replace('http','ws'));

//Create netcode using a websocket as a transport
let clientNetcode = new ClientNetcode(socket)

//Create an event queue which can use the netcode
let eventQueue = new LocalEventQueue(clientNetcode)

//Create a game which only communicates with the eventQueue
let tankGame = new TankGame(eventQueue)