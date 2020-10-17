import React from "react";
import Modal from "react-modal";

import "./ConfirmationWindow.css"
class ConfirmationWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,
      confirm: false,
    };
    this.parent = this.props.parent;
    this.msg = this.props.msg

  }

  async setConfirm(v){
    await this.setState({confirm: v});
    this.setState({open:false});
    if(v === true) this.props.trigger(this.parent);
  }
  setOpen(v){
    this.setState({open:v})
  }

  render(){

    return <div>
            <Modal isOpen = {this.state.open === true}
            onRequestClose = {() => this.setOpen(false)}
            overlayClassName = "confirmationWindowOverlay"
            className = "confirmationWindow">
              <p> {this.msg} </p>
              <p> Are you sure you wish to proceed? </p>
              <button className = "confirmNo"
              onClick = {() => this.setConfirm(false)}> No </button>
              <button className = "confirmYes"
               onClick = {() => this.setConfirm(true)}> Yes </button>
            </Modal>
           </div>
  }
}

export default ConfirmationWindow;
