import AbstractType from "./AbstractType"

/**
 * Simple type describes a simple graph/network : unique (up to direction, if applicable) node to node connections,
 * and no self connected nodes
 */
class SimpleType extends AbstractType {
    constructor() {
        super("Simple", true)
    }
}


export default SimpleType