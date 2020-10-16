import React from "react";
import Vertex from "./datatypes/Vertex";


import "./NetworkCustom.css";

const VERTEX_SIZE = 5;
const VERTEX_COLOR = "rgb(0,255,255)";
const SELECTED_COLOR = "rgb(255,0,255)";

class NetworkCustomVisualizer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height: 0,
      width: 0,
      gridConstant: 10,
      gridX: 0,
      gridY: 0,
      mouseX: 0,
      mouseY: 0,
      previousMouseX: 0,
      previousMouseY: 0,
      dragging: false,
      edgeStart: [null,null],
      edgeStartIndex: 0,
      mouseLeave: true,
      vertex_list: [],
      edge_list: [],
      vertices: {},
      edges: {},
      operationType: "newVertex",
      operationsBuffer: [],
      operationsBufferIndex: -1,
      selected_vertices: null,
      box: null,
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
      // const x = Math.floor(Math.round((gridX*i+ Number.EPSILON) * 100) / 100);
      for(let j = 0; j < c; j++){
        // const y = Math.floor(Math.round((gridY*j+ Number.EPSILON) * 100) / 100);
        vertices[[i,j]] = [];
      }
    }
    this.setState({height: h, width: w, vertices: vertices, gridX: gridX, gridY: gridY});
  }

  componentDidUpdate(){
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;

    const ctx = this.canvas.current.getContext("2d");
    ctx.scale(this.state.scale, this.state.scale);
    ctx.clearRect(0,0,this.state.width, this.state.height);
    for(let i = 0; i < this.state.vertex_list.length; i++){
      const v = this.state.vertex_list[i];
      ctx.beginPath();
      ctx.fillStyle = v.color;
      ctx.arc(v.x,v.y, v.size, 0, Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }

    //
    // draw grid
    for(let i = 1; i < this.state.gridConstant; i++){
      ctx.beginPath();
      ctx.moveTo(i*this.state.gridX, 0);
      ctx.lineTo(i*this.state.gridX, this.state.height);
      ctx.stroke();
      ctx.closePath();
    }
    for(let i = 1; i < this.state.gridConstant; i++){
      ctx.beginPath();
      ctx.moveTo(0, this.state.gridY*i);
      ctx.lineTo(this.state.width, this.state.gridY*i);
      ctx.stroke();
      ctx.closePath();
    }

    for(let i = 0; i < this.state.edge_list.length; i++){
      // console.log("edge", key);
      const e = this.state.edge_list[i];
      const v1 = this.state.vertex_list[e[0]];
      const v2 = this.state.vertex_list[e[1]];
      // console.log(startX, startY, endX, endY)
      ctx.beginPath();
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.closePath();
    }

    if(this.state.operationType === "newVertex" && this.state.mouseLeave === false){
      ctx.beginPath();
      ctx.fillStyle = rgb_to_str(this.app.state.startRed,this.app.state.startGreen,
                                    this.app.state.startBlue);
      ctx.globalAlpha= 0.7;
      ctx.arc(this.state.mouseX, this.state.mouseY, VERTEX_SIZE, 0, 2*Math.PI);
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
    if(this.state.box !== null){
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 15]);
      ctx.moveTo(this.state.box[0], this.state.box[1]);
      ctx.lineTo(this.state.box[2], this.state.box[1]);
      ctx.moveTo(this.state.box[2], this.state.box[1]);
      ctx.lineTo(this.state.box[2], this.state.box[3]);
      ctx.moveTo(this.state.box[2], this.state.box[3]);
      ctx.lineTo(this.state.box[0], this.state.box[3]);
      ctx.moveTo(this.state.box[0], this.state.box[3]);
      ctx.lineTo(this.state.box[0], this.state.box[1]);
      // ctx.rect(this.state.box[0], this.state.box[1], this.state.box[2], this.state.box[3]);
      ctx.stroke();
      ctx.closePath();
    }
  }

  updateCursorPostion(e){
    const x = this.state.mouseX;
    const y = this.state.mouseY;
    const prevX = this.state.previousX;
    const prevY = this.state.previousY;
    const vertices = this.state.vertices;
    const edge = this.state.edges;
    const edgeStartIndex = this.state.edgeStartIndex;
    const startX = this.state.edgeStart[0];
    const startY = this.state.edgeStart[1];
    const rect = this.canvas.current.getBoundingClientRect(x,y);
    const box = this.state.box;
    // console.log(this.state.edgeStart);
    if(this.state.operationType === "ConnectEdge" && this.state.dragging === true) {
      this.tryConnectEdge(startX, startY, edgeStartIndex, x, y, vertices);
    }
    if(this.state.operationType === "SelectMove" && this.state.dragging === true){
      this.createBox(x,y, startX, startY, box, prevX, prevY);
    }

    const xPos =  e.clientX -rect.left;
    const yPos =  e.clientY - rect.top;

    this.setState({mouseX: xPos,mouseY:yPos, previousX: x, previousY:y, mouseLeave: false});

  }

  setOperationType(v){
    console.log(this.state.vertices);
    if(this.state.selected_vertices !== null){
      for(let i = 0; i < this.state.selected_vertices.length; i++){
        this.state.selected_vertices[i].vertex.color = VERTEX_COLOR;
      }
    }
    this.setState({operationType: v, box:null, selected_vertices: null, edgeStart: [null, null]})
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
    const vertex_list = this.state.vertex_list;
    const x = e.clientX -rect.left;
    const y = e.clientY - rect.top
    const [vertexX, vertexY] = this.getGrid(x, y)

    /* TODO CHECK if another vertex is too closed*/
    var tooClose = false;
    for(let i = 0; i < vertices[[vertexX,vertexY]].length; i++){
      const v = this.state.vertex_list[vertices[[vertexX,vertexY]][i]];
      if(distance(v.x,v.y,x, y) < (VERTEX_SIZE+VERTEX_SIZE)*(VERTEX_SIZE+VERTEX_SIZE)){
        tooClose = true;
      }
    }
    if(tooClose === false){
      const v = new Vertex(x, y);
      v.size = VERTEX_SIZE;
      v.color = VERTEX_COLOR;
      var details = {}
      vertex_list.push(v)
      vertices[[vertexX, vertexY]].push(vertex_list.length-1);
      details.vertex = v;
      details.vertexIndex = vertex_list.length-1;
      details.grid = [vertexX, vertexY];
      details.gridIndex = [vertices[[vertexX, vertexY]]].length-1;
      this.addActionToBuffer("vertex", details);
      this.setState({vertices:vertices, vertex_list: vertex_list});
    }
  }

  tryConnectEdge(edge_startX, edge_startY, edgeStartIndex, x, y, vertices){
    // console.log("connecting");
    // console.log("input", x, y, vertices, edge_start, edge_end);
    if(edge_startX === null && edge_startY === null){
      const [new_x,new_y] = this.getGrid(x,y);
      // console.log(new_x, new_y);
      for(let i = 0; i < vertices[[new_x,new_y]].length; i++){
        const v = this.state.vertex_list[vertices[[new_x,new_y]][i]];
        if(distance(v.x,v.y,x, y) < (VERTEX_SIZE+2)*(VERTEX_SIZE+2)){
          this.setState({edgeStart: [v.x,v.y], edgeStartIndex: vertices[[new_x,new_y]][i]});
          break;
        }
      }
    }
    else{
      const [new_x,new_y] = this.getGrid(x,y);
      console.log(vertices[[new_x, new_y]]);
      // console.log(new_x, new_y);
      for(let i = 0; i < vertices[[new_x,new_y]].length; i++){
        const v = this.state.vertex_list[vertices[[new_x,new_y]][i]];
        // console.log(v);
        if(distance(v.x,v.y,x, y) < (VERTEX_SIZE+2)*(VERTEX_SIZE+2)){
          // console.log("VERTEX SPOTTED!");
          const edges = this.state.edges;
          const edge_list = this.state.edge_list;
          const [new_edges, new_edge_list] = this.addEdge(edges,
                    edge_list, this.state.edgeStartIndex, vertices[[new_x,new_y]][i]);
          this.setState({edgeStart: [v.x,v.y],
            edgeStartIndex: vertices[[new_x, new_y]][i],edges: new_edges,
                                                  edge_list: new_edge_list});
          break;
        }
      }
    }
  }

  addEdge(edges, edge_list, startVertexIndex, endVertexIndex){

    if(edges[[startVertexIndex,endVertexIndex]] === undefined &&
      edges[[endVertexIndex, startVertexIndex]] === undefined &&
                    startVertexIndex !== endVertexIndex){
      // console.log("successful connection");
      edges[[startVertexIndex, endVertexIndex]] = true;
      edge_list.push([startVertexIndex, endVertexIndex]);
    }
    return [edges, edge_list];
  }

  createBox(x,y, startX,startY, box, previousX, previousY){
    if(startX === null && startY === null){
      if(box === null){
        const selected_vertices = this.state.selected_vertices;
        if(selected_vertices !== null){
          for(let i = 0; i < selected_vertices.length; i++){
            selected_vertices[i].vertex.color = VERTEX_COLOR;
          }
        }
      this.setState({edgeStart: [x,y], selected_vertices: null});
      }
      else{
        if(Math.min(box[0], box[2]) < x && x < Math.max(box[0], box[2]) &&
          Math.min(box[1], box[3])< y && y<Math.max(box[1], box[3])){
            var deltaX = x - previousX;
            var deltaY = y - previousY;
            const selected_vertices = this.state.selected_vertices;
            if(box[0]+deltaX<0 || box[2]+deltaX > this.state.width) deltaX = 0;
            if(box[1]+deltaY<0 || box[3]+deltaY > this.state.height) deltaY = 0;
            const vertices = this.state.vertices;
            this.updateSelectedVertices(vertices, selected_vertices, deltaX, deltaY);
            this.setState({box: [box[0]+deltaX, box[1]+deltaY, box[2]+deltaX, box[3]+deltaY]});
          }
          else{
            this.setState({box:null});
          }
      }
    }
    else{
      // console.log(startX, startY, x, y);
      this.setState({box: [Math.min(startX,x), Math.min(startY,y), Math.max(x,startX), Math.max(y,startY)]});
    }
  }

  updateSelectedVertices(vertices,selected_vertices, dx, dy){
    var new_vertices = vertices;
    for(let i = 0; i < selected_vertices.length; i++){
      selected_vertices[i].vertex.x += dx;
      selected_vertices[i].vertex.y += dy;
      const new_grid = this.getGrid(selected_vertices[i].vertex.x,
                                    selected_vertices[i].vertex.y);

      if(new_grid[0] !== selected_vertices[i].grid[0] || new_grid[1]
        !== selected_vertices[i].grid[1]){
          new_vertices = this.updateVertexGrids(vertices,selected_vertices[i], new_grid);
        };
    }
    this.setState({vertices: new_vertices});
  }

  updateVertexGrids(vertices,selected_vertex, new_grid){
    const old_grid = selected_vertex.grid;
    // console.log("updating vertex grids from", old_grid, "to", new_grid);
    const index_value = vertices[old_grid].indexOf(selected_vertex.index);
    // console.log("element to remove", selected_vertex.index);
    vertices[old_grid].splice(index_value,1);
    // console.log("vertices[old+grid]",vertices[old_grid]);
    vertices[new_grid].push(selected_vertex.index);
    // console.log("vertices[new_grid]",vertices[new_grid]);
    selected_vertex.grid = new_grid;

    return vertices;
  }

  clearNetwork(){
    const vertices = {};
    const c = this.state.gridConstant;
    for(let i = 0; i < c; i++){
      for(let j = 0; j < c; j++){
        vertices[[i,j]] = [];
      }
    }
    this.setState({vertices: vertices, edges: {}, edgeStart: [null,null], box:null,
    selected_vertices: null, vertex_list: [], edge_list: [], operationsBuffer: [],
      operationsBufferIndex:-1});
  }

  clearDragOutcome(){
    this.setState({dragging:false, edgeStart: [null,null], edgeStartIndex: null});
    const box = this.state.box;
    const selected_vertices = this.state.selected_vertices;
    if(box !== null &&  selected_vertices === null){
      this.selectVertices(box);
    }
  }

  getGrid(x,y){
    const gridX = this.state.gridX;
    const gridY = this.state.gridY;

    const new_x = Math.floor(x/gridX);
    const new_y = Math.floor(y/gridY);
    return [new_x, new_y];
  }

  getListGrid(x0, y0, x1, y1){
    const startGrid = this.getGrid(x0,y0);
    const endGrid = this.getGrid(x1,y1);
    // console.log("startGrid", startGrid);
    // console.log("endGrid", endGrid);
    if(startGrid[0] === endGrid[0] && startGrid[1] === endGrid[1]) return [startGrid];
    else if(startGrid[0] === endGrid[0]){
      const res = [];
      for(let i = startGrid[1]; i <= endGrid[1]; i++){
        res.push([startGrid[0], i])
      }
      return res;
    }
    else if(startGrid[1] === endGrid[1]){
      const res = [];
      for(let j = startGrid[0]; j <= endGrid[0]; j++){
        res.push([j, startGrid[1]]);
      }
      return res;
    }
    else{
      const res = [];
      for(let i = startGrid[1]; i <= endGrid[1]; i++){
        for(let j = startGrid[0]; j <= endGrid[0]; j++){
          res.push([j, i]);
        }
      }
      return res;
    }
  }

  selectVertices(box){
    var x0 = Math.min(box[0], box[2]);
    var y0 = Math.min(box[1], box[3]);
    var x1 = Math.max(box[0], box[2]);
    var y1 = Math.max(box[1], box[3]);

    // console.log("coordinates", x0,y0,x1,y1);
    const boxesToCheck = this.getListGrid(x0,y0,x1,y1);
    // console.log("boxes", boxesToCheck);
    const selected_vertices = this.unPackVertexFromGrid(boxesToCheck, x0, y0, x1,y1);
    console.log("selected_vertices", selected_vertices);
    for(let i = 0; i < selected_vertices.length; i++){
      selected_vertices[i].vertex.color = SELECTED_COLOR;
    }
    this.setState({selected_vertices: selected_vertices});
  }

  unPackVertexFromGrid(box_array, x0, y0, x1, y1){
    const selected_vertices = [];
    // console.log(this.state.vertices);
    for(let i = 0; i < box_array.length; i++){
      var index_list = this.state.vertices[box_array[i]];
      for(let j = 0; j < index_list.length; j++){
        const v = this.state.vertex_list[index_list[j]]
        if(v.x >= x0 && v.y >= y0 && v.x <=x1 && v.y <= y1)selected_vertices.push({vertex: v,
                                      grid: box_array[i], index: index_list[j]});
      }
    }
    return selected_vertices;
  }

  /*
  The following accpetable {types:details} pairs are
    vertex :
    edge :
    box :
  */
  addActionToBuffer(type, details){
    var buffer = this.state.operationsBuffer;
    var bufferIndex = this.state.operationsBufferIndex;
    if(bufferIndex === buffer.length-1){
      buffer.push({type:type, details: details});
      bufferIndex++;
      // console.log("buffer", buffer);
      // console.log("bufferIndex", bufferIndex);
      this.setState({operationsBuffer: buffer, operationsBufferIndex: bufferIndex});
    }
    else{
      console.log("Not at buffer end", buffer);
      console.log(bufferIndex)
      const new_buffer =[]
      for(let i = 0; i < bufferIndex+1; i++){
        new_buffer.push(buffer[i]);
      }
      console.log("spliced buffer", new_buffer)
      console.log(new_buffer);
      new_buffer.push({type: type, details: details});
      console.log(new_buffer);
      bufferIndex ++;
      console.log("assert", bufferIndex === new_buffer.length-1);
      this.setState({operationsBuffer: new_buffer, operationsBufferIndex: bufferIndex});
    }
  }

  undoActionFromBuffer(){
    var bufferIndex = this.state.operationsBufferIndex;
    const buffer = this.state.operationsBuffer;
    if(buffer[bufferIndex].type === "vertex"){
      const vertex_list = this.state.vertex_list;
      const vertices = this.state.vertices;
      vertex_list.splice(buffer[bufferIndex].details.vertexIndex, 1);
      vertices[buffer[bufferIndex].details.grid].splice(buffer[bufferIndex].gridIndex,1);
      bufferIndex --;
      this.setState({vertex_list: vertex_list, vertices: vertices, operationsBufferIndex: bufferIndex});

    }

  }

  redoActionFromBuffer(){
    var bufferIndex = this.state.operationsBufferIndex;
    const buffer = this.state.operationsBuffer;
    if(buffer[bufferIndex+1].type === "vertex"){
      bufferIndex ++;
      const vertex_list = this.state.vertex_list;
      const vertices = this.state.vertices;
      vertex_list.push(buffer[bufferIndex].details.vertex);
      vertices[buffer[bufferIndex].details.grid].push(vertex_list.length-1);
      this.setState({vertex_list: vertex_list, vertices: vertices, operationsBufferIndex: bufferIndex});
    }
  }


  render(){
    const num_b = 10;
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
            style = {{height:Math.min(this.state.width/num_b,100),
              width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
             </button>
            <button className = "connectB"
            disabled = {this.state.operationType === "ConnectEdge"}
            title = "Connect Vertices"
            onClick = {() => this.setOperationType("ConnectEdge")}
            style = {{height:Math.min(this.state.width/num_b,100),
              width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
             </button>
            <button className = "selectB"
            disabled = {this.state.operationType === "SelectMove"}
            title = "Select & Move Area"
            onClick = {() => this.setOperationType("SelectMove")}
            style = {{height:Math.min(this.state.width/num_b,100),
              width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
             </button>
             {/*
            <button className = "moveB"
            title = "Move Frame"
            disabled = {this.state.operationType === "moveCamera"}
            onClick = {() => this.setOperationType("moveCamera")}
            style = {{height:Math.min(this.state.width/num_b,100),
              width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "CameraB"
            title = "Reset Camera"
            onClick = {() => this.resetCamera()}
            style = {{height:Math.min(this.state.width/num_b,100),
            width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button> */}
            <button className = "clearB"
            title = "Clear Frame"
            onClick = {() => this.clearNetwork()}
            style = {{height:Math.min(this.state.width/num_b,100),
              width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "settingsB"
            title = "Graphical settings"
            style = {{height:Math.min(this.state.width/num_b,100),
              width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "undoB"
            onClick = {() => this.undoActionFromBuffer()}
            disabled = {this.state.operationsBufferIndex === -1}
            title = "Undo"
            style = {{height:Math.min(this.state.width/num_b,100),
              width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "redoB"
            onClick = {() => this.redoActionFromBuffer()}
            disabled = {this.state.operationsBuffer.length-1 === this.state.operationsBufferIndex}
            title = "Redo"
            style = {{height:Math.min(this.state.width/num_b,100),
            width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "saveB"
            title = "Save as"
            style = {{height:Math.min(this.state.width/num_b,100),
            width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "uploadB"
            title = "Upload"
            style = {{height:Math.min(this.state.width/num_b,100),
            width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            <button className = "exportB"
            title = "Export to Network Viusalizer"
            style = {{height:Math.min(this.state.width/num_b,100),
            width: Math.min(this.state.width/num_b,100), backgroundSize: 'cover'}}>
            </button>
            </div>
            <br></br>
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
