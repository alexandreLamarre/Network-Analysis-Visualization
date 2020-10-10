import React from "react";
import HelpWindow from "./HelpWindow";
import AlgorithmAttributes from "./AlgorithmAttributes";
import Vertex from "./datatypes/Vertex";
import Edge from "./datatypes/Edge";
import createRandomNetwork from "./networkgeneration/createRandomNetwork";
import {springEmbedding} from "./NetworkAlgorithms/springEmbedding";
import {fruchtermanReingold} from "./NetworkAlgorithms/FruchtermanReingold";
import {kamadaKawai} from "./NetworkAlgorithms/kamadaKawai";
import {forceAtlas2} from "./NetworkAlgorithms/forceAtlas2";
import {forceAtlasLinLog} from "./NetworkAlgorithms/forceAtlasLinLog";
import {hall} from "./Spectral/Hall";
import {radialFlowDirected} from "./NetworkAlgorithms/radialFlowDirected";
import {spectralDrawing} from "./Spectral/spectralDrawing";
import {kruskal} from "./MSTAlgorithms/kruskal";
import {prim} from "./MSTAlgorithms/prims";
import {opt2} from "./TSP/opt2";
import {opt3} from "./TSP/opt3";
import {GreedyColoring} from "./Coloring/GreedyColoring";
import getHelpInfo from "./helpInfoFunctions";

import "./Network.css";

