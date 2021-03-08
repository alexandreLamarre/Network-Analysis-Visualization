import React from "react";
import {IonItem} from "@ionic/react"

class SettingColor extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value : this.props.settings.value
        }
        this.settings = this.props.settings
    }

    setSettingsValue(v){
        this.settings.value = v;
        this.setState({value: v});
    }

    render(){
        return (
            <IonItem lines = "full" color = "light">
                <p>
                    {this.settings.name}
                </p>
                <input type = "color"
                       style = {{marginLeft: "5%"}}
                       value = {this.state.value}
                       onChange = {(e) => this.setSettingsValue(e.target.value)}
                />
            </IonItem>
        )
    }
}

export default SettingColor;