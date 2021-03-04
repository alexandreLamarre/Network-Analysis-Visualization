//DEFAULT IMPORTS
import React from 'react';
import './App.css';

//CUSTOM COMPONENT IMPORTS
import {NetworkVisualizer, NetworkVisualizer3D, NetworkCustom} from "./Network/index.js"
import {Nav2D, Nav3D, NavCustom} from "./NavBar"
// import NetworkVisualizer from "./Network";
import NetworkNavBar from "./Settings/NetworkNavBar";
// import NetworkVisualizer3D from "./Network3D";
import NetworkCustomVisualizer from "./NetworkCustom";



//REACT ROUTER IMPORTS

import {BrowserRouter as Router, Route, Link} from "react-router-dom";

// IONIC IMPORTS
import {IonApp, IonGrid, IonRow, IonCol, IonLabel, IonContent, IonItem, IonIcon, IonInput} from "@ionic/react"

import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { logoElectron, searchCircleOutline} from 'ionicons/icons';
import {Redirect} from "react-router";

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      running:false,
      animationSpeed: 50,
      numV: 120,
      numE: 300,
      connected: "True",
      maxE: 600,
      minE: 20,
      height: 0,
      width: 0,
      settings: {
        spring: {ka: 2, kr: 1, eps: 0.5,
                delta: 0.1, areascaling: 0,
                distanceType: 1},
        fruchterman: {cTemp: 1,
                tempHeuristic: "Logarithmic", eps: 0.5},
        forceatlas2: {fr: 10, gravity: false,
                      gravityType: "Normal", kg: 10,
                      tau: 0.1, ksmax: 10,
                      overlappingNodes: true},
        forceatlaslinlog: {fr: 10, gravity: false,
                      gravityType: "Normal", kg: 10,
                      tau: 0.1, ksmax: 10,
                      overlappingNodes: true},
        kruskal: {red: 255,
                  green: 0,
                  blue: 0},
        prim: {red:255,
               green: 0,
               blue: 0},
        opt2:{
          timeout: 30,
          red:255,
          green: 0,
          blue: 0,
        },
        opt2annealing:{
          timeout: 30,
          temperature: 100,
          acceptance: 0.0001,
          startColor: [255,0,0],
          endColor: [0,0,255],
        },
        opt3:{
          timeout: 30,
          red:255,
          green: 0,
          blue: 0,
        },
        greedy:{
          startRed: 0,
          startGreen: 255,
          startBlue: 0,
          endRed: 255,
          endGreen: 0,
          endBlue: 0,
        }
      },


      dimension: 2,
      degreesize: false,
      minsize: 3,
      maxsize: 10,
      startRed: 0,
      startGreen: 255,
      startBlue: 255,
      endRed: 0,
      endGreen: 255,
      endBlue: 255,
      filter: "",
      filtering: false,
    }
    this.network = React.createRef();
    this.network3d = React.createRef();
    this.customnetwork = React.createRef();
    this.navbar = React.createRef();
    this.toolbar = React.createRef();
    
  }

  componentDidMount(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    window.addEventListener("resize", () => {this.resize()})
    this.setState({height: h, width: w});
  }

  resize(){
    const w = window.innerWidth
    const h = window.innerHeight
    this.setState({height: h, width: w})
  }

  render() {

    // let network;
    // if(this.state.dimension === 2){
    //   network = <NetworkVisualizer height = {this.state.height}
    //   ref = {this.network} app = {this}/>
    // }
    // else if(this.state.dimension === 3){
    //   network = <NetworkVisualizer3D
    //   height = {this.state.height}
    //   ref = {this.network3d} app = {this}/>
    // }
    // else if(this.state.dimension === "Custom"){
    //   network = <NetworkCustomVisualizer height = {this.state.height}
    //   ref = {this.customnetwork} app = {this}></NetworkCustomVisualizer>
    var numnetwork = 9
    var numsettings = 3

    return (
        <IonApp>
          <Router>

            <Route exact path = "/">
              <Redirect to ="/Network-Analysis-Visualization/2d"/>
            </Route>
            <Route exact path = "/Network-Analysis-Visualization">
              <Redirect to ="/Network-Analysis-Visualization/2d"/>
            </Route>

          <IonContent>
            <IonGrid width = "100%">
              <IonRow size = "1" id = "toolbar" style = {{height: Math.max(this.state.height/10, 50)}}>
                <IonCol size = "3">
                  <Route path = "/Network-Analysis-Visualization/2d" render = {() => <Nav2D selected = {true}/>}/>
                  <Route path = "/Network-Analysis-Visualization/3d" render = {() => <Nav2D selected = {false}/>}/>
                  <Route path = "/Network-Analysis-Visualization/custom" render = {() => <Nav2D selected = {false}/>}/>

                </IonCol>
                <IonCol size = "3">
                  <Route path = "/Network-Analysis-Visualization/2d" render = {() => <Nav3D selected = {false}/>}/>
                  <Route path = "/Network-Analysis-Visualization/3d" render = {() => <Nav3D selected = {true}/>}/>
                  <Route path = "/Network-Analysis-Visualization/custom" render = {() => <Nav3D selected = {false}/>}/>

                </IonCol>
                <IonCol size = "3">
                  <Route path = "/Network-Analysis-Visualization/2d" render = {() => <NavCustom selected = {false}/>}/>
                  <Route path = "/Network-Analysis-Visualization/3d" render = {() => <NavCustom selected = {false}/>}/>
                  <Route path = "/Network-Analysis-Visualization/custom" render = {() => <NavCustom selected = {true}/>}/>
                </IonCol>
                <IonCol size = "3" >
                  <IonItem> <IonLabel> Network Settings </IonLabel> </IonItem>
                </IonCol>
              </IonRow>

              <IonRow size = "11" style = {{overflow: "auto"}} id = "appcontent">
                <IonCol size = {numnetwork}>

                  <Route path = "/Network-Analysis-Visualization/2d" render = {() => <NetworkVisualizer offsetRef = {this.toolbar}/>}/>
                  <Route path = "/Network-Analysis-Visualization/3d" render = {() => <NetworkVisualizer3D offsetRef = {this.toolbar}/>}/>
                  <Route path = "/Network-Analysis-Visualization/custom" render = {() => <NetworkCustom offsetRef = {this.toolbar}/>}/>

                </IonCol>
                <IonCol size = {numsettings}  id = "settings">
                  <IonContent style = {{boxShadow: "5px 10px 35px grey"}}>
                  <IonItem>
                    <IonIcon icon = {searchCircleOutline}/>
                    <IonInput placeholder = "filter">
                    </IonInput>
                  </IonItem>


                  </IonContent>

                </IonCol>
              </IonRow>

            </IonGrid>
          </IonContent>
          </Router>
        </IonApp>
    )
    // return (
    //   <div className="App">
    //     <div className = "AppElements">
    //       <NetworkNavBar height = {this.state.height}
    //       ref = {this.navbar} app = {this}/>
    //       {network}
    //     </div>
    //   </div>
    //
    // );
  }
}
export default App;
