import React from "react";
import {IonItem, IonLabel, IonRange} from "@ionic/react";

class SettingOption extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value : this.props.settings.value
        }
        this.settings = this.props.settings
    }

    setOption(v){
        this.settings.value = v
        this.setState({value: v})
    }

    render(){
        return (
            <IonItem color = "light">
                <IonLabel>
                    {this.settings.name}
                </IonLabel>
                <select
                    value = {this.settings.value}
                    onChange = {(e) => this.setOption(e.target.value)}>
                    {this.settings.options.map((opt, index) => (
                        <option key = {index} value = {opt}> {opt} </option>
                    ))}
                </select>

            </IonItem>
        )
    }
}

export default SettingOption