import AlgorithmSettings from "./AlgorithmSettings"
import NetworkSettings from "../../Components/Network/NetworkSettings";

/**
 * Abstract Super Class that dictates what methods each Network Algorithm Should have
 * **/
class AbstractNetworkAlgorithm{
    constructor(name) {
        this.name = name
        this.settings = new AlgorithmSettings(name)
        this.requiredProperty = null
    }
    /** getAnimations should run the algorithm and get the animations**/
    async getAnimations (){
        throw new Error("Cannot fetch animation of an Abstract algorithm")
    }

    /**
     * nextAnimationStep should take the input set of vertices and return the update vertices and edges
     * @param network the network to transform
     * @param animations object containing the animations information
     * @param currentStep the current step we are at in the animation (0-indexed)
     * @param steps the number of steps to apply : > 0 means forward steps, < 0 means backwards steps
     */
    nextAnimationSteps(network, animations, currentStep, steps) {
        if (animations.length === 0) {
            console.warn("No animations found");
            return;
        }
        const actualSteps = this.trimSteps(animations, currentStep, steps)
        this.applyAnimation(network, animations, currentStep, actualSteps)
        return actualSteps
    }

    /**
     *
     * @param network
     * @param animations
     * @param currentStep
     * @param actualSteps
     */
    applyAnimation(network, animations, currentStep, actualSteps){
        throw new Error("Cannot apply an animation on an abstract algorithm")
    }

    /** getSettings should get the settings attribute of the algorithm**/
    getSettings(){
        throw new Error("Cannot get settings of an Abstract algorithm ")
    }

    /**
     * sets the settings attribute of the algorithm
     * @param settings the settings to be set
     */
    setSettings(settings){
        this.settings = settings
    }

    /**
     * Some algorithms required specific network properties, and this sets such a required property.
     * Checks that it is a valid network property by iterating over settings.
     * @param property the required property of the algorithm
     */
    setRequiredProperty(property){
        if(property === null) {this.requiredProperty = null; return;}
        const properties = new NetworkSettings().properties
        for(const key in properties){
            if(key === property){
                this.requiredProperty = property
                return
            }
        }
        throw new Error("Set required property to Algorithm that does not exist in Network Settings")
    }
    /** getHTMLSettings returns the HTML that represent the settings**/
    getHTMLSettings(){
        throw new Error("Can't initiate HTML settings of an Abstract algorithm")
    }

    /**
     *
     * @param animations
     * @param currentStep
     * @param steps
     * @returns {Number} the amount of appropriate steps to actually apply
     */
    trimSteps(animations, currentStep, steps){
        const n = animations.length - 1

        if(currentStep === n && steps > 0) return 0 //already at animation end, perform 0 steps
        if(currentStep === 0 && steps < 0) return 0 //already at animation start, perform 0 steps

        var nextSteps = currentStep + steps
        if (nextSteps > n) return n - currentStep //steps will exceed the animation length
        if (nextSteps < 0) return -currentStep // steps will exceed minimum animation index
        return steps
    }

    /**
     * Creates a Network's adjacency matrix from its vertices and edges
     * @param v vertices
     * @param e edges
     * @returns {Number[][]} the adjacency matrix of the network
     */
    createAdjacencyMatrix(v, e){
        const adj = [];
        for(let i = 0; i < v.length; i++){
            const adj_row = [];
            for(let j = 0; j < v.length; j++){
                adj_row.push(0);
            }
            adj.push(adj_row);
        }

        for(let i = 0; i < e.length; i ++){
            adj[e[i].start][e[i].end] = 1;
            adj[e[i].end][e[i].start] = 1;
        }
        return adj;
    }
}

export default AbstractNetworkAlgorithm