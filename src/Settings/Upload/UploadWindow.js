import React from "react";
import Modal from "react-modal";
import "./Upload.css";

Modal.setAppElement("#root");

class UploadWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,
      filename: "",
    };
  }


  setOpen(v){
    this.setState({open:v});
  }

  checkFile(e){
    console.log(e);
    e.preventDefault();
  }

  setFilename(e){
    this.setState({filename: e.target.files[0].name});
  }

  render(){
    return <div>
              <Modal isOpen = {this.state.open}
                onRequestClose = {() => this.setOpen(false)}
                className = "upload"
                overlayClassName = "uploadoverlay"
                >
                  <p> Currently Supported Formats: .csv files</p>
                  <p> First Vertices are specified in rows, with their properties</p>
                  <p> Then following a line break, Edges are specified in rows, with
                      their corresponding properties</p>
                  <div className = "formBlock">
                    <form onSubmit = {(e) => this.checkFile(e)}>
                      <input
                       onChange = {(e) => this.setFilename(e)}
                       type = "file"
                       id = "myFile"
                       name = "filename"/>
                      <input type = "submit"/>
                    </form>
                  </div>
              </Modal>
          </div>
  }
}

export default UploadWindow;
