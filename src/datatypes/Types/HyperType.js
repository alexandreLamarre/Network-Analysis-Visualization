import AbstractType from "./AbstractType";

/**
 * Hyper type describes networks who have node to multiple node connections
 */
class HyperType extends AbstractType{
    constructor(){
        super("Hyper")
    }

    createEdges(numE, numV){
        throw new Error("An abstract network type cannot create its edges -" +
            "Must implement create edges method in child class")
    }

    /**
     * Hyper Graph max degree isn't necessarily useful, so we'll use
     * Infinity to bypass any edge assignment restrictions
     * @param numV number of vertices in the network
     * @returns {Number}
     */
    calculateMaxDegree(numV) {
        return Infinity;
    }

    getMaxBound(numV, numE, property) {
        super.getMaxBound(numV, numE, property);
    }

    getMinBound(numV, numE, property) {
        super.getMinBound(numV, numE, property);
    }
}

export default HyperType