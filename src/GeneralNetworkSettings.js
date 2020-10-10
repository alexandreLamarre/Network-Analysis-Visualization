import React from "react";
import Modal from "react-modal";

import "./GeneralNetworkSettings.css";

const MAX_EDGES = 600;

async function waitSetConnected(that,value){
  if(value === 0) await that.setState({connected:"False"});
  if(value === 1) await that.setState({connected:"True"});
  if(that.state.dimension === 2) that.network.current.resetNetwork();
  if(that.state.dimension === 3) that.network3d.current.resetNetwork();
}

async function waitSetVertices(that, v){
  await that.setState({numV: v});
  if(that.state.dimension === 2) that.network.current.resetNetwork();
  if(that.state.dimension === 3) that.network3d.current.resetNetwork();
}

async function waitSetEdges(that,e){
  await that.setState({numE: e});
  if(that.state.dimension === 2) that.network.current.resetNetwork();
  if(that.state.dimension === 3) that.network3d.current.resetNetwork();
}

async function waitSetLayout(that,w,h){
  await that.setState({height: h,width: w});
  if(that.state.dimension === 2) that.network.current.resetNetwork();
  if(that.state.dimension === 3) that.network3d.current.resetNetwork();
}

async function waitSetDegreeSize(that, v){
  if(v === 0){
    await that.setState({degreesize: false});
    that.network.current.updateVertexSize();
  }
  if(v === 1){
    await that.setState({degreesize: true});
    that.network.current.updateVertexSize();
  }
}

async function waitSetRed(that, v){
  await that.setState({startRed: v});
  if(that.state.dimension === 2) that.network.current.updateColoring();
}

async function waitSetGreen(that, v){
  await that.setState({startGreen: v});
  if(that.state.dimension === 2) that.network.current.updateColoring();
}

async function waitSetBlue(that, v){
  await that.setState({startBlue: v});
  if(that.state.dimension === 2) that.network.current.updateColoring();
}

async function waitSetEndRed(that, v){
  await that.setState({endRed: v});
  if(that.state.dimension === 2) that.network.current.updateColoring();
}

async function waitSetEndGreen(that, v){
  await that.setState({endGreen: v});
  if(that.state.dimension === 2) that.network.current.updateColoring();
}

async function waitSetEndBlue(that, v){
  await that.setState({endBlue: v});
  if(that.state.dimension === 2) that.network.current.updateColoring();
}

async function waitSetMinVertexSize(that, v){
  const value = parseInt(v);
  await that.setState({minsize:value});
  if(that.state.dimension === 2) that.network.current.updateVertexSize();
}

async function waitSetMaxVertexSize(that, v){
  const value = parseInt(v);
  await that.setState({maxsize:value});
  if(that.state.dimension === 2) that.network.current.updateVertexSize();
}


