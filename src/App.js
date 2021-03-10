//DEFAULT IMPORTS
import React from 'react';
import './App.css';

//CUSTOM COMPONENT IMPORTS

import {NavBar} from "./Components/NavBar"
import {Visualizer, Network} from "./Components/Network";
import NetworkSettings from "./Components/Network/NetworkSettings";
import Animator from "./Animations/Animator";
import PolarColorGradient from "./datatypes/ColorGradient/PolarColorGradient";

//REACT ROUTER IMPORTS
import {BrowserRouter as Router, Route} from "react-router-dom";

// IONIC IMPORTS
import {
  IonApp, IonGrid, IonRow, IonCol, IonContent, IonItem, IonIcon, IonInput, IonButton, IonProgressBar
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
  searchCircleOutline, pauseCircleSharp,
    closeCircleOutline,
} from 'ionicons/icons';
import {Redirect} from "react-router";


const ANIMATOR = new Animator()

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
      activeAlgorithm : { },
      animations: [],
      animationsInBuffer: false,
      currentStep : 0,
      running : false,
      filter: "",
      invalidAlgorithm: false,
      invalidAlgorithmInfo: {},
      fps: 60,
    }
    this.networkSettings = new NetworkSettings()
    this.networkData = new Network(this.networkSettings, false)
    this.maxTimeout = 0;
    this.networkSettingsRef = React.createRef()
    this.algorithmSettingsRef = React.createRef()
  }


  componentDidMount(){
    const networkSettingsHTML = this.networkSettings.toHTML(this.networkSettingsRef)
    const algorithmSettingsHTML = ANIMATOR.algorithmSettingsToHTML(this.algorithmSettingsRef)
    const algorithmSelectHTML = ANIMATOR.algorithmsToHTML()
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
      algorithmSelectHTML: algorithmSelectHTML,
      activeAlgorithm: ANIMATOR.activeAlgorithm,
    });
  }

  componentWillUnmount() {
    while(this.maxTimeout >= 0){
      clearTimeout(this.maxTimeout);
      this.maxTimeout --;
    }
  }

  animate(){
    if(this.state.running){
      this.maxTimeout = setTimeout(() => {
        if(this.state.currentStep === this.state.animations.length -1){
          this.setState({running:false})
        }

        const stepsPerformed = ANIMATOR.nextAnimationSteps(
            this.networkData,
            this.state.animations,
            this.state.currentStep,
            1)
        this.setState({currentStep: this.state.currentStep + stepsPerformed})
        window.requestAnimationFrame(() => this.animate())
      }, parseInt(1000/ this.state.fps));
    }
  }

  resize(){
    const w = window.innerWidth
    const h = window.innerHeight
    this.setState({height: h, width: w})
  }

  async getAnimation(){
    //check if network is of valid type
    if( ANIMATOR.activeAlgorithm.requiredProperty !== null &&
        !this.networkData.settings.properties[ANIMATOR.activeAlgorithm.requiredProperty]){
      this.setState({
        invalidAlgorithm: true,
        invalidAlgorithmInfo: {
          name: ANIMATOR.activeAlgorithm.name,
          requiredProperty: ANIMATOR.activeAlgorithm.requiredProperty
        },
      })
    }else{
      //animationsInBuffer tells to load the animation player, and loading dictates whether or not
      // the animation is done fetching
      await this.setState({
        invalidAlgorithm: false,
        invalidAlgorithmInfo: {},
        animationsInBuffer: true,
        loading: true,
        currentStep: 0,
        activeAlgorithm: ANIMATOR.activeAlgorithm, })
      await this.forceUpdate()
      setTimeout(() => ANIMATOR.getAnimations(
          this.networkData.vertices,
          this.networkData.edges,
          this.networkData.isThreeDimensional).then((animations) => {
            this.setState({animations: animations, loading: false})
          }), 10)

    }
  }


  performAnimationStep(num){
    if(num === 1 || num === -1) this.setState({running:false})
    const numPerformed = ANIMATOR.nextAnimationSteps(
        this.networkData,
        this.state.animations,
        this.state.currentStep,
        parseInt(num))
    this.setState({currentStep: this.state.currentStep + numPerformed})
  }

  setSpecificAnimationFrame(animationIndex){
    if(this.state.animations.length === 0 || !this.state.animationsInBuffer) return
    //using current step = 0; means we can apply any animation index and have the returned steps be the new current step number
    const newCurrentStep = ANIMATOR.nextAnimationSteps(
        this.networkData,
        this.state.animations,
        0,
        parseInt(animationIndex)
    )
    this.setState({currentStep: newCurrentStep, running:false});
  }

  async toggleAnimationsRunning(){
    await this.setState({running: !this.state.running})
    this.animate()
  }

  resetAnimationLogic(){
    this.setState({
      animations : [],
      currentStep: 0,
      animationsInBuffer: false,
      running: false,
      activeAlgorithm: {}})
  }

  setFilter(v){
    this.networkSettingsRef.current.setState({filter: v})
    this.algorithmSettingsRef.current.setState({filter:v})
    this.setState({filter: v})
  }

  setFPS(v){
    this.setState({fps: parseInt(v)})
  }

  render() {
    return (
        <Router>
            <Route exact path = "/">
            <Redirect to ="/Network-Analysis-Visualization/2d"/>
          </Route>
            <Route exact path = "/Network-Analysis-Visualization">
              <Redirect to ="/Network-Analysis-Visualization/2d"/>
            </Route>

        <IonApp>

          <IonContent>
            <IonGrid width = "100%">
              <NavBar parent = {this} />

              <IonRow size = "11" style = {{overflow: "auto"}} id = "appcontent">

                <Visualizer parent = {this} />

                <IonCol size = "3"  id = "settings">

                  <IonContent style = {{boxShadow: "5px 10px 35px grey"}}>
                    {/*SETTINGS/ ANIMATION PlAYER CONDITIONAL*/}
                    {this.state.animationsInBuffer === false? <div>
                      <IonItem>
                        <IonIcon icon = {searchCircleOutline}/>
                        <IonInput
                            onIonChange = {(e) => this.setFilter(e.target.value)}
                            placeholder = "filter"
                            style = {{textAlign: "center"}} >
                        </IonInput>
                      </IonItem>
                      <div style = {{outline: "1px solid black"}}>
                        <div style =
                                 {{minHeight:  Math.max(this.state.height*(5.8/10), 300),
                                   maxHeight: Math.max(this.state.height*(5.8/10), 300),
                                   overflowY: "scroll"}}>
                          {this.state.networkSettingsHTML}
                          {this.state.algorithmSettingsHTML}
                        </div>
                      </div>
                      <hr/>
                      <IonItem lines = "full">
                        {this.state.algorithmSelectHTML}

                      </IonItem>
                      <IonItem lines = "full">
                        <IonButton style = {{margin:"auto"}} onClick = {() => this.getAnimation()}> Animate </IonButton>
                      </IonItem>
                      <div
                          hidden = {!this.state.invalidAlgorithm}
                          style = {{color:"red", textAlign:"center"}}>
                        Algorithm '{this.state.invalidAlgorithmInfo.name}' requires Network property/type
                        '{this.state.invalidAlgorithmInfo.requiredProperty}'
                      </div>
                    </div>:
                    // ANIMATION PLAYER
                    <div className = "animationPlayer">
                      <IonIcon hidden = {this.state.loading}
                               onClick = {() => this.resetAnimationLogic()}
                               style = {{position: "absolute", top: 0, right: 0,cursor: "pointer"}}
                               size = "large"
                               icon = {closeCircleOutline}/>

                      <br className = "noSelectText"/>
                      <p className = "noSelectText" style = {{textAlign: "center"}}><b>{this.state.activeAlgorithm.name}</b></p>
                      <IonProgressBar hidden = {!this.state.loading}type = "indeterminate"/>

                      <br className = "noSelectText"/>
                      <div className = "animationControls" hidden = {this.state.loading}>

                      <div style = {{display: "flex", justifyContent:"center",
                        alignItems:"center", alignContent:"center", backgroundColor: "#f4f5f8"}}>
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


                      <IonItem lines = "none" color = "medium">
                      <input type = "range"
                          style = {{color: "rgb(63,111,255)", cursor: "grab", width: "100%"}}
                          min = "0"
                          max = {this.state.animations.length-1}
                          value = {this.state.currentStep}
                          onChange = {(e) => this.setSpecificAnimationFrame(e.target.value)}
                      />
                      </IonItem>
                        <div style = {{display: "flex", flexDirection: "row", alignContent: "center", backgroundColor: "#f4f5f8"}}>
                        <p style = {{textAlign: "center", marginLeft: "5%"}}> FPS Cap: {this.state.fps}</p>
                        <input type = "range"
                               style = {{marginLeft: "5%", marginRight: "5%", color: "rgb(63,111,255)", cursor: "grab", width: "100%"}}
                               min = "10"
                               max = "60"
                               step = "1"
                               value = {this.state.fps}
                               onChange = {(e) => this.setFPS(e.target.value)}/>
                      </div>
                      </div>

                    </div>}

                  </IonContent>

                </IonCol>
              </IonRow>

            </IonGrid>
          </IonContent>

        </IonApp>
        </Router>
    )
  }
}
export default App;
