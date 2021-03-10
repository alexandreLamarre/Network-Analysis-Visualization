import AbstractNetworkAlgorithm from "../AbstractNetworkAlgorithm";

class AbstractVertexColoringAlgorithm extends AbstractNetworkAlgorithm{
    constructor(name){
        super(name)
        this.setRequiredProperty(null)
    }
    /**
     * In Vertex coloring algorithms we want
     * to assign new vertex colors to the network
     * @param network the network we want to change
     * @param animations
     * @param currentStep
     * @param actualSteps
     */
    applyAnimation(network, animations, currentStep, actualSteps) {
        network.vertices = animations[currentStep + actualSteps]
    }

}

export default AbstractVertexColoringAlgorithm;