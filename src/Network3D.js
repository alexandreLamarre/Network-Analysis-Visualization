import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {createRandomNetwork3D} from "./networkgeneration/createRandomNetwork3D";
import {fruchtermanReingold3D} from "./NetworkAlgorithms/FruchtermanReingold3D";
import {springEmbedding3D} from "./NetworkAlgorithms/springEmbedding3D";
import {kruskal} from "./MSTAlgorithms/kruskal";

import "./Network3D.css";

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
    }
    this.app = this.props.app;
    this.canvas = React.createRef();
  }

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
      this.app.state.numE, this.app.state.connected, this.state.randomType);

    const spheres = [];
    //displaying initial_vertices
    for(let i = 0; i< vertices.length; i++){
      const color = vertices[i].color;

      //make a sphere
      var geometry = new THREE.SphereGeometry(5,8,8);
      var material = new THREE.MeshLambertMaterial({color: 0x00ffff});
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

  componentWillUnmount(){
      var id = this.state.maxtimeouts;
      while(id){
        clearInterval(id);
        id --;
      }
  }

  componentDidUpdate(){
    for(let i = 0; i< this.state.vertices.length; i++){
      const v = this.state.vertices[i];
      this.state.spheres[i].position.set(v.x, v.y, v.z);
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

  generateForceDirectedLayout(){
    const values = springEmbedding3D(this.state.vertices, this.state.edges,
        this.state.width, this.state.height, this.state.iterations, this.app.state.settings.spring);
    const final_vertices = values[0];
    const animations = values[1];
    // console.log(animations);
    this.animateNetwork(animations, final_vertices);
  }

  generateReingold(){
    const values = fruchtermanReingold3D(this.state.vertices, this.state.edges, this.state.width,
        this.state.height, this.state.iterations, this.app.state.settings.fruchterman);

    const final_vertices = values[0];
    const animations = values[1];
    this.animateNetwork(animations, final_vertices);
  }

  generateKamadaKawai(){

  }

  generateForceAtlas2(){

  }

  generateForceAtlasLinLog(){

  }

  generateHall(){

  }

  generateSpectralDrawing(){

  }

  generateRadialFlowDirected(){

  }

  generateKruskal(){
    const values = kruskal(this.state.vertices, this.state.edges, 3);
    const color_animations = values[0];
    const sorted_edges = values[1];
    // console.log(color_animations);
    // waitSetSortedEdges
    this.animateColoring(color_animations);
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

  }

  animateNetwork(animations, final_vertices){
    let x = 0;
    this.app.setState({running: true});
    for(let k = 0; k < animations.length; k++){
      x = setTimeout(() => {
        const vertices = this.state.vertices;
        for(let i = 0; i < vertices.length; i++){
          vertices[i].setVector(animations[k][i]);
        }
        this.setState({vertices: vertices});
        if(k === animations.length -1){
          this.setState({vertices: final_vertices});
          this.app.setState({running: false});
        }
      }, k*this.app.state.animationSpeed)
    }
    this.setState({maxtimeouts: x})
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
          vertices[animations[k].vIndex].size = animations[k].size;
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
            this.state.randomType);
    const spheres = [];
    //displaying initial_vertices
    for(let i = 0; i< vertices.length; i++){
      const color = vertices[i].color;

      //make a sphere
      var geometry = new THREE.SphereGeometry(5,8,8);
      var material = new THREE.MeshLambertMaterial({color: 0x00ffff});
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

  zoomCamera(v){
    const delta = Math.sign(v);
    this.state.camera.position.z += 10*delta;
    this.state.renderer.render(this.state.scene, this.state.camera);
  }

  resetCamera(){
    this.state.camera.position.z = this.state.depth * 1.7;
    this.state.camera.position.x = this.state.width/2;
    this.state.camera.position.y = this.state.height/2;
    this.state.renderer.render(this.state.scene, this.state.camera);
  }

  startDrag(e){
    this.state.previousMouseX = e.clientX;
    this.state.previousMouseY = e.clientY;
    this.state.dragging = true;
  }

  endDrag(){
    this.state.dragging = false;
  }

  rotateCamera(e){
    if(this.state.dragging){
      const deltaX = e.clientX - this.state.previousMouseX;
      const deltaY = e.clientY - this.state.previousMouseY;
      this.state.previousMouseX = e.clientX;
      this.state.previousMouseY = e.clientY;
      this.state.camera.position.y += deltaY
      this.state.camera.position.x += -deltaX
      this.state.renderer.render(this.state.scene, this.state.camera);
    }
  }

  setAlgoType(v){
    this.setState({algoType: v});
  }
  setRandomizedType(v){
    this.setState({randomType: v})
  }

  render(){
    return <div>
              <canvas
              className = "canvas3d"
              ref = {this.canvas}
              onWheel = {(e) => this.zoomCamera(e.deltaY)}
              onMouseDown = {(e) => this.startDrag(e)}
              onMouseUp = {() => this.endDrag()}
              onMouseMove = {(e) => this.rotateCamera(e)}>
              </canvas>
              <div className = "selectContainer">
                <div className = "selectalgorow">
                <select className = "selectalgo" onChange = {(event) => this.setAlgoType(event.target.value)}>
                  <optgroup label = "Force Directed Algorithms">
                  <option value = "spring"> Basic Spring Embedding </option>
                  <option value = "fruchtermanReingold"> Fruchterman-Reingold </option>
                  <option value = "kamadaKawai" disabled = {true}> Kamada-Kawai </option>
                  <option value = "forceAtlas2" disabled = {true}> Force Atlas 2 (unfinished preview)</option>
                  <option value = "forceAtlasLinLog" disabled = {true}> Force Atlas 2 (LinLog) (unfinished preview) </option>
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
                    <option disabled = {true}> Prim's Algorithm </option>
                  </optgroup>
                  <optgroup label = "TSP">
                    <option value = "2opt" disabled = {true} > 2-Opt </option>
                    <option value = "3opt" disabled = {true}> 3-Opt </option>
                    <option value = "2optannealing" disabled = {true}> 2-Opt Simulated Annealing </option>
                    <option value = "3optannealing" disabled = {true}> 3-Opt Simulated Annealing </option>
                  </optgroup>
                </select>
                <button className = "b"
                disabled = {this.app.state.running === true }
                onClick = {() => this.runAlgorithm()}> Run Algorithm
                </button>
                </div>
                <div className = "selectalgorow">
                <select className = "selectalgo" onChange = {(event) => this.setRandomizedType(event.target.value)}>
                  <option value = "random"> Random </option>
                  <option value = "randomcircle"> Random Sphere </option>
                  <option value = "randomsymmetry" disabled = {true}> Random Symmetry </option>
                  <option value = "randomclustering" disabled = {true}> Random Clustering </option>
                </select>
                <button className = "b"
                disabled = {this.app.state.running === true }
                onClick = {() => this.resetNetwork()}> Reset Network
                </button>
                </div>
                <div className = "selectalgorow">
                <button className = "b"
                onClick = {() => this.resetCamera()}
                > Reset Camera </button>
                </div>
              </div>
          </div>
  }

}

export default NetworkVisualizer3D;
