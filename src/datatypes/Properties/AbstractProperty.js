/**
 * Defines a network property object, e.g. defines 'connected','cycle', 'bipartite', etc... for network types
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
    checkProperties(network){
        throw new Error("Cannot check if an abstract property is satisfied " +
            "- must implement checkProperties method in child class ")
    }

    /**
     * creates a random network of the given type
     * in the form of an array of vertices and an array of edges that satisfy this property
     * @param type
     * @returns {vertices[], edges[]}
     */
    createRandomNetwork(type){
        throw new Error("Cannot create a random network from an abstract property" +
        "- must implement createRandomNetwork method in child class")
    }

    /**
     * Applies some rule based on network type - helper method for create random network.
     * @param type the type of the network
     */
    rule(type){
        throw new Error("Cannot apply rule to an abstract property - optional method for createRandomNetwork method")
    }


}