import AbstractNetworkAlgorithm from "../AbstractNetworkAlgorithm";

class AbstractMinimumSpanningTreeAlgorithm extends AbstractNetworkAlgorithm{
    constructor(name){
        super(name)
        this.setRequiredProperty("Connected")
    }
    /**
     * In minimum spanning trees we color both the vertices and edges
     * @param network the network we want to change
     * @param animations
     * @param currentStep
     * @param actualSteps
     */
    applyAnimation(network, animations, currentStep, actualSteps) {
        network.vertices = animations[currentStep + actualSteps].vertices;
        network.edges = animations[currentStep + actualSteps].edges;
    }

}

export default AbstractMinimumSpanningTreeAlgorithm