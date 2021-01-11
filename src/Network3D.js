import React from "react";
import Vertex from "./datatypes/Vertex";
import Edge from "./datatypes/Edge";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {createRandomNetwork3D} from "./networkgeneration/createRandomNetwork3D";
import {fruchtermanReingold3D} from "./NetworkAlgorithms/FruchtermanReingold3D";
import {springEmbedding3D} from "./NetworkAlgorithms/springEmbedding3D";
import {forceAtlasLinLog3D} from "./NetworkAlgorithms/forceAtlasLinLog-3D";
import {forceAtlas23D} from "./NetworkAlgorithms/forceAtlas2-3D";
import {kruskal} from "./MSTAlgorithms/kruskal";
import {prim} from "./MSTAlgorithms/prims";
import {opt2} from "./TSP/opt2";
import {opt2Annealing} from "./TSP/opt2Annealing";
import {opt3} from "./TSP/opt3";
import {GreedyColoring} from "./Coloring/GreedyColoring";
import {misraGries} from "./Coloring/misraGries";
import {spectralDrawing} from "./Spectral/spectralDrawing";

import "./Network3D.css";

var MAX_TIMEOUT = 30; //seconds

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

/** Netork Visualizer Component which controls
  - canvas rendering using THREE.js
  - network animation controls
  - calling the 3d network algorithms themselves
**/
class NetworkVisualizer3D extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height: 0,
      width: 0,
      depth: 0,
      scene : null,
      camera : null,
      renderer: null,
      vertices: [],
      edges: [],
      spheres : [],
      lines: [],
      algoType: "spring",
      randomType: "random",
      iterations: 100,
      maxtimeouts: 0,
      dragging: false,
      previousMouseX : 0,
      previousMouseY: 0,
      algoType: "spring",
      randomType: "random",
      TSP: false,
      cameraChanged: false,
      currentAnimations: [],
      currentAnimationIndex: 0,
      animationIndex: 0,
      paused: true,
      group: "layout",
    }
    this.app = this.props.app;
    this.canvas = React.createRef();
  }
  /** Sets initial inner width and inner height for the canvas
  and sets up the 3d scene on the canvas using THREE.js**/
  componentDidMount(){
    const w = window.innerHeight*0.55;
    const h = window.innerHeight*0.55;
    const d = window.innerHeight*0.55; //depth === 'z'- axis
    this.canvas.current.height = h;
    this.canvas.current.width = w;

    var renderer = new THREE.WebGLRenderer({canvas: this.canvas.current, alpha:true});
    renderer.setSize(w, h);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    var pointLight = new THREE.PointLight( 0xffffff , 1);
    pointLight.position.set(1,1,2);
    camera.add(pointLight)
    camera.position.z = 1.7*d;
    camera.position.x = w/2;
    camera.position.y = h/2;
    scene.add(camera);
    renderer.render(scene, camera);

    const [vertices,edges] = createRandomNetwork3D(w, h,d, this.app.state.numV,
      this.app.state.numE, this.app.state.connected, this.state.randomType,
      [this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue],
      [this.app.state.endRed, this.app.state.endGreen, this.app.state.endBlue],
      this.app.state.degreesize, this.app.state.minsize, this.app.state.maxsize);

    const spheres = [];
    //displaying initial_vertices
    for(let i = 0; i< vertices.length; i++){
      const color = vertices[i].color;
      //make a sphere
      var geometry = new THREE.SphereGeometry(vertices[i].size,8,8);
      var material = new THREE.MeshLambertMaterial(new THREE.Color(vertices[i].color));
      var sphere = new THREE.Mesh(geometry, material);
      const v = vertices[i]
      sphere.position.set(v.x, v.y, v.z);
      spheres.push(sphere);
      scene.add(sphere);
    }

    const lines = [];
    //displaying intial edges
    for(let j = 0; j < edges.length; j++){
        var material = new THREE.LineBasicMaterial({color : 0xa9a9a9});
        material.opacity = 0.1;
        var points = [];
        const e = edges[j];
        const v = vertices;
        points.push(spheres[e.start].position);
        points.push(spheres[e.end].position);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(geometry, material);
        scene.add(line);
        lines.push(line);
    }
    renderer.render(scene, camera);
    this.setState({
      width: w,
      height: h,
      depth: d,
      scene: scene,
      camera: camera,
      renderer: renderer,
      vertices: vertices,
      edges: edges,
      spheres: spheres,
      lines: lines,
    });
  }

  /** Clears the setTimeouts set by algorithm animations when this component
  is destroyed**/
  componentWillUnmount(){
      var id = this.state.maxtimeouts;
      while(id){
        clearInterval(id);
        id --;
      }
  }

  /** Updates the 3D scene on canvas based on the state's components**/
  componentDidUpdate(){
    for(let i = 0; i< this.state.vertices.length; i++){
      const v = this.state.vertices[i];
      this.state.spheres[i].position.set(v.x, v.y, v.z);
      // this.state.spheres[i].
      this.state.spheres[i].material.color = new THREE.Color(this.state.vertices[i].color)
    }
    for(let j = 0; j< this.state.edges.length; j++){
      const e = this.state.edges[j];
      const v = this.state.vertices;
      var pos = this.state.lines[j].geometry.attributes.position.array;
      pos[0] = v[e.start].x;
      pos[1] = v[e.start].y;
      pos[2] = v[e.start].z;
      pos[3] = v[e.end].x;
      pos[4] = v[e.end].y;
      pos[5] = v[e.end].z;
      this.state.lines[j].geometry.attributes.position.needsUpdate = true;
      this.state.lines[j].material.color = new THREE.Color(this.state.edges[j].color);
    }
    this.state.renderer.render(this.state.scene, this.state.camera);
  }

  /** Calls the force directed layout algorithm and animates it**/
  generateForceDirectedLayout(){
    const values = springEmbedding3D(this.state.vertices, this.state.edges,
        this.state.width, this.state.height, this.state.iterations, this.app.state.settings.spring);
    const final_vertices = values[0];
    const animations = values[1];
    // console.log(animations);
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  /** Calls the Fruchterman-Reingold layout algorithm and animates it**/
  generateReingold(){
    const values = fruchtermanReingold3D(this.state.vertices, this.state.edges, this.state.width,
        this.state.height, this.state.iterations, this.app.state.settings.fruchterman);

    const final_vertices = values[0];
    const animations = values[1];
    waitAnimateNetwork(this, 0, animations.length, animations);
  }
  /**[INCOMPLETE] Calls the Kamada-Kawai differential equations layout
  algorithm and animates it **/
  generateKamadaKawai(){}

  /** Calls the Force Atlas 2 layout algorithm and animates it**/
  generateForceAtlas2(){
    const [final_vertices, animations] = forceAtlas23D(this.state.vertices, this.state.edges,
                this.state.width, this.state.height, this.state.iterations, this.app.state.settings.forceatlas2)
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  /** Calls the Force Atlas2 algorithm with linear-logarithmic scaling changes**/
  generateForceAtlasLinLog(){
    const values = forceAtlasLinLog3D(this.state.vertices, this.state.edges,
                this.state.width, this.state.height, this.state.iterations, this.app.state.settings.forceatlaslinlog);
    const animations = values[1];
    // console.log(animations);
    const final_vertices = values[0];
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  /**[INCOMPLETE] Calls the Hall's quadratic form of graphs layout algorithm **/
  generateHall(){}

  /** Calls the generalized eigenvector layout algorithm and animates it**/
  generateSpectralDrawing(){
    const [eigenvectors, animations] = spectralDrawing(this.state.vertices,
      this.state.edges,this.state.width, this.state.height, this.app.state.dimension);
      waitAnimateNetwork(this, 0, animations.length, animations);
  }
  /**[INCOMPLETE] Calls a custom radial layout algorithm **/
  generateRadialFlowDirected(){}

  /** Calls Kruskals MST Algorithm and animates it**/
  generateKruskal(){
    const [animations, sorted_edges] = kruskal(this.state.vertices, this.state.edges, 3,
      [this.app.state.settings.kruskal.red, this.app.state.settings.kruskal.green,
        this.app.state.settings.kruskal.blue]);
    const that = this;
    waitSetEdges(that, sorted_edges, animations);
  }

  /** Calls Prim's MST Algorithm and animates it**/
  generatePrim(){
    const animations = prim(this.state.vertices, this.state.edges, 3,
      [this.app.state.settings.prim.red, this.app.state.settings.prim.green,
      this.app.state.settings.prim.blue]);
    waitAnimateNetwork(this,0,animations.length,animations);
  }

  /** Calls the 2-Opt Solution to the travelling salesperson problem and
  animates it**/
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

  /** Calls the 2-Opt Solution augmented with simulated annealing to the
  travelling salesperson problem and animates it**/
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

  /** Calls the 3-Opt Solution to the travelling salesperson problem and animates
  it **/
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

  /**Calls the Greedy Vertex Coloring Algorithm and animates it **/
  generateGreedyVertex(){
    const [vertices, animations] = GreedyColoring(this.state.vertices, this.state.edges, this.app.state.dimension, [255,255,0], [0,0,255])
    waitAnimateNetwork(this,0,animations.length,animations);
  }

  /** Calls the Misra-Gries Fan Rotation Algorithm and animates it **/
  generateMisraGries(){
    // console.log("generate misra gries");
    const animations = misraGries(this.state.vertices, this.state.edges, [255,0,0], [0,255,0]);
    waitAnimateNetwork(this, 0, animations.length, animations);
  }

  /** Checks which algorith to generate an animation for if no animation is running
  Otherwise, starts/pauses the animation based on the current index **/
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

  /** Animates Layout Type algorithms**/
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

  /** Animates Coloring Type algorithms**/
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

  /** Animates Travelling Salesperson algorithms **/
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

  /** Re-generates a new random network based on component state
  and recreates a THREE.js scene to render to**/
  resetNetwork(){
    var renderer = new THREE.WebGLRenderer({canvas: this.canvas.current, alpha:true});
    renderer.setSize(this.state.width, this.state.height);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, this.state.width/this.state.height, 0.1, 1000);
    var pointLight = new THREE.PointLight( 0xffffff , 1);
    pointLight.position.set(1,1,2);
    camera.add(pointLight)
    camera.position.z = 1.7*this.state.depth;
    camera.position.x = this.state.width/2;
    camera.position.y = this.state.height/2;
    scene.add(camera);
    renderer.render(scene, camera);

    const [vertices,edges] = createRandomNetwork3D(this.state.width,this.state.height,
      this.state.depth, this.app.state.numV, this.app.state.numE, this.app.state.connected,
            this.state.randomType,
            [this.app.state.startRed, this.app.state.startGreen, this.app.state.startBlue],
            [this.app.state.endRed, this.app.state.endGreen, this.app.state.endBlue],
            this.app.state.degreesize, this.app.state.minsize, this.app.state.maxsize);
    const spheres = [];
    //displaying initial_vertices
    for(let i = 0; i< vertices.length; i++){
      const color = vertices[i].color;

      //make a sphere
      var geometry = new THREE.SphereGeometry(vertices[i].size,8,8);
      var material = new THREE.MeshLambertMaterial(new THREE.Color(vertices[i].color));
      var sphere = new THREE.Mesh(geometry, material);
      const v = vertices[i]
      sphere.position.set(v.x, v.y, v.z);
      spheres.push(sphere);
      scene.add(sphere);
    }
    const lines = [];
    //displaying intial edges
    for(let j = 0; j < edges.length; j++){
        var material = new THREE.LineBasicMaterial({color : 0xa9a9a9});
        material.opacity = 0.1;
        var points = [];
        const e = edges[j];
        const v = vertices;
        points.push(spheres[e.start].position);
        points.push(spheres[e.end].position);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);


        var line = new THREE.Line(geometry, material);
        scene.add(line);
        lines.push(line);
    }
    renderer.render(scene,camera);
    this.setState({
      vertices: vertices,
      edges: edges,
      scene: scene,
      camera: camera,
      renderer: renderer,
      spheres: spheres,
      lines: lines,
    })

    this.app.setState({numV: vertices.length, numE: edges.length});
  }

  /** Increases the zoom on the camera looking at the THREE.js scene **/
  zoomCamera(e){
    const delta = Math.sign(e.deltaY);
    this.state.camera.position.z += 10*delta;
    this.state.renderer.render(this.state.scene, this.state.camera);
    if(this.state.cameraChanged === false) this.setState({cameraChanged: true})
  }

  /** Resets the camera to its original position in the THREE.js scene**/
  resetCamera(){
    this.state.camera.position.z = this.state.depth * 1.7;
    this.state.camera.position.x = this.state.width/2;
    this.state.camera.position.y = this.state.height/2;
    this.state.renderer.render(this.state.scene, this.state.camera);
    this.setState({cameraChanged:false})
  }

  /** handles the start of drag events**/
  startDrag(e){
    e.preventDefault();
    this.state.previousMouseX = e.clientX;
    this.state.previousMouseY = e.clientY;
    this.state.dragging = true;
  }

  /** handles the end of drag events**/
  endDrag(e){
    e.preventDefault();
    this.state.dragging = false;
  }

  /**[MISNOMER] move this camera back and forth based on difference of onMouse
  positions on drags **/
  rotateCamera(e){
    if(this.state.dragging){
      const deltaX = e.clientX - this.state.previousMouseX;
      const deltaY = e.clientY - this.state.previousMouseY;
      this.state.previousMouseX = e.clientX;
      this.state.previousMouseY = e.clientY;
      this.state.camera.position.y += deltaY
      this.state.camera.position.x += -deltaX
      this.state.renderer.render(this.state.scene, this.state.camera);
      if(this.state.cameraChanged === false) this.setState({cameraChanged:true})
    }
  }

  /** Sets the algorithm type to generate when run based on user input**/
  setAlgoType(v){
    // this.attribute.current.setLayout(v)
    this.setState({algoType: v});
    if(v === "2opt" || v === "3opt" ||
        v === "2optannealing" || v === "3optannealing"){
          this.setState({group:"TSP"});
          if(this.state.randomType !== "cycle") this.setRandomizedType("cycle");
        }
    else if(v === "spring" || v === "fruchterman" || v === "forceAtlas2"
                      || v === "forceatlaslinlog" || v === "spectralDrawing"
                    || v === "hall" || v === "schwarz"){
        this.setState({group:"layout"});
      }
    else if(v === "kruskal" || v === "prim" || v === "greedyvertex" ||
                                        v === "misra"){
        this.setState({group:"coloring"});
    }
  }

  /** Sets the random network generation type based on user input**/
  setRandomizedType(v){
    const that = this;
    waitSetRandomizedType(that, v);
  }

  /** Clears the queued setTimeouts of animations**/
  clearAnimations(){
    var id = this.state.maxtimeouts;
    while(id){
      clearInterval(id);
      id --;
    }
  }

  /** Cancels the currently loaded animation**/
  cancelAnimation(){
    this.setState({currentAnimations: [], paused: true});
    this.clearAnimations();
    this.app.setState({running: false});
  }

  /** pauses the animation**/
  pauseAnimation(){
    this.setState({paused:true});
    this.clearAnimations();
    // console.log(this.state.currentAnimationIndex);
  }

  /** Resets Vertex and Edge colors based on component default colors state**/
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
        const e = new Edge(this.state.edges[j].start, this.state.edges[j].end);
        e.setColor("rgb(211,211,211)");
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
        const e = new Edge(this.state.edges[j].start, this.state.edges[j].end);
        e.setColor("rgb(211,211,211)");
        new_edges.push(e);
      }
      this.setState({vertices: new_vertices, edges: new_edges});
      this.setState({vertices: new_vertices});
    }
  }

  /** updates Vertex Size based on which scale the user has selected**/
  updateVertexSize(){
    if(this.app.state.degreesize === false){
      const new_size = 5;
      const new_vertices = this.state.vertices.slice();
      for(let i = 0; i < new_vertices.length; i++){
        const old_size = new_vertices[i].size;
        this.state.spheres[i].scale.x = new_size/old_size;
        this.state.spheres[i].scale.y = new_size/old_size;
        this.state.spheres[i].scale.z = new_size/old_size;
      }
      const new_spheres = [];
      this.setState({vertices: new_vertices});
    }
    else{
      const max_degree = find_max_degree(this.state.vertices);
      const new_vertices = this.state.vertices.slice();
      for(let i = 0; i < new_vertices.length; i ++){
        new_vertices[i].size = Math.floor(assign_size(new_vertices[i].degree,
          max_degree, this.app.state.minsize, this.app.state.maxsize)+2);
        this.state.spheres[i].scale.x = new_vertices[i].size/5;
        this.state.spheres[i].scale.y = new_vertices[i].size/5;
        this.state.spheres[i].scale.z = new_vertices[i].size/5;
      }
      this.setState({vertices: new_vertices});
    }
  }

  /** Updates coloring when user changes the default coloring settings**/
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

  /** skips the loaded animation one frame forward, if possible**/
  skipFrame(){
    this.clearAnimations();
    const animations_index = Math.min(this.state.currentAnimationIndex + 1,
                                      this.state.currentAnimations.length-1);
    waitAnimateNetwork(this, animations_index, animations_index+1, null);
  }

  /**jumps the loaded animation one frame backward, if possible **/
  rewindFrame(){
    this.clearAnimations();
    const animations_index = Math.max(this.state.currentAnimationIndex -2, 0);
    waitAnimateNetwork(this, animations_index, animations_index+1, null);
  }

  /** jumps 1 second worth of frames (based on component state) forward
  on the loaded animation, as far as possible**/
  skipForward(){
    this.clearAnimations();
    const animations_index = Math.min(this.state.currentAnimations.length-1,
        this.state.currentAnimationIndex + Math.floor(1000/this.app.state.animationSpeed));
    const end_index = this.state.paused === true? animations_index+1:
                              this.state.currentAnimations.length;
    waitAnimateNetwork(this, animations_index, end_index, null);
  }

  /** jumps 1 second worth of frames (based on component state) backward
  on the loaded animation, as far as possible**/
  skipBackward(){
    this.clearAnimations();
    const animations_index = Math.max(0,
        this.state.currentAnimationIndex - Math.floor(1000/this.app.state.animationSpeed));
    const end_index = this.state.paused === true? animations_index+1:
                            this.state.currentAnimations.length-1;
    waitAnimateNetwork(this, animations_index, end_index, null);
  }

  /** skips to the beginning of the loaded animation, if possible**/
  skipToBeginning(){
    this.clearAnimations();
    const animations_index = 0
    this.setState({currentAnimationIndex:0})
    waitAnimateNetwork(this, 0, 1,null);
  }

  /** skips to the end of the loaded animation, if possible **/
  skipToEnd(){
    this.clearAnimations();
    const animations_index = this.state.currentAnimations.length-1;
    waitAnimateNetwork(this, animations_index, animations_index+1, null)
  }

  /** Opens the network settings component (modal)**/
  openNetworkSettings(){
    waitOpenNetworkSettings(this);
  }

  /**Opens the algorithm settings component (modal) **/
  openAlgorithmSettings(){
    waitOpenAlgorithmSettings(this);
  }

  /** saves the network into a CSV file**/
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
    link.download = 'Network3d.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /** [INCOMPATIBLE WITH THREE.js] saves the network canvas into a given
  extension file (jpeg, png),  **/
  saveAs(extension){
    const canvas = this.canvas.current;
    const image = canvas.toDataURL("network3d/"+extension);
    var link = document.createElement('a');
    link.href = image;
    link.download = 'Network.'+extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render(){
    return <div>
              <canvas style = {{marginTop: this.props.height*1/20+this.props.height/40}}
              className = "canvas3d"
              ref = {this.canvas}
              onMouseLeave = {(e) => this.endDrag(e)}
              onWheel = {(e) => this.zoomCamera(e)}
              onMouseDown = {(e) => this.startDrag(e)}
              onMouseUp = {(e) => this.endDrag(e)}
              onMouseMove = {(e) => this.rotateCamera(e)}>
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
                style = {{width: (this.state.height*8)/10}}>
                  <optgroup label = "Force Directed Algorithms">
                  <option value = "spring"> Basic Spring Embedding </option>
                  <option value = "fruchtermanReingold"> Fruchterman-Reingold </option>
                  <option value = "kamadaKawai" disabled = {true} hidden = {true}> Kamada-Kawai </option>
                  <option value = "forceAtlas2"> Force Atlas 2 </option>
                  <option value = "forceatlaslinlog"> Force Atlas 2 (LinLog) </option>
                  </optgroup>
                  <optgroup label = "Spectral Layout Algorithms">
                  <option value = "spectralDrawing"> Generalized Eigenvector (Koren)</option>
                  <option value = "hall" hidden = {true}> Hall's algorithm </option>
                  <option value = "schwarz" disabled = {true}> Schwarz Based Method</option>
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
                    <option value = "greedyvertex"> Greedy Coloring </option>
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
                    {/*
                    <a className = "aFile" onClick = {() => this.saveAs("png")} hidden ={true}>.png</a>
                    <a className = "aFile" onClick = {() => this.saveAs("jpg")} hidden = {true}>.jpg</a>
                    */}
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
                <div className = "selectalgorow" value = {this.state.randomType}>
                <select className = "selectalgo"
                style = {{width: (this.state.height*8)/10}}
                disabled = {this.app.state.running === true}
                onChange = {(event) => this.setRandomizedType(event.target.value)}
                value = {this.state.randomType}>
                  <option value = "random" disabled = {this.state.TSP === true}> Random </option>
                  <option value = "randomcircle" disabled = {this.state.TSP === true}> Random Sphere </option>
                  <option value = "cycle"> Random Hamiltonian Cycle </option>
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

export default NetworkVisualizer3D;

/** HELPER FUNCTIONS AND ASYNCHRONOUS COMPONENT HANDLING**/

/** Asynchronously-await set canvas layout size/type
before resetting network**/
async function waitSetRandomizedType(that,v){
  await that.setState({randomType: v});
  that.resetNetwork();
}

/** Asynchronously-await setting the edges to animate**/
async function animateEdges(that, edges){
  await that.setState({edges: edges});
}

/** find the max degree of a vertex given a set of vertices**/
function find_max_degree(vertices){
  var max_degree = -Infinity;
  for(let i = 0; i < vertices.length; i++){
    max_degree = Math.max(vertices[i].degree, max_degree);
  }
  return max_degree;
}

/** assign size to a vertex based on its degree and the minsize/maxsize
for vertices within the network**/
function assign_size(degree, max_degree, minsize, maxsize){
  //min degree is 1 or 0
  return minsize +(maxsize - minsize)*(degree/max_degree)
}

/** checks if two rgb tuple colors are the same**/
function sameColor(startColor, endColor){
  if(startColor[0] === endColor[0] && startColor[1] === endColor[1] && startColor[2] === endColor[2]) return true;
  return false;
}

/** returns rgb tuples into css-compatible strings**/
function rgb_to_str(color){
  return "rgb(" + parseInt(color[0]) + "," + parseInt(color[1]) + "," + parseInt(color[2]) +")";
}

/** Create a color gradient given a start and end color.
Splits distinct colors based on the max degree of the network**/
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

/** helper for hsl_to_rgb conversion, which checks the hue and assigns
permutations based on its degree**/
function check_degrees(hue, C, X){
  if((hue >= 0 && hue < 60) || hue == 360) return [C,X,0];
  if(hue >= 60 && hue < 120 ) return [X,C,0];
  if(hue >= 120 && hue < 180 ) return [0, C, X];
  if(hue >= 180 && hue < 240 ) return [0, X, C];
  if(hue >= 240 && hue < 300 ) return [X, 0, C];
  if(hue >= 300 && hue < 360 ) return [C, 0, X];
  return [0,0,0];
}

/** assign colors based on vertex degree and the corresponding network
color gradient**/
function assign_color(degree, max_degree, gradient){
  var selection = gradient[Math.floor((degree/max_degree) * (gradient.length-1))]
  return rgb_to_str(selection)
}

async function waitSetEdges(that, sorted_edges,animations){
  await that.setState({edges: sorted_edges});
  waitAnimateNetwork(that, 0, animations.length,animations)
}

/** Asynchrnously-await opening the network settings component (modal)**/
async function waitOpenNetworkSettings(that){
  await that.app.navbar.current.openSettings();
  that.app.navbar.current.settings.current.generalsettings.current.setOpen(true);
}

/** Asynchronously-await opening the algorithm settings component (modal)**/
async function waitOpenAlgorithmSettings(that){
  await that.app.navbar.current.openSettings();
  that.app.navbar.current.settings.current.algorithmsettings.current.setOpen(true);
}
