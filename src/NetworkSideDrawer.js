import React from "react";
import Modal from "react-modal";
import TutorialWindow from "./TutorialWindow";
import GeneralNetworkSettings from "./GeneralNetworkSettings";

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
    }
    this.tutorial = React.createRef();
    this.generalsettings = React.createRef();
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
            <TutorialWindow open = {true}/>
            <Modal isOpen = {this.state.open}
            onRequestClose = {() => this.setOpen(false)}
            className = "sidedrawer"
            overlayClassName = "sidedraweroverlay"
            >
              <TutorialWindow ref = {this.tutorial} open = {false}/>
              <GeneralNetworkSettings ref = {this.generalsettings} app = {this.app}/>
              <div className = "settings">
                <br></br>
                <button onClick = {() => this.tutorial.current.setOpen(true)}> Tutorial </button>
                <br></br>
                <button onClick = {() => this.generalsettings.current.setOpen(true)}> General Settings </button>
                <br></br>
                <button> Algorithm Settings </button>
                <br></br>
                <button> Upload Your Data</button>
                <br></br>
                <a href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization" target= "_blank" > Documentation & Code </a>
                <br></br>
                <button> More Information </button>
                <br></br>
              </div>
            </Modal>
          </div>
  }
}

export default NetworkSideDrawer;
