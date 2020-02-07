class GameLoop{
    constructor(updateFunction,ticsPerSecond = 20){
        this.updateFunction = updateFunction
        this.ticsPerSecond = ticsPerSecond
        this.ticInterval = 1000/this.ticsPerSecond
        this.looping = false
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
        setTimeout(()=>{this.Update()},timeLeftTillEnd)
    }
}

if(typeof window === 'undefined'){
    //export only to nodejs environments
    var {performance} = require('perf_hooks');
    exports.GameLoop = GameLoop
}