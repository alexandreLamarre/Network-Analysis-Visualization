import React from "react";

class NetworkCustom extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            width: 0,
            height: 0,
        }
        this.heightConstant= 8.5/10
        this.widthConstant = 7/10
        this.minheight = 420
        this.network = React.createRef()
    }


    componentDidMount(){
        const w = window.innerWidth * this.widthConstant
        const h = window.innerHeight * this.heightConstant
        this.network.current.width = w
        this.network.current.height = h
        window.addEventListener("resize", () => {this.resize()})
        this.setState({width: w, height: h})
    }

    resize(){
        const h = Math.max(window.innerHeight *this.heightConstant, this.minheight)
        const w = window.innerWidth  * this.widthConstant
        if (this.network.current !== null){
            this.network.current.width = w
            this.network.current.height = h
        }
        this.setState({height: h, width: w})
        console.log("resizing")
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
    }

    /** Resets camera to default position**/
    resetCamera(){
        this.setState({offsetX:0,offsetY:0, scaleFactor: 1, mouseX: this.state.wdith/2, mouseY:this.state.height/2})
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network} style = {{backgroundColor: "rgb(255, 0, 0)"}}
                        onMouseLeave = {(e) => this.setDrag(e,false)}
                        onMouseDown = {(e) => this.setDrag(e,true)}
                        onMouseUp = {(e) => this.setDrag(e,false)}
                        onMouseMove = {(e) => this.updateCamera(e)}
                        onWheel = {(e) => this.zoomCamera(e)}/>
            </div>
        )
    }
}

export default NetworkCustom