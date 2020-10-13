import React from "react";
import {DrawerToggleButton} from "./NetworkSideDrawer";
import NetworkSideDrawer from "./NetworkSideDrawer";


import "./NetworkNavBar.css";

class NetworkNavBar extends React.Component{
  constructor(props){
    super(props);
    this.settings = React.createRef();
    this.app = this.props.app;
  }

  openSettings(){
    console.log("clicked");
    const open = this.settings.current.state.open;
    this.settings.current.setOpen(!open);
  }

  render(){
    return <div className = "gonavbar">
              <NetworkSideDrawer ref = {this.settings} app = {this.app}></NetworkSideDrawer>
              <header className = "toolbar">
                <nav className ="toolbar__navigation">
                  <div><DrawerToggleButton openSettings = {() => this.openSettings()}></DrawerToggleButton></div>
                  <div className = "toolbar__logo"><a > Network Algorithm Visualizer {this.app.state.dimension ===3?3:2 }D </a></div>
                  <div className ="toolbar__search">
                      <form>
                      <label> Search :
                      </label>
                      <input minLength = "2" list = "search_values"/>
                      <datalist id = "search_values">
                        <option value = "Basic Spring Embedding"/>
                        <option value = "Fruchterman-Reingold"/>
                        <option value = "Force Atlas 2"/>
                        <option value = "Force Atlas 2 (LinLog)"/>
                        <option value = "Hall's Algorithm"/>
                        <option value = "Generalized Eigenvector Spectral Drawing"/>
                        <option value = "Kruskal's Algorithm"/>
                        <option value = "Prim's Algorithm"/>
                        <option value = "2-opt"/>
                        <option value = "3-opt"/>
                        <option value = "2-opt simulated annealing"/>
                      </datalist>
                      </form>
                  </div>
                </nav>
              </header>
            </div>
  }
}

export default NetworkNavBar;
