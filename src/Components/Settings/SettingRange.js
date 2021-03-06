import React from "react";
import {IonItem, IonLabel, IonRange} from "@ionic/react";

class SettingRange extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value : this.props.settings.value
        }
        this.settings = this.props.settings
        console.log(this.settings)
        console.log("STEP", this.settings.step)
    }

    setSettingsValue(v){
        this.settings.value = Number.parseFloat(v)
        this.setState({value: v})
    }

    render(){
        return (

            <IonItem lines = "full">
                <p>
                    {this.settings.name} {this.state.value}
                </p>
                <IonRange
                    min = {this.settings.min}
                    max = {this.settings.max}
                    step = {this.settings.step}
                    value = {this.state.value}
                    onIonChange = {(e) => this.setSettingsValue(e.target.value)}>
                </IonRange>

            </IonItem>)
    }
}

export default SettingRange