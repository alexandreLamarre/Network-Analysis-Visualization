import React from "react";
import HelpWindow from "./HelpWindow";
import getHelpInfo from "./helpInfoFunctions";

import "./AlgorithmAttributes.css";

class AlgorithmAttributes extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      layout : "spring",
      parentHelp: null,
      delta: 0.1, //spring
      eps : 0.5, //spring
      crep: 1, //spring
      cspring: 2, //spring
      C: 2, // spring
      maxX: 0,
      maxY: 0,
      cTemp: 1, //fruchtermanReingold
      tempHeuristic: "Logarithmic", //fruchtermanReingold
      tempHeuristicValue: 1,
      cPercentage: "0", // spring
      collision: 2, //fruchterman
      distanceType: 1, // spring
      kr: 10, // forceAtlas2
      gravity: false, //forceAtlas2
      gravityType : "Normal",//forceAtlas2
      kg: 10, //forceAtlas2
      tau: 0.1,//forceAtlas2
      ksmax: 10, //forceAtlas2
      overlappingNodes: true, //forceAtlas2
      filtering: false,
      filter: "",
    }
    this.help = React.createRef();
    this.settings = this.props.settings;
  }


  setCREP(v){
    const value = parseFloat(v);
    this.setState({crep:value});
    waitSetSettings(this.settings, this)
  }

  setCSPRING(v){
    const value = parseFloat(v);
    this.setState({cspring:value});
    waitSetSettings(this.settings, this)
  }

  setDelta(v){
    const value = parseFloat(v);
    this.setState({delta:value});
    waitSetSettings(this.settings, this)
  }

  setEpsilon(v){
    const value = parseFloat(v);
    this.setState({eps:value});
    waitSetSettings(this.settings, this)
  }

  setC(v){
    const value = parseFloat(v)
    this.setState({cPercentage: value});
    waitSetSettings(this.settings, this)
  }

  setCTEMP(v){
    const value = parseFloat(v);
    this.setState({cTemp:value});
    waitSetSettings(this.settings, this)
  }

  setKr(v){
    const value = parseFloat(v);
    this.setState({kr: value})
    waitSetSettings(this.settings, this)
  }

  setGravity(v){
    const value = parseInt(v);
    if(value === 0) this.setState({gravity:false});
    if(value === 1) this.setState({gravity: true});
    waitSetSettings(this.settings, this)
  }

  setGravityType(v){
    const value = parseInt(v);
    if(value === 0) this.setState({gravityType: "Normal"});
    if(value === 1) this.setState({gravityType: "Strong"});
    waitSetSettings(this.settings, this)
  }

  setGravityStrength(v){
    const value = parseFloat(v);
    this.setState({kg: value});
    waitSetSettings(this.settings, this)
  }

  setTau(v){
    const value = parseFloat(v);
    this.setState({tau:value});
    waitSetSettings(this.settings, this)
  }

  setKsmax(v){
    const value = parseFloat(v);
    this.setState({ksmax:value})
    waitSetSettings(this.settings, this)
  }

  setOverlappingNodes(v){
    const value = parseInt(v);
    if(value === 0) this.setState({overlappingNodes:true});
    if(value === 1) this.setState({overlappingNodes: false})
    waitSetSettings(this.settings, this)
  }
  setTempHeuristic(v){
    const value = parseInt(v);
    this.setState({tempHeuristicValue: value});
    if(value===1) this.setState({tempHeuristic: "Logarithmic"});
    if(value===2) this.setState({tempHeuristic: "Linear"});
    if(value===3) this.setState({tempHeuristic: "Directional"});
    if(value===4) this.setState({tempHeuristic: "None"});
    waitSetSettings(this.settings, this);
  }

  setCollision(v){
    const value = parseInt(v);
    this.setState({collision: value});
    waitSetSettings(this.settings, this)
  }

  setDistanceType(v){
    const value = parseInt(v);
    this.setState({distanceType : value});
    waitSetSettings(this.settings, this)
  }

  setHelp(v){
    this.state.parentHelp.current.setOpen(false)
    const [title,info,details,open] = getHelpInfo(v);
    this.help.current.setTitle(title);
    this.help.current.setInfo(info);
    this.help.current.setDetails(details);
    this.help.current.setOpen(open);
  }

  filter(e){
    if(e === "") {
      this.setState({filtering: false});
      console.log("default");
    }
    else{
      this.setState({filtering: true, filter: e})
    }
  }
  render(){
      return <div className = "Attributes">
      <HelpWindow ref = {this.help}></HelpWindow>
      <div className = "searchbar">
        <label className = "attributesearch"> Search for Algorithm: </label>
        <input onChange = {(e) => this.filter(e.target.value)}/>
      </div>
      {(this.state.filtering === true && "spring embedding".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
      ?<div><p> Spring Embedding</p><div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.1"
                max = "2"
                step = "0.1"
                value = {this.state.cspring}
                onChange = {(event)=> this.setCSPRING(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Force of Attraction: {this.state.cspring}</label>
                </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.1"
                max = "2"
                step = "0.1"
                value ={this.state.crep}
                onChange = {(event)=> this.setCREP(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Force of Repulsion : {this.state.crep}</label>
              </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.001"
                max = "3"
                value = {this.state.eps}
                step = "0.001"
                onChange = {(event)=> this.setEpsilon(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Convergence Bound : {this.state.eps}</label>
                </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.1"
                max = "2"
                step = "0.1"
                value = {this.state.delta}
                onChange = {(event)=> this.setDelta(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Rate of Convergence: {this.state.delta}</label>
                </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0"
                max = "100"
                value = {this.state.cPercentage}
                step = "0.1"
                onChange = {(event)=> this.setC(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Force to Area scaling: {this.state.cPercentage}%</label>
                </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0"
                max = "1"
                value = {this.state.distanceType}
                step = "1"
                onChange = {(event)=> this.setDistanceType(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Distance: {this.state.distanceType === 1? "Continuous": "Graph Theoretic"}</label>
                </div>
                </div>
                : <></>}
              {(this.state.filtering === true && "fruchterman-reingold".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
              ?<div><p>Fruchterman-Reingold</p>
              <div className = "Attributes">
                <HelpWindow ref = {this.help}></HelpWindow>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0.1"
                  max = "3"
                  step = "0.1"
                  value = {this.state.cTemp}
                  onChange = {(event)=> this.setCTEMP(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Initial Temperature Scaling: {this.state.cTemp}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "1"
                  max = "3"
                  value = {this.state.tempHeuristicValue}
                  step = "1"
                  onChange = {(event)=> this.setTempHeuristic(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Temperature Cooling: {this.state.tempHeuristic}</label>
                  <input className = "slider"
                  type = "range"
                  min = "0.001"
                  max = "1"
                  value = {this.state.eps}
                  step = "0.001"
                  onChange = {(event)=> this.setEpsilon(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Convergence Bound : {this.state.eps}</label>
                </div>
              </div>
              </div>
              : <></>}
            {(this.state.filtering === true && "forceatlas2".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
            ?<div><p> ForceAtlas2 </p>
            <div className = "Attributes">
                <HelpWindow ref = {this.help}></HelpWindow>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0.1"
                  max = "100"
                  step = "0.1"
                  value = {this.state.kr}
                  onChange = {(event) => this.setKr(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Force of Repulsion: {this.state.kr}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "1"
                  step = "1"
                  value = {this.state.gravity === true? 1:0}
                  onChange = {(event) => this.setGravity(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Gravity: {this.state.gravity === true? "On": "Off"}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "1"
                  step = "1"
                  value = {this.state.gravityType === "Normal"? 0: 1}
                  onChange = {(event) => this.setGravityType(event.target.value)}
                  disabled = {this.state.running || !(this.state.gravity)}>
                  </input>
                  <label> Gravity Type: {this.state.gravityType}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "20"
                  step = "0.1"
                  value = {this.state.kg}
                  onChange = {(event) => this.setGravityStrength(event.target.value)}
                  disabled = {this.state.running || !(this.state.gravity)}>
                  </input>
                  <label> Gravity Strength: {this.state.kg}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0.1"
                  max = "2"
                  step = "0.1"
                  value = {this.state.tau}
                  onChange = {(event) => this.setTau(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Tolerance(speed): {this.state.tau}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "1"
                  max = "20"
                  step = "0.1"
                  value = {this.state.ksmax}
                  onChange = {(event) => this.setKsmax(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Temperature Cap: {this.state.ksmax}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "1"
                  step = "1"
                  value = {this.state.overlappingNodes === true? "0":"1"}
                  onChange = {(event) => this.setOverlappingNodes(event.target.value)}
                  disabled = {true}>
                  </input>
                  <label> Overlap Nodes: {this.state.overlappingNodes === true? "On": "Off"}</label>
                </div>
             </div>
             </div>
             : <> </>}
             {(this.state.filtering === true && "forceatlaslinlog".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
            ?<div><p>ForceAtlasLinLog</p>
            <div className = "Attributes">
                <HelpWindow ref = {this.help}></HelpWindow>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0.1"
                  max = "100"
                  step = "0.1"
                  value = {this.state.kr}
                  onChange = {(event) => this.setKr(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Force of Repulsion: {this.state.kr}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "1"
                  step = "1"
                  value = {this.state.gravity === true? 1:0}
                  onChange = {(event) => this.setGravity(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Gravity: {this.state.gravity === true? "On": "Off"}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "1"
                  step = "1"
                  value = {this.state.gravityType === "Normal"? 0: 1}
                  onChange = {(event) => this.setGravityType(event.target.value)}
                  disabled = {this.state.running || !(this.state.gravity)}>
                  </input>
                  <label> Gravity Type: {this.state.gravityType}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "20"
                  step = "0.1"
                  value = {this.state.kg}
                  onChange = {(event) => this.setGravityStrength(event.target.value)}
                  disabled = {this.state.running || !(this.state.gravity)}>
                  </input>
                  <label> Gravity Strength: {this.state.kg}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0.1"
                  max = "2"
                  step = "0.1"
                  value = {this.state.tau}
                  onChange = {(event) => this.setTau(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Tolerance(speed): {this.state.tau}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "1"
                  max = "20"
                  step = "0.1"
                  value = {this.state.ksmax}
                  onChange = {(event) => this.setKsmax(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Temperature Cap: {this.state.ksmax}</label>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "1"
                  step = "1"
                  value = {this.state.overlappingNodes === true? "0":"1"}
                  onChange = {(event) => this.setOverlappingNodes(event.target.value)}
                  disabled = {true}>
                  </input>
                  <label> Overlap Nodes: {this.state.overlappingNodes === true? "On": "Off"}</label>
                </div>
                </div>

             </div>
             : <></>}
            </div>
  }
}

export default AlgorithmAttributes;


async function waitSetSettings(settings, that){
  await settings.setState({
    spring: {ka: that.state.cspring, kr: that.state.crep, eps: that.state.eps,
            delta: that.state.delta, areascaling: that.state.cPercentage,
            distanceType: that.state.distanceType},
    fruchterman: {cTemp: that.state.cTemp,
            tempHeuristic: that.state.tempHeuristic, eps: that.state.epsilon},
    forceatlas2: {fr: that.state.kr, gravity: that.state.gravity,
                  gravityType: that.state.gravityType, kg: that.state.kg,
                  tau: that.state.tau, ksmax: that.state.mskax,
                  overlappingNodes: that.state.overlappingNodes},
    forceatlaslinlog: {fr: that.state.kr, gravity: that.state.gravity,
                  gravityType: that.state.gravityType, kg: that.state.kg,
                  tau: that.state.tau, ksmax: that.state.mskax,
                  overlappingNodes: that.state.overlappingNodes}
  });
}
