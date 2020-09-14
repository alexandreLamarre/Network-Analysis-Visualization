import React, {useState} from "react";
import Modal from "react-modal";

import "./HelpWindow.css";
Modal.setAppElement("#root");

class HelpWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title: "HELP",
      info: "help window",
      details: "details",
      open: false,
    }
  }

  setInfo(info){
    this.setState({info: info});
  }

  setTitle(title){
    this.setState({title:title});
  }

  setOpen(v){
    this.setState({open: v});
  }

  setDetails(v){
    this.setState({details: v});
  }

  render(){
    // const = [modalIsOpen, setModalIsOpen] = useState()
    return <div className = "helpwindow">
      <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)}
      overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
        <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
        <h2> {this.state.title}</h2>
        <h3> Overview </h3>
        <p> {this.state.info}</p>
        <h3> Details </h3>
        <p> {this.state.details}</p>
      </Modal>
    </div>
  }
}

export default HelpWindow;
