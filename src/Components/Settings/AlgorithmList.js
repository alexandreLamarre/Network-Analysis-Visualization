import React from "react"
import {IonItem} from "@ionic/react"

import "./AlgorithmList.css";

class AlgorithmList extends React.Component{
    constructor(props){
        super(props)
        this.algorithms = this.props.algorithms
        this.parent = this.props.parent

        this.state = {
            activeAlgorithm: this.algorithms[0].name,
            requiredProperty: this.algorithms[0].requiredProperty,
        }
        console.log("required property", this.state.requiredProperty)
        console.log(this.network)
    }

    setOption(v){
        for(let i = 0; i < this.algorithms.length; i++){
            if(this.algorithms[i].name === v){
                this.setState({
                    activeAlgorithm:  v,
                    requiredProperty: this.algorithms[i].requiredProperty
                });
                this.activeAlgorithm = this.algorithms[i]
                break;
            }
        }
    }

    render(){
        return (
            <div>
                <IonItem lines = "full">
                    <b style = {{cursor: "default"}}
                        className = "noSelectText"> Select Algorithm </b>
                    <select style = {{marginLeft: "10px"}} onChange = {(e) => this.setOption(e.target.value)}>
                        {this.algorithms.map((algorithm, index) => (
                            <option value = {algorithm.name} key = {index}> {algorithm.name} </option>
                        ))}
                    </select>

                </IonItem>
            </div>
        )
    }
}

export default AlgorithmList