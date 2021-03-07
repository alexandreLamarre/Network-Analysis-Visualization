import React from "react";
import {IonCheckbox, IonItem, IonLabel, IonRange} from "@ionic/react";

class SettingCheckbox extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value: this.props.settings.value
        }
        this.settings = this.props.settings
    }

    toggle(e){
        this.settings.value = !this.settings.value
        this.setState({value: !this.state.value})
        console.log("to", this.settings.value)
    }
    render(){
        return (
            <IonItem color = "light">
                <IonLabel>
                    {this.settings.name}
                </IonLabel>
                <IonCheckbox
                    checked = {this.state.value}
                    onIonChange = {(e) => this.toggle(e.detail.value) }>
                </IonCheckbox>

            </IonItem>
        )
    }
}

export default SettingCheckbox