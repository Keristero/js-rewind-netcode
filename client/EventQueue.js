class EventQueue{
    //Example event queue structure
    /*
    this.events = {
        6363:{                                               //tic number
            af50f8b4-18b0-4de4-b29b-0e89533e61f6:[           //clientId
                { type: 'keydown', tic: 6364, keycode:152}   //event
                { type: 'keyup', tic: 6364, keycode:152}     //event
            ]
        }
    }
    */
    constructor(){
        this.events = {}
        this.maximumTicAge = 100
    }
    _GetTicData(tic){
        if(!this.events[tic]){
            this.events[tic] = {}
        }
        return this.events[tic]
    }
    _GetClientEvents(ticData,clientID){
        if(!ticData[clientID]){
            ticData[clientID] = []
        }
        return ticData[clientID]
    }
    AddEvent(event,clientID){
        let ticData = this._GetTicData(event.tic)
        let clientEvents = this._GetClientEvents(ticData,clientID)
        /*
        ensure that event arrived chronologically, by ensuring the lid (local id)
        of the previous event is exactly 1 less than the lid of the new event
        */
        let previousEvent = clientEvents[clientEvents.length-1]
        //add the new event
        clientEvents.push(event)
        console.log("added event",event);
        this.earliestTic = event.tic

        if(previousEvent && previousEvent.lid !== event.lid-1){
            //now sort the array if it needs sorting.
            //ascending (1,2,3)
            clientEvents.sort((a, b) => a.lid - b.lid);
        }
    }
    _PruneEvents(currentTic){
        //Deletes all events for the oldest tic (if it is old enough)
        let sortedTics = Object.keys(this.events).sort((a, b) => a - b);
        let oldestTic = sortedTics[0]
        if(oldestTic && oldestTic < currentTic-this.maximumTicAge){
            delete this.events[oldestTic]
        }
    }
}


class LocalEventQueue extends EventQueue{
    constructor(clientNetcode){
        super()
        this.netcode = clientNetcode
        this.clientID = ""
        this.localID = 0
        this.earliestTic = Infinity
        //Add event handlers
        this.netcode.onEventFromServer = (event)=>{this._AddServerEvent(event)}
        this.netcode.onIdentity = (event)=>{this._onIdentity(event)}
        this.netcode.onTicSync = (tic)=>{this.onTicSync(tic)}
    }
    _onIdentity(clientID){
        this.clientID = clientID
    }
    onTicSync(tic){
        console.warn("EventQueue onTicSync unimplemented",tic)
    }
    onRollback(targetTic){
        console.warn("EventQueue onRollback unimplemented",targetTic)
    }
    onEvent(event){
        console.warn("EventQueue onEvent unimplemented",event)
    }
    ProcessEventQueue(currentTic){
        //Prune old events
        this._PruneEvents(currentTic)
        if(this.earliestTic == Infinity){
            //No events have arrived, no need to process event queue
            return
        }
        if(this.earliestTic > currentTic){
            //The events that arrived are for a future tic, no need to process event queue
            return
        }
        if(this.earliestTic < currentTic){
            //If any event arrived for an earlier tic than the current tic
            //trigger a rollback to said tic
            this.onRollback(this.earliestTic)
        }
        //Now loop through all of the tics (including the current tic)
        let iTic = this.earliestTic
        for(; iTic <= currentTic; iTic++){
            this._ProcessTic(iTic)
        }

        //Finally reset earliestTic to Infinity
        this.earliestTic = Infinity
    }
    _ProcessTic(tic){
        if(this.events[tic]){
            let ticData = this.events[tic]
            for(let clientID in ticData){
                let clientEvents = ticData[clientID]
                //For each client's events
                for(let event of clientEvents){
                    //trigger each event
                    this.onEvent(event)
                }
            }
        }
    }
    AddLocalEvent(event){
        //Add an event produced by the local machine
        //Assign a local id
        event.lid = this.localID++
        //Send event
        this.netcode.SendEvent(event)
        //Add event using own clientID
        this.AddEvent(event,this.clientID)
    }
    _AddServerEvent(event){
        //Add an event sent by the server
        //Add event using clientID from event               TODO:add cid alias system to save bandwith
        this.AddEvent(event,event.cid)
    }
}

if(typeof window === 'undefined'){
    //export only to nodejs environments
    exports.EventQueue = EventQueue
}