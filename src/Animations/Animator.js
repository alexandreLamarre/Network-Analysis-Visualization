import * as ALGORITHMS from "./Algorithms"
import AlgorithmList from "../Components/Settings/AlgorithmList";
import AlgorithmSettings from "../Components/Settings/AlgorithmSettings";
import React from "react";

class Animator{
    constructor(network){
        this.network = network
        this.algorithms = [];
        console.log("iterating over all algorithms defined in index.js")
        for(const key in ALGORITHMS){
            console.log(key)
            for (const algo in ALGORITHMS[key]){
                console.log(algo)
                this.algorithms.push(new ALGORITHMS[key][algo]())

            }
        }
        if(this.algorithms.length === 0) throw new Error("No algorithms were imported by the Animator object")
        console.log("LOADED ALGORITHMS", this.algorithms)
        this.activeAlgorithm = this.algorithms[0]
    }


    algorithmsToHTML(){
        return <AlgorithmList algorithms = {this.algorithms} network = {this.network}/>
    }

    algorithmSettingsToHTML(){
        return <AlgorithmSettings algorithms = {this.algorithms}/>
    }

    getAnimations(vertices, edges, is3D){
        return this.activeAlgorithm.getAnimations(vertices, edges, is3D)
    }

    /**
     * Performs the specified amount of animation steps
     * @param animations
     * @param network
     * @param currentStep
     * @param steps
     */
    nextAnimationSteps(network, animations, currentStep, steps) {
        if(this.animations === []) throw new Error("No animations loaded")
        return this.activeAlgorithm.nextAnimationSteps(network, animations,currentStep, steps)
    }

}
export default Animator