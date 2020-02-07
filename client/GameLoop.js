class GameLoop{
    constructor(updateFunction,ticsPerSecond = 20){
        this.updateFunction = updateFunction
        this.ticsPerSecond = ticsPerSecond
        this.ticInterval = 1000/this.ticsPerSecond
        this.looping = false
        this.updateTime = 0
    }
    Start(){
        this.looping = true
        console.log(`GameLoop running at ${this.ticsPerSecond}tps, ${this.ticInterval}ms tic length`)
        this.endTime = performance.now()
        this.Update()
    }
    Update(){
        let start = this.endTime
        this.endTime = start+this.ticInterval
        this.updateFunction()
        let now = performance.now()
        let timeLeftTillEnd = this.endTime-now
        this.updateTime = this.ticInterval-timeLeftTillEnd
        //console.log("remaining MS",this.ticInterval-timeLeftTillEnd)
        setTimeout(()=>{this.Update()},timeLeftTillEnd)
        if(this.updateTime > 5){
            console.warn("long update time",this.updateTime)
        }
    }
}

if(typeof window === 'undefined'){
    //export only to nodejs environments
    var {performance} = require('perf_hooks');
    exports.GameLoop = GameLoop
}