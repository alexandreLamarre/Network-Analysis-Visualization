import AbstractType from "./AbstractType";

/**
 * Pseudo type describes networks/graphs who have unique (up to direction, if applicable) node to node connections
 * but nodes can connect to themselves
 */
class PseudoType extends AbstractType{
    constructor(){
        super("Pseudo", true)
    }
}

export default PseudoType