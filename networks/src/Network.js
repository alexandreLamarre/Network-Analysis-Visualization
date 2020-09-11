import React from "react";
import {springEmbedding} from "./NetworkAlgorithms/springEmbedding";
import {fruchtermanReingold} from "./NetworkAlgorithms/FruchtermanReingold";

import "./Network.css";

var MAX_EDGES = 600;
var MAX_TIMEOUT = 0;


class NetworkVisualizer extends React.Component{
  constructor(props){
    super(props);
    this.canvas =  React.createRef();
    this.state ={
      width : 0,
      height: 0,
      vertices: [],
      edges: [],
      numE: 150,
      numV: 50,
      delta: 2,
      animationSpeed: 50,
      running: false,
      sorted: false,
      cspring: 20,
      crep: 20,
      eps: 0.1,
      iterations: 100,
      maxtimeouts: 0,
      connected : "False",
      maxDegree: Infinity,
      disconnected: 1,
      maxEdges: 0,
      minEdges: 30,
    };

    this.stateRef = React.createRef(this.state);
  }

  componentDidMount(){
    const w = window.innerWidth * 0.97;
    const h = window.innerHeight * 0.55;

    const [vertices, edges, maxedges] = createRandomNetwork(w, h, this.state.numV, this.state.numE);
    this.setState({width: w, height: h, vertices: vertices, edges: edges, maxEdges: maxedges});
  }

  componentDidUpdate(){
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;
    const ctx = this.canvas.current.getContext("2d");
    for(let i =0; i < this.state.vertices.length; i++){
      ctx.fillStyle= "#FF0000"
      ctx.fillRect(this.state.vertices[i][0], this.state.vertices[i][1], 6, 6);
    }

    for(let j = 0; j < this.state.edges.length; j++){
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      const index1 = this.state.edges[j][0];
      const index2 = this.state.edges[j][1];
      ctx.moveTo(this.state.vertices[index1][0]+3,this.state.vertices[index1][1]+3 );
      ctx.lineTo(this.state.vertices[index2][0]+3,this.state.vertices[index2][1]+3 );
      // ctx.moveTo(this.state.vertices[j][0][0]+3, this.state.edges[j][0][1]+3);
      // ctx.lineTo(this.state.edges[j][1][0]+3, this.state.edges[j][1][1]+3);
      ctx.stroke();
      ctx.closePath();
    }
  }
  componentWillUnmount(){
      var id = this.state.maxtimeouts;
      // console.log("unmounting");
      while(id){
        clearInterval(id);
        id --;
      }
  }

  generateForceDirectedLayout(){
    const values = springEmbedding(this.state.vertices, this.state.edges,this.state.width, this.state.height, this.state.iterations, this.state.eps, this.state.delta, this.state.cspring, this.state.crep);
    const new_vertices = values[0];
    const animations = values[1];
    // console.log(animations);
    // console.log(animations);
    // // animateNetwork(animations, this.canvas.current,this.state.vertices, this.state.edges, this.state.delta, this.state.width,this.state.height);
    this.animateNetwork(animations, new_vertices);
  }

  generateReingold(){
    const values = fruchtermanReingold(this.state.vertices, this.state.edges, this.state.width, this.state.height, this.state.iterations);
    const new_vertices = values[0];
    const animations = values[1];
    // console.log(animations);

    this.animateNetwork(animations, new_vertices);
  }

  animateNetwork(animations, final_vertices){
    let x = 0;
    this.setState({running:true});
    for(let k = 0; k < animations.length; k++){

      x = setTimeout(() => {
        this.setState({vertices: animations[k]});
        console.log("animating")
        if(k === animations.length-1){
          this.setState({running:false, sorted:true, vertices:final_vertices});
          // console.log(final_vertices);
        }
      }, k * this.state.animationSpeed)
    }
    this.setState({maxtimeouts: x});
  }

  setVertices(v){
    // while(MAX_TIMEOUT){
    //   clearTimeout(MAX_TIMEOUT);
    //   MAX_TIMEOUT --;
    // }
    //
    // MAX_TIMEOUT = setTimeout(()=>{
    //   const that = this;
    //   waitSetVertices(that,v);
    // },10);
    const that = this;
    waitSetVertices(that,v);
  }

  setEdges(e){
    while(MAX_TIMEOUT){
      clearTimeout(MAX_TIMEOUT);
      MAX_TIMEOUT --;
    }
    MAX_TIMEOUT = setTimeout(() =>{
      const that = this;
      waitSetEdges(that,e);
    },10);
  }


  setAnimationSpeed(ms){
    const value = Math.abs(150-ms);
    // console.log("setting to")
    // console.log(value)
    this.setState({animationSpeed: value});
  }

  setCREP(v){
    this.setState({crep:v})
  }

  setCSPRING(v){
    this.setState({cspring:v})
  }

