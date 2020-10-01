import React from "react";
import HelpWindow from "./HelpWindow";
import AlgorithmAttributes from "./AlgorithmAttributes";
import createRandomNetwork from "./networkgeneration/createRandomNetwork";
import {springEmbedding} from "./NetworkAlgorithms/springEmbedding";
import {fruchtermanReingold} from "./NetworkAlgorithms/FruchtermanReingold";
import {kamadaKawai} from "./NetworkAlgorithms/kamadaKawai";
import {forceAtlas2} from "./NetworkAlgorithms/forceAtlas2";
import {forceAtlasLinLog} from "./NetworkAlgorithms/forceAtlasLinLog";
import {hall} from "./NetworkAlgorithms/Hall";
import {radialFlowDirected} from "./NetworkAlgorithms/radialFlowDirected";
import {spectralDrawing} from "./NetworkAlgorithms/spectralDrawing";
import {kruskal} from "./MSTAlgorithms/kruskal";
import {prim} from "./MSTAlgorithms/prims";
import {initial_random_cycle} from "./TSP/opt2";
import {opt2} from "./TSP/opt2";
import getHelpInfo from "./helpInfoFunctions";

import "./Network.css";

var MAX_EDGES = 600;
// var MAX_TIMEOUT = 0;


class NetworkVisualizer extends React.Component{
  constructor(props){
    super(props);
    this.canvas =  React.createRef();
    this.state ={
      width : 0,
      height: 0,
      vertices: [],
      edges: [],
      sorted: false,
      iterations: 100,
      maxtimeouts: 0,
      maxDegree: Infinity,
      algoType: "spring",
      randomType: "random",
      layoutType: 0,
    };
    this.app = this.props.app;
    this.help = React.createRef();
    this.tutorial = React.createRef();
  }

  componentDidMount(){
    const w = window.innerHeight * 0.55;
    const h = window.innerHeight * 0.55;

    const [vertices, edges] = createRandomNetwork(w, h, this.app.state.numV, this.app.state.numE, this.app.state.connected, this.state.randomType);
    this.setState(
      {width: w,
      height: h,
      vertices: vertices,
      edges: edges,}
    );
    this.app.setState({numV: vertices.length, numE: edges.length});
  }

  componentDidUpdate(){
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;
    const ctx = this.canvas.current.getContext("2d");
    for(let i =0; i < this.state.vertices.length; i++){
      ctx.beginPath();
      const c = this.state.vertices[i].color;
      ctx.fillStyle= c;
      // ctx.fillRect(this.state.vertices[i][0], this.state.vertices[i][1], 6, 6);
      ctx.arc(this.state.vertices[i].x, this.state.vertices[i].y, this.state.vertices[i].size, 0, Math.PI*2)
      ctx.fill();
      ctx.closePath();
    }

    for(let j = 0; j < this.state.edges.length; j++){
      ctx.beginPath();
      const index1 = this.state.edges[j].start;
      const index2 = this.state.edges[j].end;
      ctx.moveTo(this.state.vertices[index1].x,this.state.vertices[index1].y);
      ctx.lineTo(this.state.vertices[index2].x,this.state.vertices[index2].y);
      ctx.globalAlpha = this.state.edges[j].alpha;
      ctx.strokeStyle = this.state.edges[j].color;
      ctx.stroke();
      ctx.closePath();
    }
  }
  componentWillUnmount(){
      var id = this.state.maxtimeouts;
      while(id){
        clearInterval(id);
        id --;
      }
  }

  generateForceDirectedLayout(){
    const values = springEmbedding(this.state.vertices, this.state.edges,
                    this.state.width, this.state.height, this.state.iterations,
                    this.app.state.settings.spring );
    const new_vertices = values[0];
    const animations = values[1];
    this.animateNetwork(animations, new_vertices);
  }

  generateReingold(){
    const values = fruchtermanReingold(this.state.vertices, this.state.edges,
            this.state.width,this.state.height, this.state.iterations,
            this.app.state.settings.fruchterman);
    const new_vertices = values[0];
    const animations = values[1];
    // console.log(animations);

    this.animateNetwork(animations, new_vertices);
  }

  generateKamadaKawai(){
    const values = kamadaKawai(this.state.vertices, this.state.edges,
      this.state.width, this.state.height, this.state.iterations);
  }

