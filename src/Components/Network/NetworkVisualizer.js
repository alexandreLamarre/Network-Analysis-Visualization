import React from "react";
import Network from "./Network";
import SpringEmbedding from "../../Animations/Algorithms/LayoutAlgorithms/springEmbedding";

import {IonIcon, IonButton} from "@ionic/react"
import {save, cameraReverse} from "ionicons/icons"

import "./networkVisualizer.css";

class NetworkVisualizer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            width: 0,
            height: 0,
            network: null,
            sorted: false,
            offsetX: 0,
            offsetY: 0,
            dragging: false,
            previousMouseX: 0,
            previousMouseY: 0,
            zoomMouseX: null,
            zoomMouseY: null,
            scale: 1,
        }
        this.frameId = 0;
        this.settings = this.props.settings
        this.heightConstant= 8.5/10
        this.widthConstant = 7/10
        this.minheight = 420
        this.network = React.createRef()
        this.networkData = this.props.networkData
        this.animator = this.props.animator
    }

    async componentDidMount(){
        const w = window.innerWidth * this.widthConstant
        const h = window.innerHeight * this.heightConstant
        this.network.current.width = w
        this.network.current.height = h

        await this.props.parent.resetAnimationLogic() //clear any animations loaded when changing network visualizations
        this.networkData.set3D(false)
        this.networkData.createRandomNetwork()

        this.setState({width: w, height: h})
        window.addEventListener("resize", () => {this.resize()})
        this.frameId = window.requestAnimationFrame(() => this.animate())
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => {this.resize()})
        window.cancelAnimationFrame(this.frameId)
    }

    animate(){
        if(this.networkData !== null && this.network.current !== null){
            if(this.networkData.shouldReset()){
                this.networkData.createRandomNetwork()
            } else if(this.networkData.shouldResizeVertex()){
                this.networkData.applyVertexSize()
            } else if(this.networkData.shouldRecolor()){
                this.networkData.applyColorGradient()
            }
            this.drawNetwork(this.networkData)
            this.frameId = window.requestAnimationFrame(() => this.animate())
        }

    }

    drawNetwork(network){
        const w = this.network.current.width
        const h = this.network.current.height
        const ctx = this.network.current.getContext("2d");
        ctx.clearRect(0, 0, this.network.current.width, this.network.current.height)
        ctx.translate(this.state.offsetX, this.state.offsetY)//translate by the offsets

        ctx.scale(this.state.scale, this.state.scale)

        for(let i = 0; i < network.vertices.length; i++){
            ctx.globalAlpha = 1.0
            ctx.beginPath()
            const color = network.vertices[i].color
            ctx.fillStyle = color
            ctx.arc(network.vertices[i].x*w ,
                network.vertices[i].y*h,
                network.vertices[i].size, 0, Math.PI*2)
            ctx.fill();
            ctx.closePath()
        }

        for(let j = 0; j < network.edges.length; j++){
            ctx.beginPath();
            const index1 = network.edges[j].start;
            const index2 = network.edges[j].end;
            ctx.moveTo(network.vertices[index1].x * w ,
                        network.vertices[index1].y * h )
            ctx.lineTo(network.vertices[index2].x * w ,
                        network.vertices[index2].y * h)
            ctx.globalAlpha = network.edges[j].alpha
            ctx.strokeStyle = this.applyEdgeColorGradient(network.vertices,network.edges[j], ctx, w, h)
            ctx.stroke();
            ctx.closePath();
        }
        ctx.scale(1/this.state.scale, 1/this.state.scale) //scale by zoom
        ctx.translate(-this.state.offsetX, -this.state.offsetY) //untranslate by the offsets
    }

    resize(){
        const h = Math.max(window.innerHeight *this.heightConstant, this.minheight)
        const w = window.innerWidth  * this.widthConstant
        if(this.network.current !== null){
            this.network.current.width = w
            this.network.current.height = h
            this.setState({height: h, width: w})
        }

    }

    applyEdgeColorGradient(vertices, edge, ctx, w, h){
        if(Array.isArray(edge.color)){
            var gradient = ctx.createLinearGradient(
                vertices[edge.start].x *w,
                vertices[edge.start].y * h,
                vertices[edge.end].x*w,
                vertices[edge.end].y*h)
            gradient.addColorStop(0, edge.color[0]);
            gradient.addColorStop(1, edge.color[1])
            return gradient
        } else{
            return edge.color
        }
    }

    //SPECIFIC EVENT HANDLERS

    /** handles whether drag events on canvas are occuring**/
    setDrag(e,v){
        e.preventDefault();
        if(v === true) {
            this.setState({previousMouseX : e.clientX});
            this.setState({previousMouseY : e.clientY});
        }
        this.setState({dragging:v});
    }

    /** updates the camera based on user-input events on canvas**/
    updateCamera(e){
        e.preventDefault();
        if(this.state.dragging){
            const deltaX = e.clientX - this.state.previousMouseX;
            const deltaY = e.clientY - this.state.previousMouseY;
            const new_offsetX = this.state.offsetX + deltaX/(this.state.scale);
            const new_offsetY = this.state.offsetY + deltaY/(this.state.scale);
            this.setState({previousMouseX: e.clientX, previousMouseY: e.clientY,
                offsetX: new_offsetX, offsetY: new_offsetY});
        }
        const rect = this.network.current.getBoundingClientRect()
        this.setState({ currentMouseX: e.clientX -rect.left, currentMouseY: e.clientY - rect.top})
    }

    /** zoom camera**/
    zoomCamera(e){
        const delta = -Math.sign(e.deltaY);
        const zoomIntensity = 0.1
        const scale = (this.state.scale) + (delta*zoomIntensity);
        const rect = this.network.current.getBoundingClientRect()
        this.setState({scale: scale, zoomMouseX: e.clientX -rect.left, zoomMouseY: e.clientY- rect.top});
    }

    /** Resets camera to default position**/
    resetCamera(){
        console.log("resetting camera")
        this.setState({offsetX:0,offsetY:0, scale: 1, mouseX: this.state.width/2, mouseY:this.state.height/2})
    }

    /**
     * Saves the network as a file
     * @param type string: the extension type to save the file as
     */
    saveAs(type){
        var link = document.createElement("a");
        link.download = "Network." + type;
        document.body.appendChild(link);

        if(type === "csv"){
            alert("csv format networks download is not fully supported yet")
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Nothing here yet";
            link.href = csvContent;
        } else{
            const canvas = this.network.current;
            link.href = canvas.toDataURL("network/"+type);
        }
        link.click();
        document.body.removeChild(link)
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network} style = {{backgroundColor: "rgba(255,255,255,0.5)", outline: "1px solid blue"}}
                        onMouseLeave = {(e) => this.setDrag(e,false)}
                        onMouseDown = {(e) => this.setDrag(e,true)}
                        onMouseUp = {(e) => this.setDrag(e,false)}
                        onMouseMove = {(e) => this.updateCamera(e)}
                        onWheel = {(e) => this.zoomCamera(e)}
                />
                <div className = "dropdown"
                    title = "Save as"
                    style = {{
                    cursor: "pointer",
                    width: 10,
                    height: 10,
                    position: "absolute",
                    top:this.state.height -36,
                    left: this.state.width-47}}>
                    <IonButton
                        class = "no-ripple"
                        fill = "clear">
                    <IonIcon
                        title = {false}
                        size = "large"
                        color = "primary"
                        icon={save}/>
                    </IonButton>
                    <div className = "dropdown-content" style = {{top: -85}}>
                        <a className = "aFile" onClick = {() => this.saveAs("csv")}>.csv</a>
                        <a className = "aFile" onClick = {() => this.saveAs("png")}>.png</a>
                        <a className = "aFile" onClick = {() => this.saveAs("jpg")}>.jpg</a>
                    </div>
                </div>
                <div
                    title = "Reset camera to default"
                    style = {{
                    cursor: "pointer",
                    width: 10,
                    height: 10,
                    position: "absolute",
                    top:this.state.height -36,
                    left: this.state.width-85,
                    }}>
                    <IonButton fill = "clear"
                               class = "no-ripple"
                               onClick = {() => this.resetCamera()}
                    >
                    <IonIcon
                        size = "large"
                        title = {false}
                        color = "primary"
                        icon = {cameraReverse}>
                    </IonIcon>
                    </IonButton>
                </div>

            </div>
        )
    }
}

export default NetworkVisualizer