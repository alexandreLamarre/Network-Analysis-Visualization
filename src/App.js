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
      connected: false,
      maxE: 600,
      minE: 20,
      settings: {},
      dimension: 2,
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
