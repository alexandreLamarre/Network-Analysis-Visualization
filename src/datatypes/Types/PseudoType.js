import AbstractType from "./AbstractType";
import Edge from "../Edge";

/**
 * Pseudo type describes networks/graphs who have unique (up to direction, if applicable) node to node connections
 * but nodes can connect to themselves
 */
class PseudoType extends AbstractType{
    constructor(){
        super("Pseudo")
    }

    /**
     * Creates the unassigned edges for a pseudo type network (1-1) self connecting connections
     * @param numE number of edges
     * @param numV number of vertices
     * @returns {[]} unassigned
     */
    createEdges(numE, numV){
        const edges = [];
        for(let i = 0; i < numE; i++){
            const params = this.getEdgeParams()
            if(params.weight !== undefined && params.weight) {
                params.weight = Math.floor(params.weight * (numV + 1))
            }
            edges.push(new Edge(-1,-1,params))
        }
        return edges
    }

    /**
     * Calculates the maximum degree a Pseudo type network
     * @param numV
     * @returns {Number} maximum degree of a vertex
     */
    calculateMaxDegree(numV) {
        return numV
    }

    getMaxBound(numV, numE, property) {
        super.getMaxBound(numV, numE, property);
    }

    getMinBound(numV, numE, property) {
        super.getMinBound(numV, numE, property);
    }
}

export default PseudoType