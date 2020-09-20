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
    }
    this.help = React.createRef()
  }

  componentDidMount(){
    this.setState({maxX:window.innerWidth});
    this.setState({maxY: window.innerHeight});
  }
  setLayout(v){
    this.setState({layout: v});
  }
  setCREP(v){
    this.setState({crep:v});
  }

  setCSPRING(v){
    this.setState({cspring:v});
  }

  setDelta(v){
    this.setState({delta:v});
  }

  setEpsilon(v){
    this.setState({eps:v});
  }

  setC(v){
    const value = parseInt(v)
    this.setState({cPercentage: value});
  }

  setCTEMP(v){
    this.setState({cTemp:v});
  }

  setKr(v){
    this.setState({kr: v})
  }

  setGravity(v){
    const value = parseInt(v);
    if(value === 0) this.setState({gravity:false});
    if(value === 1) this.setState({gravity: true});
  }

  setGravityType(v){
    const value = parseInt(v);
    if(value === 0) this.setState({gravityType: "Normal"});
    if(value === 1) this.setState({gravityType: "Strong"});
  }

  setGravityStrength(v){
    this.setState({kg: v});
  }

  setTau(v){
    this.setState({tau:v});
  }

  setKsmax(v){
    this.setState({ksmax:v})
  }

  setOverlappingNodes(v){
    const value = parseInt(v);
    if(value === 0) this.setState({overlappingNodes:true});
    if(value === 1) this.setState({overlappingNodes: false})
  }
  setTempHeuristic(v){
    const value = parseInt(v);
    this.setState({tempHeuristicValue: value});
    if(value===1) this.setState({tempHeuristic: "Logarithmic"});
    if(value===2) this.setState({tempHeuristic: "Linear"});
    if(value===3) this.setState({tempHeuristic: "Directional"});
    if(value===4) this.setState({tempHeuristic: "None"})
  }

  setCollision(v){
    const value = parseInt(v);
    this.setState({collision: value});
  }

  setDistanceType(v){
    const value = parseInt(v);
    this.setState({distanceType : value});
  }

  setHelp(v){
    this.state.parentHelp.current.setOpen(false)
    const [title,info,details,open] = getHelpInfo(v);
    this.help.current.setTitle(title);
    this.help.current.setInfo(info);
    this.help.current.setDetails(details);
    this.help.current.setOpen(open);
  }
  render(){
    if(this.state.layout === "spring"){
      return <div className = "Attributes">
      <HelpWindow ref = {this.help}></HelpWindow>
      <div className = "sliders">
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
                <button className = "helpb" onClick = {() => this.setHelp("cspring")}> ?</button>
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
                <button className = "helpb" onClick = {() => this.setHelp("crep")}> ?</button>
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
                <button className = "helpb" onClick = {() => this.setHelp("eps")}> ?</button>
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
                <button className = "helpb" onClick = {() => this.setHelp("delta")}> ?</button>
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
                <button className = "helpb" onClick = {() => this.setHelp("forceArea")}> ?</button>
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
                <button className = "helpb" onClick = {() => this.setHelp("distanceType")}> ?</button>
                </div>
              </div>
    }
    else if(this.state.layout === "fruchtermanReingold"){
      return <div className = "Attributes">
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
                  <button className = "helpb" onClick = {() => this.setHelp("cTemp")}> ?</button>
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
                  <button className = "helpb" onClick = {() => this.setHelp("tempHeuristic")}> ?</button>
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
                  <button className = "helpb" onClick = {() => this.setHelp("eps")}> ?</button>
                </div>

             </div>
    }
    else if(this.state.layout === "forceAtlas2"){
      return <div className = "Attributes">
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
                </div>
             </div>
    }
    else if(this.state.layout === "forceAtlasLinLog"){
      return <div className = "Attributes">
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
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
                  <button className = "helpb"> ?</button>
                </div>
             </div>
    }
    else{
      return <div>
        <HelpWindow ref ={this.help}></HelpWindow>
      </div>;
    }
  }
}

export default AlgorithmAttributes;