  setDelta(v){
    this.setState({delta:v})
  }

  setEpsilon(v){
    this.setState({eps:v})
  }

  setConnected(v){
    // console.log(v);
    const value = parseInt(v);
    const that = this;
    waitSetConnected(that, value);
  }

  setDisconnectedSubgraphs(v){
    // console.log(v);
    const value = parseInt(v);
    this.setState({disconnected: value})
  }

  resetNetwork(){
    const [vertices, edges, maxedges] = createRandomNetwork(this.state.width, this.state.height, this.state.numV, this.state.numE, this.state.connected);

    this.setState({vertices: vertices, edges: edges, sorted:false, maxEdges:maxedges})
  }
  render(){

    return <div className = "network">
            <canvas
            className = "networkCanvas" ref = {this.canvas}>
            </canvas>
            <div className = "sliders">
              <input
              type = "range"
              min = "0"
              max = "130"
              defaultValue ="100"
              className = "slider"
              name = "speed" disabled = {this.state.running}
              onInput = {(event)=> this.setAnimationSpeed(event.target.value)}
              disabled = {this.state.running}>
              </input>
              <label> AnimationSpeed : {this.state.animationSpeed}ms</label>
              <input
              type = "range"
              min = "20"
              max = "200"
              defaultValue = "50"
              step = "1"
              className = "slider"
              name = "weight"
              disabled = {this.state.running}
              onInput = {(event) => this.setVertices(event.target.value)}>
              </input>
              <label> Vertices: {this.state.vertices.length}</label>
              <input
              type = "range"
              min =  {this.state.connected === "True"? this.state.vertices.length-1: 20}
              max = {Math.min(Math.floor((this.state.vertices.length*this.state.vertices.length - this.state.vertices.length)/2), MAX_EDGES)}
              defaultValue = "150"
              step = "1"
              className = "slider"
              name = "weight"
              disabled = {this.state.running}
              onInput = {(event) => this.setEdges(event.target.value)}>
              </input>
              <label> Edges: {this.state.edges.length}</label>
              <br/>
              <input
              type = "range"
              min = "0"
              max = "1"
              defaultValue = "0"
              step = "1"
              className = "slider"
              onInput = {(event) => this.setConnected(event.target.value)}
              disabled = {this.state.running}>
              </input>
              <label> Force Connectedness: {this.state.connected} </label>
              <input
              type = "range"
              min = "1"
              max = "3"
              step = "1"
              defaultValue = "1"
              className = "slider"
              onInput = {(event) => this.setDisconnectedSubgraphs(event.target.value)}
              disabled = {this.state.running || (this.state.connected === "False"? true: false)}>
              </input>
              <label>
              Disconnected Subgraphs: {this.state.disconnected}
              </label>
            </div>
            <br/>


            <div className = "sliders2">
              <label> Force of Attraction: {this.state.cspring}</label>
              <input className = "slider2"
              type = "range"
              min = "0.1"
              max = "30"
              step = "0.1"
              defaultValue ="20"
              name = "speed" disabled = {this.state.running}
              onInput = {(event)=> this.setCSPRING(event.target.value)}
              disabled = {this.state.running}>
              </input>
              <label className = "label2"> Force of Repulsion : {this.state.crep}</label>
              <input className = "slider2"
              type = "range"
              min = "0.1"
              max = "30"
              step = "0.1"
              defaultValue ="20"
              name = "speed" disabled = {this.state.running}
              onInput = {(event)=> this.setCREP(event.target.value)}
              disabled = {this.state.running}>
              </input>
              </div>
              <div className = "sliders2">
              <label> Convergence Bound : {this.state.eps}</label>
              <input className = "slider2"
              type = "range"
              min = "0.001"
              max = "3"
              defaultValue ="0.1"
              step = "0.001"
              name = "speed" disabled = {this.state.running}
              onInput = {(event)=> this.setEpsilon(event.target.value)}
              disabled = {this.state.running}>
              </input>
              <label className = "label2"> Rate of Convergence: {this.state.delta}</label>
              <input className = "slider2"
              type = "range"
              min = "0.1"
              max = "5"
              step = "0.1"
              defaultValue ="1.5"
              name = "speed" disabled = {this.state.running}
              onInput = {(event)=> this.setDelta(event.target.value)}
              disabled = {this.state.running}>
              </input>

            </div>
            <button className = "b" onClick = {() => this.generateForceDirectedLayout()} disabled = {this.state.running}>
            Basic Spring Embedding
            </button>
            <button className = "b" onClick = {() => this.generateReingold()} disabled = {this.state.running}>
            Fruchterman & Reingold
            </button>
            <button className = "b" onClick = {() => this.resetNetwork()} disabled = {this.state.running}>
            Reset Network
            </button>
           </div>
  }
}

export default NetworkVisualizer;

