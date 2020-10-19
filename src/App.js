import React from 'react';
import './App.css';
import NetworkVisualizer from "./Network";
import NetworkNavBar from "./Settings/NetworkNavBar";
import NetworkVisualizer3D from "./Network3D";
import NetworkCustomVisualizer from "./NetworkCustom";

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      running:false,
      animationSpeed: 50,
      numV: 120,
      numE: 300,
      connected: "True",
      maxE: 600,
      minE: 20,
      height: 0,
      width: 0,
      settings: {
        spring: {ka: 2, kr: 1, eps: 0.5,
                delta: 0.1, areascaling: 0,
                distanceType: 1},
        fruchterman: {cTemp: 1,
                tempHeuristic: "Logarithmic", eps: 0.5},
        forceatlas2: {fr: 10, gravity: false,
                      gravityType: "Normal", kg: 10,
                      tau: 0.1, ksmax: 10,
                      overlappingNodes: true},
        forceatlaslinlog: {fr: 10, gravity: false,
                      gravityType: "Normal", kg: 10,
                      tau: 0.1, ksmax: 10,
                      overlappingNodes: true},
        kruskal: {red: 255,
                  green: 0,
                  blue: 0},
        prim: {red:255,
               green: 0,
               blue: 0},
        opt2:{
          timeout: 30,
          red:255,
          green: 0,
          blue: 0,
        },
        opt2annealing:{
          timeout: 30,
          temperature: 100,
          acceptance: 0.0001,
          startColor: [255,0,0],
          endColor: [0,0,255],
        },
        opt3:{
          timeout: 30,
          red:255,
          green: 0,
          blue: 0,
        },
        greedy:{
          startRed: 0,
          startGreen: 255,
          startBlue: 0,
          endRed: 255,
          endGreen: 0,
          endBlue: 0,
        }
      },


      dimension: 2,
      degreesize: false,
      minsize: 3,
      maxsize: 10,
      startRed: 0,
      startGreen: 255,
      startBlue: 255,
      endRed: 0,
      endGreen: 255,
      endBlue: 255,
      filter: "",
      filtering: false,
    }
    this.network = React.createRef();
    this.network3d = React.createRef();
    this.customnetwork = React.createRef();
    this.navbar = React.createRef();
    
  }

  componentDidMount(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.setState({height: h, width: w});
  }

  render() {
    let network;
    if(this.state.dimension === 2){
      network = <NetworkVisualizer height = {this.state.height}
      ref = {this.network} app = {this}/>
    }
    else if(this.state.dimension === 3){
      network = <NetworkVisualizer3D
      height = {this.state.height}
      ref = {this.network3d} app = {this}/>
    }
    else if(this.state.dimension === "Custom"){
      network = <NetworkCustomVisualizer height = {this.state.height}
      ref = {this.customnetwork} app = {this}></NetworkCustomVisualizer>
    }

    return (
      <div className="App">
        <div className = "AppElements">
          <NetworkNavBar height = {this.state.height}
          ref = {this.navbar} app = {this}/>
          {network}
        </div>
      </div>
    );
  }
}
export default App;
