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
    }
    CreateEvent(eventType,eventData){
        console.log("creating event",eventData)
        eventData.type = eventType
        eventData.tic = this.state.metadata.tic +2
        this.eventQueue.AddLocalEvent(eventData)
    }
    createCanvasCtx(){

    }
    ProcessEvent(event){
        super.ProcessEvent(event)
        if(event.type == ""){

        }
    }
}