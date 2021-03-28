import AbstractType from "./AbstractType"
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

    getMaxBound(numV, numE, updateType) {
        let [maxV, maxE] = this.property.getMaxBound(numV, numE, updateType, maxV, maxE)
        return [maxV, maxE]
    }

    getMinBound(numV, numE, updateType) {
        let [minV, minE] =  this.property.getMinBound(numV, numE, updateType, minV, minE);
        return [minV, minE]
    }
}


export default SimpleType