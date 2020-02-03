NetworkObjects.Tank = class Tank{
    constructor(parameters){
        for(let key in parameters){
            this[key] = parameters[key]
        }
    }
    Fire(){
        this.ammo --
    }
}