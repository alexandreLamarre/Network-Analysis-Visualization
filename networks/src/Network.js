import React from "react";
import {springEmbedding} from "./NetworkAlgorithms/springEmbedding";
import {fruchtermanReingold} from "./NetworkAlgorithms/FruchtermanReingold";

import "./Network.css";


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
      connected : false,
      maxDegree: Infinity,
      disconnected: 1,
    };

    this.stateRef = React.createRef(this.state);
  }

  componentDidMount(){
    const w = window.innerWidth * 1;
    const h = window.innerHeight * 0.55;

    const [vertices, edges] = createRandomNetwork(w, h, this.state.numV, this.state.numE);
    this.setState({width: w, height: h, vertices: vertices, edges: edges});
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
      ctx.moveTo(this.state.vertices[index1][0],this.state.vertices[index1][1] );
      ctx.lineTo(this.state.vertices[index2][0],this.state.vertices[index2][1] );
      // ctx.moveTo(this.state.vertices[j][0][0]+3, this.state.edges[j][0][1]+3);
      // ctx.lineTo(this.state.edges[j][1][0]+3, this.state.edges[j][1][1]+3);
      ctx.stroke();
      ctx.closePath();
    }
  }
  componentWillUnmount(){
      var id = this.state.maxtimeouts;
      console.log("unmounting");
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
          console.log(final_vertices);
        }
      }, k * this.state.animationSpeed)
    }
    this.setState({maxtimeouts: x});
  }

  resetNetwork(){
    const [vertices, edges] = createRandomNetwork(this.state.width, this.state.height, this.state.numV, this.state.numE, this.state.width, this.state.height);

    this.setState({vertices: vertices, edges: edges, sorted:false})
  }

  setVertices(v){
    this.setState({numV: v});
    this.resetNetwork();
  }

  setEdges(e){
    this.setState({numE: e});
    this.resetNetwork();
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
  render(){

    return <div>
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
              <label for="speed"> AnimationSpeed : {this.state.animationSpeed}ms</label>
              <input
              type = "range"
              min = "15"
              max = "150"
              defaultValue = "50"
              step = "1"
              className = "slider"
              name = "weight"
              disabled = {this.state.running}
              onInput = {(event) => this.setVertices(event.target.value)}>
              </input>
              <label> Vertices: {this.state.numV}</label>
              <input
              type = "range"
              min = "30"
              max = "400"
              defaultValue = "150"
              step = "1"
              className = "slider"
              name = "weight"
              disabled = {this.state.running}
              onInput = {(event) => this.setEdges(event.target.value)}>
              </input>
              <label> Edges: {this.state.numE}</label>
              <input
              type = "range"
              min = "0"
              max = "1"
              defaultValue = "0"
              step = "1"
              className = "slider"
              disabled = {this.state.running}>
              </input>
              <label> Connected </label>
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
              max = "0.1"
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

function createRandomNetwork(maxWidth, maxHeight, numV, numE){
  //create random vertices
  let vertices = [];
  for(let i = 0; i< numV; i++){
    vertices.push(createRandomPos(maxWidth, maxHeight))
  }
  let edges = [];
  for(let i = 0; i<numE; i++){
    edges.push(connectRandomVertices(vertices.length, vertices))
  }

  return [vertices,edges];
}

function createRandomPos(maxWidth, maxHeight){
  return [Math.random()*(maxWidth+1-3), Math.random()*(maxHeight+1-3)];
}

function connectRandomVertices(end, vertices){
  var random1 = Math.floor(Math.random()*end);
  var random2 = Math.floor(Math.random()*end);
  return [random1, random2];
}
