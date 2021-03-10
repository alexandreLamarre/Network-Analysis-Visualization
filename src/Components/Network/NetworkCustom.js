import React from "react";
import Vertex from "../../datatypes/Vertex";
import Edge from "../../datatypes/Edge";

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
            startDragVertex: null, // for edge tool
            dragging: false,
            selectBox: null,
            selectedVertices : [],
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
        if(this.state.dragging) this.drawTools() //some tools leave marks as they are being operated
        this.maxFrame = window.requestAnimationFrame(() => this.animate())
    }

    drawNetwork(){
        const ctx = this.network.current.getContext("2d");
        ctx.clearRect(0, 0, this.state.width, this.state.height)
        const w = this.state.width;
        const h = this.state.height;
        //console.log(this.state.offsetX, this.state.offsetY)
        ctx.save();
        ctx.translate(this.state.offsetX, this.state.offsetY)//translate by the offsets
        ctx.scale(this.state.scale, this.state.scale);

        for(let i = 0; i < this.state.selectedVertices.length; i++){
            const s = this.state.selectedVertices[i];
            const v = this.boundingBoxes[s].vertex
            ctx.globalAlpha = 1.0
            ctx.beginPath()

            ctx.fillStyle = "rgb(0, 255, 0)"
            ctx.arc(v.x*w ,
                v.y*h,
                v.size + 5, 0, Math.PI*2)
            ctx.fill();
            ctx.closePath()
        }


        for(let i = 0; i < this.boundingBoxes.length; i++){
            const v = this.boundingBoxes[i].vertex
            ctx.globalAlpha = 1.0
            ctx.beginPath()
            ctx.fillStyle = v.color
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
                this.boundingBoxes[index1].vertex.y * h )
            ctx.lineTo(this.boundingBoxes[index2].vertex.x * w ,
                this.boundingBoxes[index2].vertex.y * h)
            ctx.globalAlpha = this.edges[j].alpha
            ctx.strokeStyle = this.edges[j].color;
            ctx.stroke();
            ctx.closePath();
        }

        if(this.state.selectBox !== null){
            const sx = this.state.selectBox.startX;
            const sy = this.state.selectBox.startY;
            const ex = this.state.selectBox.endX;
            const ey = this.state.selectBox.endY;
            ctx.save();

            ctx.beginPath();
            ctx.setLineDash([5,15]);
            ctx.globalAlpha = 1
            ctx.rect(
                sx * w,
                sy * h,
                (ex-sx) * w ,
                (ey-sy) * h);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        ctx.scale(1/this.state.scale, 1/this.state.scale) //scale by zoom
        ctx.translate(-this.state.offsetX, -this.state.offsetY) //untranslate by the offsets
        ctx.restore();


    }

    drawTools(){
        if(this.state.drawTool === "edge"){
            const v = this.state.startDragVertex
            if(v !== null){
                const coords = this.objectSpaceToCanvasSpace(
                    this.boundingBoxes[v].vertex.x,
                    this.boundingBoxes[v].vertex.y,
                    this.state.width,
                    this.state.height,
                )
                const x = coords.x
                const y = coords.y
                const ctx = this.network.current.getContext("2d");
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.setLineDash([5,15])
                ctx.lineTo(this.state.currentDragX, this.state.currentDragY);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }

        } else if(this.state.drawTool === "select" && this.state.selectBox === null){
            const ctx = this.network.current.getContext("2d");
            const sx = this.state.startDragX;
            const sy = this.state.startDragY;
            const ex = this.state.currentDragX;
            const ey = this.state.currentDragY;
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([5,15]);
            ctx.rect(sx,sy,ex-sx,ey - sy)
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

    }

    /**
     * Handles mouse down events based on the currently selected drawing tool
     * @param e mouse event
     */
    processDownOutcome(e){
        this.checkRemoveSelectedBox();

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
            || this.state.drawTool === "move") {
            this.setState({
                dragging: true,
                startDragX: canvasX,
                startDragY: canvasY,
                currentDragX: canvasX,
                currentDragY: canvasY});
        }
    }

    processDrag(){
        if(this.state.selectBox !== null && this.state.drawTool === "select"){
            //we should move the select box and its contents if it is selected with the mouse
            const coords1 = this.canvasSpaceToObjectSpace(
                this.state.startDragX,
                this.state.startDragY,
                this.state.width,
                this.state.height)
            const coords2 = this.canvasSpaceToObjectSpace(
                this.state.currentDragX,
                this.state.currentDragY,
                this.state.width,
                this.state.height
            )

            const sx = coords1.x; const sy = coords1.y;
            const cx = coords2.x; const cy = coords2.y;
            if(sx > this.state.selectBox.startX
                && sx <this.state.selectBox.endX
                && sy > this.state.selectBox.startY
                && sy < this.state.selectBox.endY){

                const deltaX = cx - sx
                const deltaY = cy - sy
                this.updateSelectedCoords(deltaX, deltaY);
                // this.updateSelectedCoordsVertices();
                this.setState({
                    startDragX: this.state.currentDragX,
                    startDragY : this.state.currentDragY
                });
            } else{
                this.removeSelectedVertices();
            }
        }else if(this.state.drawTool === "edge"){
            console.log("processing edge")
            const vertex = this.nearbyVertexExists(
                this.state.currentDragX,
                this.state.currentDragY,
                this.state.width, this.state.height).vertex
            if(vertex === null) return;
            if(this.state.startDragVertex === null){
                this.setState({
                    startDragVertex: vertex,
                    startDragX: this.state.currentDragX,
                    startDragY: this.state.currentDragY});
            } else if(this.state.startDragVertex !== vertex){
                this.createEdge(this.state.startDragVertex, vertex);
                this.setState({
                    startDragVertex: vertex,
                    startDragX : this.state.currentDragX,
                    startDragY : this.state.currentDragY,
                })
            }
        } else if(this.state.drawTool === "move"){
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
        if(this.state.drawTool === "select" && this.state.selectBox === null
            && this.state.currentDragX !== this.state.startDragX
            && this.state.currentDragY !== this.state.startDragY){
            const coords1 = this.canvasSpaceToObjectSpace(
                this.state.startDragX,
                this.state.startDragY,
                this.state.width,
                this.state.height);
            const coords2 = this.canvasSpaceToObjectSpace(
                this.state.currentDragX,
                this.state.currentDragY,
                this.state.width,
                this.state.height
            )
            const x1 = coords1.x; const x2 = coords2.x;
            const y1 = coords1.y; const y2 = coords2.y;
            const selectBox = {
                startX:  Math.min(x1, x2),
                startY: Math.min(y1, y2),
                endX : Math.max(x1, x2),
                endY: Math.max(y1, y2)}

            this.selectVerticesFromBox(selectBox);
            this.setState({
                selectBox: selectBox});
            }
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
            box: {maxX: maxX, maxY: maxY, minX: minX, minY : minY},
            selected: false,
        }

        this.boundingBoxes.push(box)
        this.buffer.push({bbox: box});
    }

    /**
     * Creates an edge between v1 and v2 if non already exists between them
     * @param v1 first enpoint
     * @param v2 second endpoint
     */
    createEdge(v1, v2){
        for(let i = 0; i < this.edges.length; i++){
            const e = this.edges[i];
            if(e.start === v1 && e.start === v2){
                console.log("edge already exists")
                return
            }
        }
        const e = new Edge(v1, v2);
        this.edges.push(e)
    }

    /**
     * Updates the selected vertices upon creation of a select box
     * @param box
     * @returns {[]}
     */
    selectVerticesFromBox(box){
        const selectedVertices = [];
        for(let i = 0; i < this.boundingBoxes.length; i++){
            const v = this.boundingBoxes[i].vertex;
            if(v.x < box.endX && v.x > box.startX && v.y < box.endY && v.y > box.startY){
                selectedVertices.push(i)
            }
        }
        console.log("SELECTED VERTICES", selectedVertices)

        this.setState({selectedVertices: selectedVertices})
    }


    /**
     * Updates the coordinates of the select box
     * and all of its dependant selected vertices by the specified amounts
     * @param deltaX the amount to move in the X direction in object space
     * @param deltaY the amount to move in the Y direction in object space
     */
    updateSelectedCoords(deltaX, deltaY){
        const selectBox = this.state.selectBox;

        selectBox.startX += deltaX
        selectBox.startY += deltaY;
        selectBox.endX += deltaX;
        selectBox.endY += deltaY;
        const selectedVertices = this.state.selectedVertices
        for(let i = 0; i < selectedVertices.length; i++){
            const s = selectedVertices[i];
            const v = this.boundingBoxes[s].vertex;
            v.x += deltaX;
            v.y += deltaY;
            const b = this.boundingBoxes[s].box;
            b.maxX += deltaX;
            b.minX += deltaX;
            b.minY += deltaY;
            b.maxY += deltaY;
        }

        this.setState({selectBox: selectBox})
    }

    /**
     * Checks to see if we should remove the selected box if it exists
     */
    checkRemoveSelectedBox(){
        if(this.state.drawTool !== "move" && this.state.drawTool !== "select" && this.state.selectBox !== null){
            this.removeSelectedVertices();
        }
    }

    /**
     * Resets the selected vertices
     */
    removeSelectedVertices(){
        this.setState({selectBox: null, selectedVertices: []})
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
                vertex = i
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
        this.setState({
            startDragX: null,
            startDragY: null,
            currentDragX: null,
            currentDragY: null,
            dragging:false,
            startDragVertex: null})
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

    /**
     * transforms a set of coordinates from object space to canvas space
     * @param x x coordinate to transform
     * @param y y coordinate to transform
     * @param w width of the canvas
     * @param h height of the canvas
     * @returns {{x: number, y: *}}
     */
    objectSpaceToCanvasSpace(x, y, w, h){
        return {x : x*w*this.state.scale+ this.state.offsetX, y: y*this.state.scale*h +this.state.offsetY}
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
                            cursor: this.state.drawTool === "move"? "move":
                                this.state.drawTool === "select"? "cell": "default",
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
                <button onClick = {() => this.setState({drawTool: "move"})}> Move </button>
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