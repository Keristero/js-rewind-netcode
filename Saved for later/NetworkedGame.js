const NetworkObjects = {}
class NetworkedGame{
    constructor(snapshotHistory = 20){
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
    }
    get newObjectId(){
        return this.state.metadata.nextObjectId++
    }
    GetClient(clientID){
        return this.clients[clientID]
    }
    CreateClient(clientID){
        if(typeof this.state.clients[clientID] == "undefined"){
            let newClient = {
                inputs:{}
            }
            this.state.clients[clientID] = newClient
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
        console.log(this.snapshots)
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
    /**
     * 
     * @param {Number} tics number of tics to rollback
     */
    RollBack(tics){
        this.RestoreSnapshot(this.snapshots[tics])
    }
}