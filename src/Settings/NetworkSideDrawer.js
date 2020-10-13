import React from "react";
import Modal from "react-modal";
import GeneralNetworkSettings from "./GeneralNetworkSettings";
import NetworkAlgorithmSettings from "./NetworkAlgorithmSettings";
import UploadWindow from "./Upload/UploadWindow";

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
    this.uploadwindow = React.createRef();
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
            <Modal isOpen = {this.state.open}
            onRequestClose = {() => this.setOpen(false)}
            className = "sidedrawer"
            overlayClassName = "sidedraweroverlay"
            >
              <GeneralNetworkSettings ref = {this.generalsettings} app = {this.app}/>
              <NetworkAlgorithmSettings ref = {this.algorithmsettings} app = {this.app}/>
              <UploadWindow ref = {this.uploadwindow}></UploadWindow>
              <div className = "settings">
                <br></br>
                <a target = "_blank" href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization"> Tutorial </a>
                <br></br>
                <button onClick= {() => this.switchDimension()}> {this.state.dimension === 2? 3:2}D Networks </button>
                <br></br>
                <button onClick = {() => this.generalsettings.current.setOpen(true)}> General Settings </button>
                <br></br>
                <button onClick = {() => this.algorithmsettings.current.setOpen(true)}> Algorithm Settings </button>
                <br></br>
                <button onClick = {() => this.uploadwindow.current.setOpen(true)}> Upload Your Data</button>
                <br></br>
                <button> Create Custom Network </button>
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
