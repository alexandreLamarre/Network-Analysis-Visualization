import React from "react";
import Vertex from "../../datatypes/Vertex";

class NetworkCustom extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            width: 0,
            height: 0,
            drawTool: "vertex", // vertex, edge, select, move
            offsetX : 0,
            offsetY : 0,
            scale: 1,
            startDragX : null,
            startDragY : null,
            currentDragX: null,
            currentDragY: null,
            dragging: false
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
        this.props.parent.setState({custom: true})
        this.setState({width: w, height: h})
    }

    componentWillUnmount() {
        this.props.parent.setState({custom: false})
        window.cancelAnimationFrame("resize", () => {this.resize()})
        window.cancelAnimationFrame(this.maxFrame);
    }

    animate(){
        if(this.state.dragging) this.processDrag()
        this.drawNetwork()
        this.maxFrame = window.requestAnimationFrame(() => this.animate())
    }

    drawNetwork(){
        const ctx = this.network.current.getContext("2d");
        ctx.clearRect(0, 0, this.state.width, this.state.height)
        const w = this.state.width;
        const h = this.state.height;
        //console.log(this.state.offsetX, this.state.offsetY)
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

    /**
     * Handles mouse down events based on the currently selected drawing tool
     * @param e mouse event
     */
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
        } else if (this.state.drawTool === "edge"
            || this.state.drawTool === "select"
            || this.state.drawTool === "shit") {
            console.log(this.state.drawTool)
            this.setState({dragging: true, startDragX: canvasX, startDragY: canvasY});
        }
    }

    processDrag(){
        if(this.state.drawTool === "edge"){
            console.log("processing edge")
        } else if (this.state.drawTool === "select"){
            console.log("processing select")
        } else if(this.state.drawTool === "shit"){
            console.log(this.state.startDragX, this.state.startDragY)
            const deltaX = this.state.startDragX - this.state.currentDragX;
            const deltaY = this.state.startDragY - this.state.currentDragY;
            const offsetX = this.state.offsetX - deltaX/this.state.scale;
            const offsetY = this.state.offsetY - deltaY/this.state.scale;
            console.log(deltaX, deltaY)
            this.setState({
                offsetX: offsetX,
                offsetY: offsetY,
                startDragX: this.state.currentDragX,
                startDragY: this.state.currentDragY
            })
        }
    }

    processDragOutcome(){
        console.log("mouse up")
        this.clearDragging()
    }

    /**
     * Creates a vertex object and its corresponding bounding box
     * @param canvasX canvas space x coordinate
     * @param canvasY canvas space y coordinate
     * @param w width of the canvas
     * @param h height of the canvas
     */
    createVertex(canvasX, canvasY, w, h){
        if(this.nearbyVertexExists(canvasX, canvasY, w, h).value) return

        //otherwise create a vertex and boundin box in object space
        const v = this.canvasSpaceToObjectSpace(canvasX, canvasY, w, h);
        const vx = v.x;
        const vy = v.y;
        console.log(vx,vy)
        const vertex = new Vertex(vx, vy);
        const max = this.canvasSpaceToObjectSpace(
            canvasX + vertex.size + 10,
            canvasY + vertex.size + 10,
            w,
            h)
        const maxX = max.x;
        const maxY = max.y;
        const min = this.canvasSpaceToObjectSpace(
            canvasX - vertex.size - 10,
            canvasY - vertex.size - 10,
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
     * Helper method to check whether or not there is a vertices near the selected canvas coords
     * within the canvas bounds w, h.
     * Returns a value of true and a vertex if one is found otherwise false and null.
     * @param canvasX canvas space x coordinate
     * @param canvasY canvas space y coordinate
     * @param w width of the canvas
     * @param h height of the canvas
     * @returns {{vertex: Vertex, value: boolean}}
     */
    nearbyVertexExists(canvasX, canvasY, w, h){
        let nearbyAlreadyExists = false
        let vertex = null
        for(let i = 0; i < this.boundingBoxes.length; i++){
            const box = this.boundingBoxes[i].box;
            const coords = this.canvasSpaceToObjectSpace(canvasX, canvasY, w, h)
            if(this.inBox(box, coords.x, coords.y)){
                nearbyAlreadyExists = true;
                vertex = this.boundingBoxes[i].vertex;
                break;
            }
        }
        return {value: nearbyAlreadyExists, vertex: vertex}
    }


    /**
     *
     * @param e
     */
    handleMouseMove(e){
        if(this.state.dragging){
            const rect = this.network.current.getBoundingClientRect();
            const x = e.clientX -rect.left; const y = e.clientY-rect.top;
            this.setState({currentDragX: x, currentDragY : y});
        }
    }

    /**
     *
     * @param e
     */
    clearDragging(){
        console.log("drag cleared")
        this.setState({startDragX: null, startDragY: null, currentDragX: null, currentDragY: null, dragging:false})
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



    /** zoom camera**/
    zoomCamera(e){
        const delta = -Math.sign(e.deltaY);
        const zoomIntensity = 0.1
        const scale = (this.state.scale) + (delta*zoomIntensity);
        const rect = this.network.current.getBoundingClientRect()
        this.setState({scale: scale, zoomMouseX: e.clientX -rect.left, zoomMouseY: e.clientY- rect.top});
    }

    /**
     * Resets camera zoom and offset
     */
    resetCamera(){
        this.setState({offsetX: 0, offsetY: 0, scale: 1})
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network}
                        style = {{
                            cursor: this.state.drawTool === "shit"? "move": "default",
                            outline: "1px solid black"
                        }}
                        onMouseDown= {(e) => this.processDownOutcome(e, true)}
                        onMouseMove = {(e) => this.handleMouseMove(e)}
                        onMouseUp = {(e) => this.processDragOutcome(e)}
                        onMouseLeave = {() => this.clearDragging()}
                        onWheel = {(e) => this.zoomCamera(e)}/>

                <button onClick = {() => this.setState({drawTool: "vertex"})}> Vertex </button>
                <button onClick = {() => this.setState({drawTool: "edge"})}> Edge</button>
                <button onClick = {() => this.setState({drawTool: "select"})}> Select </button>
                <button onClick = {() => this.setState({drawTool: "shit"})}> Move </button>
                <button> Undo </button>
                <button> Redo </button>
                <button onClick = {() => this.resetCamera()}> Reset camera </button>
                <button > Save as</button>
                <input type = "color"/>
            </div>
        )
    }
}

export default NetworkCustom