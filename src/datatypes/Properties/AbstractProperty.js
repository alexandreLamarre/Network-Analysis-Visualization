/**
 * Defines a network property object, e.g. defines
 * 'connected','cycle', 'bipartite', etc... for network types
 */
class AbstractProperty{
    constructor(name){
        this.name = name
        this.dependencies = [];
    }

    /**
     * Returns an array of dependant property names
     * @returns{names[]}
     */
    getDependantProperties(){
        throw new Error("Cannot get dependant properties of an abstract property - " +
            "must implement getDependantProperties method in child class")
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
     * @param type
     * @returns {vertices[], edges[]}
     */
    assignEdges(type){
        throw new Error("Cannot assign edges of a random network from an abstract property" +
        "- must implement assignEdges method in child class")
    }
}

export default AbstractProperty;