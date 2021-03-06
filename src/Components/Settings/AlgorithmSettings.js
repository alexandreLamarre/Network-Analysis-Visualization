import React from "react";

class AlgorithmSettings extends React.Component{
    constructor(props){
        super(props)
        this.algoSettings = []
        for(let i = 0; i < this.props.algorithms.length; i++){
            console.log("adding settings", this.props.algorithms[i].settings)
            this.algoSettings.push(this.props.algorithms[i].settings)
        }
    }

    render(){
        return(
            <div>
                {this.algoSettings.map((algorithmSettings, index) => (
                    algorithmSettings.toHTML(index)
                ))}
            </div>
        )
    }
}

export default AlgorithmSettings