  generateForceAtlas2(){
    const values = forceAtlas2(this.state.vertices, this.state.edges,
      this.state.width, this.state.height, this.state.iterations, this.app.state.settings.forceatlas2);
    const new_vertices = values[0];
    const animations = values[1];
    // console.log(new_vertices);

    this.animateNetwork(animations, new_vertices);
  }

  generateForceAtlasLinLog(){
    const values = forceAtlasLinLog(this.state.vertices, this.state.edges,
      this.state.width, this.state.height, this.state.iterations, this.app.state.settings.forceatlaslinlog)
    const new_vertices = values[0];
    const animations = values[1];

    this.animateNetwork(animations, new_vertices);
  }

  generateHall(){

  }

  generateSpectralDrawing(){

  }

  generateRadialFlowDirected(){

  }

  generateKruskal(){
    const [animations, new_edges] = kruskal(this.state.vertices, this.state.edges, 2);
    const that = this;
    waitSetEdges(that, new_edges, animations);
  }

  generatePrim(){
    const animations = prim(this.state.vertices, this.state.edges, 2);
    this.animateColoring(animations);
  }

  generate2Opt(){
    const [path, root] = initial_random_cycle(this.state.vertices, this.state.edges);
    console.log(path);
    console.log(root);
    opt2(path,root,1,this.state.vertices,this.app.state.dimension);

  }

  runAlgorithm(){
    if(this.state.algoType === "spring") this.generateForceDirectedLayout();
    if(this.state.algoType === "fruchtermanReingold") this.generateReingold();
    if(this.state.algoType === "kamadaKawai") this.generateKamadaKawai();
    if(this.state.algoType === "forceAtlas2") this.generateForceAtlas2();
    if(this.state.algoType === "forceAtlasLinLog") this.generateForceAtlasLinLog();
    if(this.state.algoType === "hall") this.generateHall();
    if(this.state.algoType === "spectralDrawing") this.generateSpectralDrawing();
    if(this.state.algoType === "radialFlowDirected") this.generateRadialFlowDirected();
    if(this.state.algoType === "kruskal") this.generateKruskal();
    if(this.state.algoType === "prim") this.generatePrim();
    if(this.state.algoType === "2opt") this.generate2Opt();
  }

  animateColoring(animations){
    let x = 0;
    this.app.setState({running:true});

    for(let k =0; k < animations.length; k++){
      x = setTimeout(() => {
        const vertices = this.state.vertices;
        const edges= this.state.edges;

        if(animations[k].vIndex !== undefined){
          vertices[animations[k].vIndex].color = animations[k].color;
          // vertices[animations[k].vIndex].size = animations[k].size;
        }
        if(animations[k].eIndex !== undefined){
          edges[animations[k].eIndex].setColor(animations[k].color);
          edges[animations[k].eIndex].setAlpha(animations[k].alpha)
        }

        this.setState({vertices: vertices, edges:edges});
        // console.log("animating")
        if(k === animations.length-1){
          this.app.setState({running:false});
          // console.log(final_vertices);
        }
      }, k * this.app.state.animationSpeed)
    }
    this.setState({maxtimeouts: x});
  }

  animateNetwork(animations, final_vertices){
    let x = 0;
    this.app.setState({running:true});
    for(let k = 0; k < animations.length; k++){

      x = setTimeout(() => {
        const vertices = this.state.vertices;
        for(let i = 0; i <vertices.length; i++){
          vertices[i].setVector(animations[k][i]);
        }
        this.setState({vertices: vertices});
        // console.log("animating")
        if(k === animations.length-1){
          this.setState({sorted:true, vertices:final_vertices});
          this.app.setState({running:false});
          // console.log(final_vertices);
        }
      }, k * this.app.state.animationSpeed)
    }
    this.setState({maxtimeouts: x});
  }

  setAlgoType(v){
    // this.attribute.current.setLayout(v)
    this.setState({algoType: v});
  }
  setRandomizedType(v){
    this.setState({randomType: v})
  }

  setHelp(v){
    var value = v;
    if(v === "algoType"){
      value = this.state.algoType;
    }
    // this.attribute.current.help.current.setOpen(false)
    const [title, info, details, open] = getHelpInfo(value);
    this.help.current.setTitle(title);
    this.help.current.setInfo(info);
    this.help.current.setDetails(details)
    this.help.current.setOpen(open);
  }

