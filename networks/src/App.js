import React from 'react';
import './App.css';
import NetworkVisualizer from "./Network";
function App() {
  return (
    <div className="App">
    <label className = "title"> Network Algorithm Visualizer </label>
      <div className = "AppElements">
        <NetworkVisualizer/>
      </div>
    </div>
  );
}

export default App;
