const NetworkObjects = {}
class NetworkedGame{
    constructor(eventQueue,snapshotHistory = 20){
        this.eventQueue = eventQueue
        //Add event handlers
        this.eventQueue.onEvent = (event)=>{this.ProcessEvent(event)}
        this.eventQueue.onRollback = (event)=>{this.RollBack(event)}
        this.eventQueue.onTicSync = (tic)=>{this.TicSync(tic)}

        //Initialize state
        this.state = {
            metadata:{
                tic:0,
                nextObjectId:0
            },
            clients:{

            },
            objects:{

            }
        }
        this.snapshots = []
        this.snapshotHistory = snapshotHistory //Number of state snapshots to keep

        //Start update loop
        this.eventID = 0
        let loop = new GameLoop(()=>{
            this.Update()
        },)
        loop.Start()
    }
    Update(){
        //Snapshot state as it is now
        this.SnapshotState()
        //process next tic's events
        this.eventQueue.ProcessEventQueue(this.state.metadata.tic+1)
    }
    get newObjectId(){
        return this.state.metadata.nextObjectId++
    }
    GetClient(clientID){
        return this.state.clients[clientID]
    }
    CreateClient(clientID){
        if(typeof this.state.clients[clientID] == "undefined"){
            let newClient = {
                inputs:{}
            }
            this.state.clients[clientID] = newClient
            console.warn('new client connected',clientID)
            return newClient
        }
    }
    DeleteClient(clientID){
        delete this.clients[clientID]
    }
    AddObject(newObject){
        //Add an object to the state
        let objectID = this.newObjectId
        let objectType = newObject.constructor.name
        let objectGroup = this.GetObjectGroup(objectType)
        objectGroup[objectID] = newObject
        return objectID
    }
    GetObjectGroup(objectType){
        if(!this.state.objects[objectType]){
            this.state.objects[objectType] = {}
        }
        return this.state.objects[objectType]
    }
    SnapshotState(){
        this.latestSnapshotJSON = JSON.stringify(this.state)
        this.snapshots.unshift(this.latestSnapshotJSON)
        if(this.snapshots.length > 25){
            this.snapshots.pop()
        }
    }
    RestoreSnapshot(snapshotJSON){
        this.state = JSON.parse(snapshotJSON)
        for(let ConstructorName in this.state.objects){
            let objectGroup = this.state.objects[ConstructorName]
            for(let objectID in objectGroup){
                let rawObj = objectGroup[objectID]
                objectGroup[objectID] = new NetworkObjects[ConstructorName](rawObj)
            }
        }
    }
    TicSync(serverTic){
        //set tic to tic recieved from server
        if(this.state.metadata.tic != serverTic){
            console.warn(`tic ${this.state.metadata.tic}/${serverTic}, ${this.state.metadata.tic-serverTic} tics out, skipping tics to sync, fix this later`)
            this.state.metadata.tic = serverTic
        }
    }
    /**
     * 
     * @param {Number} targetTic tic to rollback to
     */
    RollBack(targetTic){
        let originalTic = this.state.metadata.tic
        console.warn(`Rolling back to ${targetTic} from ${originalTic}`)
        let ticsToRollback = this.state.metadata.tic-targetTic //number of tics to rollback
        this.RestoreSnapshot(this.snapshots[ticsToRollback])
    }
    ProcessEvent(event){
        console.log('event',event)
        if(event.type == "setTic"){
            this.state.metadata.tic = event.targetTic
        }
        if(event.type == "connection"){
            this.CreateClient(event.uid)
        }
    }
}