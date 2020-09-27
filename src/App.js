import React from 'react';
import './App.css';
import NetworkVisualizer from "./Network";
import NetworkNavBar from "./NetworkNavBar";


function App() {
  return (
    <div className="App">
      <div className = "AppElements">
        <NetworkNavBar/>
        <NetworkVisualizer/>
      </div>
    </div>
  );
}

export default App;
