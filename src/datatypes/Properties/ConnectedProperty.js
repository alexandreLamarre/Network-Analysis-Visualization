import AbstractProperty from "./AbstractProperty";

class ConnectedProperty extends AbstractProperty{
    constructor(){
        super("Connected");
        const supported = ["Simple", "Pseudo", "Multi", "Hyper", "Directed", "Weighted"];
        this.addSupportedTypes(supported);
    }

    check(network) {
        super.check(network);
    }

    assignEdges(vertices, unassignedEdges, params) {
        super.assignEdges(vertices, unassignedEdges, params);
    }

    getMaxBound(numV, numE, updateType, maxV, maxE) {
        super.getMaxBound(numV, numE, updateType, maxV, maxE);
    }

    getMinBound(numV, numE, updateType, minV, minE) {
        super.getMinBound(numV, numE, updateType, minV, minE);
    }
}

export default ConnectedProperty;