  setLayoutType(v){
    const value = parseInt(v);
    this.setState({layoutType:value});
    if(value === 0){
      const w =  0.55*window.innerHeight;
      const h = 0.55*window.innerHeight;
      this.canvas.current.height = h;
      this.canvas.current.width = w;
      const that = this;
      waitSetLayout(that, w, h);
    }
    if(value === 1){
      const w =  0.97*window.innerWidth;
      const h = 0.55*window.innerHeight;
      this.canvas.current.height = h;
      this.canvas.current.width = w;
      const that = this;
      waitSetLayout(that, w, h);
      // this.attribute.current.setState({delta: 0.2})
    }
  }

  resetNetwork(){
    const [vertices, edges] = createRandomNetwork(this.state.width, this.state.height, this.app.state.numV, this.app.state.numE, this.app.state.connected, this.state.randomType);
    this.setState(
      {vertices: vertices,
       edges: edges,
      }
    );

    this.app.setState({numV: vertices.length, numE: edges.length});
  }
  render(){

    return <div className = "network">
            <canvas
            className = "networkCanvas" ref = {this.canvas}>
            </canvas>
            <div className = "selectContainer">
              <div className = "selectalgorow">

                <select className = "selectalgo" onChange = {(event) => this.setAlgoType(event.target.value)}>
                  <optgroup label = "Force Directed Algorithms">
                  <option value = "spring"> Basic Spring Embedding </option>
                  <option value = "fruchtermanReingold"> Fruchterman-Reingold </option>
                  <option value = "kamadaKawai" disabled = {true}> Kamada-Kawai </option>
                  <option value = "forceAtlas2"> Force Atlas 2 </option>
                  <option value = "forceAtlasLinLog" > Force Atlas 2 (LinLog) </option>
                  </optgroup>
                  <optgroup label = "Spectral Layout Algorithms">
                  <option value = "hall" disabled = {true}> Hall's algorithm </option>
                  <option value = "spectralDrawing" disabled = {true}> Generalized Eigenvector Spectral Drawing (Koren)</option>
                  </optgroup>
                  <optgroup label = "Custom Algorithms">
                    <option value = "radialFlowDirected" disabled = {true}>  Radial Flow Directed </option>
                  </optgroup>
                  <optgroup label = "Minimum Spanning Trees">
                    <option value ="kruskal"> Kruskral's Algorithm</option>
                    <option value = "prim"> Prim's Algorithm </option>
                  </optgroup>
                  <optgroup label = "TSP">
                    <option value = "2opt"> 2-Opt </option>
                    <option value = "3opt" disabled = {true}> 3-Opt </option>
                    <option value = "2optannealing" disabled = {true}> 2-Opt Simulated Annealing </option>
                    <option value = "3optannealing" disabled = {true}> 3-Opt Simulated Annealing </option>
                  </optgroup>
                </select>

                <button className = "b" onClick = {() => this.runAlgorithm()} disabled = {this.app.state.running}> Run Algorithm </button>
              </div>


              <div className = "selectalgorow">
                <select className = "selectalgo" onChange = {(event) => this.setRandomizedType(event.target.value)}>
                  <option value = "random"> Random </option>
                  <option value = "randomcircle"> Random Circle </option>
                  <option value = "randomsymmetry" disabled = {true}> Random Symmetry </option>
                  <option value = "randomclustering" disabled = {true}> Random Clustering </option>
                </select>
                <button className = "b" disabled = {this.app.state.running} onClick = {() => this.resetNetwork()}> Reset Network</button>
              </div>

            <div className = "selectalgorow">
              <select className = "selectalgo" onChange = {(event) => this.setLayoutType(event.target.value)} disabled = {this.app.state.running}>
                <option value = "0"> Square </option>
                <option value = "1"> Stretch to Fit </option>
              </select>

            </div>
            </div>
            <HelpWindow ref = {this.help}></HelpWindow>
           </div>
  }
}

export default NetworkVisualizer;


async function waitSetLayout(that,w,h){
  await that.setState({height: h,width: w});
  that.resetNetwork();
}

async function waitSetEdges(that, sorted_edges,animations){
  await that.setState({edges: sorted_edges});
  that.animateColoring(animations)
}
