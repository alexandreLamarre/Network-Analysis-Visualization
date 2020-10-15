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
      operationType: "newVertex",
      opererationsBuffer: [],
      operationsBufferIndex: 0,
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

    for(var key in this.state.edges){
      // console.log("edge", key);
      const values = key.split(",");
      const [startX, startY, endX, endY] = values;
      // console.log(startX, startY, endX, endY)
      ctx.beginPath();
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.closePath();
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
    if(this.state.operationType === "ConnectEdge" && this.state.dragging === true){
      if(this.state.edgeStart[0] !== null && this.state.edgeStart[1] !== null){
        ctx.beginPath();
        ctx.globalAlpha = 0.2;
        ctx.moveTo(this.state.edgeStart[0], this.state.edgeStart[1])
        ctx.lineTo(this.state.mouseX, this.state.mouseY);
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  updateCursorPostion(e){
    const x = this.state.mouseX;
    const y = this.state.mouseY;
    const vertices = this.state.vertices;
    const startX = this.state.edgeStart[0];
    const startY = this.state.edgeStart[1];
    const rect = this.canvas.current.getBoundingClientRect(x,y);
    // console.log(this.state.edgeStart);
    if(this.state.operationType === "ConnectEdge" && this.state.dragging == true) {
      this.tryConnectEdge(x,y,vertices,startX, startY);
    }

    const xPos =  e.clientX -rect.left;
    const yPos =  e.clientY - rect.top;

    this.setState({mouseX: xPos,mouseY:yPos, mouseLeave: false});

  }

  setOperationType(v){
    console.log(v);
    this.setState({operationType: v})
  }

  resetCamera(){

  }

  processClickOutcome(e){
    if(this.state.operationType === "newVertex") this.placeVertex(e);
  }

  processDragOutcome(e){
    this.setState({dragging:true});

  }

  placeVertex(e){
    const rect = this.canvas.current.getBoundingClientRect();
    const vertices = this.state.vertices;
    const [vertexX, vertexY] = this.getGrid(e.clientX -rect.left, e.clientY - rect.top)
    // console.log([vertexX, vertexY]);
    /* TODO CHECK if another vertex is too closed*/
    vertices[[vertexX, vertexY]].push(new Vertex(e.clientX-rect.left, e.clientY - rect.top));
    this.setState({vertices:vertices});
  }

  tryConnectEdge(x,y,vertices, edge_startX, edge_startY){
    // console.log("connecting");
    // console.log("input", x, y, vertices, edge_start, edge_end);
    if(edge_startX === null && edge_startY === null){
      const [new_x,new_y] = this.getGrid(x,y);
      // console.log(new_x, new_y);
      for(let i = 0; i < vertices[[new_x,new_y]].length; i++){
        const v = vertices[[new_x,new_y]][i];
        if(distance(v.x,v.y,x, y) < (this.app.state.minsize+2)*(this.app.state.minsize+2)){
          this.setState({edgeStart: [v.x,v.y]})
          break;
        }
      }
    }
    else{
      const [new_x,new_y] = this.getGrid(x,y);
      // console.log(new_x, new_y);
      for(let i = 0; i < vertices[[new_x,new_y]].length; i++){
        const v = vertices[[new_x,new_y]][i];
        if(distance(v.x,v.y,x, y) < (this.app.state.minsize+2)*(this.app.state.minsize+2)){
          const edges = this.state.edges;
          const new_edges = this.addEdge(edges, [edge_startX, edge_startY], [v.x, v.y])
          this.setState({edgeStart: [v.x,v.y], edges: new_edges});
          break;
        }
      }
    }
  }

  addEdge(edges, startVertex, endVertex){
    // console.log("adding edge to ", edges);
    // console.log("connecting ", startVertex, endVertex);
    if(edges[[startVertex,endVertex]] === undefined && edges[[endVertex,startVertex]] === undefined &&
      startVertex[0] !== endVertex[0] && startVertex[1] !== endVertex[1]){
      console.log("successful connection")
      const [x1,y1] = this.getGrid(startVertex[0], startVertex[1]);
      const [x2,y2] = this.getGrid(endVertex[0], endVertex[1]);
      edges[[startVertex, endVertex]] = {startGrid: [x1,y1], endGrid: [x2,y2]};
      console.log(edges);
    }
    return edges;
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
    this.setState({vertices: vertices, edges: {}, edgeStart: [null,null]});
  }

  clearDragOutcome(){
    this.setState({dragging:false, edgeStart: [null,null]});
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

  /*
  The following accpetable {types:details} pairs are
    {vertex : }
    {edge: }
    {eraseVertex: }
    {eraseEdge: }
  */
  addActionToBuffer(type, details){

  }
  render(){
    return <div>
            <canvas
            onClick = {(e) => this.processClickOutcome(e)}
            onMouseMove = {(e) => this.updateCursorPostion(e)}
            onMouseLeave = {() => this.setState({mouseLeave:true, dragging:false})}
            onMouseDown = {(e) => this.processDragOutcome(e)}
            onMouseUp = {() => this.clearDragOutcome()}
            className = "networkCanvas"
            ref = {this.canvas}>
            </canvas>
            <br></br>
            <div className = "animationsButtons">
            <button className = "placeB"
            disabled = {this.state.operationType === "newVertex"}
            title = "Place Vertices"
            onClick = {() => this.setOperationType("newVertex")}
            style = {{height:Math.min(this.state.width/10,100),
              width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
             </button>
            <button className = "connectB"
            disabled = {this.state.operationType === "ConnectEdge"}
            title = "Connect Vertices"
            onClick = {() => this.setOperationType("ConnectEdge")}
            style = {{height:Math.min(this.state.width/10,100),
              width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
             </button>
            <button className = "selectB"
            disabled = {this.state.operationType === "SelectMove"}
            title = "Select & Move Area"
            onClick = {() => this.setOperationType("SelectMove")}
            style = {{height:Math.min(this.state.width/10,100),
              width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
             </button>
            <button className = "moveB"
            title = "Move Frame"
            disabled = {this.state.operationType === "moveCamera"}
            onClick = {() => this.setOperationType("moveCamera")}
            style = {{height:Math.min(this.state.width/10,100),
              width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "CameraB"
            title = "Reset Camera"
            onClick = {() => this.resetCamera()}
            style = {{height:Math.min(this.state.width/10,100),
            width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "clearB"
            title = "Clear Frame"
            onClick = {() => this.clearNetwork()}
            style = {{height:Math.min(this.state.width/10,100),
              width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "undoB"
            title = "Undo"
            style = {{height:Math.min(this.state.width/10,100),
              width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "redoB"
            title = "Redo"
            style = {{height:Math.min(this.state.width/10,100),
            width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "saveB"
            title = "Save as"
            style = {{height:Math.min(this.state.width/10,100),
            width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "uploadB"
            title = "Upload"
            style = {{height:Math.min(this.state.width/10,100),
            width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "exportB"
            title = "Export to Network Viusalizer"
            style = {{height:Math.min(this.state.width/10,100),
            width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
            </button>
            </div>
            <br></br>
            <p> Operation Type: {this.state.operationType}</p>
           </div>
  }
}

function distance(x1,x2,y1,y2){
  return Math.pow(x1-y1,2) + Math.pow(x2-y2, 2);
}

function rgb_to_str(color){
  return "rgb("+color[0]+"," + color[1]+","+color[2]+")";
}


export default NetworkCustomVisualizer;
