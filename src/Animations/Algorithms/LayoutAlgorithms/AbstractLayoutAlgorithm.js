import AbstractNetworkAlgorithm from "../AbstractNetworkAlgorithm";

class AbstractLayoutAlgorithm extends AbstractNetworkAlgorithm{
    /**
     * In layout algorithms we store the new vertices at each iteration of the algorithm
     * @param vertices
     * @param edges
     * @param animations
     * @param currentStep
     * @param actualSteps
     */
    applyAnimation(vertices, edges, animations, currentStep, actualSteps) {
        vertices = animations[currentStep + actualSteps]
    }

}

export default AbstractLayoutAlgorithm;