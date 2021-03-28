import Vertex from "../Vertex";
import Edge from "../Edge";
import GeneralProperty from "../Properties/GeneralProperty";

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
        this.property = "General"
    }

    /**
     * Creates a randomized network based on type and associated properties
     * @param numV the number of vertices to create
     * @param numE the number of edges to create
     * @param is3D whether or not the network is 3D
     * @returns {[vertices,edges]}
     */
    createRandomNetwork(numV, numE, is3D){
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
        let maxDegree; //TODO: calculate this based on network type
        const edges = this.property.assignEdges(vertices, unassignedEdges, typeParams)
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
     * @param updateType last updated type: 'vertex' or 'edge'
     */
    getMaxBound(numV, numE, updateType){
        throw new Error("Cannot get max edge bounds of an abstract type -" +
            "Must implement getMaxEdgeBound method in child class ")
    }

    /**
     * Returns the minimum bound of vertices and edges in the network
     * @param numV current number of vertices
     * @param numE current number of edges
     * @param updateType last updated type: 'vertex' or 'edge'
     */
    getMinBound(numV, numE, updateType){
        throw new Error("Cannot get min edge bounds of an abstract type -" +
            "Must implement getMinEdgeBound method in child class ")
    }

    /**
     * Sets the property of a network type
     * @param property the property object to set
     */
    setProperty(property){
        this.property = property
        if(this.property === undefined || !this.property) this.property = new GeneralProperty();
    }

    /**
     * Sets the edge subtypes of a network type
     * @param subtypes the subtypes to set the edgesubtypes to
     */
    setEdgeSubTypes(subtypes){
        this.edgesubtypes = subtypes;
        if (this.edgesubtypes === undefined || (!this.edgesubtypes)) this.edgesubtypes = [];
    }

    /**
     * Sets the vertex subtypes of a network type
     * @param subtypes the subtypes to set the vertexsubtypes to
     */
    setVertexSubTypes(subtypes){
        this.vertexsubtypes = subtypes
        if(this.vertexsubtypes === undefined || (!this.vertexsubtypes)) this.vertexsubtypes = [];
    }

    /**
     * Gets the extra vertex parameters from this type's vertex subtypes
     * @returns {params}
     */
    getVertexParams(){
        let params = {}
        for(const sub in this.vertexsubtypes){
            sub.set(params)
        }
        return params
    }

    /**
     * Gets the extra edge parameters from this types's edge subtypes
     * @returns {params}
     */
    getEdgeParams(){
        let params = {}
        for(const sub in this.edgesubtypes){
            sub.set(params)
        }
        return params
    }
}

export default AbstractType;