class GeneralNetworkSettings extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,
      startColor: convertValuesToRgb(this.props.app.state.startRed, this.props.app.state.startGreen, this.props.app.state.startBlue),
      endColor: convertValuesToRgb(this.props.app.state.endRed, this.props.app.state.endGreen, this.props.app.state.endBlue),
      width: 100,
      height: 100,
    }
    this.app = this.props.app;
    this.network = this.app.network.current === null? this.app.network3d.current: this.app.network.current;
    this.canvasStartColor = React.createRef();
    this.canvasEndColor = React.createRef();
    // console.log(this.state.startColor);
    // console.log(this.state.endColor);
  }
  drawStart(){
      const ctx1 = this.canvasStartColor.current.getContext("2d");
      ctx1.clearRect(0,0,this.state.width, this.state.height);
      ctx1.beginPath();
      ctx1.fillRect(0,0, this.state.width, this.state.height);
      ctx1.fillStyle = this.state.startColor;
      ctx1.fill();
  }
  drawEnd(){
    const ctx2 = this.canvasEndColor.current.getContext("2d");
    ctx2.clearRect(0,0,this.state.width, this.state.height);
    ctx2.beginPath();
    ctx2.fillRect(0,0, this.state.width, this.state.height);
    ctx2.fillStyle = this.state.endColor;
    ctx2.fill();
  }
  setOpen(v){
    this.setState({open:v});
  }

  setAnimationSpeed(ms){
    const value = Math.abs(150-parseInt(ms));
    this.app.setState({animationSpeed: value});
  }

  setVertices(v){
    const value = parseInt(v);
    waitSetVertices(this.app, value)
  }

  setEdges(v){
    const value = parseInt(v);
    waitSetEdges(this.app, value)
  }

  setConnected(v){
    const value = parseInt(v);
    waitSetConnected(this.app, value);
  }

  setDisconnectedSubgraphs(){

  }

  setScaleDegreeSize(v){
    const value = parseInt(v);
    waitSetDegreeSize(this.app, value)
  }

  setRed(v){
    const value = parseInt(v);
    waitSetRed(this.app, value);
    this.setState({startColor: convertValuesToRgb(value, this.app.state.startGreen, this.app.state.startBlue)});
    this.drawStart();
  }

  setGreen(v){
    const value = parseInt(v);
    waitSetGreen(this.app, value);
    this.setState({startColor: convertValuesToRgb(this.app.state.startRed, value, this.app.state.startBlue)});
    this.drawStart()
  }

  setBlue(v){
    const value = parseInt(v);
    waitSetBlue(this.app, value);
    this.setState({startColor: convertValuesToRgb(this.app.state.startRed, this.app.state.startGreen, value)});
    this.drawStart()
  }

  setEndRed(v){
    const value = parseInt(v);
    waitSetEndRed(this.app, value)
    this.setState({endColor: convertValuesToRgb(value, this.app.state.endGreen, this.app.state.endBlue)});
    this.drawEnd();
  }

  setEndGreen(v){
    const value = parseInt(v);
    waitSetEndGreen(this.app, value);
    this.setState({endColor: convertValuesToRgb(this.app.state.endRed, value , this.app.state.endBlue)});
    this.drawEnd();
  }

  setEndBlue(v){
    const value = parseInt(v);
    waitSetEndBlue(this.app, value);
    this.setState({endColor: convertValuesToRgb(this.app.state.endRed, this.app.state.endGreen, value)});
    this.drawEnd();
  }

  setMinVertexSize(v){
    const that = this.app;
    waitSetMinVertexSize(that,v);
  }

  setMaxVertexSize(v){
    const that = this.app;
    waitSetMaxVertexSize(that, v);
  }

  render(){
    return<div>
          <Modal isOpen = {this.state.open}
            onRequestClose = {() => this.setOpen(false)}
            className = "generalsettings"
            overlayClassName = "generalsettingsoverlay"
            >
            <p className = "sliderHeader" style = {{color: "black"}}>
              <b style = {{color: "white"}} >General Network Settings</b>
            </p>
            <div className = "sliders">
              <input
                type = "range"
                min = "0"
                max = "130"
                value = {Math.abs(150-this.app.state.animationSpeed)}
                className = "slider"
                onChange = {(event)=> this.setAnimationSpeed(event.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                AnimationSpeed : {this.app.state.animationSpeed}ms
              </label>
              <input
                type = "range"
                min = "4"
                max = "200"
                value = {this.app.state.numV}
                step = "1"
                className = "slider"
                name = "weight"
                disabled = {this.app.state.running}
                onChange = {(event) => this.setVertices(event.target.value)}>
              </input>
              <label>
                Vertices: {this.app.state.numV}
              </label>
              <input
                type = "range"
                min =  {this.app.state.connected === "True"? this.app.state.numV-1: Math.min(20, this.app.state.numV-1)}
                max = {Math.min(Math.floor((this.app.state.numV*this.app.state.numV - this.app.state.numV)/2), MAX_EDGES)}
                value = {this.app.state.numE}
                step = "1"
                className = "slider"
                name = "weight"
                disabled = {this.app.state.running || this.network.state.randomType === "cycle"}
                onChange = {(event) => this.setEdges(event.target.value)}>
              </input>
              <label>
                Edges: {this.app.state.numE}
              </label>
              <input
                type = "range"
                min = "0"
                max = "1"
                value = {this.app.state.connected === "True"? "1":"0"}
                step = "1"
                className = "slider"
                onChange = {(event) => this.setConnected(event.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Force Connectedness: {this.app.state.connected}
              </label>
              </div>


              <p className = "sliderHeader" style = {{color: "black"}}>
                <b style = {{color: "white"}} > Size Settings</b>
              </p>


              <input
                type = "range"
                min = "0"
                max = "1"
                step = "1"
                value = {this.app.state.degreesize === true?1:0}
                className = "slider"
                onChange = {(e) => this.setScaleDegreeSize(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Scale Vertex Size to Degree : {this.app.state.degreesize === true?"On":"Off"}
              </label>

              <input
                type = "range"
                min = "1"
                max = {this.app.state.maxsize}
                step = "1"
                value = {this.app.state.minsize}
                className = "slider"
                onChange = {(e) => this.setMinVertexSize(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Minimum Vertex Size: {this.app.state.minsize}
              </label>

              <input
                type = "range"
                min = {this.app.state.minsize}
                max = "12"
                step = "1"
                value = {this.app.state.maxsize}
                className = "slider"
                onChange = {(e) => this.setMaxVertexSize(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Maximum Vertex Size: {this.app.state.maxsize}
              </label>

              <p className = "sliderHeader" style = {{color: "black"}}>
                <b style = {{color: "white"}} > Start Color (Lowest degree vertices)</b>
              </p>

              <canvas
              height = {this.state.height}
              width = {this.state.width}
              ref = {this.canvasStartColor}
              style = {{backgroundColor: this.state.startColor}}
              className = "colorCanvas"></canvas>

              <br></br>

              <input
                type = "range"
                min = "0"
                max = "255"
                step = "1"
                value = {this.app.state.startRed}
                className = "slider"
                onChange = {(e) => this.setRed(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Red : {this.app.state.startRed}
              </label>
              <input
                type = "range"
                min = "0"
                max = "255"
                step = "1"
                value = {this.app.state.startGreen}
                className = "slider"
                onChange = {(e) => this.setGreen(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Green : {this.app.state.startGreen}
              </label>
              <input
                type = "range"
                min = "0"
                max = "255"
                step = "1"
                value = {this.app.state.startBlue}
                className = "slider"
                onChange = {(e) => this.setBlue(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Blue: {this.app.state.startBlue}
              </label>
              <p className = "sliderHeader" style = {{color: "black"}}>
                <b style = {{color: "white"}} > End Color (Highest degree vertices)</b>
              </p>

              <canvas
              height = {this.state.height}
              width = {this.state.width}
              ref = {this.canvasEndColor}
              style = {{backgroundColor: this.state.endColor}}
              className = "colorCanvas"></canvas>

              <br></br>
              <input
                type = "range"
                min = "0"
                max = "255"
                step = "1"
                value = {this.app.state.endRed}
                className = "slider"
                onChange = {(e) => this.setEndRed(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Red : {this.app.state.endRed}
              </label>
              <input
                type = "range"
                min = "0"
                max = "255"
                step = "1"
                value = {this.app.state.endGreen}
                className = "slider"
                onChange = {(e) => this.setEndGreen(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Green : {this.app.state.endGreen}
              </label>
              <input
                type = "range"
                min = "0"
                max = "255"
                step = "1"
                value = {this.app.state.endBlue}
                className = "slider"
                onChange = {(e) => this.setEndBlue(e.target.value)}
                disabled = {this.app.state.running}>
              </input>
              <label>
                Blue: {this.app.state.endBlue}
              </label>

      </Modal>
    </div>
  }
}

export default GeneralNetworkSettings;

function convertValuesToRgb(red, green, blue){
  return "rgb("+red.toString()+","+green.toString()+","+blue.toString()+")"
}
