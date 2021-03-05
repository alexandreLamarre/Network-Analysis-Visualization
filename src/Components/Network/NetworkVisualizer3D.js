import React from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import Network from "./Network";

class NetworkVisualizer3D extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            width: 0,
            height: 0,
            network: null,
            spheres: [],
            lines : [],
            scene : null,
            camera: null,
            renderer: null,
            controls: null,
        }
        this.heightConstant= 8.5/10
        this.widthConstant = 7/10
        this.minheight = 420
        this.network3D = React.createRef()
        this.networkData = new Network(this.props.settings, true)

        this.renderer = null
        this.controls = null
        this.scene = null
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
        this.pointLight = new THREE.PointLight(0xffffff, 1);
        this.pointLight.position.set(1,1,2)
        this.camera.add(this.pointLight)

        this.spheres = []
        this.lines = []

    }


    componentDidMount(){
        //set up default constants and what not
        const w = window.innerWidth * this.widthConstant
        const h = window.innerHeight * this.heightConstant
        this.network3D.current.width = w
        this.network3D.current.height = h
        const network = this.networkData


        //set 3D graphics variables
        this.renderer = new THREE.WebGLRenderer({canvas: this.network3D.current, alpha:true})
        this.renderer.setSize(w, h)
        this.camera.aspect = (w/h)
        this.camera.far = h*w*2
        this.controls = new OrbitControls(this.camera, this.network3D.current)
        this.controls.target.set( w/2, h/2, h/2);
        this.camera.position.set(w/2, h/2, 1.7*h)
        this.controls.update()

        //setup initial scene
        this.resetSceneFromData(w, h)


        this.renderer.render(this.scene, this.camera)


        //add listeners and set state
        window.addEventListener("resize", () => {this.resize()})
        window.requestAnimationFrame(() => this.animate())
        this.setState({width: w, height: h})
    }

    animate(){
        if(this.networkData !== null && this.network3D.current !== null){
            if(this.networkData.shouldReset()){
                this.networkData.createRandomNetwork()
                this.resetSceneFromData(this.state.width, this.state.height)
            } else{
                this.updateScene()
            }
            this.renderer.render(this.scene, this.camera)
            window.requestAnimationFrame(() => this.animate())
        }
    }

    resetSceneFromData(w, h){
        this.scene = new THREE.Scene()
        this.scene.add(this.camera)
        const spheres = []
        for(let i = 0; i < this.networkData.vertices.length; i++){
            const v = this.networkData.vertices[i]
            var geometrySphere = new THREE.SphereGeometry(v.size, 8, 8)
            var materialSphere = new THREE.MeshLambertMaterial("(0xffffff")
            var sphere = new THREE.Mesh(geometrySphere, materialSphere);
            sphere.position.set(v.x* w, v.y*h, v.z*h)
            spheres.push(sphere)
            this.scene.add(sphere)
        }

        const lines = []
        for(let j = 0; j < this.networkData.edges.length; j++){
            const e = this.networkData.edges[j]
            var linePoints = []
            var material = new THREE.LineBasicMaterial({color: 0xa9aa9});
            material.opacity = 0.1
            linePoints.push(spheres[e.start].position)
            linePoints.push(spheres[e.end].position)
            var geometry = new THREE.BufferGeometry().setFromPoints(linePoints)
            var line = new THREE.Line(geometry, material)
            this.scene.add(line)
            lines.push(line)
        }
        this.spheres = spheres
        this.lines = lines
    }

    updateScene(){
        const h = Math.max(window.innerHeight *this.heightConstant, this.minheight)
        const w = window.innerWidth  * this.widthConstant
        for(let i = 0; i < this.networkData.vertices.length; i++){
            const v = this.networkData.vertices[i]
            this.spheres[i].position.set(v.x*w, v.y*h, v.z*h);
            this.spheres[i].material.color.set(v.color);
        }

        for(let j = 0; j < this.networkData.edges.length; j++){
            // if(j == 0) console.log(this.networkData.edges[j].color)
            // this.lines[j].material.color = new THREE.Color(this.networkData.edges[j].color)
            const v= this.networkData.vertices
            const e = this.networkData.edges[j]
            const startX = v[e.start].x * w;
            const startY = v[e.start].y * h;
            const startZ = v[e.start].z * h;
            const endX = v[e.end].x*w;
            const endY = v[e.end].y*h;
            const endZ = v[e.end].z*h;

            const vertices = new Float32Array([
                startX, startY, startZ,
                endX, endY, endZ,
            ])

            this.lines[j].geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
            this.lines[j].geometry.attributes.position.needsUpdate = true;

            // this.lines[j].material.color.set(this.networkData.edges[j].color);
        }
    }

    resize(){
        const h = Math.max(window.innerHeight *this.heightConstant, this.minheight)
        const w = window.innerWidth  * this.widthConstant
        if (this.network3D.current != null){
            this.network3D.current.width = w
            this.network3D.current.height = h
            this.camera.aspect = w/h
            this.renderer.setSize(w, h)
            this.controls.target.set(w/2, h/2, h/2)
        }
        this.setState({height: h, width: w})
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network3D}
                        style = {{outline: "1px solid blue",
                        backgroundColor: "black"
                        }}/>
                        <button onClick = {() => console.log(this.props.settings)}> Log</button>
            </div>
        )
    }
}

export default NetworkVisualizer3D