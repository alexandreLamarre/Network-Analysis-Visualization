import React from "react";
import Modal from "react-modal";
import getPageInfo from "./TutorialInfoHelpers";

import "./TutorialWindow.css"
Modal.setAppElement("#root");

class TutorialWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title: "Tutorial: What are Networks?",
      info: "A network is typically thought of as a system of \
      interconnected things. <br><br> In Computer Science, we tend to analyze\
      large amounts of data and the relationships between said data. <br><br> \
      Indeed, networks provide an intuitive and efficient way to model large\
      amounts of related data. <br><br> We can represent data by Nodes: <br> <br> And \
      relationships between data as Edges: <br>",
      open: true,
      pageNumber: 1,
      maxPageNumber: 9,
    }
  }


  setPageNumber(v){
    const value = parseInt(v);
    this.setState({pageNumber: value});
    this.setInfo(value)
    this.setTitle(value);
    if(value === this.state.maxPageNumber+1){
      this.setState({open:false, pageNumber:1})
    }
  }

  setOpen(v){
    this.setState({open:v});
  }

  setTitle(v){
    if(v === 1)this.setState({title: "Tutorial: What are Networks?"});
    if(v === 2) this.setState({title: "Tutorial: Why do we care about networks?"});
    if(v === 3) this.setState({title: "Tutorial: What Network Algorithms do we care about?"});
    if(v === 4) this.setState({title: "Tutorial: Why are Network Layouts so important?"});
    if(v === 5) this.setState({title : "Tutorial: Nodes and Edges"});
    if(v === 6) this.setState({title: "Tutorial: How to select an Algorithm"});
    if(v === 7) this.setState({title: "Tutorial: Random Network Generation type"});
    if(v === 8) this.setState({title: "Tutorial: How to select a Layout Type"});
    if(v === 9) this.setState({title: "Tutorial: Algorithm and Network settings"});
  }

  setInfo(v){
    var el = document.getElementById("TutorialInfo");
    const info = getPageInfo(v);
    el.innerHTML = info;
  }

  render(){
    // const = [modalIsOpen, setModalIsOpen] = useState()
    return <div className = "tutorialwindow">
      <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)}
      overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
        <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
        <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
        <p id = "TutorialInfo"> A network is typically thought of as a system of
        interconnected things. <br/><br/> In Computer Science, we tend to analyze
        large amounts of data and the relationships between said data. <br/><br/>
        Indeed, networks provide an intuitive and efficient way to model large
        amounts of related data. <br/><br/> We can represent data by Nodes: <br/> <br/> And
        relationships between data as Edges: <br/> </p>
        <button className = "previousb" disabled = {this.state.pageNumber === 1}
        onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
        Previous
        </button>
        <button className = "nextb"
        onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
        {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
         </button>
      </Modal>
    </div>
  }
}

export default TutorialWindow;