var MAX_EDGES = 600;
var MAX_TIMEOUT = 30; //seconds
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
      TSP : false,
    };
    this.app = this.props.app;
    this.help = React.createRef();
    this.tutorial = React.createRef();
  }

  componentDidMount(){
    const w = window.innerHeight * 0.55;
    const h = window.innerHeight * 0.55;

    const [vertices, edges] = createRandomNetwork(w, h, this.app.state.numV,
      this.app.state.numE, this.app.state.connected, this.state.randomType,
      [this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue],
      [this.app.state.endRed, this.app.state.endGreen, this.app.state.endBlue], this.app.state.degreesize, this.app.state.minsize, this.app.state.maxsize)
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
      this.cancelAnimation();
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
    const [animations, new_edges] = kruskal(this.state.vertices, this.state.edges, 2,
      [this.app.state.settings.kruskal.red, this.app.state.settings.kruskal.green,
        this.app.state.settings.kruskal.blue]);
    const that = this;
    waitSetEdges(that, new_edges, animations);
  }

  generatePrim(){
    const animations = prim(this.state.vertices, this.state.edges, 2,
      [this.app.state.settings.prim.red, this.app.state.settings.prim.green,
      this.app.state.settings.prim.blue]);
    this.animateColoring(animations);
  }

  generate2Opt(){
    this.animateTSP(opt2);
  }

  generate3Opt(){
    this.animateTSP(opt3);
  }

  generateGreedyVertex(){
    const [vertices, animations] = GreedyColoring(this.state.vertices, this.state.edges, this.app.state.dimension, [255,255,0], [0,0,255])
    this.animateColoring(animations)
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
    if(this.state.algoType === "3opt") this.generate3Opt();
    if(this.state.algoType === "greedyvertex") this.generateGreedyVertex();
  }

  animateTSP(func){
    let x = 0;
    var STOP = 10;
    var count = 0;
    this.app.setState({running:true});
    console.log(this.app.state.running)
    var timeout;
    var selected_color;
    if(func === opt2) {
      console.log(this.app.state.settings.opt2)
      timeout = this.app.state.settings.opt2.timeout;
      selected_color = [this.app.state.settings.opt2.red, this.app.state.settings.opt2.green,
                        this.app.state.settings.opt2.blue];
    }
    if(func === opt3) {
      timeout = this.app.state.settings.opt3.timeout;
      selected_color = [this.app.state.settings.opt3.red, this.app.state.settings.opt3.green,
                        this.app.state.settings.opt3.blue];
    }
    console.log("timeout", timeout);
    for(let k =0; k < (timeout*1000)/this.app.state.animationSpeed; k++){
      x = setTimeout(() => {
        const [edges, better_solution]= func(this.state.vertices,
          this.state.edges, this.app.state.dimension, selected_color);
        const that = this;
        animateEdges(that, edges);
        //clear animation code;
        // if(better_solution === true) count = 0;
        // count ++;
        // if(count >= STOP) break;
        // console.log("animating")
        if(k === ((timeout*1000)/this.app.state.animationSpeed) -1){
          this.app.setState({running:false});
          // console.log(final_vertices);
        }
      }, k * this.app.state.animationSpeed)
    }
    this.setState({maxtimeouts: x});
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
    if(v === "2opt" || v === "3opt" ||
        v === "2optannealing" || v === "3optannealing"){
          this.setState({TSP:true});
          if(this.state.randomType !== "cycle") this.setRandomizedType("cycle");
        }
    else{ this.setState({TSP: false})}
  }
  setRandomizedType(v){
    const that = this;
    waitSetRandomizedType(that, v);
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
    const [vertices, edges] = createRandomNetwork(this.state.width, this.state.height,
       this.app.state.numV, this.app.state.numE, this.app.state.connected, this.state.randomType,
       [this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue],
       [this.app.state.endRed, this.app.state.endGreen, this.app.state.endBlue], this.app.state.degreesize, this.app.state.minsize, this.app.state.maxsize);
    this.setState(
      {vertices: vertices,
       edges: edges,
      }
    );

    this.app.setState({numV: vertices.length, numE: edges.length});
  }

  cancelAnimation(){
    var id = this.state.maxtimeouts;
    while(id){
      clearInterval(id);
      id --;
    }
    this.app.setState({running: false});
  }

  resetColoring(){
    const shouldRecolor = !(sameColor([this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue],
                              [this.app.state.endRed, this.app.state.endGreen, this.app.state.endBlue]));
    if(shouldRecolor === true){
      const new_vertices = this.state.vertices.slice();
      const max_degree = find_max_degree(this.state.vertices);
      var gradient = createColorGradient([this.app.state.startRed, this.app.state.startGreen,
                                          this.app.state.startBlue], [this.app.state.endRed,
                                          this.app.state.endGreen, this.app.state.endBlue], max_degree);
      for(let i = 0; i < new_vertices.length; i++){
        new_vertices[i].color = assign_color(new_vertices[i].degree, max_degree, gradient);
      }
      const new_edges = [];
      for(let j = 0; j < this.state.edges.length; j++){
        new_edges.push(new Edge(this.state.edges[j].start, this.state.edges[j].end));
      }
      this.setState({vertices: new_vertices, edges: new_edges});
    }
    else{
      const new_vertices = this.state.vertices.slice();
      const color = rgb_to_str([this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue]);
      for(let i = 0; i < new_vertices[i].length; i ++){
        new_vertices[i].color = color;
      }
      const new_edges = [];
      for(let j = 0; j < this.state.edges.length; j++){
        new_edges.push(new Edge(this.state.edges[j].start, this.state.edges[j].end));
      }
      this.setState({vertices: new_vertices, edges: new_edges});
    }
  }

  updateVertexSize(){
    if(this.app.state.degreesize === false){
      const new_size = 3;
      const new_vertices = this.state.vertices.slice();
      for(let i = 0; i < new_vertices.length; i++){
        new_vertices[i].size = new_size;
      }
      this.setState({vertices: new_vertices});
    }
    else{
      const max_degree = find_max_degree(this.state.vertices);
      const new_vertices = this.state.vertices.slice();
      for(let i = 0; i < new_vertices.length; i ++){
        new_vertices[i].size = assign_size(new_vertices[i].degree,
          max_degree, this.app.state.minsize, this.app.state.maxsize);
      }
      this.setState({vertices: new_vertices});
    }
  }

  updateColoring(){
    const shouldRecolor = !(sameColor([this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue],
                              [this.app.state.endRed, this.app.state.endGreen, this.app.state.endBlue]));
    if(shouldRecolor === true){
      const new_vertices = this.state.vertices.slice();
      const max_degree = find_max_degree(this.state.vertices);
      var gradient = createColorGradient([this.app.state.startRed, this.app.state.startGreen,
                                          this.app.state.startBlue], [this.app.state.endRed,
                                          this.app.state.endGreen, this.app.state.endBlue], max_degree);
      for(let i = 0; i < new_vertices.length; i++){
        new_vertices[i].color = assign_color(new_vertices[i].degree, max_degree, gradient);
      }
      this.setState({vertices: new_vertices});
    }
    else{
      const new_vertices = this.state.vertices.slice();
      const color = rgb_to_str([this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue]);
      for(let i = 0; i < new_vertices[i].length; i ++){
        new_vertices[i].color = color;
      }
      this.setState({vertices: new_vertices});
    }
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
                  <option value = "kamadaKawai" hidden = {true} disabled = {true}> Kamada-Kawai </option>
                  <option value = "forceAtlas2"> Force Atlas 2 </option>
                  <option value = "forceAtlasLinLog" > Force Atlas 2 (LinLog) </option>
                  </optgroup>
                  <optgroup label = "Spectral Layout Algorithms">
                  <option value = "hall" disabled = {true}> Hall's algorithm </option>
                  <option value = "spectralDrawing" disabled = {true}> Generalized Eigenvector (Koren)</option>
                  </optgroup>
                  <optgroup label = "Custom Algorithms" hidden = {true}>
                    <option value = "radialFlowDirected" disabled = {true}>  Radial Flow Directed </option>
                  </optgroup>
                  <optgroup label = "Minimum Spanning Trees">
                    <option value ="kruskal"> Kruskral's Algorithm</option>
                    <option value = "prim"> Prim's Algorithm </option>
                  </optgroup>
                  <optgroup label = "TSP">
                    <option value = "2opt"> 2-Opt </option>
                    <option value = "3opt"> 3-Opt </option>
                    <option value = "2optannealing" disabled = {true}> 2-Opt Simulated Annealing </option>
                    <option value = "3optannealing" disabled = {true} hidden = {true}> 3-Opt Simulated Annealing </option>
                  </optgroup>
                  <optgroup label = "Edge Coloring Algorithms">
                    <option value = "" disabled = {true}> Misra-Gries Algorithm (Fan Rotation)</option>
                  </optgroup>
                  <optgroup label = "Vertex Coloring Algorithms">
                    <option value = "greedyvertex" > Greedy Coloring </option>
                  </optgroup>
                </select>

                <button className = "b" onClick = {() => this.runAlgorithm()} disabled = {this.app.state.running}> Run Algorithm </button>
              </div>


              <div className = "selectalgorow">
                <select className = "selectalgo" onChange = {(event) => this.setLayoutType(event.target.value)} disabled = {this.app.state.running}>
                  <option value = "0"> Square </option>
                  <option value = "1"> Stretch to Fit </option>
                </select>
                <select value = {this.state.randomType}
                disabled = {this.app.state.running === true }className = "selectalgo" onChange = {(event) => this.setRandomizedType(event.target.value)}>
                  <option value = "random" disabled = {this.state.TSP === true}> Random </option>
                  <option value = "randomcircle" disabled = {this.state.TSP === true}> Random Circle </option>
                  <option  value = "cycle"> Random Hamiltonian Cycle </option>
                  <option value = "randomclustering" disabled = {true}> Random Clustering </option>
                </select>
                <button className = "b" disabled = {this.app.state.running} onClick = {() => this.resetNetwork()}> Reset Network</button>
              </div>

            <div className = "selectalgorow">
              <button className = "b" onClick = {() => this.cancelAnimation()}> Cancel Animation</button>
              <button className = "b" disabled = {this.app.state.running === true}
              onClick = {() => this.resetColoring()}> Reset Coloring </button>

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

async function waitSetRandomizedType(that,v){
  await that.setState({randomType: v});
  that.resetNetwork();
}

async function animateEdges(that, edges){
  await that.setState({edges: edges});
}

function find_max_degree(vertices){
  var max_degree = -Infinity;
  for(let i = 0; i < vertices.length; i++){
    max_degree = Math.max(vertices[i].degree, max_degree);
  }
  return max_degree;
}

function assign_size(degree, max_degree, minsize, maxsize){
  //min degree is 1 or 0
  return minsize +(maxsize - minsize)*(degree/max_degree)
}

function sameColor(startColor, endColor){
  if(startColor[0] === endColor[0] && startColor[1] === endColor[1] && startColor[2] === endColor[2]) return true;
  return false;
}

function rgb_to_str(color){
  return "rgb(" + color[0] + "," + color[1] + "," + color[2]+")";
}

function createColorGradient(startColor, endColor, maxDegree){
  // console.log("inside color gradient", startColor, endColor, maxDegree);
  var [startHue, startSaturation, startLightness] = rgb_to_hsl(startColor);
  var [endHue, endSaturation, endLightness] = rgb_to_hsl(endColor);

  // console.log(startHue, startSaturation, startLightness);
  // console.log(endHue, endSaturation, endLightness);
  var incrementHue = (endHue-startHue)/maxDegree;

  const gradient = [];

  for(let i = 0; i < maxDegree; i++){
    const newHue = startHue+(incrementHue*i)%360;
    const [red,green,blue] = hsl_to_rgb((startHue+incrementHue*i)%360, startSaturation,
                                            startLightness)
    gradient.push([Math.abs(red%256), Math.abs(green%256), Math.abs(blue%256)]);
    // console.log(gradient[i]);
  }
  return gradient;
}

function rgb_to_hsl(rgbColor){
  var red = rgbColor[0]/255;
  var green = rgbColor[1]/255;
  var blue = rgbColor[2]/255;
  var Cmax = Math.max(...[red,green,blue]);
  var Cmin = Math.min(...[red,green,blue]);
  var delta = Cmax-Cmin;


  var hue = calculate_hue(delta, Cmax, red, green, blue)%360;
  var lightness = (Cmax+Cmin)/2;
  var saturation = delta === 0? 0: delta/(1-Math.abs(2*lightness-1));

  return [hue, saturation, lightness];
}

function hsl_to_rgb(hue, saturation, lightness){
  const C = (1 - Math.abs(2*lightness-1))*saturation
  const X = C * (1 - Math.abs(hue/60)%2 -1);
  const m = lightness - C/2;
  const [R_prime, G_prime, B_prime] = check_degrees(hue, C, X);
  return [((R_prime+m)*255)%256, ((G_prime + m)* 255)%256, ((B_prime+m) * 255)%256];
}

function calculate_hue(delta, Cmax, red, green, blue){
  if(delta === 0) return 0;
  if(Cmax === red) return 60*(((green-blue)/delta)%6);
  if(Cmax === green) return 60*((blue-red)/delta+2);
  if(Cmax === blue) return 60*((red- green)/delta + 4);
}

function check_degrees(hue, C, X){
  if((hue >= 0 && hue < 60) || hue == 360) return [C,X,0];
  if(hue >= 60 && hue < 120 ) return [X,C,0];
  if(hue >= 120 && hue < 180 ) return [0, C, X];
  if(hue >= 180 && hue < 240 ) return [0, X, C];
  if(hue >= 240 && hue < 300 ) return [X, 0, C];
  if(hue >= 300 && hue < 360 ) return [C, 0, X];
  return [0,0,0];
}

function assign_color(degree, max_degree, gradient){

  var selection = gradient[Math.floor((degree/max_degree) * (gradient.length-1))]

  return rgb_to_str(selection)
}
