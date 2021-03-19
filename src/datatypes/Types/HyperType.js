import AbstractType from "./AbstractType";

/**
 * Hyper type describes networks who have node to multiple node connections
 */
class HyperType extends AbstractType{
    constructor(){
        super("Hyper", true)
    }
}

export default HyperType