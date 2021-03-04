import React from "react"
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import {logoElectron} from "ionicons/icons";
import {Link} from "react-router-dom";

/**
 * Nav Link in toolbar component for creating custom Networks
 */
class NavCustom extends React.Component{
    render(){
        return(
            <Link style = {{textDecoration: "none"}} to = "/Network-Analysis-Visualization/custom">
                <IonItem style = {{outline: this.props.selected?"solid 2px blue":"none"}}>
                    <IonIcon icon = {logoElectron}/>
                    <IonLabel> Custom </IonLabel>
                </IonItem>
            </Link>
        )
    }
}
export default NavCustom