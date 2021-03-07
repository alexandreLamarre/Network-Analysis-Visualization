import React from "react"
import {IonItem} from "@ionic/react"

import "./AlgorithmList.css";

class AlgorithmList extends React.Component{
    constructor(props){
        super(props)
        this.algorithms = this.props.algorithms
        this.animator = this.props.animator

        this.state = {
            activeAlgorithm: this.algorithms[0].name,
        }
        console.log(this.network)
    }

    setOption(v){
        console.log("setting algorithm", v)
        for(let i = 0; i < this.algorithms.length; i++){
            if(this.algorithms[i].name === v){
                console.log("algorithm found")
                this.setState({
                    activeAlgorithm:  v,
                });
                this.animator.activeAlgorithm = this.algorithms[i]
                console.log(this.algorithms.activeAlgorithm)
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