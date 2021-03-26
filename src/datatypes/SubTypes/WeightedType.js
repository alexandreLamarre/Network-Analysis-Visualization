import AbstractSubType from "./AbstractSubType";

class WeightedType extends AbstractSubType{
    constructor(){
        super("Weighted")
    }

    /**
     * Takes in an input set of params and sets them to indicate they should be weighted.
     * @param params set of extra parameters for an edge
     * @returns {params}
     */
    set(params){
        params.weight = Math.random()
        return params
    }
}

export default WeightedType;