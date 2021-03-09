import * as ALGORITHMS from "./Algorithms"
import AlgorithmList from "../Components/Settings/AlgorithmList";
import AlgorithmSettings from "../Components/Settings/AlgorithmSettings";
import React from "react";

class Animator{
    constructor(){

        this.algorithms = [];
        for(const key in ALGORITHMS){
            for (const algo in ALGORITHMS[key]){
                this.algorithms.push(new ALGORITHMS[key][algo]())

            }
        }
        if(this.algorithms.length === 0) throw new Error("No algorithms were imported by the Animator object")
        console.log("LOADED ALGORITHMS", this.algorithms)
        this.activeAlgorithm = this.algorithms[0]
    }


    algorithmsToHTML(){
        return <AlgorithmList algorithms = {this.algorithms} animator = {this}/>
    }

    algorithmSettingsToHTML(ref){
        return <AlgorithmSettings ref = {ref} algorithms = {this.algorithms} />
    }

    async getAnimations(vertices, edges, is3D){
        const a = await this.activeAlgorithm.getAnimations(vertices, edges, is3D)
        return a
    }

    /**
     * Performs the specified amount of animation steps
     * @param animations
     * @param network
     * @param currentStep
     * @param steps
     */
    nextAnimationSteps(network, animations, currentStep, steps) {
        if(this.animations === []) {
            console.warn("No animations were loaded")
            return;
        }
        network.shouldUpdate = true
        return this.activeAlgorithm.nextAnimationSteps(network, animations,currentStep, steps)
    }

}
export default Animator