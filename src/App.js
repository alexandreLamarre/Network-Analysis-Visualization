import React from 'react';
import './App.css';
import NetworkVisualizer from "./Network";
import NetworkNavBar from "./NetworkNavBar";
import NetworkVisualizer3D from "./Network3D";


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
    }
    this.network = React.createRef();
    this.network3d = React.createRef();
    this.navbar = React.createRef();
  }


  render() {
    let network;
    if(this.state.dimension === 2){
      network = <NetworkVisualizer ref = {this.network} app = {this}/>
    }
    else{
      network = <NetworkVisualizer3D ref = {this.network3d} app = {this}/>
    }

    return (
      <div className="App">
        <div className = "AppElements">
          <NetworkNavBar ref = {this.navbar} app = {this}/>
          {network}
        </div>
      </div>
    );
  }
}
export default App;
