class ClientNetcode{
    constructor(socket){
        this.socket = socket
        socket.onmessage = (message)=>{this.handleMessage(message)}
    }
    SendEvent(event){
        this.socket.send(JSON.stringify(event));
    }
    sendPing(){
        this.socket.send(JSON.stringify({type:"ping",ms:Date.now()}));
    }
    onTicSync(userID){
        console.warn("ClientNetcode onTicSync is unimplemented",userID)
    }
    onIdentity(userID){
        console.warn("ClientNetcode onIdentity is unimplemented",userID)
    }
    onEventFromServer(event){
        console.warn("ClientNetcode onEventFromServer is unimplemented",event)
    }
    handleMessage(message){
        console.log(message.data);
        let data = JSON.parse(event.data)

        if(data.type == "connection"){
            this.onIdentity(data.id)
        }else if(data.type == "pong"){
            this.ping = Date.now() - data.ms
        }else if(data.type == "serverTic"){
            this.onTicSync(data.tic)
        }else{
            this.onEventFromServer(data)
        }
        
    }
}