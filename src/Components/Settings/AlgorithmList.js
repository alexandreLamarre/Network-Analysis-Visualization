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
            width: 0,
        }
    }

    componentDidMount(){
        const w = window.innerWidth
        this.setState({width: w})
        window.addEventListener("resize", () => this.resize())
    }

    setOption(v){
        for(let i = 0; i < this.algorithms.length; i++){
            if(this.algorithms[i].name === v){
                console.log("algorithm found")
                this.setState({
                    activeAlgorithm:  v,
                });
                this.animator.activeAlgorithm = this.algorithms[i]
                break;
            }
        }
    }

    resize(){
        const w = window.innerWidth;
        this.setState({width: w})
    }


    render(){
        return (
            <div>
                <IonItem lines = "full">
                    <b style = {{cursor: "default", maxWidth: this.state.width*(0.75/10)}}
                        className = "noSelectText"> Select Algorithm </b>
                    <select style = {{marginLeft: "10px", maxWidth: this.state.width*(1/10)}} onChange = {(e) => this.setOption(e.target.value)}>
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