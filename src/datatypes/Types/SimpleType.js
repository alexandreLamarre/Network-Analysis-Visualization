import AbstractType, {MAX_E, MAX_V, MIN_E, MIN_V} from "./AbstractType"
import Edge from "../Edge";

/**
 * Simple type describes a simple graph/network : unique (up to direction, if applicable) node to node connections,
 * and no self connected nodes
 */
class SimpleType extends AbstractType {
    constructor() {
        super("Simple")
    }

    /**
     * Creates the unasigned edges for a simple network (1-1 node connections)
     * @param numE the number of edges
     * @param numV the number of vertices
     * @returns {edges}
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
     * calculates the max degree in a simple network
     * @param numV number of vertices in the network
     * @returns {Number} max degree
     */
    calculateMaxDegree(numV) {
        return numV - 1;
    }

    /**
     * Get max bound on vertices and edges for simple networks.
     * Check
     * @param numV number of vertices
     * @param numE number of edges
     * @param property property to check the bounds against
     * @returns {[Number, Number]} max vertices, max edges
     */
    getMaxBound(numV, numE, property) {
        return property.getMaxBound(numV, numE, MAX_V, MAX_E)

    }

    /**
     * Get min bound on vertices and edges for simple networks
     * @param numV number of vertices in the network
     * @param numE number of edges in the network
     * @param property property to check the bounds against
     * @returns {[Number, Number]} min vertices, min edges
     */
    getMinBound(numV, numE, property) {
        return property.getMinBound(numV, numE, MIN_V, MIN_E);
    }
}


export default SimpleType