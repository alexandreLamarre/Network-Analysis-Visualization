import React from "react";
import Modal from "react-modal";

import "./GeneralNetworkSettings.css";

const MAX_EDGES = 600;

async function waitSetConnected(that,value){
  if(value === 0) await that.setState({connected:"False"});
  if(value === 1) await that.setState({connected:"True"});
  that.network.current.resetNetwork();
}

async function waitSetVertices(that, v){
  await that.setState({numV: v});
  that.network.current.resetNetwork();
}

async function waitSetEdges(that,e){
  await that.setState({numE: e});
  that.network.current.resetNetwork();
}

async function waitSetLayout(that,w,h){
  await that.setState({height: h,width: w});
  that.network.current.resetNetwork();
}




class GeneralNetworkSettings extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,
    }
    this.app = this.props.app;
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

  render(){
    return<div>
          <Modal isOpen = {this.state.open}
            onRequestClose = {() => this.setOpen(false)}
            className = "generalsettings"
            overlayClassName = "generalsettingsoverlay"
            >
            <p className = "sliderHeader" style = {{color: "black"}}>
              <b>General Network Settings</b>
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
              <button className = "helpb">
                ?
              </button>
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
              <button
                className = "helpb"
                onClick = {() => this.setHelp("vertices")}>
                ?
              </button>
              <input
                type = "range"
                min =  {this.app.state.connected === "True"? this.app.state.numV-1: Math.min(20, this.app.state.numV-1)}
                max = {Math.min(Math.floor((this.app.state.numV*this.app.state.numV - this.app.state.numV)/2), MAX_EDGES)}
                value = {this.app.state.numE}
                step = "1"
                className = "slider"
                name = "weight"
                disabled = {this.app.state.running}
                onChange = {(event) => this.setEdges(event.target.value)}>
              </input>
              <label>
                Edges: {this.app.state.numE}
              </label>
              <button className = "helpb"> ?</button>
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
              <button className = "helpb">
                ?
              </button>
              <input
                type = "range"
                min = "1"
                max = "3"
                step = "1"
                value = {this.app.state.disconnected}
                className = "slider"
                onChange = {(event) => this.setDisconnectedSubgraphs(event.target.value)}
                disabled = {true}>
              </input>
              <label>
                Disconnected Subgraphs: {this.app.state.disconnected}
              </label>
              <button className = "helpb">
                ?
              </button>
              </div>
      </Modal>
    </div>
  }
}

export default GeneralNetworkSettings;
