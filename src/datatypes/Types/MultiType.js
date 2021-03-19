import AbstractType from "./AbstractType";

/**
 * Multi type describes networks who have non-unique node to node connections,
 * and nodes can connect to themselves
 */
class MultiType extends AbstractType{
    constructor(){
        super("Multi", true)
    }
}

export default MultiType