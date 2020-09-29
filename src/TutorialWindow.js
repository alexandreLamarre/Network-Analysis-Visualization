import React from "react";
import Modal from "react-modal";
import getPageInfo from "./TutorialInfoHelpers";

import "./TutorialWindow.css"

import nodeExample from "./images/nodeExample.jpg";
import edgeExample from "./images/edgeExample.jpg";
import algorithmExample from "./images/algorithmExample.jpg";
import algorithmHelpExample from "./images/algorithmHelpExamplejpg.jpg";
import algorithmSelectExample from "./images/algorithmSelectExample.jpg";
import algorithmSettings from "./images/algorithmSettings.jpg";
import algorithmSettingsHelp from "./images/algorithmSettingsHelp.jpg";
import degreExample from "./images/degreeExample.jpg";
import layoutExample from "./images/layoutExample.jpg";
import networkExampleHelp from "./images/networkExampleHelp.jpg";
import networkLayoutHelp from "./images/networkLayoutHelp.jpg";
import networkSettings from "./images/networkSettings.jpg";
import networkSettingsHelp from "./images/networkSettingsHelp.jpg";
import randomGenerationExample from "./images/randomGenerationExample.jpg";
import resetNetworkExample from "./images/resetNetworkExample.jpg";

Modal.setAppElement("#root");

class TutorialWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title: "Tutorial: What are Networks?",
      info: "A network is typically thought of as a system of \
      interconnected things. <br/><br/> In Computer Science, we tend to analyze\
      large amounts of data and the relationships between said data. <br/><br/> \
      Indeed, networks provide an intuitive and efficient way to model large\
      amounts of related data. <br/><br/> We can represent data by Nodes: <br/> <br/> And \
      relationships between data as Edges: <br/>",
      open: this.props.open,
      pageNumber: 1,
      maxPageNumber: 9,
    }
  }


  setPageNumber(v){
    const value = parseInt(v);
    this.setState({pageNumber: value});
    // this.setInfo(value)
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
    if(v === 6) this.setState({title: "Tutorial: Select an Algorithm"});
    if(v === 7) this.setState({title: "Tutorial: Random Network Generation type"});
    if(v === 8) this.setState({title: "Tutorial: Select a Layout Type"});
    if(v === 9) this.setState({title: "Tutorial: Algorithm and Network settings"});
  }

  setInfo(v){
    var el = document.getElementById("TutorialInfo");
    const info = getPageInfo(v);
    el.innerHTML = info;
  }

  render(){
    // const = [modalIsOpen, setModalIsOpen] = useState()
    return <div></div>
  //   if(this.state.pageNumber == 1){
  //     return <div className = "tutorialwindow">
  //       <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)}
  //       className = "Modal"
  //       overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
  //         <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //         <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //         <p id = "TutorialInfo"> A network is typically thought of as a system of
  //         interconnected things. <br/><br/> In Computer Science, we tend to analyze
  //         large amounts of data and the relationships between said data. <br/><br/>
  //         Indeed, networks provide an intuitive and efficient way to model large
  //         amounts of related data. <br/><br/> We can represent data by Nodes: <br/> <img className = "tutorialimage" src={nodeExample}/> <br/> And
  //         relationships between data as Edges: <br/> <img className = "tutorialimage" src = {edgeExample}/> </p>
  //         <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //         onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //         Previous
  //         </button>
  //         <button className = "nextb"
  //         onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //         {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //          </button>
  //       </Modal>
  //     </div>
  //   }
  //     if(this.state.pageNumber == 2){
  //       return <div className = "tutorialwindow">
  //         <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)}
  //         overlayClassName = "Overlay" className = "Modal" shouldCloseOnOverlayClick = {true}>
  //           <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //           <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //           <p id = "TutorialInfo">Structures and properties of Networks can tell us almost
  //           everything we would want to know about the data we are analyzing. <br/><br/> \
  //           For example, optimizing a network can lead to a "divide and conquer" style approach
  //           to solving the problems the data represents. <br/> Representing a large amount of data as
  //           smaller amounts that can be computed individually is just one application
  //           of networks. <br/> <br/> In fact, networks have important applications in fields from
  //           Machine Learning to Cyber Security.  </p>
  //           <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //           onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //           Previous
  //           </button>
  //           <button className = "nextb"
  //           onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //           {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //            </button>
  //         </Modal>
  //       </div>
  //     }
  //       if(this.state.pageNumber == 3){
  //         return <div className = "tutorialwindow">
  //           <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)}
  //           overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true} className = "Modal">
  //             <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //             <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //             <p id = "TutorialInfo">There are a lot of different types of networks algorithms, all of
  //             them fulfilling an important role in network analysis. <br/><br/> However, Network Layout Algorithms
  //             stand at the core of important network algorithms as they are able to visualize <br/>  networks
  //             and optimize desireable properties of networks. <br/><br/> Network Layout Algorithms typically
  //             optimize the following: <br/> - Minimize edge crossings, that is, edges should intersect as little as possible <br/> - Uniform edge lengths\
  //              <br/> - Related nodes are drawn together <br/> - Loosely related nodes are
  //              drawn further apart </p>
  //             <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //             onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //             Previous
  //             </button>
  //             <button className = "nextb"
  //             onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //             {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //              </button>
  //           </Modal>
  //         </div>
  //       }
  //         if(this.state.pageNumber == 4){
  //           return <div className = "tutorialwindow">
  //             <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)} className = "Modal"
  //             overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
  //               <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //               <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //               <p id = "TutorialInfo">If computers were to optimize a network layout using specific criteria
  //               they would do so in exponential time, meaning that solving large problems would scale exponentially. <br/><br/>
  //               For example, optimizing a network of several million nodes would take with the most efficient\
  //               straighforward algorithms around 3500 hours, or just over 145 days. <br/><br/> In practice, it turns out
  //               network layout algorithms do a good job of optimizing desireable properties of a
  //               network. While the optimization is not perfect, <br/> it is pretty close to perfect and is many times faster. <br/>
  //               <br/> For comparison, optimizing a network of several million nodes using a network layout algorithm
  //               would take less than a day. <br/><br/> Network layout algorithms also allow us, as humans,
  //               to quickly identify properties of networks, potentially saving a huge amount of subsequent
  //               computation time. </p>
  //               <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //               onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //               Previous
  //               </button>
  //               <button className = "nextb"
  //               onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //               {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //                </button>
  //             </Modal>
  //           </div>
  //         }
  //           if(this.state.pageNumber == 5){
  //             return <div className = "tutorialwindow">
  //               <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)} className = "Modal"
  //               overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
  //                 <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //                 <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //                 <p id = "TutorialInfo"> Nodes are represented by circles: <br/><img className = "tutorialimage" src = {nodeExample}></img><br/>
  //                 Edges are represented by lines connecting nodes: <br/><img className = "tutorialimage" src = {edgeExample}></img><br/>
  //                 The size and color of nodes are proportional to their degree, in other words, the number of other
  //                 nodes they are connected to: <br/> <img className = "tutorialimage" src = {degreExample}/> </p>
  //                 <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //                 onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //                 Previous
  //                 </button>
  //                 <button className = "nextb"
  //                 onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //                 {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //                  </button>
  //               </Modal>
  //             </div>
  //           }
  //             if(this.state.pageNumber == 6){
  //               return <div className = "tutorialwindow">
  //                 <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)} className = "Modal"
  //                 overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
  //                   <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //                   <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //                   <p id = "TutorialInfo"> You can select which algorithm you would like to run by clicking here:
  //                   <br/><img className = "tutorialimage" src = {algorithmSelectExample}></img><br/> And selecting the algorithm you would like to run: <br/> <img className = "tutorialimage" src ={algorithmExample} ></img>
  //                   <br/> You can get a description of the algorithm by clicking the help button next to it: <br/><img className = "tutorialimage" src = {algorithmHelpExample}></img><br/> </p>
  //                   <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //                   onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //                   Previous
  //                   </button>
  //                   <button className = "nextb"
  //                   onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //                   {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //                    </button>
  //                 </Modal>
  //               </div>
  //             }
  //               if(this.state.pageNumber == 7){
  //                 return <div className = "tutorialwindow">
  //                   <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)} className = "Modal"
  //                   overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
  //                     <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //                     <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //                     <p id = "TutorialInfo"> You can choose the way you want your network to be randomly generated by selecting an option here:
  //                     <br/><img className = "tutorialimage" src = {randomGenerationExample}></img><br/> At any time you can create a new random network by clicking on "Reset Network":<br/><img className = "tutorialimage" src = {resetNetworkExample}></img><br/>
  //                     You can also find information about the type of random networking generation by clicking the help button next to it: <br/> </p>
  //                     <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //                     onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //                     Previous
  //                     </button>
  //                     <button className = "nextb"
  //                     onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //                     {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //                      </button>
  //                   </Modal>
  //                 </div>
  //               }
  //                 if(this.state.pageNumber == 8){
  //                   return <div className = "tutorialwindow">
  //                     <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)} className = "Modal"
  //                     overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
  //                       <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //                       <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //                       <p id = "TutorialInfo"> You can select what type of frame the network is drawn in by selecting a drop down option from here: <br/><img className = "tutorialimage" src = {layoutExample}></img><br/>
  //                       As always you can find information about the type of frame by clicking the help button next to it: <br/> <img className = "tutorialimage" src = {networkLayoutHelp}></img><br/>
  //                        </p>
  //                       <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //                       onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //                       Previous
  //                       </button>
  //                       <button className = "nextb"
  //                       onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //                       {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //                        </button>
  //                     </Modal>
  //                   </div>
  //                 }
  //                   if(this.state.pageNumber == 9){
  //                     return <div className = "tutorialwindow">
  //                       <Modal isOpen = {this.state.open} onRequestClose = {() => this.setOpen(false)} className = "Modal"
  //                       overlayClassName = "Overlay" shouldCloseOnOverlayClick = {true}>
  //                         <button className = "closeb" onClick = {() => this.setOpen(false)}> X </button>
  //                         <h2> {this.state.title} ({this.state.pageNumber}/{this.state.maxPageNumber})</h2>
  //                         <p id = "TutorialInfo"> There are a variety of settings for generating networks, which you can tweak to your liking: <br/><img className = "tutorialimage" src = {networkSettings}></img><br/>
  //                         If you're not sure what the settings do, click the help button next to them for a description: <br/><img className = "tutorialimage" src = {networkSettingsHelp}></img><br/>
  //                         There are also settings specific to the algorithm you can run, which you can also tweak to your liking:<br/><img className = "tutorialimage" src = {algorithmSettings}></img><br/> Settings will affect the outcome and procedure of\
  //                         the algorithm, so feel free to experiment with what works best. </p>
  //                         <button className = "previousb" disabled = {this.state.pageNumber === 1}
  //                         onClick = {()=> this.setPageNumber(this.state.pageNumber-1)}>
  //                         Previous
  //                         </button>
  //                         <button className = "nextb"
  //                         onClick = {() => this.setPageNumber(this.state.pageNumber+1)}>
  //                         {this.state.pageNumber === this.state.maxPageNumber? "Close": "Next"}
  //                          </button>
  //                       </Modal>
  //                     </div>}
  }
}

export default TutorialWindow;
