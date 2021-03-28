import AbstractType from "./AbstractType";

/**
 * Pseudo type describes networks/graphs who have unique (up to direction, if applicable) node to node connections
 * but nodes can connect to themselves
 */
class PseudoType extends AbstractType{
    constructor(){
        super("Pseudo")
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

export default PseudoType