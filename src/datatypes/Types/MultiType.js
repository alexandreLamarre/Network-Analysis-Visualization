import AbstractType from "./AbstractType";
import Edge from "../Edge";

/**
 * Multi type describes networks who have non-unique node to node connections,
 * and nodes can connect to themselves
 */
class MultiType extends AbstractType{
    constructor(){
        super("Multi")
    }

    /**
     * Creates the unassigned edges in multi type networks.
     * @param numE number of edges in the network
     * @param numV number of vertices in the network
     * @returns {[]} array of unassigned edges
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
        return edges;
    }

    /**
     * Calculates the max degree of a Multi type network.
     * While there is technically no maxDegree we use max degree to be
     * the maximum possible amount of same connections between two nodes, i.e.
     * v1 and v2 can have at most max Degree edges between them.
     * @param numV number of vertices in the network
     * @returns{Number} Maximum number of connections between the same nodes.
     */
    calculateMaxDegree(numV) {
        let count = 0;
        while(numV > 10){
            numV = numV % 10;
            count += 1;
        }
        return Math.max(10, 10 ** (count-3));

    }

    getMaxBound(numV, numE, property) {
        super.getMaxBound(numV, numE, property);
    }

    getMinBound(numV, numE, property) {
        super.getMinBound(numV, numE, property);
    }
}

export default MultiType