//DEFAULT IMPORTS
import React from 'react';
import './App.css';

//CUSTOM COMPONENT IMPORTS

import {Nav2D, Nav3D, NavCustom} from "./Components/NavBar"
import Settings from "./Animations/Algorithms/AlgorithmSettings.js"
import SettingObject from "./Animations/Algorithms/AlgorithmSetting.js"
import {NetworkVisualizer, NetworkVisualizer3D, NetworkCustom, Network} from "./Components/Network";
import NetworkSettings from "./Components/Network/NetworkSettings";
import Animator from "./Animations/Animator";

//REACT ROUTER IMPORTS
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

// IONIC IMPORTS
import {IonApp, IonGrid, IonRow, IonCol,
  IonLabel, IonContent, IonItem, IonIcon, IonInput, IonButton} from "@ionic/react"
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
import SpringEmbedding from "./Animations/Algorithms/LayoutAlgorithms/springEmbedding";


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      running:false,
      height: 0,
      width: 0,
      settingsObject : [],
      settingsHTML: null,
      networkSettingHTML : null,
      algorithmSelectHTML: null
    }
    this.networkSettings = new NetworkSettings()
    this.networkData = new Network(this.networkSettings, false)
    this.animator = new Animator(this.networkData)
    console.log("Animator object network",this.animator.network)
  }


  componentDidMount(){

    const networkSettingsHTML = this.networkSettings.toHTML()
    const algorithmSettingsHTML = this.animator.algorithmSettingsToHTML()
    const algorithmSelectHTML = this.animator.algorithmsToHTML()
    const w = window.innerWidth;
    const h = window.innerHeight;
    window.addEventListener("resize", () => {this.resize()})
    this.setState({
      height: h,
      width: w,
      settingsHTML: <div> Loading ...</div>,
      settingsObject: null,
      networkSettingsHTML : networkSettingsHTML,
      algorithmSettingsHTML: algorithmSettingsHTML,
      algorithmSelectHTML: algorithmSelectHTML
    });
  }

  checkImplementation(){
    console.log(this.state.settingsObject)
    console.log(this.networkSettings)
    console.log(this.springEmbedding)
  }

  getAnimation(){
    const a =this.springEmbedding.getAnimations(this.networkData.vertices, this.networkData.edges, this.networkData.isThreeDimensional)
    console.log(a)
    this.networkData.vertices = a[a.length-1]
  }

  resize(){
    const w = window.innerWidth
    const h = window.innerHeight
    this.setState({height: h, width: w})
  }

  render() {
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

                  <Route path = "/Network-Analysis-Visualization/2d" render = {() => <NetworkVisualizer
                      settings = {this.networkSettings} networkData = {this.networkData} />}/>
                  <Route path = "/Network-Analysis-Visualization/3d" render = {() => <NetworkVisualizer3D
                      settings = {this.networkSettings} networkData = {this.networkData} />}/>
                  <Route path = "/Network-Analysis-Visualization/custom" render = {() => <NetworkCustom/>}/>

                </IonCol>
                <IonCol size = {numsettings}  id = "settings">
                  <IonContent style = {{boxShadow: "5px 10px 35px grey"}}>
                  <IonItem>
                    <IonIcon icon = {searchCircleOutline}/>
                    <IonInput placeholder = "filter" style = {{textAlign: "center"}}>
                    </IonInput>
                  </IonItem>
                    <div style = {{outline: "1px solid black"}}>
                      <div style =
                               {{maxHeight: Math.max(this.state.height*(6/10), 300),
                                 overflowY: "scroll"}}>
                        {this.state.networkSettingsHTML}
                        {this.state.algorithmSettingsHTML}
                      </div>
                    </div>
                    <hr/>
                    <IonItem>
                      {this.state.algorithmSelectHTML}
                    </IonItem>
                    <IonItem>
                      <IonButton onClick = {() => this.checkImplementation()}> Log </IonButton>
                      <IonButton onClick = {() => this.getAnimation()}> Fetch Animations</IonButton>
                    </IonItem>

                  </IonContent>

                </IonCol>
              </IonRow>

            </IonGrid>
          </IonContent>
          </Router>
        </IonApp>
    )
  }
}
export default App;
