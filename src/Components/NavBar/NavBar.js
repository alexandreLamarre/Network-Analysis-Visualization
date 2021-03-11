import React from "react";

import {IonRow, IonCol, IonItem, IonLabel, IonIcon, IonToggle} from "@ionic/react";
import {Route} from "react-router-dom";
import {Nav2D, Nav3D, NavCustom} from "./index";
import {logoOctocat, moon} from "ionicons/icons";


import "./darkmode.css";



class NavBar extends React.Component{

    /**
     * Toggles the ionic color theme between light and dark
     * @param e toggle event
     */
    setDarkMode(e){
        document.body.classList.toggle('dark', e.detail.checked)
    }

    /**
     * Creates a proxy a tag to click to redirect in a new tab to the documentation of the project
     */
    openDocumentation(){
        const el = document.createElement("a");
        el.href = "https://github.com/alexandreLamarre/Network-Analysis-Visualization"
        el.target = "_blank"
        el.click();
    }

    render(){

        return (
            <IonRow size = "1" id = "toolbar" style = {{height: Math.max(this.props.parent.state.height/10, 50)}}>
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
                    <IonItem  >
                        <IonIcon style = {{cursor: "pointer"}}
                                 onClick = {() => this.openDocumentation()} icon={ logoOctocat}/>
                        <IonLabel style = {{cursor: "pointer",marginLeft: "5%"}}
                                  onClick = {() => this.openDocumentation()}>
                            Documentation </IonLabel>
                        <IonToggle onIonChange = {(e) => this.setDarkMode(e)}/>
                        <IonIcon color = "moon" icon = {moon}/>
                    </IonItem>
                </IonCol>
            </IonRow>
        )
    }
}

export default NavBar;