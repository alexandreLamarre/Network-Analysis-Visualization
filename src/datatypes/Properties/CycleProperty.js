import AbstractProperty from "./AbstractProperty";
import {MAX_V, MAX_E, MIN_V, MIN_E} from "../Types/AbstractType";


class CycleProperty extends AbstractProperty{
    constructor(){
        super("Cycle");
        const supported = ["Simple", "Pseudo", "Multi", "Hyper", "Directed", "Weighted"];
        this.addSupportedTypes(supported);
        const dependencies = ["Connected"];
        this.addDependencies(dependencies);
    }

    check(network) {
        if(network.settings.activeProperty === "Cycle") return true
        if(network.vertices.length !== network.edges.length) return false;
        //initial sweep over vertices.
        for(let e = 1; e < network.edges.length; e ++){
            if(network.edges[e-1].end !== network.edges[e].start) return false
        }

        return network.edges[0].start === network.edges[network.edges.length - 1].end;
    }

    /**
     * Assigns edges so that the network type forms a cycle.
     * @param vertices
     * @param unassignedEdges
     * @returns {[]}
     */
    assignEdges(vertices, unassignedEdges, params) {
        const edges = []
        const unvisited = []
        vertices.forEach((v, index) => unvisited.push(index));
        let curLen = unvisited.length;
        let root;  let next;
        [root, curLen] = fastPickRandomIndex(unvisited, curLen);
        [next, curLen] = fastPickRandomIndex(unvisited, curLen);
        const firstEdge = unassignedEdges.pop();
        firstEdge.start = root;
        firstEdge.end = next;
        edges.push(firstEdge)

        vertices[root].increment_degree();
        vertices[next].increment_degree();
        let prevEnd = next;

        while(unassignedEdges.length > 1){
            let curEdge = unassignedEdges.pop();
            curEdge.start = prevEnd;
            let next;
            [next, curLen] = fastPickRandomIndex(unvisited, curLen)
            curEdge.end = next
            edges.push(curEdge)
            vertices[next].increment_degree();
            vertices[prevEnd].increment_degree();
            prevEnd = next
        }
        const lastEdge = unassignedEdges.pop();
        lastEdge.start = prevEnd
        lastEdge.end = root
        edges.push(lastEdge);
        vertices[prevEnd].increment_degree();
        vertices[root].increment_degree();
        return edges;
    }

    /**
     * Gets the minimum bound for the network type based on the connected property.
     * @returns [maxV, maxE]
     */
    getMaxBound(numV, numE, updateType, maxV, maxE) {
        return [Math.min(maxV, MAX_V), Math.min(MAX_V, MAX_E)];
    }

    /**
     * Gets the maximum bound for the network type based on the connected property.
     * @returns {minV, minE}
     */
    getMinBound(numV, numE, updateType, minV, minE) {
        return [Math.max(MIN_E, MIN_V), Math.max(MIN_V, MIN_E)];
    }
}

export default CycleProperty;

/**
 * Picks a fast random valid index for a cycle, without popping and reordering arrays
 */
export function fastPickRandomIndex(arr, len){
    if (len <= 0) return null
    const index = Math.floor(Math.random()*len)

    const value = arr[index]
    const temp = arr[len-1];
    //swap temp and index
    arr[len-1] = arr[index]
    arr[index] = temp;
    return [value, len-1]
}