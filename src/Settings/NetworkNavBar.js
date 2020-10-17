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
    const open = this.settings.current.state.open;
    this.settings.current.setOpen(!open);
  }

  render(){
    return <div className = "gonavbar">
              <NetworkSideDrawer height = {this.props.height}
              ref = {this.settings} app = {this.app}></NetworkSideDrawer>
              <header className = "toolbar" style = {{height: this.props.height*1/20}}>
                <nav className ="toolbar__navigation">
                  <div><DrawerToggleButton openSettings = {() => this.openSettings()}
                  height = {this.props.height}></DrawerToggleButton></div>
                  <div className = "toolbar__logo"
                  style = {{fontSize: this.props.height/40, marginTop: this.props.height/240}} >
                  <a > Network Analysis {this.app.state.dimension}{this.app.state.dimension === "Custom"?"":"D"}
                  </a></div>
                  <div className ="toolbar__search"
                  style = {{fontSize: this.props.height/40, marginTop: this.props.height/240}}>
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
