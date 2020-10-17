import React from "react";
import Modal from "react-modal";
import GeneralNetworkSettings from "./GeneralNetworkSettings";
import NetworkAlgorithmSettings from "./NetworkAlgorithmSettings";
import UploadWindow from "./Upload/UploadWindow";
import ConfirmationWindow from "../ConfirmationWindow";

import "./NetworkSideDrawer.css";

Modal.setAppElement("#root")

export const DrawerToggleButton = props => (
  <button onClick = {props.openSettings} className = "toggle_button"
  style = {{height: props.height/20, width: props.height/20, backgroundSize: 'cover'}}>
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
    this.confirmDimensionWindow = React.createRef();
    this.confirmCustomWindow = React.createRef();
    this.app = this.props.app;

  }

  setOpen(v){
    this.setState({open:v});
  }

  componentDidUpdate(){
    Modal.setAppElement(document.getElementById('BC'));
  }



  render(){
    return <div>

            <Modal isOpen = {this.state.open}
            onRequestClose = {() => this.setOpen(false)}
            className = "sidedrawer"
            overlayClassName = "sidedraweroverlay"
            style = {{overlay:{top:this.props.height*1/20}}}
            >
              <ConfirmationWindow
              ref = {this.confirmDimensionWindow}
              parent = {this}
              trigger = {switchDimension}
              msg = {"Any unsaved changes will be lost."}/>
              <ConfirmationWindow
              ref = {this.confirmCustomWindow}
              parent = {this}
              trigger = {setCustomNetwork}
              msg = {"Any unsaved changes will be lost"}
              />
              <GeneralNetworkSettings ref = {this.generalsettings} app = {this.app}/>
              <NetworkAlgorithmSettings ref = {this.algorithmsettings} app = {this.app}/>
              <UploadWindow ref = {this.uploadwindow}></UploadWindow>
              <div className = "settings">
                <br></br>
                <a target = "_blank" href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization"> Tutorial </a>
                <br></br>
                <button onClick= {() => this.confirmDimensionWindow.current.setOpen(true)}>
                {this.app.state.dimension === 3 || this.app.state.dimension === "Custom"? 2:3}D Networks
                </button>
                <br></br>
                <button onClick = {() => this.generalsettings.current.setOpen(true)}> General Settings </button>
                <br></br>
                <button onClick = {() => this.algorithmsettings.current.setOpen(true)}> Algorithm Settings </button>
                <br></br>
                <button onClick = {() => this.uploadwindow.current.setOpen(true)}> Upload Your Data</button>
                <br></br>
                <button onClick = {() => this.confirmCustomWindow.current.setOpen(true)}> Create Custom Network </button>
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

async function switchDimension(that){
  console.log("current app  dimension", that.app.state.dimension)
  if(that.app.state.dimension === 2) {
    console.log("switching to 3")
    await that.app.setState({dimension: 3, running: false});
  }
  else if(that.app.state.dimension == 3 || that.app.state.dimension === "Custom") {
    console.log("switching to 2")
    await that.app.setState({dimension: 2, running: false});
  }
}

async function setCustomNetwork(that){
  await that.app.setState({dimension: "Custom", running:false});
}
