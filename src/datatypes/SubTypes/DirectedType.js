import AbstractSubType from "./AbstractSubType";

class DirectedType extends AbstractSubType{
    constructor(){
        super("Directed")
    }

    /**
     * Takes in an input set of params and sets them to indicate they should be directed
     * @param params set of extra parameters for an edge
     */
    set(params){
        params.directed = true
        return params
    }
}

export default DirectedType;