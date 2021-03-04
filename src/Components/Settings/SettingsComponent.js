import React from "react"
import {IonItem, IonLabel} from "@ionic/react"

class SettingsComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }

    }


    render(){
        let settings = this.props.settings
        return (
            <div>
            <IonItem color = "rgb(200, 200, 200)"
                     style = {{outline: "1px solid black"}}>
                <IonLabel style = {{textAlign: "center"}}>
                    <b>{this.props.name}</b>
                </IonLabel>

            </IonItem >
                    {settings.map((s, index) => (
                        s
                    ))}
            </div>


        )
    }
}

export default SettingsComponent