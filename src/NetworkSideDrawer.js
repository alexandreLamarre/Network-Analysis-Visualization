import React from "react";
import Modal from "react-modal";
import TutorialWindow from "./TutorialWindow";
import GeneralNetworkSettings from "./GeneralNetworkSettings";
import NetworkAlgorithmSettings from "./NetworkAlgorithmSettings";

import "./NetworkSideDrawer.css";

Modal.setAppElement("#root")

export const DrawerToggleButton = props => (
  <button onClick = {props.openSettings} className = "toggle_button">
    <div className = "toggle_button-line"></div>
    <div className = "toggle_button-line"></div>
    <div className = "toggle_button-line"></div>
  </button>
)


class NetworkSideDrawer extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      open:false,
      dimension: 2,
    }
    this.tutorial = React.createRef();
    this.generalsettings = React.createRef();
    this.algorithmsettings = React.createRef();
    this.app = this.props.app;

  }

  setOpen(v){
    this.setState({open:v});
  }

  componentDidUpdate(){
    Modal.setAppElement(document.getElementById('BC'));
  }

  switchDimension(){
    if(this.state.dimension == 2) {
      this.setState({dimension: 3});
      this.app.setState({dimension: 3, running: false});
    }
    if(this.state.dimension == 3) {
      this.setState({dimension: 2});
      this.app.setState({dimension: 2, running: false});
    }
  }

  render(){

    return <div>
            <TutorialWindow open = {false}/>
            <Modal isOpen = {this.state.open}
            onRequestClose = {() => this.setOpen(false)}
            className = "sidedrawer"
            overlayClassName = "sidedraweroverlay"
            >
              <TutorialWindow ref = {this.tutorial} open = {false}/>
              <GeneralNetworkSettings ref = {this.generalsettings} app = {this.app}/>
              <NetworkAlgorithmSettings ref = {this.algorithmsettings} app = {this.app}/>
              <div className = "settings">
                <br></br>
                <button onClick = {() => this.tutorial.current.setOpen(true)}> Tutorial </button>
                <br></br>
                <button onClick= {() => this.switchDimension()}> {this.state.dimension === 2? 3:2}D Networks </button>
                <br></br>
                <button onClick = {() => this.generalsettings.current.setOpen(true)}> General Settings </button>
                <br></br>
                <button onClick = {() => this.algorithmsettings.current.setOpen(true)}> Algorithm Settings </button>
                <br></br>
                <button> Upload Your Data</button>
                <br></br>
                <a href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#network-algorithm-visualization" target= "_blank" > Documentation & Code </a>
                <br></br>
                <a href ="https://github.com/alexandreLamarre/Network-Algorithm-Visualization/issues" target ="_blank"> Report a Bug </a>
                <br></br>
              </div>
            </Modal>
          </div>
  }
}

export default NetworkSideDrawer;
