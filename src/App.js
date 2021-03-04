//DEFAULT IMPORTS
import React from 'react';
import './App.css';

//CUSTOM COMPONENT IMPORTS
import {NetworkVisualizer, NetworkVisualizer3D, NetworkCustom} from "./Components/Network/index.js"
import {Nav2D, Nav3D, NavCustom} from "./Components/NavBar"
import Settings from "./Animations/Algorithms/Settings.js"
import SettingObject from "./Animations/Algorithms/Setting.js"


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

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      settingsHTML: null,
      running:false,
      animationSpeed: 50,
      numV: 120,
      numE: 300,
      connected: "True",
      maxE: 600,
      minE: 20,
      height: 0,
      width: 0,
      settingsObject : [],
    }
    
  }

  componentDidMount(){
    let s = new Settings("Network ")
    let s1 = SettingObject.newRangeSetting("vertices", 4, 200, 1, 4)
    let s2 = SettingObject.newRangeSetting("edges", 0, 600, 1, 4)
    let s3 = SettingObject.newCheckBoxSetting("force connectedness", false)
    let s4 = SettingObject.newOptionSetting("random generation", ["random", "random-circle"], "random")
    s.push(s1)
    s.push(s2)
    s.push(s3)
    s.push(s4)

    const w = window.innerWidth;
    const h = window.innerHeight;
    window.addEventListener("resize", () => {this.resize()})
    this.setState({height: h, width: w, settingsHTML: s.toHTML(), settingsObject: s});
  }

  checkImplementation(){
    console.log(this.state.settingsObject)
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

                  <Route path = "/Network-Analysis-Visualization/2d" render = {() => <NetworkVisualizer />}/>
                  <Route path = "/Network-Analysis-Visualization/3d" render = {() => <NetworkVisualizer3D />}/>
                  <Route path = "/Network-Analysis-Visualization/custom" render = {() => <NetworkCustom />}/>

                </IonCol>
                <IonCol size = {numsettings}  id = "settings">
                  <IonContent style = {{boxShadow: "5px 10px 35px grey"}}>
                  <IonItem>
                    <IonIcon icon = {searchCircleOutline}/>
                    <IonInput placeholder = "filter" style = {{textAlign: "center"}}>
                    </IonInput>
                  </IonItem>
                    {this.state.settingsHTML}
                    <IonButton onClick = {() => this.checkImplementation()}> Log </IonButton>
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
