import React from "react"
import {Route} from "react-router-dom";
import {NetworkCustom, NetworkVisualizer, NetworkVisualizer3D} from "./index";
import {IonCol} from "@ionic/react";

class Visualizer extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <IonCol size = "9">

                <Route path = "/Network-Analysis-Visualization/2d" render = {() => <NetworkVisualizer
                    settings = {this.props.parent.networkSettings}
                    networkData = {this.props.parent.networkData}
                    animator = {this.props.parent.animator}
                    parent = {this.props.parent}/>}
                />
                <Route path = "/Network-Analysis-Visualization/3d" render = {() => <NetworkVisualizer3D
                    settings = {this.props.parent.networkSettings}
                    networkData = {this.props.parent.networkData}
                    animator = {this.props.parent.animator}
                    parent = {this.props.parent}/>}
                />
                <Route path = "/Network-Analysis-Visualization/custom" render = {() => <NetworkCustom
                    parent = {this.props.parent}/>}

                />

            </IonCol>
        )
    }
}

export default Visualizer;