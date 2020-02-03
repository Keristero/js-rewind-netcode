class TankGame extends NetworkedGame{
    constructor(eventqueue){
        super(eventqueue)

        //Add Keypress Listeners
        document.body.addEventListener("keydown", e => {
            this.CreateEvent("keydown",{keycode:e.keyCode})
        });
        document.body.addEventListener("keyup", e => {
            this.CreateEvent("keyup",{keycode:e.keyCode})
        });

        //Start update loop
        this.eventID = 0
        this.ticsPerSecond = 20
        this.ticInterval = 1000/this.ticsPerSecond
        this.interval_update = setInterval(()=>{this.Update()},this.ticInterval)
        console.log(`TankGame running at ${this.ticsPerSecond}tps, ${this.ticInterval}ms tic length`)

    }
    CreateEvent(eventType,eventData){
        console.log("creating event",eventData)
        eventData.type = eventType
        eventData.tic = this.state.metadata.tic +1
        this.eventQueue.AddLocalEvent(eventData)
    }
    Update(){
        //Snapshot state as it is now
        this.SnapshotState()
        //process next tic's events
        this.eventQueue.ProcessEventQueue(this.state.metadata.tic+1)
    }
    createCanvasCtx(){

    }
}