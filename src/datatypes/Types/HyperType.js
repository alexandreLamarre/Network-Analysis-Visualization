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

    getMaxBound(numV, numE, updateType) {
        super.getMaxBound(numV, numE, updateType);
    }

    getMinBound(numV, numE, updateType) {
        super.getMinBound(numV, numE, updateType);
    }
}

export default HyperType