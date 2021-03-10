import React from "react";
import Vertex from "../../datatypes/Vertex";

class NetworkCustom extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            width: 0,
            height: 0,
            drawTool: "vertex",
            offsetX : 0,
            offsetY : 0,
            scale: 1,
            startDragX : null,
            startDragY : null,
            currentDragX: null,
            currentDragY: null,
        }
        this.heightConstant= 8.5/10
        this.widthConstant = 7/10
        this.minheight = 420
        this.network = React.createRef()
        this.boundingBoxes = [];
        this.edges = [];
        this.buffer = [];
    }

    componentDidMount(){
        const w = window.innerWidth * this.widthConstant
        const h = window.innerHeight * this.heightConstant
        this.network.current.width = w
        this.network.current.height = h
        window.addEventListener("resize", () => {this.resize()})
        window.requestAnimationFrame(() => this.animate());
        this.setState({width: w, height: h})
    }

    componentWillUnmount() {
        window.cancelAnimationFrame("resize", () => {this.resize()})
        window.cancelAnimationFrame(this.maxFrame);
    }

    animate(){
        // if(this.state.dragging) this.handleDrag()
        this.drawNetwork()
        this.maxFrame = window.requestAnimationFrame(() => this.animate())
    }

    drawNetwork(){
        const ctx = this.network.current.getContext("2d");
        ctx.clearRect(0, 0, this.state.width, this.state.height)
        const w = this.state.width;
        const h = this.state.height;

        ctx.translate(this.state.offsetX, this.state.offsetY)//translate by the offsets
        ctx.scale(this.state.scale, this.state.scale)
        for(let i = 0; i < this.boundingBoxes.length; i++){
            const v = this.boundingBoxes[i].vertex
            ctx.globalAlpha = 1.0
            ctx.beginPath()
            const color = v.color
            ctx.fillStyle = color
            ctx.arc(v.x*w ,
                v.y*h,
                v.size, 0, Math.PI*2)
            ctx.fill();
            ctx.closePath()
        }
        for(let j = 0; j < this.edges.length; j++){
            ctx.beginPath();
            const index1 = this.edges[j].start;
            const index2 = this.edges[j].end;
            ctx.moveTo(this.boundingBoxes[index1].vertex.x * w ,
                this.boundingBox[index1].vertex.y * h )
            ctx.lineTo(this.boundingBox[index2].vertex.x * w ,
                this.boundingBox[index2].vertex.y * h)
            ctx.globalAlpha = this.edges[j].alpha
            ctx.strokeStyle = this.applyEdgeColorGradient(this.boundingBox,this.edges[j], ctx, w, h)
            ctx.stroke();
            ctx.closePath();
        }
        ctx.scale(1/this.state.scale, 1/this.state.scale) //scale by zoom
        ctx.translate(-this.state.offsetX, -this.state.offsetY) //untranslate by the offsets
    }


    processDownOutcome(e){
        const rect = this.network.current.getBoundingClientRect();
        const x = e.clientX; const y = e.clientY;
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        const w = this.network.current.width;
        const h = this.network.current.height;
        if(this.state.drawTool === "vertex"){
            console.log("vertex");
            this.createVertex(canvasX, canvasY, w, h);
        } else {
            //TODO
        }
    }

    /**
     * Creates a vertex object
     * @param canvasX canvas space x coordinate
     * @param canvasY canvas space y coordinate
     * @param w width of the canvas
     * @param h height of the canvas
     */
    createVertex(canvasX, canvasY, w, h){
        let nearbyAlreadyExists = false
        for(let i = 0; i < this.boundingBoxes.length; i++){
            const box = this.boundingBoxes[i].box;
            const coords = this.canvasSpaceToObjectSpace(canvasX, canvasY, w, h)
            console.log(coords, box)
            if(this.inBox(box, coords.x, coords.y)){nearbyAlreadyExists = true; break;}
        }
        if(nearbyAlreadyExists) {
            this.setState({dragging:true, startDragX: canvasX, startDragY: canvasY})
            return;
        }

        const v = this.canvasSpaceToObjectSpace(canvasX, canvasY, w, h);
        const vx = v.x;
        const vy = v.y;
        console.log(vx,vy)
        const vertex = new Vertex(vx, vy);
        const max = this.canvasSpaceToObjectSpace(
            canvasX + vertex.size + 5,
            canvasY + vertex.size + 5,
            w,
            h)
        const maxX = max.x;
        const maxY = max.y;
        const min = this.canvasSpaceToObjectSpace(
            canvasX - vertex.size - 5,
            canvasY - vertex.size - 5,
            w,
            h)
        const minX = min.x;
        const minY  = min.y;
        const box = {
            vertex: vertex,
            box: {maxX: maxX, maxY: maxY, minX: minX, minY : minY}}

        this.boundingBoxes.push(box)
        this.buffer.push({bbox: box});
    }


    /**
     *
     * @param e
     */
    handleMouseMove(e){
        //TODO
        if(this.state.dragging){
            const rect = this.network.current.getBoundingClientRect();
            const x = e.clientX; const y = e.clientY;
            this.setState({currentX: x, currentY : y});
        }
    }

    /**
     *
     * @param e
     */
    clearDragging(e){
        //TODO
    }

    inBox(box, x, y){
        return x < box.maxX && x > box.minX && y < box.maxY && y > box.minY;
    }

    /**
     * transforms a set of coordinates from canvas space to object space
     * @param x x coordinate to transform
     * @param y y coordinate to transform
     * @param w width of the canvas
     * @param h height of the canvas
     * @returns {{x: number, y: *}}
     */
    canvasSpaceToObjectSpace(x, y, w, h){
        return {x : (x-this.state.offsetX)*(1/this.state.scale)/w, y: (y - this.state.offsetY)*(1/this.state.scale)/h}
    }

    resize(){
        const h = Math.max(window.innerHeight *this.heightConstant, this.minheight)
        const w = window.innerWidth  * this.widthConstant
        if (this.network.current !== null){
            this.network.current.width = w
            this.network.current.height = h
            this.setState({height: h, width: w})
        }
    }

    setDrag(e, shouldDrag){

    }


    /** zoom camera**/
    zoomCamera(e){
        const delta = -Math.sign(e.deltaY);
        const zoomIntensity = 0.1
        const scale = (this.state.scale) + (delta*zoomIntensity);
        const rect = this.network.current.getBoundingClientRect()
        this.setState({scale: scale, zoomMouseX: e.clientX -rect.left, zoomMouseY: e.clientY- rect.top});
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network} style = {{outline: "1px solid black"}}
                        onMouseDown= {(e) => this.processDownOutcome(e, true)}
                        onMouseUp = {(e) => this.clearDragging(e)}
                        onMouseLeave = {(e) => this.clearDragging(e)}
                        onWheel = {(e) => this.zoomCamera(e)}/>
            </div>
        )
    }
}

export default NetworkCustom