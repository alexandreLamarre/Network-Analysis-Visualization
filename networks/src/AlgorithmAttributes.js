import React, {useState} from "react";

import "./AlgorithmAttributes.css";

class AlgorithmAttributes extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      layout : "spring",
      delta: 2,
      eps : 0.1,
      crep: 20,
      cspring: 20,
      C: 2,
      maxX: 0,
      maxY: 0,
      cTemp: 1,
      tempHeuristic: "Linear",
      tempHeuristicValue: 1,
      cPercentage: "0",
    }
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
    const percentage = Math.min(Math.trunc(((parseInt(v)-2)/(this.state.maxX/21)) *100), 100)
    this.setState({cPercentage: percentage});
    this.setState({C:v});
  }

  setCTEMP(v){
    this.setState({cTemp:v});
  }

  setTempHeuristic(v){
    const value = parseInt(v);
    this.setState({tempHeuristicValue: value});
    if(value===1) this.setState({tempHeuristic: "Linear"});
    if(value===2) this.setState({tempHeuristic: "Logarithmic"});
    if(value===3) this.setState({tempHeuristic: "Directional"});
    if(value===4) this.setState({tempHeuristic: "None"})
  }
  render(){
    if(this.state.layout === "spring"){
      return <div className = "Attributes">
      <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.1"
                max = "30"
                step = "0.1"
                value = {this.state.cspring}
                name = "speed" disabled = {this.state.running}
                onInput = {(event)=> this.setCSPRING(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Force of Attraction: {this.state.cspring}</label>
                <button className = "helpb"> ?</button>
                </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.1"
                max = "30"
                step = "0.1"
                value ={this.state.crep}
                name = "speed" disabled = {this.state.running}
                onInput = {(event)=> this.setCREP(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Force of Repulsion : {this.state.crep}</label>
                <button className = "helpb"> ?</button>
              </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.001"
                max = "3"
                value = {this.state.eps}
                step = "0.001"
                name = "speed" disabled = {this.state.running}
                onInput = {(event)=> this.setEpsilon(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Convergence Bound : {this.state.eps}</label>
                <button className = "helpb"> ?</button>
                </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "0.1"
                max = "5"
                step = "0.1"
                value = {this.state.delta}
                name = "speed" disabled = {this.state.running}
                onInput = {(event)=> this.setDelta(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Rate of Convergence: {this.state.delta}</label>
                <button className = "helpb"> ?</button>
                </div>
                <div className = "sliders">
                <input className = "slider"
                type = "range"
                min = "2"
                max = {this.state.maxX/20}
                value = {this.state.C}
                step = "0.1"
                defaultValue ="1.5"
                name = "speed" disabled = {this.state.running}
                onInput = {(event)=> this.setC(event.target.value)}
                disabled = {this.state.running}>
                </input>
                <label> Force to Area scaling: {this.state.cPercentage}%</label>
                <button className = "helpb"> ?</button>
                </div>
              </div>
    }
    if(this.state.layout === "fruchtermanReingold"){
      return <div className = "Attributes">
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "0.1"
                  max = "3"
                  step = "0.1"
                  value = {this.state.cTemp}
                  name = "speed" disabled = {this.state.running}
                  onInput = {(event)=> this.setCTEMP(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Initial Temperature Scaling: {this.state.cTemp}</label>
                  <button className = "helpb"> ?</button>
                </div>
                <div className = "sliders">
                  <input className = "slider"
                  type = "range"
                  min = "1"
                  max = "3"
                  value = {this.state.tempHeuristicValue}
                  step = "1"
                  name = "speed" disabled = {this.state.running}
                  onChange = {(event)=> this.setTempHeuristic(event.target.value)}
                  disabled = {this.state.running}>
                  </input>
                  <label> Temperature Cooling: {this.state.tempHeuristic}</label>
                  <button className = "helpb"> ?</button>
                </div>

             </div>
    }
  }
}

export default AlgorithmAttributes;
