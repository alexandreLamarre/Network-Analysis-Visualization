import AbstractProperty from "./AbstractProperty";
import {MAX_E, MAX_V, MIN_E, MIN_V} from "../Types/AbstractType";

/**
 * General property, a property whose topology only depends on
 * the topology of the network type.
 */
class GeneralProperty extends AbstractProperty{
    constructor(){
        super("General");
        const supported = [
            "Simple", "Pseudo", "Multi",
            "Hyper", "Directed", "Weighted",
            "Labelled"
        ];
        this.addSupportedTypes(supported);
    }

    /**
     * Checks if a network is a general type. (It is always a general type)
     * @param network the network to check
     * @returns {boolean}
     */
    check(network) {
        return true
    }

    /**
     * Assigns the edges of a network according to only their type.
     * @param vertices
     * @param unassignedEdges
     * @param typeParams {type, subtypes} type is the string name of the network type,
     * subtypes is the set of currently applied subtypes.
     * @param maxDegree
     */
    assignEdges(vertices, unassignedEdges, typeParams, maxDegree) {
        if(!this.supportedTypes.has(typeParams.type)){
            throw new Error("Property ", this.name, + " does not support the type " + typeParams.type + " provided")
        }
        const edges = []
        const degrees = []
        const indices = [];
        vertices.forEach((_, index) => {
            indices.push(index);
            degrees.push(0);
        });
        let already_connected = new Map(); //manage already connected
        let curLen = indices.length;
        let index1; let index2; const otherConnections = [];
        while(unassignedEdges.length > 0){
            let curEdge = unassignedEdges.pop();


            if (typeParams.type === "Simple") [index1, index2, curLen] = fastConnectSimple(indices, degrees,
                                                                            curLen, already_connected, typeParams, maxDegree)
            else if (typeParams.type === "Pseudo") [index1, index2, curLen] = fastConnectPseudo(indices, degrees,
                                                                            curLen, already_connected, typeParams, maxDegree)
            else if (typeParams.type === "Multi") [index1, index2, curLen] = fastConnectMulti(indices, degrees,
                                                                            curLen, already_connected, typeParams, maxDegree)
            else if(typeParams.type === "Hyper") [index1, index2, curLen] = fastConnectHyper(indices, degrees,
                                                                            curLen,already_connected, typeParams, maxDegree);
            curEdge.start = index1;
            curEdge.end = index2;
            curEdge.otherConnections = otherConnections;
            edges.push(curEdge);
        }
        return edges
    }

    /**
     * Returns the max bound for the vertices and edges of the network.
     * In the case of general property, it is the max bound of the network type,
     * bounded by the max network constants
     *
     * @param numV number of vertices in the network
     * @param numE number of edges in the network
     * @param updateType last type updated: 'vertex' or 'edge'
     * @param maxV maximum vertices based on network property
     * @param maxE maximum edges based on network property
     * @returns {[Number, Number]} [maximum vertices, maximum edges]
     */
    getMaxBound(numV, numE, maxV, maxE) {
        return [Math.min(maxV, MAX_V), Math.min(maxE, MAX_E)]
    }

    /**
     * Returns the min bound for the vertices and edges of the network.
     * In the case of general property, it is the min bound of the network type
     * bounded by the min network constants
     *
     * @param numV number of vertices in the network
     * @param numE number of edges in the network
     * @param minV minimum vertices based on network property
     * @param minE minimum edges based on network property
     * @returns {[minV, minE]}
     */
    getMinBound(numV, numE, minV, minE) {
        return [Math.max(minV, MIN_V), Math.max(minE, MIN_E)]
    }
}

export default GeneralProperty;

/**
 * Connects two vertices based on simple network type.
 * @param indices arr of indices, arr[0:curLen] is the arr of available vertices
 * @param degrees array of degrees, to keep track of possible maxDegree violations
 * @param curLen the current length of the indices subarray that represents available vertices
 * @param typeParams{type, subtypes} the params of the network
 * @param alreadyConnected hash map of already connected vertices
 * @param maxDegree maximum degree of a vertex in the given network type
 */
