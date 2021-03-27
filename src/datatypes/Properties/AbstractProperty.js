/**
 * Defines a network property object, e.g. defines
 * 'connected','cycle', 'bipartite', etc... for network types
 */
class AbstractProperty{
    constructor(name){
        this.name = name
        this.dependencies = new Set();
        this.supportedTypes = new Set();
    }

    /**
     * Checks if a property supports a network type
     * @param type name string of the type to check
     */
    supports(type){
        return this.supportedTypes.has(type)
    }

    /**
     * Adds supported types
     * @param types array of name strings of network types
     */
    addSupportedTypes(types){
        for(let i = 0; i < types.length; i++){
            this.supportedTypes.add(types[i]);
        }
    }

    /**
     * Adds dependant properties: for example cycle => connected
     * @param deps
     */
    addDependencies(deps){
        for(let i = 0; i < deps.length; i++){
            this.dependencies.add(deps[i]);
        }
    }

    /**
     * Gets the max bounds on vertices and edges based on network property
     */
    getMaxBound(numV, numE, updateType, maxV, maxE){
        throw new Error("Cannot get max bound for an abstract property")
    }

    /**
     * Gets the min bounds on vertices and edges based on network property
     */
    getMinBound(numV, numE, updateType, minV, minE){
        throw new Error("Cannot get max bound for an abstract property")
    }

    /**
     * Returns an array of dependant property names
     * @returns{set}
     */
    getDependantProperties(){
        return this.dependencies;
    }

    /**
     * Checks if the network satisfies this property
     * @param network
     */
    check(network){
        throw new Error("Cannot check if an abstract property is satisfied " +
            "- must implement check method in child class ")
    }

    /**
     * creates a random network of the given type
     * in the form of an array of vertices and an array of edges that satisfy this property
     * @param vertices vertices in the network
     * @param unassignedEdges unnasigned edges to be assigned
     * @param params {maxDegree, directed, multi, pseudo, hyper}
     * @returns {vertices[], edges[]}
     */
    assignEdges(vertices, unassignedEdges, params){
        throw new Error("Cannot assign edges of a random network from an abstract property" +
        "- must implement assignEdges method in child class")
    }
}

export default AbstractProperty;