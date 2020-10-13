import React from "react";

import "./NetworkCustom.css";

class NetworkCustomVisualizer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height: 0,
      width: 0,
    }
    this.canvas = React.createRef();
  }

  componentDidMount(){
    const w = window.innerHeight * 0.55;
    const h = window.innerHeight * 0.55;

    this.setState({height: h, width: w});
  }

  componentDidUpdate(){
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;
  }
  render(){
    return <div>
            <canvas
            className = "networkCanvas" ref = {this.canvas}>
            </canvas>
           </div>
  }
}

export default NetworkCustomVisualizer;
