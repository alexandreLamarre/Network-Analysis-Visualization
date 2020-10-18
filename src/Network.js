import React from "react";
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
import {opt2Annealing} from "./TSP/opt2Annealing";
import {opt3} from "./TSP/opt3";
import {GreedyColoring} from "./Coloring/GreedyColoring";
import {misraGries} from "./Coloring/misraGries";

import "./Network.css";

var MAX_EDGES = 600;
var MAX_TIMEOUT = 30; //seconds
// var MAX_TIMEOUT = 0;

async function waitAnimateNetwork(that,startIndex, endIndex, animations,func){
  if(animations !== null) await that.setState({currentAnimations: animations});
  await that.setState({currentAnimationIndex: startIndex, animationIndex: endIndex, paused: false});
  // console.log("start",startIndex,"end", endIndex,"animations", animations);
  if(that.state.group === "layout") that.animateNetwork();
  if(that.state.group === "coloring") that.animateColoring();
  if(that.state.group === "TSP") that.animateTSP()
  // if(that.state.group === "coloring") continue;
  // if(that.state.group === "TSP") continue;
}

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
      offsetX: 0,
      offsetY: 0,
      dragging: false,
      previousMouseX: 0,
      previousMouseY: 0,
      scaleFactor: 1,
      currentAnimations: [],
      currentAnimationIndex: 0,
      animationIndex: 0,
      paused: true,
      group: "layout", // layout, coloring or TSP

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
    this.app.setState({numV: vertices.length, numE: edges.length, mouseX: w/2, mouseY:h/2});
  }

  componentDidUpdate(){
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;
    const ctx = this.canvas.current.getContext("2d");
    ctx.scale(this.state.scaleFactor,this.state.scaleFactor);
    for(let i =0; i < this.state.vertices.length; i++){
      ctx.beginPath();
      const c = this.state.vertices[i].color;
      ctx.fillStyle= c;
      // ctx.fillRect(this.state.vertices[i][0], this.state.vertices[i][1], 6, 6);
      ctx.arc(this.state.vertices[i].x+this.state.offsetX, this.state.vertices[i].y+this.state.offsetY, this.state.vertices[i].size, 0, Math.PI*2)
      ctx.fill();
      ctx.closePath();
    }

    for(let j = 0; j < this.state.edges.length; j++){
      ctx.beginPath();
      const index1 = this.state.edges[j].start;
      const index2 = this.state.edges[j].end;
      ctx.moveTo(this.state.vertices[index1].x+this.state.offsetX,this.state.vertices[index1].y+this.state.offsetY);
      ctx.lineTo(this.state.vertices[index2].x+this.state.offsetX,this.state.vertices[index2].y+this.state.offsetY);
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
    waitAnimateNetwork(this, 0,animations.length, animations);
  }

  generateReingold(){
    const values = fruchtermanReingold(this.state.vertices, this.state.edges,
            this.state.width,this.state.height, this.state.iterations,
            this.app.state.settings.fruchterman);
    const new_vertices = values[0];
    const animations = values[1];
    // console.log(animations);
    waitAnimateNetwork(this, 0, animations.length, animations);
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

    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  generateForceAtlasLinLog(){
    const values = forceAtlasLinLog(this.state.vertices, this.state.edges,
      this.state.width, this.state.height, this.state.iterations, this.app.state.settings.forceatlaslinlog)
    const new_vertices = values[0];
    const animations = values[1];

    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  generateHall(){
    const values = hall(this.state.vertices,this.state.edges, this.state.width, this.state.height)
  }

  generateSpectralDrawing(){
    const [eigenvectors, animations] = spectralDrawing(this.state.vertices,
      this.state.edges,this.state.width, this.state.height, this.app.state.dimension);
      waitAnimateNetwork(this, 0, animations.length, animations);
  }

  generateRadialFlowDirected(){

  }

  generateKruskal(){
    const [animations, sorted_edges] = kruskal(this.state.vertices, this.state.edges, 2,
      [this.app.state.settings.kruskal.red, this.app.state.settings.kruskal.green,
        this.app.state.settings.kruskal.blue]);
    const that = this;
    waitSetEdges(that, sorted_edges, animations);
  }

  generatePrim(){
    const animations = prim(this.state.vertices, this.state.edges, 2,
      [this.app.state.settings.prim.red, this.app.state.settings.prim.green,
      this.app.state.settings.prim.blue]);
    waitAnimateNetwork(this,0,animations.length,animations);
  }

  generate2Opt(){
    const animations = [];
    this.app.setState({running:true});
    const selected_color = [this.app.state.settings.opt2.red, this.app.state.settings.opt2.green,
                      this.app.state.settings.opt2.blue];
    var edges = this.state.edges;
    var better_solution = false;
    for(let i = 0; i < (this.app.state.settings.opt2.timeout*1000)/this.app.state.animationSpeed; i++){
      [edges, better_solution]= opt2(this.state.vertices,
        edges, this.app.state.dimension, selected_color);
      animations.push(edges);
    }
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  generate2OptAnnealing(){
    const animations = [];
    this.app.setState({running:true});
    var current_temperature = this.app.state.settings.opt2annealing.temperature;
    const max_temperature = current_temperature;
    var temp = current_temperature;
    for(let i = 0; i < (this.app.state.settings.opt2annealing.timeout*1000)/this.app.state.animationSpeed; i++){
      temp = 0.992*temp;
    }
    var min_temperature = temp;
    // console.log("max", max_temperature, "min", min_temperature);

    var edges = this.state.edges;
    var better_solution = false;
    for(let i = 0; i < (this.app.state.settings.opt2annealing.timeout*1000)/this.app.state.animationSpeed; i++){
      [edges, better_solution] = opt2Annealing(this.state.vertices,
          edges, this.app.state.dimension, this.app.state.settings.opt2annealing.startColor,
          this.app.state.settings.opt2annealing.endColor, current_temperature,
          min_temperature, max_temperature,
          this.app.state.settings.opt2annealing.acceptance);
      animations.push(edges);
      current_temperature = 0.992*current_temperature;
    }
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  generate3Opt(){
    const animations = [];
    this.app.setState({running:true});
    const selected_color = [this.app.state.settings.opt3.red, this.app.state.settings.opt3.green,
                      this.app.state.settings.opt3.blue];
    var edges = this.state.edges;
    var better_solution = false;
    for(let i = 0; i < (this.app.state.settings.opt3.timeout*1000)/this.app.state.animationSpeed; i++){
      [edges, better_solution]= opt3(this.state.vertices,
        edges, this.app.state.dimension, selected_color);
      animations.push(edges);
    }
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  generateGreedyVertex(){
    const [vertices, animations] = GreedyColoring(this.state.vertices, this.state.edges, this.app.state.dimension, [255,255,0], [0,0,255])
    waitAnimateNetwork(this,0,animations.length,animations);
  }

  generateMisraGries(){
    const animations = misraGries(this.state.vertices, this.state.edges, [255,0,0], [0,255,0]);
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  runAlgorithm(){
    if(this.app.state.running === false){
      if(this.state.algoType === "spring") this.generateForceDirectedLayout();
      if(this.state.algoType === "fruchtermanReingold") this.generateReingold();
      if(this.state.algoType === "kamadaKawai") this.generateKamadaKawai();
      if(this.state.algoType === "forceAtlas2") this.generateForceAtlas2();
      if(this.state.algoType === "forceatlaslinlog") this.generateForceAtlasLinLog();
      if(this.state.algoType === "hall") this.generateHall();
      if(this.state.algoType === "spectralDrawing") this.generateSpectralDrawing();
      if(this.state.algoType === "radialFlowDirected") this.generateRadialFlowDirected();
      if(this.state.algoType === "kruskal") this.generateKruskal();
      if(this.state.algoType === "prim") this.generatePrim();
      if(this.state.algoType === "2opt") this.generate2Opt();
      if(this.state.algoType === "2optannealing") this.generate2OptAnnealing();
      if(this.state.algoType === "3opt") this.generate3Opt();
      if(this.state.algoType === "greedyvertex") this.generateGreedyVertex();
      if(this.state.algoType === "misra") this.generateMisraGries();
    }
    else{
      waitAnimateNetwork(this, this.state.currentAnimationIndex, this.state.currentAnimations.length-1, null);
    }
  }

  animateTSP(func){
    let x = 0;
    this.app.setState({running:true});
    // console.log(this.app.state.running)
    const start = this.state.currentAnimationIndex;
    const end = this.state.animationIndex;
    for(let k =start; k < end; k++){
      x = setTimeout(() => {
        const vertices = this.state.vertices;
        const edges= this.state.edges;
        const animations = this.state.currentAnimations;

        this.setState({edges: animations[k], currentAnimationIndex: this.state.currentAnimationIndex + 1});
        // console.log("animating")
        if(k === end-1){
          // console.log("pausing")
          this.setState({paused: true,currentAnimationIndex: end});

          // console.log(final_vertices);
        }
      }, (k-start) * this.app.state.animationSpeed)
    }

    this.setState({maxtimeouts: x});
  }

  animateColoring(){
    let x = 0;
    this.app.setState({running:true});
    // console.log("animating");
    const start = this.state.currentAnimationIndex;
    const end = this.state.animationIndex;

    for(let k =start; k < end; k++){
      x = setTimeout(() => {
        const vertices = this.state.vertices;
        const edges= this.state.edges;
        const animations = this.state.currentAnimations;

        this.setState({vertices: animations[k].vertices, edges:animations[k].edges, currentAnimationIndex: this.state.currentAnimationIndex + 1});
        // console.log("animating")
        if(k === end-1){
          // console.log("pausing")
          this.setState({paused: true,currentAnimationIndex: end});

          // console.log(final_vertices);
        }
      }, (k-start) * this.app.state.animationSpeed)
    }
    this.setState({maxtimeouts: x});
  }

  animateNetwork(){
    let x = 0;
    this.app.setState({running:true});
    const start = this.state.currentAnimationIndex;
    const end = this.state.animationIndex;
    for(let k = start; k < end; k++){

      x = setTimeout(() => {
        const vertices = this.state.vertices;
        for(let i = 0; i <vertices.length; i++){
          vertices[i].setVector(this.state.currentAnimations[k][i]);
        }
        this.setState({vertices: vertices, currentAnimationIndex: this.state.currentAnimationIndex+1});
        if(k === end-1) this.setState({paused: true, currentAnimationIndex: end});
        // console.log("animating")
      }, (k-start) * this.app.state.animationSpeed)
    }
    this.setState({maxtimeouts: x});
  }

  setAlgoType(v){
    // this.attribute.current.setLayout(v)
    this.setState({algoType: v});
    if(v === "2opt" || v === "3opt" ||
        v === "2optannealing" || v === "3optannealing"){
          this.setState({group:"TSP"});
          if(this.state.randomType !== "cycle") this.setRandomizedType("cycle");
        }
    else if(v === "spring" || v === "fruchterman" || v === "forceAtlas2"
                      || v === "forceatlaslinlog" || v === "spectralDrawing" ||
                      v === "hall" || v === "schwarz"){
        this.setState({group:"layout"});
      }
    else if(v === "kruskal" || v === "prim" || v === "greedyvertex" ||
                                        v === "misra"){
        this.setState({group:"coloring"});
    }
  }

  setRandomizedType(v){
    const that = this;
    waitSetRandomizedType(that, v);
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

  clearAnimations(){
    var id = this.state.maxtimeouts;
    while(id){
      clearInterval(id);
      id --;
    }
  }

  cancelAnimation(){
    this.setState({currentAnimations: [], paused: true});
    this.clearAnimations();
    this.app.setState({running: false});
  }

  pauseAnimation(){
    this.setState({paused:true});
    this.clearAnimations();
    // console.log(this.state.currentAnimationIndex);
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
        const e = new Edge(this.state.edges[j].start, this.state.edges[j].end)
        if(this.state.group === "TSP") e.setAlpha(0.2);
        new_edges.push(e);
      }

      this.setState({vertices: new_vertices, edges: new_edges});
    }
    else{
      const new_vertices = this.state.vertices.slice();
      const color = rgb_to_str([this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue]);
      for(let i = 0; i < new_vertices.length; i ++){
        new_vertices[i].color = color;
      }
      const new_edges = [];
      for(let j = 0; j < this.state.edges.length; j++){
        const e = new Edge(this.state.edges[j].start, this.state.edges[j].end)
        if(this.state.group === "TSP") e.setAlpha(0.2);
        new_edges.push(e);
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
      for(let i = 0; i < new_vertices.length; i ++){
        new_vertices[i].color = color;
      }
      this.setState({vertices: new_vertices});
    }
  }

  setDrag(e,v){
    e.preventDefault();
    if(v === true) {
      this.state.previousMouseX = e.clientX;
      this.state.previousMouseY = e.clientY;
    }
    this.setState({dragging:v});
  }

  updateCamera(e){
    e.preventDefault();
    if(this.state.dragging){
      const deltaX = e.clientX - this.state.previousMouseX;
      const deltaY = e.clientY - this.state.previousMouseY;
      const new_offsetX = this.state.offsetX += 0.75*deltaX;
      const new_offsetY = this.state.offsetY += 0.75*deltaY;
      this.setState({previousMouseX: e.clientX, previousMouseY: e.clientY,
                    offsetX: new_offsetX, offsetY: new_offsetY});
    }
  }

  resetCamera(){
    this.setState({offsetX:0,offsetY:0, scaleFactor: 1, mouseX: this.state.wdith/2, mouseY:this.state.height/2})
  }

  zoomCamera(e){
    e.preventDefault();
    const delta = -Math.sign(e.deltaY);
    const new_scale_factor = this.state.scaleFactor + delta*0.035;
    this.setState({scaleFactor: new_scale_factor});
  }

  skipFrame(){
    this.clearAnimations();
    const animations_index = Math.min(this.state.currentAnimationIndex + 1,
                                      this.state.currentAnimations.length-1);
    waitAnimateNetwork(this, animations_index, animations_index+1, null);
  }

  rewindFrame(){
    this.clearAnimations();
    const animations_index = Math.max(this.state.currentAnimationIndex -2, 0);
    waitAnimateNetwork(this, animations_index, animations_index+1, null);
  }

  skipForward(){
    this.clearAnimations();
    const animations_index = Math.min(this.state.currentAnimations.length-1,
        this.state.currentAnimationIndex + Math.floor(1000/this.app.state.animationSpeed));
    const end_index = this.state.paused === true? animations_index+1:
                              this.state.currentAnimations.length;
    waitAnimateNetwork(this, animations_index, end_index, null);
  }

  skipBackward(){
    this.clearAnimations();
    const animations_index = Math.max(0,
        this.state.currentAnimationIndex - Math.floor(1000/this.app.state.animationSpeed));
    const end_index = this.state.paused === true? animations_index+1:
                            this.state.currentAnimations.length-1;
    waitAnimateNetwork(this, animations_index, end_index, null);
  }

  skipToBeginning(){
    this.clearAnimations();
    const animations_index = 0
    this.setState({currentAnimationIndex:0})
    waitAnimateNetwork(this, 0, 1,null);
  }
  skipToEnd(){
    this.clearAnimations();
    const animations_index = this.state.currentAnimations.length-1;
    waitAnimateNetwork(this, animations_index, animations_index+1, null)
  }

  openNetworkSettings(){
    waitOpenNetworkSettings(this);
  }

  openAlgorithmSettings(){
    waitOpenAlgorithmSettings(this);
  }

  saveAsCSV(){
    let csvContent = "data:text/csv;charset=utf-8,";
    const vertices = this.state.vertices;
    const edges = this.state.edges;

    for(let i = 0; i < vertices.length; i ++){
      csvContent += vertices[i].toCSV();
    }
    for(let i = 0; i < edges.length; i++){
      csvContent += (edges[i].toCSV());
    }
    var link = document.createElement('a');
    link.href = csvContent;
    link.download = 'Network.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

  saveAs(extension){
    const canvas = this.canvas.current;
    const image = canvas.toDataURL("network/"+extension);
    var link = document.createElement('a');
    link.href = image;
    link.download = 'Network.'+extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  render(){

    return <div className = "network">
            <canvas style = {{marginTop: this.props.height*1/20+this.props.height/40}}
            className = "networkCanvas" ref = {this.canvas}
            onMouseLeave = {(e) => this.setDrag(e,false)}
            onMouseDown = {(e) => this.setDrag(e,true)}
            onMouseUp = {(e) => this.setDrag(e,false)}
            onMouseMove = {(e) => this.updateCamera(e)}
            onWheel = {(e) => this.zoomCamera(e)}>
            </canvas>
            <br></br>
            <div className = "animationButtons">
            <button className = "FirstFrameB" title = "Skip to algorithm start"
            disabled = {this.app.state.running === false || this.state.currentAnimationIndex === 1}
            style = {{height:Math.min(this.state.width/10,100),
              width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}
              onClick = {() => this.skipToBeginning()}></button>
            <button className = "FastBackB" title = "Rewind algorithm 1 second"
            disabled = {this.app.state.running === false || this.state.currentAnimationIndex === 1}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}
                onClick = {() => this.skipBackward()}></button>
            <button className = "PreviousFrameB" title = "Previous frame"
            disabled = {this.app.state.running === false || this.state.currentAnimationIndex === 1}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}
                onClick = {() => this.rewindFrame()}></button>
            <button className = "StartB" hidden = {this.state.paused === false} title = "Run algorithm"
            disabled = {(this.state.currentAnimationIndex === this.state.currentAnimations.length)
            && this.state.currentAnimations.length !== 0}
            onClick={() => this.runAlgorithm()}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}></button>
            <button className = "PauseB" hidden = {this.state.paused === true} title = "Pause Algorithm"
            onClick = {() => this.pauseAnimation()}
              style = {{height:Math.min(this.state.width/10,100),
                 width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}></button>
            <button className = "StopB"
            title = "Clear algorithm"
            disabled = {this.app.state.running === false}
            onClick = {() => this.cancelAnimation()}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}></button>
            <button className = "NextFrameB"
            title = "Next Frame"
            disabled = {this.app.state.running === false
                        || this.state.currentAnimationIndex === this.state.currentAnimations.length}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}
                onClick = {() => this.skipFrame()}></button>
            <button className = "FastForwardB"
            title = "Skip forward 1 second"
            disabled = {this.app.state.running === false
                        || this.state.currentAnimationIndex === this.state.currentAnimations.length}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}
                onClick = {() => this.skipForward()}></button>
            <button className = "LastFrameB"
            title = "Skip to algorithm termination"
            disabled = {this.app.state.running === false
                        || this.state.currentAnimationIndex === this.state.currentAnimations.length}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}
                onClick = {() => this.skipToEnd()}></button>
            <button className= "CameraB"
            title = "Reset camera"
            disabled = {this.state.offsetX === 0 && this.state.offsetY === 0 && this.state.scaleFactor === 1}
            onClick = {() => this.resetCamera()}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}></button>
            <button className = "ResetColoringB"
            title = "Reset Coloring"
            disabled = {this.app.state.running === true}
            onClick = {() => this.resetColoring()}
              style = {{height:Math.min(this.state.width/10,100),
                width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}></button>
            </div>
            <br></br>
            <div className = "selectContainer">
              <div className = "selectalgorow">

                <select className = "selectalgo"
                onChange = {(event) => this.setAlgoType(event.target.value)}
                style = {{width: (this.state.width*8)/10}}>
                  <optgroup label = "Force Directed Algorithms">
                  <option value = "spring"> Basic Spring Embedding </option>
                  <option value = "fruchtermanReingold"> Fruchterman-Reingold </option>
                  <option value = "kamadaKawai" hidden = {true} disabled = {true}> Kamada-Kawai </option>
                  <option value = "forceAtlas2"> Force Atlas 2 </option>
                  <option value = "forceatlaslinlog" > Force Atlas 2 (LinLog) </option>
                  </optgroup>
                  <optgroup label = "Spectral Layout Algorithms">
                  <option value = "spectralDrawing"> Generalized Eigenvector (Koren)</option>
                  <option value = "hall" hidden= {true}> Hall's algorithm </option>
                  <option value = "schwarz" disabled = {true}> Schwarz Based Method </option>
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
                    <option value = "2optannealing"> 2-Opt Simulated Annealing </option>
                    <option value = "3optannealing" disabled = {true} hidden = {true}> 3-Opt Simulated Annealing </option>
                  </optgroup>
                  <optgroup label = "Edge Coloring Algorithms">
                    <option value = "misra"> Misra-Gries Algorithm (Fan Rotation)</option>
                  </optgroup>
                  <optgroup label = "Vertex Coloring Algorithms">
                    <option value = "greedyvertex" > Greedy Coloring </option>
                  </optgroup>
                </select>
                <div className = "dropdown">
                  <button className = "saveB"
                  disabled = {this.app.state.running === true && this.state.paused === false}
                  title = "Save as"
                  style = {{height:Math.min(this.state.width/10,100),
                  width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
                  </button>
                  <div className = "dropdown-content">
                    <a className = "aFile" onClick = {() => this.saveAsCSV()}>.csv</a>
                    <a className = "aFile" onClick = {() => this.saveAs("png")}>.png</a>
                    <a className = "aFile" onClick = {() => this.saveAs("jpg")}>.jpg</a>
                  </div>
                </div>
                <button className = "AlgoB"
                title = "Algorithm Settings"
                onClick = {() => this.openAlgorithmSettings()}
                disabled = {this.app.state.running === true}
                  style = {{height:Math.min(this.state.width/10,100),
                    width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
                    </button>
              </div>

              <br></br>
              <div className = "selectalgorow">
                <select className = "selectalgo"
                 onChange = {(event) => this.setLayoutType(event.target.value)}
                 style = {{width: (this.state.width*2)/10}}
                disabled = {this.app.state.running}>
                  <option value = "0"> Square </option>
                  <option value = "1"> Stretch to Fit </option>
                </select>
                <select value = {this.state.randomType}
                style = {{width: (this.state.width*6)/10}}
                disabled = {this.app.state.running === true }className = "selectalgo" onChange = {(event) => this.setRandomizedType(event.target.value)}>
                  <option value = "random" disabled = {this.state.group === "TSP"}> Random </option>
                  <option value = "randomcircle" disabled = {this.state.group === "TSP"}> Random Circle </option>
                  <option  value = "cycle"> Random Hamiltonian Cycle </option>
                  <option value = "randomclustering" disabled = {true}> Random Clustering </option>
                </select>
                <button className = "resetB"
                onClick = {() => this.resetNetwork()}
                title = "New random network"
                disabled = {this.app.state.running === true}
                  style = {{height:Math.min(this.state.width/10,100),
                    width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
                    </button>
                <button className = "generalB"
                title = "Network Settings"
                onClick = {() => this.openNetworkSettings()}
                disabled = {this.app.state.running === true}
                  style = {{height:Math.min(this.state.width/10,100),
                    width: Math.min(this.state.width/10,100), backgroundSize: 'cover'}}>
                    </button>
              </div>


            </div>
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
  waitAnimateNetwork(that, 0, animations.length,animations)
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

async function waitOpenNetworkSettings(that){
  await that.app.navbar.current.openSettings();
  that.app.navbar.current.settings.current.generalsettings.current.setOpen(true);
}

async function waitOpenAlgorithmSettings(that){
  await that.app.navbar.current.openSettings();
  that.app.navbar.current.settings.current.algorithmsettings.current.setOpen(true);
}
