import AbstractType from "./AbstractType";

/**
 * Weighted type describes a network whose edges have associated weights
 */
class WeightedType extends AbstractType{
    constructor(){
        super("Weighted", false)
    }
}

export default WeightedType