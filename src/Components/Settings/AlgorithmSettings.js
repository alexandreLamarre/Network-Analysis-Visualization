import React from "react";

class AlgorithmSettings extends React.Component{
    constructor(props){
        super(props)
        this.algoSettings = []
        for(let i = 0; i < this.props.algorithms.length; i++){
            this.algoSettings.push(this.props.algorithms[i].settings)
        }
        this.state = {
            filter: ""
        }
    }

    render(){
        return(
            <div>
                {this.algoSettings.map((algorithmSettings, index) => (
                    <div key = {index} hidden = {!algorithmSettings.name.toLowerCase().includes(this.state.filter.toLowerCase())}>
                        {algorithmSettings.toHTML(index)}
                    </div>
                ))}
            </div>
        )
    }
}

export default AlgorithmSettings