import AbstractProperty from "./AbstractProperty";
import {MAX_V, MAX_E, MIN_E, MIN_V} from "../Types/AbstractType";

class GeneralProperty extends AbstractProperty{
    constructor(){
        super("General");
        const supported = ["Simple", "Pseudo", "Multi", "Hyper", "Directed", "Weighted"];
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
     *
     * @param vertices
     * @param unassignedEdges
     * @param typeParams {type, subtypes} type is the string name of the network type,
     * subtypes is the set of currently applied subtypes.
     * @param maxDegree
     */
    assignEdges(vertices, unassignedEdges, typeParams, maxDegree) {
        if(!this.supportedTypes.has(typeParams.type)){

        }
        const edges = []
        const degrees = []
        const indices = [];
        vertices.forEach((_, index) => {
            indices.push(index)
            degrees.push(0)
        });
        let already_connected = new Map(); //manage already connected
        let curLen = indices.length;
        let index1; let index2;
        while(unassignedEdges.length > 0){
            let curEdge = unassignedEdges.pop();

            [index1, index2, curLen] = fastConnectAvaibleVertices(
                indices,curLen,degrees,already_connected,typeParams
            );

            if(!typeParams.type === "Multi"){
                already_connected.set([index1, index2], true);
                if(!typeParams.subtype.has("Directed")){
                    already_connected.set([index1, index2], true);
                }
            }

            edges.push(curEdge)
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
     * @returns {[maxV, maxE]}
     */
    getMaxBound(numV, numE, updateType, maxV, maxE) {
        return [Math.min(maxV, MAX_V), Math.min(maxE, MAX_E)]
    }

    /**
     * Returns the min bound for the vertices and edges of the network.
     * In the case of general property, it is the min bound of the network type
     * bounded by the min network constants
     *
     * @param numV number of vertices in the network
     * @param numE number of edges in the network
     * @param updateType last type updated: 'vertex' or 'edge'
     * @param minV minimum vertices based on network property
     * @param minE minimum edges based on network property
     * @returns {[minV, minE]}
     */
    getMinBound(numV, numE, updateType, minV, minE) {
        return [Math.max(minV, MIN_V), Math.max(minE, MIN_E)]
    }
}

export default GeneralProperty;

/**
 * Helper to pick a random avaible vertex
 * @param arr array of vertex indices
 * @param len the length of the vertex indices array still available for picking
 * @param degrees the degrees of the vertices in the network
 * @param alreadyConnected
 * @param typeParams {type, subtypes} the extra network type parameters
 * @param maxDegree
 */
export function fastConnectAvaibleVertices(arr, len, degrees, alreadyConnected, typeParams, maxDegree){
    if(len <= 0) return null;
    let curLen = len;
    //pick first vertex we want to connect to.
    const randomIndex = Math.floor(Math.random()*len);
    const index = arr[randomIndex];
    degrees[index] += 1;
    if(degrees[index] > maxDegree) throw new Error("Maximum degree " +
        "limit exceeded in general property assign edges");
    //swap out available vertices if the selected one achieves the maxDegree
    if(degrees[index] === maxDegree){arr[index] = arr[len-1];curLen -= 1;}

    const randomIndex2 = Math.floor(Math.random*curLen);
    let index2 = arr[randomIndex2];

    //TODO: fast connect
    if(typeParams.type === "Multi"){

    }
    else if(typeParams.type === "Pseudo"){

    }
    else if(typeParams.type === "Hyper"){

    }
    else if(typeParams.type === "UniformHyper"){

    }
    else{

    }


    return [index, index2, curLen];

}