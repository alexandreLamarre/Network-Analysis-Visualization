import React from "react";

import "./Network3D.css";

class NetworkVisualizer3D extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height: 0,
      width: 0,
      scene : null,
      camera : null,
    }

    this.canvas = React.createRef();
  }

  componentDidMount(){
    const w = window.innerHeight*0.55;
    const h = window.innerHeight*0.55;
    this.canvas.current.height = h;
    this.canvas.current.width = w;

    this.setState({
      width: w,
      height: h,
    })
  }

  render(){
    return <div>
              <canvas className = "canvas3d" ref = {this.canvas}></canvas>
          </div>
  }

}

export default NetworkVisualizer3D;
