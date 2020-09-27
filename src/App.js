import React from 'react';
import './App.css';
import NetworkVisualizer from "./Network";
import NetworkNavBar from "./NetworkNavBar";

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
    }
    this.network = React.createRef();
  }


  render() {
    return (
      <div className="App">
        <div className = "AppElements">
          <NetworkNavBar app = {this}/>
          <NetworkVisualizer ref = {this.network} app = {this}/>
        </div>
      </div>
    );
  }
}
export default App;
