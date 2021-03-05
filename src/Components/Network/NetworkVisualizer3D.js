import React from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

class NetworkVisualizer3D extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            width: 0,
            height: 0,
        }
        this.heightConstant= 8.5/10
        this.widthConstant = 7/10
        this.minheight = 420
        this.network3D = React.createRef()
    }


    componentDidMount(){
        const w = window.innerWidth * this.widthConstant
        const h = window.innerHeight * this.heightConstant
        this.network3D.current.width = w
        this.network3D.current.height = h
        window.addEventListener("resize", () => {this.resize()})
        this.setState({width: w, height: h})
    }

    resize(){
        const h = Math.max(window.innerHeight *this.heightConstant, this.minheight)
        const w = window.innerWidth  * this.widthConstant
        if (this.network3D.current != null){
            this.network3D.current.width = w
            this.network3D.current.height = h
        }
        this.setState({height: h, width: w})
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network3D} style = {{backgroundColor: "rgb(0, 0, 255)"}}/>
            </div>
        )
    }
}

export default NetworkVisualizer3D