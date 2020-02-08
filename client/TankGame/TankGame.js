class TankGame extends NetworkedGame{
    constructor(eventqueue){
        super(eventqueue)

        this.controls = {
            "w":"up",
            "s":"down",
            "a":"left",
            "d":"right"
        }

        //Add Keypress Listeners
        window.addEventListener("keydown", e => {
            for(let key in this.controls){
                if(e.key == key){
                    this.CreateEvent("inputOn",{i:this.controls[key]})
                }
            }
        });
        window.addEventListener("keyup", e => {
            for(let key in this.controls){
                if(e.key == key){
                    this.CreateEvent("inputOff",{i:this.controls[key]})
                }
            }
        });

        //create canvas
        this.createCanvasCtx()

        //start draw loop
        this.Draw()
    }
    Draw(){
        //schedule this function to run again when the browser requests another frame
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.DrawObjects()
        window.requestAnimationFrame(()=>{this.Draw()})
    }
    DrawObjects(){
        for(let objectType in this.state.objects){
            let objects = this.state.objects[objectType]
            for(let objectID in this.state.objects[objectType]){
                let object = objects[objectID]
                //call draw on EVERY object
                object.Draw(this.ctx)
            }
        }
    }
    UpdateObjects(){
        for(let objectType in this.state.objects){
            let objects = this.state.objects[objectType]
            for(let objectID in this.state.objects[objectType]){
                let object = objects[objectID]
                //call draw on EVERY object
                if(objectType == "Tank"){
                    let client = this.GetClient(object.clientID)
                    object.Update(client)
                }
            }
        }
    }
    Update(){
        super.Update()
        this.UpdateObjects()
        this.ResetInputs()
    }
    CreateEvent(eventType,eventData){
        console.log("creating event",eventData)
        eventData.type = eventType
        eventData.tic = this.state.metadata.tic +1
        this.eventQueue.AddLocalEvent(eventData)
    }
    createCanvasCtx(){
        this.canvas = document.createElement('canvas')
        this.canvas.width = 800
        this.canvas.height = 600
        this.ctx = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }
    ResetInputs(){
        //loop through all inputs of all clients and set their "pressed" value to false
        //the pressed value exists so we can know if an input was pressed, even if it was pressed and released in the same tic!
        for(let clientID in this.state.clients){
            let client = this.state.clients[clientID]
            for(let inputName in client.inputs){
                let input = client.inputs[inputName]
                input.pressed = false
            }
        }
    }
    ProcessEvent(event){
        super.ProcessEvent(event)
        if(event.type == "connection"){
            //When a new client connects (including self and others)
            let clientID = event.uid
            this.CreateClient(clientID)
            let theirTank = new Tank({clientID:clientID})
            this.AddObject(theirTank)
            console.warn("SPOOKY TANK",theirTank)
        }
        if(event.type == "inputOn"){
            //When an input is pressed down
            if(event.uid){
                var clientID = event.uid
            }else{
                var clientID = this.eventQueue.clientID
            }
            let client = this.GetClient(clientID)
            client.inputs[event.i] = {state:true,pressed:true}
        }
        if(event.type == "inputOff"){
            //When an input is released
            if(event.uid){
                var clientID = event.uid
            }else{
                var clientID = this.eventQueue.clientID
            }
            let client = this.GetClient(clientID)
            client.inputs[event.i].state = false
        }
    }
}