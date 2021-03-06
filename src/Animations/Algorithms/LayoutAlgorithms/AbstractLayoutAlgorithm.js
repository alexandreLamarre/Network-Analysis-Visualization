import AbstractNetworkAlgorithm from "../AbstractNetworkAlgorithm";

class AbstractLayoutAlgorithm extends AbstractNetworkAlgorithm{
    /**
     * In layout algorithms we store the new vertices at each iteration of the algorithm
     * @param network the network we want to change
     * @param animations
     * @param currentStep
     * @param actualSteps
     */
    applyAnimation(network, animations, currentStep, actualSteps) {
        network.vertices = animations[currentStep + actualSteps]
    }

}

export default AbstractLayoutAlgorithm;