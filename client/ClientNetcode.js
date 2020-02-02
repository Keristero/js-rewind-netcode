class ClientNetcode{
    constructor(socket){
        this.socket = socket
        socket.onmessage = (message)=>{this.handleMessage(message)}

        //Create a ping graph
        this.pingGraph = new PingGraph(document.body,200,200)
        setInterval(()=>{
            this.sendPing()
        },1000)

        //start game tic loop
        this.tic = 0
        this.eventID = 0
        this.ticsPerSecond = 20
        this.ticInterval = 1000/this.ticsPerSecond
        this.interval_tic = setInterval(()=>{this.runEveryTic()},this.ticInterval)
        console.log(`Game Client running at ${this.ticsPerSecond}tps, ${this.ticInterval}ms tic length`)

        //Add Keypress Listeners
        document.body.addEventListener("keydown", e => {
            this.createEvent("keydown",{keycode:e.keyCode})
        });
        document.body.addEventListener("keyup", e => {
            this.createEvent("keyup",{keycode:e.keyCode})
        });

        //Event queue
        this.events = {} //unfinished

        //Lag compensation
        this.lagCompensationEnabled = false

    }
    get latencyCompensatedTic(){
        if(this.lagCompensationEnabled){
            //this will disadvantage bad ping clients :(
            //but it might make stuff smoother?

            //It would be better to either let the client decide on a static lag amount
            //or determine a lag amount at the start of each game based on all player's connections
            return this.tic + (1+Math.floor(this.ping/this.ticInterval))
        }else{
            return this.tic + 1
        }
    }
    createEvent(eventType,eventData){
        let event = {
            type:eventType,
            ...eventData,
            tic:this.latencyCompensatedTic,
        }
        this.localEventQueue.AddLocalEvent(event)
        this.socket.send(JSON.stringify(event));
    }
    runEveryTic(){
        this.tic++
        this.localEventQueue.ProcessEventQueue(this.tic)
    }
    sendPing(){
        this.socket.send(JSON.stringify({type:"ping",ms:Date.now()}));
    }
    handleMessage(message){
        console.log(message.data);
        let data = JSON.parse(event.data)

        //connection
        if(data.type == "connection"){
            this.id = data.id
            this.localEventQueue = new LocalEventQueue(this.id,this.handleRollback,this.handleEvent)

        }else if(data.type == "pong"){
            this.ping = Date.now() - data.ms
            this.pingGraph.update(this.ping)

        }else if(data.type == "serverTic"){
            this.tic = data.tic

        }else{
            this.localEventQueue.AddServerEvent(data)
        }
        
    }
    handleRollback(tic){
        console.warn(`Rolling back state to ${tic} from ${this.tic}`)
    }
    handleEvent(event){
        console.log("handling event",event)
    }
}