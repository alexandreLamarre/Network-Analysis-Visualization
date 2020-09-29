import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {createRandomNetwork3D} from "./networkgeneration/createRandomNetwork3D";
import {fruchtermanReingold3D} from "./NetworkAlgorithms/FruchtermanReingold3D";

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
    var controls = new OrbitControls(camera, this.canvas.current);
    var pointLight = new THREE.PointLight( 0xffffff , 0.75);
    pointLight.position.set(1,1,2);
    camera.add(pointLight)
    camera.position.z = 1.7*d;
    camera.position.x = w/2;
    camera.position.y = h/2;
    console.log(controls);
    scene.add(camera);
    renderer.render(scene, camera);

    const [vertices,edges] = createRandomNetwork3D(w, h,d, this.app.state.numV, this.app.state.numE);

    const spheres = [];
    //displaying initial_vertices
    for(let i = 0; i< vertices.length; i++){
      const color = vertices[i].color;

      //make a sphere
      var geometry = new THREE.SphereGeometry(10,8,8);
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
        var material = new THREE.LineBasicMaterial({color : 0x00000});
        material.opacity = 0.3;
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
    console.log(lines);

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

  componentDidUpdate(){
    for(let i = 0; i< this.state.vertices.length; i++){
      const v = this.state.vertices[i];
      this.state.spheres[i].position.set(v.x, v.y, v.z);
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
    }

    this.state.renderer.render(this.state.scene, this.state.camera);
  }

  runAlgorithm(){
    const values = fruchtermanReingold3D(this.state.vertices, this.state.edges,
      this.state.width, this.state.height, this.state.iterations, "Logarithmic", 1, 0.1)
    const final_vertices = values[0];
    const animations = values[1];

  }

  animateNetwork(){
    
  }

  render(){
    return <div>
              <canvas className = "canvas3d" ref = {this.canvas}></canvas>
              <button onClick = {() => this.runAlgorithm()}> Run Algorithm</button>
          </div>
  }

}

export default NetworkVisualizer3D;