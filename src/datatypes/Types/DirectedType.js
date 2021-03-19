import AbstractType from "./AbstractType";

/**
 * Directed type describes networks/graphs whose have edges have directions
 */
class DirectedType extends AbstractType{
    constructor(){
        super("Directed", false)
    }
}

export default DirectedType