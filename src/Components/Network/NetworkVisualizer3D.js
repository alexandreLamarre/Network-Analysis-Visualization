import React from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import Network from "../../datatypes/Network";

import {IonButton, IonIcon} from "@ionic/react";
import {cameraReverse, save} from "ionicons/icons";

import "./networkVisualizer.css";


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
        this.frameID = 0
        this.heightConstant= 8.5/10
        this.widthConstant = 7/10
        this.minheight = 420
        this.network3D = React.createRef()
        this.networkData = this.props.networkData
        this.animator = this.props.animator

        this.renderer = null
        this.controls = null
        this.scene = null
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1)
        this.pointLight = new THREE.PointLight(0xffffff, 1);
        this.pointLight.position.set(1,1,2)
        this.camera.add(this.pointLight)

        this.spheres = []
        this.lines = []

        this.resize = this.resize.bind(this);
    }


    async componentDidMount(){
        //set up default constants and what not
        const w = window.innerWidth * this.widthConstant
        const h = window.innerHeight * this.heightConstant
        this.network3D.current.width = w
        this.network3D.current.height = h

        await this.props.parent.resetAnimationLogic() //clear any animations loaded when changing network visualizations
        this.networkData.set3D(true)
        this.networkData.createRandomNetwork()
        const network = this.networkData


        //set 3D graphics variables
        this.renderer = new THREE.WebGLRenderer({canvas: this.network3D.current, alpha:true})
        this.renderer.setSize(w, h)
        this.camera.aspect = (w/h)
        this.controls = new OrbitControls(this.camera, this.network3D.current)
        this.controls.target.set( w/2, h/2, h/2);
        this.camera.position.set(w/2, h/2, 1.7*h)
        this.controls.update()

        //setup initial scene
        this.resetSceneFromData(w, h)


        this.renderer.render(this.scene, this.camera)


        //add listeners and set state
        window.addEventListener("resize", this.resize)
        this.frameID = window.requestAnimationFrame(() => this.animate())
        this.setState({width: w, height: h})
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize)
        window.cancelAnimationFrame(this.frameID)
        if(this.renderer !== null) this.renderer = null; //destroy the webgl context
        if(this.network3D.current != null) this.network3D.current = null //destroy webgl context
    }

    animate(){
        if(this.networkData !== null && this.network3D.current !== null){
            if(this.networkData.shouldReset()){
                this.networkData.createRandomNetwork()
                this.resetSceneFromData(this.state.width, this.state.height)
            } else if (this.networkData.shouldUpdate){
                this.updateScene()
                this.networkData.shouldUpdate = false
            } else if (this.networkData.shouldResizeVertex()){
                this.networkData.applyVertexSize()
                this.updateScene()
            } else if (this.networkData.shouldRecolor()){
                this.networkData.applyColorGradient()
                this.updateScene()
            }
            this.renderer.render(this.scene, this.camera)
            this.frameID = window.requestAnimationFrame(() => this.animate())
        }
    }

    resetSceneFromData(w, h){
        this.scene = new THREE.Scene()
        this.scene.add(this.camera)
        const spheres = []
        for(let i = 0; i < this.networkData.vertices.length; i++){
            const v = this.networkData.vertices[i]
            var geometrySphere = new THREE.SphereGeometry(v.size, 4, 4)
            var materialSphere = new THREE.MeshLambertMaterial({color: new THREE.Color(v.color)})
            var sphere = new THREE.Mesh(geometrySphere, materialSphere);

            sphere.position.set(v.x* w, v.y*h, v.z*h)
            sphere.scale.set(1+v.size/5, 1+v.size/5, 1+v.size/5)
            spheres.push(sphere)
            this.scene.add(sphere)
        }

        const lines = []
        for(let j = 0; j < this.networkData.edges.length; j++){
            const e = this.networkData.edges[j]
            const v = this.networkData.vertices
            var linePoints = []

            linePoints.push(spheres[e.start].position)
            linePoints.push(spheres[e.end].position)
            var geometry = new THREE.BufferGeometry().setFromPoints(linePoints)

            const colors = []
            const edgecolors = this.getEdgeColors(e)
            for(let i = 0; i < edgecolors.length; i++){
                edgecolors[i] = new THREE.Color(edgecolors[i])
                colors.push(edgecolors[i].r, edgecolors[i].g, edgecolors[i].b);
            }

            geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

            var material = new THREE.LineBasicMaterial({vertexColors: true});
            material.opacity = 0.1
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
            this.spheres[i].scale.set(1+v.size/5, 1+v.size/5, 1+v.size/5)
            this.spheres[i].material.color.set(v.color);
        }

        for(let j = 0; j < this.networkData.edges.length; j++){
            const e = this.networkData.edges[j]

            const colors = []
            const edgecolors = this.getEdgeColors(e)
            for(let i = 0; i < edgecolors.length; i++){
                edgecolors[i] = new THREE.Color(edgecolors[i])
                colors.push(edgecolors[i].r, edgecolors[i].g, edgecolors[i].b);
            }
            this.lines[j].geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))


            var linePoints = []
            linePoints.push(this.spheres[e.start].position)
            linePoints.push(this.spheres[e.end].position)


            this.lines[j].geometry.setFromPoints(linePoints)
            this.lines[j].geometry.attributes.position.needsUpdate = true;

            // this.lines[j].material.color.set(this.networkData.edges[j].color);
        }
    }

    getEdgeColors(edge){
        if(Array.isArray(edge.color)){
            return edge.color
        } else{
            return [edge.color, edge.color]
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
            this.controls.update()
            this.networkData.shouldUpdate = true
            this.setState({height: h, width: w})
        }

    }

    resetCamera(){
        const h = Math.max(window.innerHeight *this.heightConstant, this.minheight)
        const w = window.innerWidth  * this.widthConstant
        this.camera.position.set(w/2, h/2, 1.7*h)
        this.controls.target.set( w/2, h/2, h/2);
        this.controls.update()
    }

    saveAs(type){
        alert("Saving not yet supported for 3D networks")
    }

    render() {
        return (
            <div>
                <canvas ref = {this.network3D}
                        style = {{outline: "1px solid blue",
                        backgroundColor: "black"
                        }}/>
                <div className = "dropdown"
                    title = "Save as"
                    style = {{
                        cursor: "pointer",
                        width: 10,
                        height: 10,
                        position: "absolute",
                        top:this.state.height -36,
                        left: this.state.width-47}}>
                    <IonButton
                        class = "no-ripple"
                        fill = "clear">
                        <IonIcon
                            title = {false}
                            size = "large"
                            color = "primary"
                            icon={save}/>
                    </IonButton>
                    <div className = "dropdown-content" style = {{top: -85}}>
                        <a className = "aFile" onClick = {() => this.saveAs("csv")}>.csv</a>
                        <a className = "aFile" onClick = {() => this.saveAs("png")}>.png</a>
                        <a className = "aFile" onClick = {() => this.saveAs("jpg")}>.jpg</a>
                    </div>
                </div>
                <div
                    title = "Reset camera to default"
                    style = {{
                        cursor: "pointer",
                        width: 10,
                        height: 10,
                        position: "absolute",
                        top:this.state.height -36,
                        left: this.state.width-85,
                    }}>
                    <IonButton fill = "clear"
                               class = "no-ripple"
                               onClick = {() => this.resetCamera()}
                    >
                        <IonIcon
                            size = "large"
                            title = {false}
                            color = "primary"
                            icon = {cameraReverse}>
                        </IonIcon>
                    </IonButton>
                </div>
            </div>
        )
    }
}

export default NetworkVisualizer3D