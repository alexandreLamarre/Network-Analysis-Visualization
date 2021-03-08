import AbstractNetworkAlgorithm from "../AbstractNetworkAlgorithm";

class AbstractTSPAlgorithm extends AbstractNetworkAlgorithm{
    constructor(name){
        super(name)
        this.setRequiredProperty("Cycle")
    }
    /**
     * In TSP algorithms we want
     * to assign entirely new edges to the network
     * @param network the network we want to change
     * @param animations
     * @param currentStep
     * @param actualSteps
     */
    applyAnimation(network, animations, currentStep, actualSteps) {
        network.edges = animations[currentStep + actualSteps]
    }

}

export default AbstractTSPAlgorithm;