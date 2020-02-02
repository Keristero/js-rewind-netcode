const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app);
const WebSocket = require('ws');

const GameSerer = require('./GameServer')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});
const webSocketServer = new WebSocket.Server({ server });
const gameServer = new GameSerer(webSocketServer)

app.use(express.static('client'))


server.listen(3000, function(){
  console.log('listening on *:3000');
});