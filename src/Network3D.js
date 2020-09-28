import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {createRandomNetwork3D} from "./networkgeneration/createRandomNetwork3D";

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
    var controls = new OrbitControls(camera, this.canvas.current);
    var pointLight = new THREE.PointLight( 0xffffff , 0.75);
    pointLight.position.set(1,1,2);
    camera.add(pointLight)
    camera.position.z = d;
    console.log(controls);
    scene.add(camera);
    renderer.render(scene, camera);

    const [vertices,edges] = createRandomNetwork3D(w, h,d, this.app.state.numV, this.app.state.numE);


    this.setState({
      width: w,
      height: h,
      depth: d,
      scene: scene,
      camera: camera,
      renderer: renderer,
      vertices: vertices,
      edges: edges,
    });
  }

  componentDidUpdate(){

    for(let i = 0; i< this.state.vertices.length; i++){
      const color = this.state.vertices[i].color;

      //make a sphere
      var geometry = new THREE.SphereGeometry(10,8,8);
      var material = new THREE.MeshLambertMaterial({color: 0x00ffff});
      var sphere = new THREE.Mesh(geometry, material);
      const v = this.state.vertices[i]
      sphere.position.set(v.x, v.y, v.z);
      this.state.scene.add(sphere);
    }

    for(let j = 0; j < this.state.edges.length; j++){
        var material = new THREE.LineBasicMaterial({color : 0x00000});
        material.opacity = 0.3;
        var points = [];
        const e = this.state.edges[j];
        const v = this.state.vertices;
        points.push(new THREE.Vector3(v[e.start].x, v[e.start].y, v[e.start].z));
        points.push(new THREE.Vector3(v[e.end].x, v[e.end].y, v[e.end].z));
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(geometry, material);
        this.state.scene.add(line);
    }


    this.state.renderer.render(this.state.scene, this.state.camera);
  }

  render(){
    return <div>
              <canvas className = "canvas3d" ref = {this.canvas}></canvas>
          </div>
  }

}

export default NetworkVisualizer3D;
