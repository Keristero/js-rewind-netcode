const uuidv4 = require('uuid/v4');
const {EventQueue} = require('./client/EventQueue.js')

class GameServer{
    constructor(webSocketServer){
        this.wss = webSocketServer
        this.eventQueue = new EventQueue()

        //create connection handler
        webSocketServer.on('connection',(websocket,request)=>{this.handleConnection(websocket,request)})

        //start game tic loop
        this.tic = 0
        this.ticsPerSecond = 20
        this.ticInterval = 1000/this.ticsPerSecond
        this.interval_tic = setInterval(()=>{this.runEveryTic()},this.ticInterval)
        console.log(`Game Server running at ${this.ticsPerSecond}tps, ${this.ticInterval}ms tic length`)
    }
    runEveryTic(){
        this.tic++
        if(this.tic % 100 == 0){
            this.wss.clients.forEach((socket)=>{
                socket.send(JSON.stringify({type:"serverTic",tic:this.tic}))
            });
        }
    }
    get clientCount(){
        let count = 0
        this.wss.clients.forEach((client)=>{
            count++
        });
        return count
    }
    handleConnection(websocket,request){
        //When a client connects via websocket
        console.log(`websocket connection`)
        console.log(`${this.clientCount} clients currently connected`)
        //assign the websocket a unique id
        websocket.id = uuidv4();
        //send it back so the client know's it's own id
        websocket.send(JSON.stringify({type:"identity",id:websocket.id}))
        //and we also broadcast to all clients, so they know about the connection
        this.broadcastToAllClients(JSON.stringify({type:"connection",uid:websocket.id,tic:this.tic}))
        //create a message handler
        websocket.on('message',(json)=>{this.handleMessage(json,websocket)})
    }
    handleMessage(json,websocket){
        let data = JSON.parse(json)
        //Ping
        if(data.type == "ping"){
            websocket.send(JSON.stringify({type:"pong",ms:data.ms}))
        }else{
            let event = data
            this.eventQueue.AddEvent(event,websocket.id)
            //add clientID to event
            event.cid = websocket.id
            this.broadcastToAllClientsExcept(websocket.id,JSON.stringify(event))
        }
    }
    broadcastToAllClients(serialData){
        for(let websocket of this.wss.clients){
            websocket.send(serialData)
        }
    }
    broadcastToAllClientsExcept(clientID,serialData){
        for(let websocket of this.wss.clients){
            if(clientID != websocket.id){
                websocket.send(serialData)
            }
        }
    }
}

module.exports = GameServer