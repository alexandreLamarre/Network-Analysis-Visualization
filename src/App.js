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
import {BrowserRouter as Router, Route} from "react-router-dom";

// IONIC IMPORTS
import {
  IonApp, IonGrid, IonRow, IonCol,
  IonLabel, IonContent, IonItem, IonIcon, IonInput, IonButton, IonRange
} from "@ionic/react"
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
import {
  playBackCircleOutline,
  playCircleOutline, playForwardCircleOutline,
  playSkipBackCircleOutline, playSkipForwardCircleOutline,
  searchCircleOutline, stopCircleOutline, pauseCircleSharp,
    closeCircleOutline,
} from 'ionicons/icons';
import {Redirect} from "react-router";




class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      height: 0,
      width: 0,
      settingsObject : [],
      settingsHTML: null,
      networkSettingHTML : null,
      algorithmSelectHTML: null,
      animations: [],
      animationsInBuffer: false,
      currentStep : 0,
      running : false,
    }
    this.networkSettings = new NetworkSettings()
    this.networkData = new Network(this.networkSettings, false)
    this.animator = new Animator(this.networkData)

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

  }

  getAnimation(){
    const animations = this.animator.getAnimations(
        this.networkData.vertices,
        this.networkData.edges,
        this.networkData.isThreeDimensional)
    this.setState({animationsInBuffer: true, animations: animations, currentStep: 0})
  }

  async toggleAnimationsRunning(){
    await this.setState({running: !this.state.running})
    this.animate()
  }

  performAnimationStep(num){
    const numPerformed = this.animator.nextAnimationSteps(
        this.networkData,
        this.state.animations,
        this.state.currentStep,
        parseInt(num))
    this.setState({currentStep: this.state.currentStep + numPerformed})
  }

  animate(){
    if(this.state.running){
      if(this.state.currentStep === this.state.animations.length -1){
        this.setState({running:false})
      }

      const stepsPerformed = this.animator.nextAnimationSteps(
          this.networkData,
          this.state.animations,
          this.state.currentStep,
          1)
      this.setState({currentStep: this.state.currentStep + stepsPerformed})
      window.requestAnimationFrame(() => this.animate())
    }
  }

  resetAnimationLogic(){
    this.setState({animations : [], currentStep: 0, animationsInBuffer: false, running: false})
  }

  setSpecificAnimationFrame(animationIndex){
    if(this.state.animations.length === 0 || !this.state.animationsInBuffer) return
    //using current step = 0; means we can apply any animation index and have the returned steps be the new current step number
    const newCurrentStep = this.animator.nextAnimationSteps(
        this.networkData,
        this.state.animations,
        0,
        parseInt(animationIndex)
        )
    this.setState({currentStep: newCurrentStep, running:false});
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
                      settings = {this.networkSettings}
                      networkData = {this.networkData}
                      animator = {this.animator}
                      parent = {this}/>}
                  />
                  <Route path = "/Network-Analysis-Visualization/3d" render = {() => <NetworkVisualizer3D
                      settings = {this.networkSettings}
                      networkData = {this.networkData}
                      animator = {this.animator}
                      parent = {this}/>}
                  />
                  <Route path = "/Network-Analysis-Visualization/custom" render = {() => <NetworkCustom/>}/>

                </IonCol>
                <IonCol size = {numsettings}  id = "settings">
                  <IonContent style = {{boxShadow: "5px 10px 35px grey"}}>
                    <div hidden = {this.state.animationsInBuffer}>
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
                      <IonItem lines = "full">
                        {this.state.algorithmSelectHTML}
                      </IonItem>
                    </div>


                    <div className = "animationPlayer" hidden = {this.state.animationsInBuffer === false}>

                      <IonIcon onClick = {() => this.resetAnimationLogic()}
                               style = {{position: "absolute", top: 0, right: 0,cursor: "pointer"}}
                               size = "large"
                               icon = {closeCircleOutline}/>

                      <br className = "noSelectText"/>
                      <p className = "noSelectText" style = {{textAlign: "center"}}><b>{this.animator.activeAlgorithm.name}</b></p>
                      <br className = "noSelectText"/>


                          <div style = {{display: "flex", justifyContent:"center",
                            alignItems:"center", alignContent:"center", backgroundColor: "rgb(255,245,245)"}}>
                            <IonButton expand = "block" fill = "clear" color = "medium"
                                       onClick = {() => this.performAnimationStep(-this.state.animations.length)}>
                              <IonIcon
                                  size = "large"
                                  icon = {playBackCircleOutline}
                                  />
                            </IonButton>
                            <IonButton expand = "block" fill = "clear" color = "medium"
                                       onClick = {() => this.performAnimationStep(-1)}>
                              <IonIcon
                                  size = "large"
                                  icon = {playSkipBackCircleOutline}
                                  />
                            </IonButton>
                            <IonButton expand = "block" fill = "clear" color = "medium"
                                       onClick = {() => this.toggleAnimationsRunning()}>
                              <IonIcon
                                  size = "large"
                                  icon = {this.state.running === false?playCircleOutline: pauseCircleSharp}
                                  />
                            </IonButton>
                            <IonButton expand = "block" fill = "clear" color = "medium"
                                       onClick = {() => this.performAnimationStep(1)}>
                              <IonIcon
                                  size = "large"
                                  icon = {playSkipForwardCircleOutline}
                                  />
                            </IonButton>
                            <IonButton expand = "block" fill = "clear" color = "medium"
                                       onClick = {() => this.performAnimationStep(this.state.animations.length)}>
                              <IonIcon
                                  size = "large"
                                  icon = {playForwardCircleOutline}
                                  />
                            </IonButton>

                          </div>


                      <IonItem lines = "none" color = "light">
                      <input type = "range"
                          style = {{color: "rgb(63,111,255)", cursor: "grab", width: "100%"}}
                          min = "0"
                          max = {this.state.animations.length-1}
                          value = {this.state.currentStep}
                          onChange = {(e) => this.setSpecificAnimationFrame(e.target.value)}
                      />
                      </IonItem>

                    </div>
                    <IonItem lines = "full" hidden = {this.state.animationsInBuffer === true}>
                      <IonButton style = {{margin:"auto"}} onClick = {() => this.getAnimation()}> Animate </IonButton>
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
