NetworkObjects.Tank = class Tank{
    constructor(parameters){
        this.x = 100
        this.y = 100
        this.angle = 0
        this.speed = 0

        for(let key in parameters){
            this[key] = parameters[key]
        }
    }
    Fire(){
        this.ammo --
    }
    Draw(ctx){
        let hw = (this.width*0.5)
        let hh = (this.height*0.5)
        let x = this.x
        let y = this.y

        ctx.save(); 
        ctx.translate(x, y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'red'
        ctx.fillRect(-hw,-hh,this.width,this.height);
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2;
        ctx.strokeRect(-hw,-hh,this.width,this.height);
        ctx.restore();
    }
    Update(client){
        console.log(client)
        let inputs = client.inputs
        let angle = this.angle - 1.5708
        this.speed *= 0.8
        if(inputs["up"] && inputs["up"].state){
            this.speed += this.accel
        }
        if(inputs["down"] && inputs["down"].state){
            this.speed -= this.accel
        }
        if(inputs["left"] && inputs["left"].state){
            this.angle -= this.rotationSpeed
        }
        if(inputs["right"] && inputs["right"].state){
            this.angle += this.rotationSpeed
        }
        this.x += this.speed * Math.cos(angle);
        this.y += this.speed * Math.sin(angle);
    }
}

var Tank = NetworkObjects.Tank

Tank.prototype.width = 50
Tank.prototype.height = 100
Tank.prototype.rotationSpeed = 0.1
Tank.prototype.accel = 2