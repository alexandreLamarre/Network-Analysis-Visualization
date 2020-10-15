import React from "react";
import Vertex from "./datatypes/Vertex";


import "./NetworkCustom.css";

class NetworkCustomVisualizer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height: 0,
      width: 0,
      gridConstant: 20,
      mouseX: 0,
      mouseY: 0,
      dragging: false,
      edgeStart: [null,null],
      mouseLeave: true,
      vertices: {},
      edges: {},
      operationType: "newVertex"
    }
    this.app = this.props.app;
    this.canvas = React.createRef();
  }

  componentDidMount(){
    const w = window.innerHeight * 0.55;
    const h = window.innerHeight * 0.55;

    const c = this.state.gridConstant;
    const gridX = w/c;
    const gridY = h/c;
    const vertices = {}
    for(let i = 0; i < c; i++){
      const x = Math.round((gridX*i+ Number.EPSILON) * 100) / 100;
      for(let j = 0; j < c; j++){
        const y = Math.round((gridY*j+ Number.EPSILON) * 100) / 100;
        vertices[[x,y]] = [];
      }
    }
    this.setState({height: h, width: w, vertices: vertices});
  }

  componentDidUpdate(){
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;

    const ctx = this.canvas.current.getContext("2d");
    ctx.clearRect(0,0,this.state.width, this.state.height);
    for(var key in this.state.vertices){
      if(this.state.vertices[key].length !== 0){
        for(let i = 0; i < this.state.vertices[key].length; i++){
          const v = this.state.vertices[key][i];
          ctx.beginPath();
          ctx.fillStyle = v.color;
          ctx.arc(v.x, v.y,v.size, 0, Math.PI*2);
          ctx.fill();
          ctx.closePath();
        }
      }
    }
    if(this.state.operationType === "newVertex" && this.state.mouseLeave === false){
      ctx.beginPath();
      ctx.fillStyle = rgb_to_str(this.app.state.startRed,this.app.state.startGreen,
                                    this.app.state.startBlue);
      ctx.globalAlpha= 0.7;
      ctx.arc(this.state.mouseX, this.state.mouseY, this.app.state.minsize, 0, 2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }

  updateCursorPostion(e){
    const rect = this.canvas.current.getBoundingClientRect();
    this.setState({mouseX: e.clientX -rect.left, mouseY: e.clientY - rect.top, mouseLeave: false});
  }

  setOperationType(v){
    this.setState({operationType: v})
  }

  resetCamera(){

  }

  processClickOutcome(e){
    if(this.state.operationType === "newVertex") this.placeVertex(e);
  }

  processDragOutcome(e){
    if(this.state.operationType === "ConnectEdge") {

    }
  }

  placeVertex(e){
    const rect = this.canvas.current.getBoundingClientRect();
    const vertices = this.state.vertices;
    const [vertexX, vertexY] = this.getGrid(e.clientX -rect.left, e.clientY - rect.top)
    // console.log([vertexX, vertexY]);
    vertices[[vertexX, vertexY]].push(new Vertex(e.clientX-rect.left, e.clientY - rect.top));
    this.setState({vertices:vertices});
  }

  connectEdge(e){

  }

  clearNetwork(){
    const gridX = Math.round((this.state.width/this.state.gridConstant+Number.EPSILON)*100)/100;
    const gridY = Math.round((this.state.height/this.state.gridConstant+Number.EPSILON)*100)/100;
    const vertices = {};
    const c = this.state.gridConstant;
    for(let i = 0; i < c; i++){
      for(let j = 0; j < c; j++){
        vertices[[gridX*i, gridY*j]] = [];
      }
    }
    this.setState({vertices: vertices});
  }

  clearDragOutcome(){
    this.setState({dragging:false});
  }

  tryCreateEdge(x0, y0, x1, y1){

  }

  getGrid(x,y){
    const gridX = Math.round((this.state.width/this.state.gridConstant+Number.EPSILON)*100)/100;
    const gridY = Math.round((this.state.height/this.state.gridConstant+Number.EPSILON)*100)/100;

    const new_x = Math.floor(x/gridX);
    const new_y = Math.floor(y/gridY);
    return [new_x*gridX, new_y*gridY];
  }

  render(){
    return <div>
            <canvas
            onClick = {(e) => this.processClickOutcome(e)}
            onMouseMove = {(e) => this.updateCursorPostion(e)}
            onMouseLeave = {() => this.setState({mouseLeave:true})}
            onMouseDown = {(e) => this.processDragOutcome(e)}
            onMouseUp = {() => this.clearDragOutcome()}
            className = "networkCanvas"
            ref = {this.canvas}>
            </canvas>
            <br></br>
            <button
            onClick = {() => this.setOperationType("newVertex")}>
             Place Vertex
             </button>
            <button
            onClick = {() => this.setOperationType("ConnectEdge")}>
             Connect Edge
             </button>
            <button
            onClick = {() => this.setOperationType("SelectMove")}>
             Select & move
             </button>
            <button
            onClick = {() => this.setOperationType("moveCamera")}>
            move Camera
            </button>
            <button onClick = {() => this.resetCamera()}> Reset Camera</button>
            <button onClick = {() => this.clearNetwork()}>
              Clear Network
            </button>
            <button>
              Undo
            </button>
            <button>
              Redo
            </button>
            <button>
            Save as
            </button>
            <button>
            Upload
            </button>
            <br></br>
            <p> Operation Type: {this.state.operationType}</p>
           </div>
  }
}

function distance(x1,x2,y1,y2){

}

function rgb_to_str(color){
  return "rgb("+color[0]+"," + color[1]+","+color[2]+")";
}


export default NetworkCustomVisualizer;
