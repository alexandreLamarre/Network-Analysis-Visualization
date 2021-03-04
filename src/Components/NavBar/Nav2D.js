import React from "react"
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import {logoElectron} from "ionicons/icons";
import {Link} from "react-router-dom";

/**
 * Nav Link in toolbar component for 2D network Visualizer
 */
class Nav2D extends React.Component{
    render(){
        return(
            <Link style = {{textDecoration: "none"}} to = "/Network-Analysis-Visualization/2d">
                <IonItem style = {{outline: this.props.selected?"solid 2px blue":"none"}}>
                    <IonIcon icon = {logoElectron}/>
                    <IonLabel> 2D </IonLabel>
                </IonItem>
            </Link>
        )
    }
}
export default Nav2D