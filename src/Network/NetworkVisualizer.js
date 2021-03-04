import React from "react";

class NetworkVisualizer extends React.Component{
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
        this.network.current.width = w
        this.network.current.height = h
        this.setState({height: h, width: w})
        console.log("resizing")
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network} style = {{backgroundColor: "rgb(0, 255, 0)"}}/>
            </div>
        )
    }
}

export default NetworkVisualizer