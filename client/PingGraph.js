class PingGraph{
    constructor(parentElement,width=200,height=200){
        if(!isElement(parentElement)){
            throw("Ping graph requires a parent element to append a HtmlCanvasElement to")
        }
        this.width = width
        this.height = height
        this.lastReading = 0
        this.parentElement = parentElement
        this.ctx1 = this.createLayer(width,height)
        this.ctx2 = this.createLayer(width,height)
        this.x = 0
    }
    createLayer(width,height){
        let canvas = document.createElement('canvas')
        canvas.style.position = "absolute"
        canvas.width = width
        canvas.height = height
        this.parentElement.appendChild(canvas)
        let ctx = canvas.getContext('2d')
        return ctx
    }
    update(reading){
        this.drawGraph(reading)
        this.drawText(reading)
    }
    drawText(reading){
        let ctx = this.ctx2
        ctx.font = "20px Georgia";
        ctx.clearRect(0,0,this.width,this.height)
        ctx.fillText(`ping (ms): ${reading}`, 10, 50);
    }
    drawGraph(reading){
        let ctx = this.ctx1
        let distance = this.width*0.1
        ctx.beginPath();
        ctx.moveTo(this.x,this.getYPos(this.lastReading));
        this.x+= distance
        ctx.lineTo(this.x,this.getYPos(reading));
        ctx.stroke();
        this.lastReading = reading
        if(this.x > this.width*0.9){
            //Shift existing canvas contents left
            ctx.globalCompositeOperation = "copy";
            ctx.drawImage(ctx.canvas,-distance, 0);
            // reset back to normal for subsequent operations.
            ctx.globalCompositeOperation = "source-over"
            this.x -= distance
        }
    }
    getYPos(reading){
        return this.height-reading
    }
}

function isElement(obj) {
    try {
      //Using W3 DOM2 (works for FF, Opera and Chrome)
      return obj instanceof HTMLElement;
    }
    catch(e){
      //Browsers not supporting W3 DOM2 don't have HTMLElement and
      //an exception is thrown and we end up here. Testing some
      //properties that all elements have (works on IE7)
      return (typeof obj==="object") &&
        (obj.nodeType===1) && (typeof obj.style === "object") &&
        (typeof obj.ownerDocument ==="object");
    }
  }