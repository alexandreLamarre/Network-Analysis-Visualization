import AbstractProperty from "./AbstractProperty";

class ConnectedProperty extends AbstractProperty{
    constructor(){
        super("Connected");
        const supported =
            ["Simple"];
        this.addSupportedTypes(supported);
    }

    check(network) {
        super.check(network);
    }

    assignEdges(vertices, unassignedEdges, params) {
        super.assignEdges(vertices, unassignedEdges, params);
    }

    getMaxBound(numV, numE, maxV, maxE) {
        super.getMaxBound(numV, numE, maxV, maxE);
    }

    getMinBound(numV, numE, minV, minE) {
        super.getMinBound(numV, numE, minV, minE);
    }
}

export default ConnectedProperty;