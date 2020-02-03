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
        this.state.metadata.tic++
        this.eventQueue.ProcessEventQueue(this.state.metadata.tic)
    }
    createCanvasCtx(){

    }
}

/*

let testGame = new NetworkedGame()
testGame.CreateClient("Dave")

let tankBarry = new NetworkObjects.Tank({name:"Barry",ammo:10})
testGame.AddObject(tankBarry)

for(let i = 0; i < 30; i++){
    let tanks = testGame.state.objects["Tank"]
    for(let tankID in tanks){
        let tank = tanks[tankID]
        tank.Fire()
        console.log(tank.ammo)
    }

    testGame.SnapshotState()
}
testGame.RollBack(0)
let tanks = testGame.state.objects["Tank"]
for(let tankID in tanks){
    let tank = tanks[tankID]
    console.log(tank.ammo)
}
*/