function fastConnectSimple(indices, degrees, curLen, alreadyConnected, typeParams, maxDegree){
    if(curLen <= 0) throw new Error("expected connection curLen to be greater than 0");

    const tempIndex = Math.floor(Math.random()*curLen)
    const index1 = indices[tempIndex];
    degrees[index1] += 1;
    if(degrees[index1] > maxDegree) throw new Error("maximum network degree exceeded while assigning edges to index1");
    if(degrees[index1] === maxDegree) curLen = remove(indices, tempIndex, curLen)

    const tempIndex2 = Math.floor(Math.random()*curLen);
    let index2 = indices[tempIndex2];
    let reassigned = false//keeps track of whether or not we need to do a O(n) operation to find the index location

    // We delay the 'redundant' vertex logic so that instead of applying it for each vertex, we only apply it for vertices
    // that violate the rules for connections => for large sparse networks (more common) then
    // the average runtime is O(n) instead of O(n^2)
    if(index1 === index2){
        index2 = assignNonRedundantVertexSimple(indices, index1, curLen, alreadyConnected,typeParams);
        reassigned = true;
    } else if(typeParams.subtypes.has("Directed") && alreadyConnected[[index1,index2]]){
        index2 = assignNonRedundantVertexSimple(indices, index1, curLen, alreadyConnected,typeParams);
        reassigned = true;
    } else if(alreadyConnected[[index1, index2]] || alreadyConnected[[index1,index2]]){
        index2 = assignNonRedundantVertexSimple(indices, index1, curLen, alreadyConnected,typeParams);
        reassigned = true;
    }
    if(degrees[index2] > maxDegree) throw new Error("maximum network degree exceeded while assigning edges to index2");

    if(!reassigned){
        if(degrees[index2] === maxDegree) curLen = remove(indices, tempIndex2, curLen);
    } else{
        //only use O(n) operation if we have to
        const index = indices.indexOf(index2);
        if(degrees[index2] === maxDegree) curLen = remove(indices, index, curLen);
    }
    return [index1, index2, curLen];
}

/**
 * Connects two vertices based on simple network type.
 * @param indices arr of indices, arr[0:curLen] is the arr of available vertices
 * @param degrees array of degrees, to keep track of possible maxDegree violations
 * @param curLen the current length of the indices subarray that represents available vertices
 * @param typeParams{type, subtypes} the params of the network
 * @param maxDegree maximum degree of a vertex in the given network type
 */
function fastConnectPseudo(indices, degrees, curLen, typeParams, maxDegree){
    if(curLen <= 0) return null;
}

/**
 * Connects two vertices based on simple network type.
 * @param indices arr of indices, arr[0:curLen] is the arr of available vertices
 * @param degrees array of degrees, to keep track of possible maxDegree violations
 * @param curLen the current length of the indices subarray that represents available vertices
 * @param typeParams{type, subtypes} the params of the network
 * @param maxDegree maximum degree of a vertex in the given network type
 */
function fastConnectMulti(indices, degrees, curLen, typeParams, maxDegree){
    if(curLen <= 0) return null;
}

/**
 * Connects two vertices based on simple network type.
 * @param indices arr of indices, arr[0:curLen] is the arr of available vertices
 * @param degrees array of degrees, to keep track of possible maxDegree violations
 * @param curLen the current length of the indices subarray that represents available vertices
 * @param typeParams{type, subtypes} the params of the network
 * @param maxDegree maximum degree of a vertex in the given network type
 */
function fastConnectHyper(indices, degrees, curLen, typeParams, maxDegree){
    if(curLen <= 0) return null;
}

/**
 * Helper to 'remove' in place the element at index
 * @param arr array to remove from
 * @param index index of element to remove
 * @param len length of the array to consider
 * @returns the update length
 */
function remove(arr, index, len){
    arr[index] = arr[len-1];
    return len -1;
}

/**
 * Helper to Assign non redundant vertex in simple network
 * @param indices array of indices
 * @param index1 index already selected
 * @param curLen length of the subarray that contains available vertices
 * @param alreadyConnected hash map of already connected vertices
 * @param typeParams{types, subtypes} additional parameters of the network type;
 * @returns {*}
 */
function assignNonRedundantVertexSimple(indices, index1, curLen, alreadyConnected, typeParams){
    const available = indices.filter((x, len) => {
        let connected;
        if(typeParams.subtypes.has("Directed")){
            connected = alreadyConnected[[index1, x]]
        } else{
            connected = alreadyConnected[[index1,x]] || alreadyConnected[[x, index1]]
        }
        return len < curLen && !connected && x !== index1
    });
    if(available.length === 0) throw new Error("Could not find any available vertices");
    const tempAvailableIndex = Math.floor(Math.random())*available.length();
    return available[tempAvailableIndex];
}