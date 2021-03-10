import AbstractNetworkAlgorithm from "../AbstractNetworkAlgorithm";

class AbstractEdgeColoringAlgorithm extends AbstractNetworkAlgorithm{
    /**
     * In edge coloring algorithms we store the a copy of the deges as they are being colored
     * @param network the network we want to change
     * @param animations
     * @param currentStep
     * @param actualSteps
     */
    applyAnimation(network, animations, currentStep, actualSteps) {
        network.edges = animations[currentStep + actualSteps]
    }

}

export default AbstractEdgeColoringAlgorithm;