// function createRandomNetwork(maxWidth, maxHeight, numV, numE){
//   //create random vertices
//   let vertices = [];
//   for(let i = 0; i< numV; i++){
//     vertices.push(createRandomPos(maxWidth, maxHeight))
//   }
//   let edges = [];
//   for(let i = 0; i<numE; i++){
//     edges.push(connectRandomVertices(vertices.length, vertices))
//   }
//
//   return [vertices,edges];
// }

function createRandomNetwork(maxWidth, maxHeight, numV, numE, conn){
  let connected = conn === undefined? "False": conn;
  const maxDegree = numV-1;
  let maxEdges = Math.floor((maxDegree*numV)/2)
  const maxEdgesValue = maxEdges;
  // console.log("maxedges")
  console.log("vertices", numV, "maxedges", maxEdgesValue);
  let vertices = [];
  let available_vertices = [];
  let degree_array = [];
  for(let i = 0; i < numV; i ++){
    vertices.push(createRandomPos(maxWidth, maxHeight));
    available_vertices.push(i);
    degree_array.push(0);
  }
  // const degree_array = []; // create adjacency matrix to check duplicate edges/ connectedness/ max degrees
  // for(let i = 0; i < numV; i++){
  //   degree_array.push(0);
  // }
  let already_connected = new Map();
  let edges = [];
  let remainingEdges = numE;
  if(connected === "True"){
    let unvisited = [];
    for(var i = 0; i < numV; i++){
      unvisited.push(i);
    }
    let visited = [];
    var vIndex1 = pickRandomVertex(unvisited);
    var v1 = unvisited[vIndex1];
    visited.push(v1);
    unvisited = removeFromArray(unvisited, vIndex1);

    var visited_num = 1;
    while(visited_num < numV){
      var vIndex2 = pickRandomVertex(unvisited)
      var v2 = unvisited[vIndex2];
      visited.push(v2); //add to visited
      edges.push([v1,v2]);
      degree_array[v1] ++;
      degree_array[v2] ++;
      remainingEdges --;
      maxEdges --;
      const indexTo = v1 + 1000* v2; // works as long as numV < 1000
      const indexFrom = v2+ 1000*v1;
      already_connected.set(indexTo, true);
      already_connected.set(indexFrom, true);
      //remove from unvisited
      unvisited = removeFromArray(unvisited, vIndex2);
      //reset v1
      vIndex1 = pickRandomVertex(visited);
      v1 = visited[vIndex1];
      visited_num ++;
    }
  }
  // for(let i = 0; i < vertices.length; i++){
  //   already_connected.set(i.toString() + i.toString(), true);
  // }

  // var available_index = vertices.length // starts out as vertex.length;
  while(remainingEdges > 0 && maxEdges > 0 && available_vertices.length > 1){
    const [random1, random2] = connectRandomVertices(available_vertices.slice());
    if(random1 === random2) console.log("unexpected");
    if(random1 === undefined) console.log("unexpected undefiend 1");
    if(random2 === undefined) console.log("unexpected undefined 2");
    // console.log("rem:", remainingEdges, "max", maxEdges);
    const indexTo = random1+1000*random2; // as long as numV < 1000 this works
    const indexFrom = random2+1000*random1;
    if(already_connected.get(indexTo) === undefined ){
      edges.push([random1, random2]);
      degree_array[random1] ++;
      degree_array[random2] ++;
      if(degree_array[random1] > maxDegree) available_vertices.splice(random1, 1);
      if(degree_array[random2] > maxDegree) available_vertices.splice(random2, 1);
      already_connected.set(indexTo, true);
      already_connected.set(indexFrom, true);
      remainingEdges --;
      maxEdges --;
      }
    }
  console.log("degree_array", degree_array);
  return [vertices,edges,Math.min(maxEdgesValue, MAX_EDGES)];
}

function createRandomPos(maxWidth, maxHeight){
  return [Math.random()*(maxWidth+1-3), Math.random()*(maxHeight+1-3)];
}

function connectRandomVertices(vertices){
  var random1 = vertices[Math.floor(Math.random()*vertices.length)];
  vertices.splice(random1,1);
  var random2 = vertices[Math.floor(Math.random()*vertices.length)];
  // while(random2 === random1){
  //   console.log("running");
  //   random2 = random2 = Math.floor(Math.random()*end);
  // }
  return [random1, random2];
}

function pickRandomVertex(array){
  return Math.floor(Math.random()*array.length)
}

function removeFromArray(array, index){
  return array.slice(0,index).concat(array.slice(index+1))
}

async function waitSetConnected(that,value){
  if(value === 0) await that.setState({connected:"False"});
  if(value === 1) await that.setState({connected:"True"});
  that.resetNetwork();
}

async function waitSetVertices(that, v){
  await that.setState({numV: v});
  that.resetNetwork();
}

async function waitSetEdges(that,e){
  await that.setState({numE: e});
  that.resetNetwork();
}
