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
    this.setState({open: v})
  }

  render(){
    // const = [modalIsOpen, setModalIsOpen] = useState()
    return <div className = "helpwindow">
      <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)}
      overlayClassName = "Overlay">
        <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
        <h2> {this.state.title}</h2>
        <p> {this.state.info}</p>
      </Modal>
    </div>
  }
}

export default HelpWindow;
