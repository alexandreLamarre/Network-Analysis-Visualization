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
      eps : 0.1, //spring
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
    if(this.state.layout === "fruchtermanReingold"){
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
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0"
                  max = "2"
                  value = {this.state.collision}
                  step = "1"
                  onChange = {(event) => this.setCollision(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Collision: {this.state.collision ===2? "Orthogonal":this.state.collision === 1? "Elastic": "Inelastic"}</label>
                  <button className = "helpb" onClick = {() => this.setHelp("collision")}> ?</button>
                </div>

             </div>
    }
  }
}

export default AlgorithmAttributes;
