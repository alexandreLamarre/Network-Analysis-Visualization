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
      delta: this.props.app.state.settings.spring.delta, //spring
      eps : this.props.app.state.settings.spring.eps, //spring
      crep: this.props.app.state.settings.spring.kr, //spring
      cspring: this.props.app.state.settings.spring.ka, //spring
      C: 2, // spring
      maxX: 0,
      maxY: 0,
      cTemp: this.props.app.state.settings.fruchterman.cTemp, //fruchtermanReingold
      tempHeuristic: this.props.app.state.settings.fruchterman.tempHeuristic,//this.props.app.settings.fruchterman.tempHeuristic, //fruchtermanReingold
      cPercentage: this.props.app.state.settings.spring.areascaling, // spring
      collision: 2, //fruchterman
      distanceType: this.props.app.state.settings.spring.distanceType, // spring
      kr: this.props.app.state.settings.forceatlas2.fr, // forceAtlas2
      gravity: this.props.app.state.settings.forceatlas2.gravity, //forceAtlas2
      gravityType : "Normal",//forceAtlas2
      kg: this.props.app.state.settings.forceatlas2.kg, //forceAtlas2
      tau: this.props.app.state.settings.forceatlas2.tau,//forceAtlas2
      ksmax: this.props.app.state.settings.forceatlas2.ksmax, //forceAtlas2
      overlappingNodes: true, //forceAtlas2
      kruskalred: this.props.app.state.settings.kruskal.red,
      kruskalgreen: this.props.app.state.settings.kruskal.green,
      kruskalblue: this.props.app.state.settings.kruskal.blue,
      primred: this.props.app.state.settings.prim.red,
      primgreen: this.props.app.state.settings.prim.green,
      primblue: this.props.app.state.settings.prim.blue,
      opt2timeout: this.props.app.state.settings.opt2.timeout,
      opt2red: this.props.app.state.settings.opt2.red,
      opt2green: this.props.app.state.settings.opt2.green,
      opt2blue: this.props.app.state.settings.opt2.blue,
      opt3timeout: this.props.app.state.settings.opt3.timeout,
      opt3red: this.props.app.state.settings.opt3.red,
      opt3green: this.props.app.state.settings.opt3.green,
      opt3blue: this.props.app.state.settings.opt3.blue,
      greedyStartRed: this.props.app.state.settings.greedy.startRed,
      greedyStartGreen: this.props.app.state.settings.greedy.startGreen,
      greedyStartBlue: this.props.app.state.settings.greedy.startBlue,
      greedyEndRed: this.props.app.state.settings.greedy.endRed,
      greedyEndGreen: this.props.app.state.settings.greedy.endGreen,
      greedyEndBlue: this.props.app.state.settings.greedy.endBlue,
      filtering: this.props.filtering,
      filter: this.props.filter,
    }
    this.help = React.createRef();
    this.app= this.props.app;
    this.settings = this.props.settings;
  }


  setCREP(v){
    waitsetCREP(v, this);
  }

  setCSPRING(v){
    waitsetCSPRING(v, this);
  }

  setDelta(v){
    waitsetDelta(v, this);
  }

  setEpsilon(v){
    waitsetEpsilon(v, this);
  }

  setC(v){
    waitsetC(v, this);
  }

  setCTEMP(v){
    waitsetCTEMP(v, this);
  }

  setKr(v){
    waitsetKr(v,this);
  }

  setGravity(v){
    waitsetGravity(v, this);
  }

  setGravityType(v){
    waitsetGravityType(v, this);
  }

  setGravityStrength(v){
    waitsetGravityStrength(v, this);
  }

  setTau(v){
    waitsetTau(v, this);
  }

  setKsmax(v){
    waitsetKsmax(v, this);
  }

  setOverlappingNodes(v){
    waitsetOverlappingNodes(v, this);
  }
  setTempHeuristic(v){
    waitsetTempHeuristic(v, this);
  }

  setCollision(v){
    waitsetCollision(v, this);
  }

  setDistanceType(v){
    waitsetDistanceType(v, this);
  }

  setKruskalRed(v){
    waitSetKruskalRed(v, this);
  }

  setKruskalGreen(v){
    waitSetKruskalGreen(v, this);
  }

  setKruskalBlue(v){
    waitSetKruskalBlue(v, this);
  }

  setPrimRed(v){
    waitSetPrimRed(v, this);
  }

  setPrimGreen(v){
    waitSetPrimGreen(v, this);
  }

  setPrimBlue(v){
    waitSetPrimBlue(v, this);
  }

  setOpt2Timeout(v){
    waitSetOpt2Timeout(v, this);
  }

  setOpt2Red(v){
    waitSetOpt2Red(v, this);
  }

  setOpt2Green(v){
    waitSetOpt2Green(v, this);
  }

  setOpt2Blue(v){
    waitSetOpt2Blue(v, this);
  }

  setOpt3Timeout(v){
    waitSetOpt3Timeout(v, this);
  }

  setOpt3Red(v){
    waitSetOpt3Red(v, this);
  }

  setOpt3Green(v){
    waitSetOpt3Green(v, this);
  }

  setOpt3Blue(v){
    waitSetOpt3Blue(v, this);
  }

  setGreedyStartRed(v){
    waitSetGreedyStartRed(v, this);
  }

  setGreedyStartGreen(v){
    waitSetGreedyStartGreen(v, this);
  }

  setGreedyStartBlue(v){
    waitSetGreedyStartBlue(v, this);
  }

  setGreedyEndRed(v){
    waitSetGreedyEndRed(v, this);
  }

  setGreedyEndGreen(v){
    waitSetGreedyEndGreen(v, this);
  }

  setGreedyEndBlue(v){
    waitSetGreedyEndBlue(v, this);
  }



  filter(e){
    if(e === "") {
      this.setState({filtering: false, filter: e});
      this.app.setState({filtering: false, filter: e});
      console.log("default");
    }
    else{
      this.app.setState({filtering: true, filter: e});
      this.setState({filtering: true, filter: e});
    }
  }
  render(){
      return <div className = "Attributes">
      <HelpWindow ref = {this.help}></HelpWindow>
      <div className = "searchbar">
        <label className = "attributesearch"> Search for Algorithm: </label>
        <input value = {this.state.filter} onChange = {(e) => this.filter(e.target.value)}/>
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
                  value = {this.state.tempHeuristic === "Logarithmic"?1:this.state.tempHeuristic === "Linear"?2:3}
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
             {(this.state.filtering === true && "kruskal's algorithm".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
            ?<div> <p> Kruskal's Algorithm </p>
            <div className = "sliders">
              <input className = "slider"
              type = "range"
              min = "0"
              max = "255"
              value = {this.app.state.settings.kruskal.red}
              onChange = {(e) => this.setKruskalRed(e.target.value)}
              step = "1"
              disabled = {this.state.running}>
              </input>
              <label> Red: {this.app.state.settings.kruskal.red}</label>
            </div>
            <div className = "sliders">
              <input className = "slider"
              type = "range"
              min = "0"
              max = "255"
              value = {this.app.state.settings.kruskal.green}
              onChange = {(e) => this.setKruskalGreen(e.target.value)}
              step = "1"
              disabled = {this.state.running}>
              </input>
              <label> Green: {this.app.state.settings.kruskal.green} </label>
            </div>
            <div className = "sliders">
              <input className = "slider"
              type = "range"
              min = "0"
              max = "255"
              value = {this.app.state.settings.kruskal.blue}
              onChange = {(e) => this.setKruskalBlue(e.target.value)}
              step = "1"
              disabled = {this.state.running}>
              </input>
              <label> Blue: {this.app.state.settings.kruskal.blue} </label>
            </div>
            </div>
            : <></>}

            {(this.state.filtering === true && "prim's algorithm".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
           ?<div> <p> Prim's Algorithm </p>
           <div className = "sliders">
             <input className = "slider"
             type = "range"
             min = "0"
             max = "255"
             value = {this.app.state.settings.prim.red}
             onChange = {(e) => this.setPrimRed(e.target.value)}
             step = "1"
             disabled = {this.state.running}>
             </input>
             <label> Red: {this.app.state.settings.prim.red} </label>
           </div>
           <div className = "sliders">
             <input className = "slider"
             type = "range"
             min = "0"
             max = "255"
             onChange = {(e) => this.setPrimGreen(e.target.value)}
             value = {this.app.state.settings.prim.green}
             step = "1"
             disabled = {this.state.running}>
             </input>
             <label> Green: {this.app.state.settings.prim.green} </label>
           </div>
           <div className = "sliders">
             <input className = "slider"
             type = "range"
             min = "0"
             max = "255"
             onChange = {(e) => this.setPrimBlue(e.target.value)}
             value = {this.app.state.settings.prim.blue}
             step = "1"
             disabled = {this.state.running}>
             </input>
             <label> Blue: {this.app.state.settings.prim.blue} </label>
           </div>
           </div>
           : <></>}

           {(this.state.filtering === true && "2-opt".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
          ?<div>  <p> 2-Opt </p>
          <div className = "sliders">
            <input className = "slider"
            type = "range"
            min = "5"
            max = "60"
            value = {this.app.state.settings.opt2.timeout}
            onChange = {(e) => this.setOpt2Timeout(e.target.value) }
            step = "1"
            disabled = {this.state.running}>
            </input>
            <label> Timeout : {this.app.state.settings.opt2.timeout}</label>
          </div>
          <div className = "sliders">
            <input className = "slider"
            type = "range"
            min = "0"
            max = "255"
            value = {this.app.state.settings.opt2.red}
            onChange = {(e) => this.setOpt2Red(e.target.value) }
            step = "1"
            disabled = {this.state.running}>
            </input>
            <label> Red: {this.app.state.settings.opt2.red} </label>
          </div>
          <div className = "sliders">
            <input className = "slider"
            type = "range"
            min = "0"
            max = "255"
            value = {this.app.state.settings.opt2.green}
            onChange = {(e) => this.setOpt2Green(e.target.value) }
            step = "1"
            disabled = {this.state.running}>
            </input>
            <label> Green: {this.app.state.settings.opt2.green}</label>
          </div>
          <div className = "sliders">
            <input className = "slider"
            type = "range"
            min = "0"
            max = "255"
            value = {this.app.state.settings.opt2.blue}
            onChange = {(e) => this.setOpt2Blue(e.target.value) }
            step = "1"
            disabled = {this.state.running}>
            </input>
            <label> Blue: {this.app.state.settings.opt2.blue} </label>
          </div>
          </div>
          : <></>}

          {(this.state.filtering === true && "3-opt".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
         ?<div> <p> 3-Opt </p>
         <div className = "sliders">
           <input className = "slider"
           type = "range"
           min = "5"
           max = "60"
           value = {this.app.state.settings.opt3.timeout}
           onChange = {(e) => this.setOpt3Timeout(e.target.value)}
           step = "1"
           disabled = {this.state.running}>
           </input>
           <label> Timeout : {this.app.state.settings.opt3.timeout}</label>
         </div>
         <div className = "sliders">
           <input className = "slider"
           type = "range"
           min = "0"
           max = "255"
           value = {this.app.state.settings.opt3.red}
           onChange = {(e) => this.setOpt3Red(e.target.value)}
           step = "1"
           disabled = {this.state.running}>
           </input>
           <label> Red: {this.app.state.settings.opt3.red} </label>
         </div>
         <div className = "sliders">
           <input className = "slider"
           type = "range"
           min = "0"
           max = "255"
           value = {this.app.state.settings.opt3.green}
           onChange = {(e) => this.setOpt3Green(e.target.value)}
           step = "1"
           disabled = {this.state.running}>
           </input>
           <label> Green: {this.app.state.settings.opt3.green} </label>
         </div>
         <div className = "sliders">
           <input className = "slider"
           type = "range"
           min = "0"
           max = "255"
           value = {this.app.state.settings.opt3.blue}
           onChange = {(e) => this.setOpt3Blue(e.target.value)}
           step = "1"
           disabled = {this.state.running}>
           </input>
           <label> Blue: {this.app.state.settings.opt3.blue} </label>
         </div>
         </div>
         : <></>}

         {(this.state.filtering === true && "2-opt simulated annealing".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
        ?<div> <p> 2-Opt Simulated Annealing </p>
        <div className = "sliders">
          <input className = "slider"
          type = "range"
          min = "5"
          max = "60"
          step = "1"
          disabled = {this.state.running}>
          </input>
          <label> Timeout :  </label>
        </div>
        <div className = "sliders">
          <input className = "slider"
          type = "range"
          min = "5"
          max = "60"
          step = "1"
          disabled = {this.state.running}>
          </input>
          <label> Initial Temperature: </label>
        </div>
        <div className = "sliders">
          <input className = "slider"
          type = "range"
          min = "5"
          max = "60"
          step = "1"
          disabled = {this.state.running}>
          </input>
          <label> Acceptance: </label>
        </div>
        <div className = "sliders">
          <input className = "slider"
          type = "range"
          min = "0"
          max = "255"
          step = "1"
          disabled = {this.state.running}>
          </input>
          <label> Red: </label>
        </div>
        <div className = "sliders">
          <input className = "slider"
          type = "range"
          min = "0"
          max = "255"
          step = "1"
          disabled = {this.state.running}>
          </input>
          <label> Green: </label>
        </div>
        <div className = "sliders">
          <input className = "slider"
          type = "range"
          min = "0"
          max = "255"
          step = "1"
          disabled = {this.state.running}>
          </input>
          <label> Blue: </label>
        </div>
        </div>
        : <></>}



        {(this.state.filtering === true && "greedy coloring".indexOf(this.state.filter.toLowerCase()) !== -1 ) || (this.state.filtering === false)
       ?<div> <p> Greedy Coloring </p>
       <div className = "sliders">
         <input className = "slider"
         type = "range"
         min = "0"
         max = "255"
         value = {this.app.state.settings.greedy.startRed}
         onChange = {(e) => this.setGreedyStartRed(e.target.value)}
         step = "1"
         disabled = {this.state.running}>
         </input>
         <label> Start Red: {this.app.state.settings.greedy.startRed}</label>
       </div>
       <div className = "sliders">
         <input className = "slider"
         type = "range"
         min = "0"
         max = "255"
         value = {this.app.state.settings.greedy.startGreen}
         onChange = {(e) => this.setGreedyStartGreen(e.target.value)}
         step = "1"
         disabled = {this.state.running}>
         </input>
         <label> Start Green: {this.app.state.settings.greedy.startGreen}</label>
       </div>
       <div className = "sliders">
         <input className = "slider"
         type = "range"
         min = "0"
         max = "255"
         value = {this.app.state.settings.greedy.startBlue}
         onChange = {(e) => this.setGreedyStartBlue(e.target.value)}
         step = "1"
         disabled = {this.state.running}>
         </input>
         <label> Start Blue: {this.app.state.settings.greedy.startBlue} </label>
       </div>
       <div className = "sliders">
         <input className = "slider"
         type = "range"
         min = "0"
         max = "255"
         value = {this.app.state.settings.greedy.endRed}
         onChange = {(e) => this.setGreedyEndRed(e.target.value)}
         step = "1"
         disabled = {this.state.running}>
         </input>
         <label> End Red: {this.app.state.settings.greedy.endRed} </label>
       </div>
       <div className = "sliders">
         <input className = "slider"
         type = "range"
         min = "0"
         max = "255"
         value = {this.app.state.settings.greedy.endGreen}
         onChange = {(e) => this.setGreedyEndGreen(e.target.value)}
         step = "1"
         disabled = {this.state.running}>
         </input>
         <label> End Green: {this.app.state.settings.greedy.endGreen}</label>
       </div>
       <div className = "sliders">
         <input className = "slider"
         type = "range"
         min = "0"
         max = "255"
         value = {this.app.state.settings.greedy.endBlue}
         onChange = {(e) => this.setGreedyEndBlue(e.target.value)}
         step = "1"
         disabled = {this.state.running}>
         </input>
         <label> End Blue: {this.app.state.settings.greedy.endBlue}</label>
       </div>
       </div>
       : <></>}
        </div>

  }
}

export default AlgorithmAttributes;


async function waitSetSettings(app, that){
  await app.setState({settings: {
    spring: {ka: that.state.cspring, kr: that.state.crep, eps: that.state.eps,
            delta: that.state.delta, areascaling: that.state.cPercentage,
            distanceType: that.state.distanceType},
    fruchterman: {cTemp: that.state.cTemp,
            tempHeuristic: that.state.tempHeuristic, eps: that.state.eps},
    forceatlas2: {fr: that.state.kr, gravity: that.state.gravity,
                  gravityType: that.state.gravityType, kg: that.state.kg,
                  tau: that.state.tau, ksmax: that.state.ksmax,
                  overlappingNodes: that.state.overlappingNodes},
    forceatlaslinlog: {fr: that.state.kr, gravity: that.state.gravity,
                  gravityType: that.state.gravityType, kg: that.state.kg,
                  tau: that.state.tau, ksmax: that.state.ksmax,
                  overlappingNodes: that.state.overlappingNodes},
    kruskal: {red: that.state.kruskalred,
              green: that.state.kruskalgreen,
              blue: that.state.kruskalblue},
    prim: {red: that.state.primred,
          green: that.state.primgreen,
          blue: that.state.primblue},
    opt2: {timeout: that.state.opt2timeout,
          red: that.state.opt2red,
          green: that.state.opt2green,
          blue: that.state.opt2blue},
    opt3: {timeout: that.state.opt3timeout,
          red: that.state.opt3red,
          green: that.state.opt3green,
          blue: that.state.opt3blue},
    greedy:{startRed: that.state.greedyStartRed,
            startGreen: that.state.greedyStartGreen,
            startBlue: that.state.greedyStartBlue,
            endRed: that.state.greedyEndRed,
            endGreen: that.state.greedyEndGreen,
            endBlue: that.state.greedyEndBlue}
    }});
  console.log(app.state.settings);
}

async function waitSetKruskalRed(v, that){
  const value = parseInt(v);
  await that.setState({kruskalred: value})
  waitSetSettings(that.app, that);
}

async function waitSetKruskalGreen(v, that){
  const value = parseInt(v);
  await that.setState({kruskalgreen: value})
  waitSetSettings(that.app, that);
}

async function waitSetKruskalBlue(v, that){
  const value = parseInt(v);
  await that.setState({kruskalblue: value})
  waitSetSettings(that.app, that);
}

async function waitSetPrimRed(v, that){
  const value = parseInt(v);
  await that.setState({primred: value})
  waitSetSettings(that.app, that);
}

async function waitSetPrimGreen(v, that){
  const value = parseInt(v);
  await that.setState({primgreen: value})
  waitSetSettings(that.app, that);
}

async function waitSetPrimBlue(v, that){
  const value = parseInt(v);
  await that.setState({primblue: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt2Timeout(v, that){
  const value = parseInt(v);
  await that.setState({opt2timeout: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt2Red(v, that){
  const value = parseInt(v);
  await that.setState({opt2red: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt2Green(v, that){
  const value = parseInt(v);
  await that.setState({opt2green: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt2Blue(v, that){
  const value = parseInt(v);
  await that.setState({opt2blue: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt3Timeout(v, that){
  const value = parseInt(v);
  await that.setState({opt3timeout: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt3Red(v, that){
  const value = parseInt(v);
  await that.setState({opt3red: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt3Green(v, that){
  const value = parseInt(v);
  await that.setState({opt3green: value})
  waitSetSettings(that.app, that);
}

async function waitSetOpt3Blue(v, that){
  const value = parseInt(v);
  await that.setState({opt3blue: value})
  waitSetSettings(that.app, that);
}

async function waitSetGreedyStartRed(v, that){
  const value = parseInt(v);
  await that.setState({greedyStartRed: value});
  waitSetSettings(that.app, that);
}

async function waitSetGreedyStartGreen(v, that){
  const value = parseInt(v);
  await that.setState({greedyStartGreen: value});
  waitSetSettings(that.app, that);
}

async function waitSetGreedyStartBlue(v, that){
  const value = parseInt(v);
  await that.setState({greedyStartBlue: value});
  waitSetSettings(that.app, that);
}
async function waitSetGreedyEndRed(v, that){
  const value = parseInt(v);
  await that.setState({greedyEndRed: value});
  waitSetSettings(that.app, that);
}

async function waitSetGreedyEndGreen(v, that){
  const value = parseInt(v);
  await that.setState({greedyEndGreen: value});
  waitSetSettings(that.app, that);
}

async function waitSetGreedyEndBlue(v, that){
  const value = parseInt(v);
  await that.setState({greedyEndBlue: value});
  waitSetSettings(that.app, that);
}

async function waitsetCREP(v, that){
  const value = parseFloat(v);
  await that.setState({crep:value});
  waitSetSettings(that.app, that)
}

async function waitsetCSPRING(v, that){
  const value = parseFloat(v);
  await that.setState({cspring:value});
  waitSetSettings(that.app, that)
}

async function waitsetDelta(v, that){
  const value = parseFloat(v);
  await that.setState({delta:value});
  waitSetSettings(that.app, that)
}

async function waitsetEpsilon(v, that){
  const value = parseFloat(v);
  await that.setState({eps:value});
  waitSetSettings(that.app, that)
}

async function waitsetC(v, that){
  const value = parseFloat(v)
  await that.setState({cPercentage: value});
  waitSetSettings(that.app, that)
}

async function waitsetCTEMP(v, that){
  const value = parseFloat(v);
  await that.setState({cTemp:value});
  waitSetSettings(that.app, that)
}

async function waitsetKr(v, that){
  const value = parseFloat(v);
  await that.setState({kr: value})
  waitSetSettings(that.app, that)
}

async function waitsetGravity(v, that){
  const value = parseInt(v);
  if(value === 0) await that.setState({gravity:false});
  if(value === 1) await that.setState({gravity: true});
  waitSetSettings(that.app, that)
}

async function waitsetGravityType(v, that){
  const value = parseInt(v);
  if(value === 0) await that.setState({gravityType: "Normal"});
  if(value === 1) await that.setState({gravityType: "Strong"});
  waitSetSettings(that.app, that)
}

async function waitsetGravityStrength(v, that){
  const value = parseFloat(v);
  await that.setState({kg: value});
  waitSetSettings(that.app, that)
}

async function waitsetTau(v, that){
  const value = parseFloat(v);
  await that.setState({tau:value});
  waitSetSettings(that.app, that)
}

async function waitsetKsmax(v, that){
  const value = parseFloat(v);
  await that.setState({ksmax:value})
  waitSetSettings(that.app, that)
}

async function waitsetOverlappingNodes(v, that){
  const value = parseInt(v);
  if(value === 0) await that.setState({overlappingNodes:true});
  if(value === 1) await that.setState({overlappingNodes: false})
  waitSetSettings(that.app, that)
}
async function waitsetTempHeuristic(v, that){
  const value = parseInt(v);
  if(value===1) await that.setState({tempHeuristic: "Logarithmic"});
  if(value===2) await that.setState({tempHeuristic: "Linear"});
  if(value===3) await that.setState({tempHeuristic: "Directional"});
  if(value===4) await that.setState({tempHeuristic: "None"});
  waitSetSettings(that.app, that);
}

async function waitsetCollision(v, that){
  const value = parseInt(v);
  await that.setState({collision: value});
  waitSetSettings(that.app, that)
}

async function waitsetDistanceType(v, that){
  const value = parseInt(v);
  await that.setState({distanceType : value});
  waitSetSettings(that.app, that)
}
