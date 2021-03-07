import React from "react"
import {IonItem, IonLabel} from "@ionic/react"

class AlgorithmSettingsComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }

    }


    render(){
        let settings = this.props.settings
        return (
            <div>
                <IonItem lines = "full" color = "dark"
                         style = {{outline: "1px solid black"}}>
                    <p>
                        <b>{this.props.name}</b>
                    </p>

                </IonItem >
                    {settings.map((s, index) => (
                        s
                    ))}
            </div>


        )
    }
}

export default AlgorithmSettingsComponent