import Vertex from "../Vertex";

export const MAX_V = 200;
export const MIN_V = 4;
export const MAX_E = 600;
export const MIN_E = 3;

/**
 * Abstract types specifies the main type the network should take.
 * e.g, main types: simple, pseudo, multi, hyper, quantum
 * composite subtypes : directed, weighted, labeled
 *
 * @property name the name of the type, this is displayed in the html
 * @property edgesubtypes the array of network subtypes that
 * should be applied to the edges of the network
 * @property vertexsubtypes the array of edge subtypes that
 * should be applied to the vertices of the network
 * @property property the network property to be applied to the network
 */
class AbstractType{
    /**
     *
     * @param name the string that represents the name of the network
     */
    constructor(name) {
        this.name = name;
        this.edgesubtypes = new Set();
        this.vertexsubtypes = new Set();
    }

    /**
     * Creates a randomized network based on type and associated properties
     * @param numV the number of vertices to create
     * @param numE the number of edges to create
     * @param is3D whether or not the network is 3D
     * @param property, the active property of the network
     * @returns {[vertices,edges]}
     */
    createRandomNetwork(numV, numE, is3D, property){
        if(!property.supports(this.name)) throw new Error("Property ", property.name, "does not support " +
                                                         "the current type " , this.name);
        const vertices = []
        for(let i = 0; i < numV; i++){
            let params = this.getVertexParams()
            if (is3D){vertices.push(new Vertex(Math.random(), Math.random(), Math.random()), params);}
            else{vertices.push(new Vertex(Math.random(), Math.random()), 0, params);}
        }

        let typeParams = {}
        typeParams.type = this.name
        typeParams.edgesubtypes = this.edgesubtypes
        const unassignedEdges = this.createEdges(numE, numV)
        let maxDegree = this.calculateMaxDegree(numV);
        const edges = property.assignEdges(vertices, unassignedEdges, typeParams, maxDegree)
        return [vertices, edges]
    }

    /**
     * Creates edges based on subtypes and current type
     * @param numE number of edges to create
     * @param numV number of vertices already in network
     */
    createEdges(numE, numV){
        throw new Error("An abstract network type cannot create its edges -" +
            "Must implement create edges method in child class")
    }

    /**
     * Returns the maximum bound of vertices and edges in the network
     * @param numV current number of vertices
     * @param numE current number of edges
     * @param property active property object of the network
     */
    getMaxBound(numV, numE, property){
        throw new Error("Cannot get max edge bounds of an abstract type -" +
            "Must implement getMaxEdgeBound method in child class ")
    }

    /**
     * Returns the minimum bound of vertices and edges in the network
     * @param numV current number of vertices
     * @param numE current number of edges
     * @param property active property object of the network
     */
    getMinBound(numV, numE, property){
        throw new Error("Cannot get min edge bounds of an abstract type -" +
            "Must implement getMinEdgeBound method in child class ")
    }

    /**
     * Calculates the upper bound on vertex degree in the network
     * @param numV number of vertices in the network
     */
    calculateMaxDegree(numV){
        throw new Error("Cannot calculate max degree in an abstract type -" +
            "must implement calculate Max Degree in child types")
    }

    /**
     * Sets the edge subtypes of a network type
     * @param subtype subtype to toggle on/off
     */
    toggleEdgeSubTypes(subtype){
        if(this.edgesubtypes.has(subtype)){
            this.edgesubtypes.delete(subtype);
        } else {
            this.edgesubtypes.add(subtype);
        }
    }

    /**
     * Sets the vertex subtypes of a network type
     * @param subtype subtype to toggle on/off
     */
    toggleVertexSubTypes(subtype){
        if(this.vertexsubtypes.has(subtype)){
            this.vertexsubtypes.delete(subtype)
        } else{
            this.vertexsubtypes.add(subtype)
        }
    }

    /**
     * Gets the extra vertex parameters from this type's vertex subtypes
     * @returns {params}
     */
    getVertexParams(){
        let params = {}
        this.vertexsubtypes.forEach((sub) => {
            sub.set(params);
        })
        return params;
    }

    /**
     * Gets the extra edge parameters from this types's edge subtypes
     * @returns {params}
     */
    getEdgeParams(){
        let params = {}
        this.edgesubtypes.forEach((sub) => {
            sub.set(params);
        });
        return params;
    }
}

export default AbstractType;