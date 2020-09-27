import React from "react";
import {DrawerToggleButton} from "./NetworkSideDrawer";
import NetworkSideDrawer from "./NetworkSideDrawer";
import TutorialWindow from "./TutorialWindow";

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
                  <div className = "toolbar__logo"><a > Network Algorithm Visualizer </a></div>
                </nav>
              </header>
            </div>
  }
}

export default NetworkNavBar;
