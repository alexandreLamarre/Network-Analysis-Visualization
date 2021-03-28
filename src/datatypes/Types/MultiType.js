import AbstractType from "./AbstractType";

/**
 * Multi type describes networks who have non-unique node to node connections,
 * and nodes can connect to themselves
 */
class MultiType extends AbstractType{
    constructor(){
        super("Multi")
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

export default MultiType