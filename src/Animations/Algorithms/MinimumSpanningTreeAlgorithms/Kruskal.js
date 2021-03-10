import AbstractMinimumSpanningTreeAlgorithm from "./AbstractMinimumSpanningTreeAlgorithm";
import UnionSets from "../../../datatypes/UnionSets";
import AlgorithmSettingObject from "../AlgorithmSetting";

class Kruskal extends AbstractMinimumSpanningTreeAlgorithm{
    constructor(){
        super("Kruskal MST")

        this.color = AlgorithmSettingObject.newColorSetting("Color", "#ff0000");
        this.settings.push([this.color]);
    }

    /**
     * gets the settings of the Kruskal algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    /**
     * Gets the animations for Kruskal's minimum spanning tree algorithm
     * @param vertices
     * @param edges
     * @param is3D
     * @returns {[]}
     */
    async getAnimations(vertices, edges, is3D){
        //Initial animation frame
        const animations = [];
        const firstFrame = this.createAnimationFrame(vertices, edges);
        animations.push(firstFrame);

        //set up animation variables
        let currentVertices = firstFrame.vertices
        let currentEdges = firstFrame.edges

        const color = this.color.obj.value;


        //first we need to sort the edges by increasing weight(distance)
        var sortedEdges = edges.sort(function(e1, e2){
            return distance(vertices[e1.start], vertices[e1.end], is3D) - distance(vertices[e2.start], vertices[e2.end], is3D);
        })

        const trees = [];
        const treeIndices = [];
        vertices.forEach((v, index) => {
            const u = new UnionSets();
            u.add(index);
            trees.push(u);
            treeIndices.push(index);
        });

        for(let e = 0; e < sortedEdges.length; e++){
            const u = sortedEdges[e].start;
            const v = sortedEdges[e].end;

            if(treeIndices[u] !== treeIndices[v]){
                trees[treeIndices[u]].push(trees[treeIndices[v]].contents);
                const representative = treeIndices[v];
                for(let i = 0; i < treeIndices.length; i++){
                    if(treeIndices[i] === representative){
                        treeIndices[i] = treeIndices[u];
                        trees[treeIndices[i]].contents = [];
                    }
                }

                const animationFrame = this.createAnimationFrame(currentVertices, currentEdges);
                animationFrame.vertices[u].color = color;
                animationFrame.edges[e].color = color;
                if(!is3D) animationFrame.edges[e].alpha = 0.5;
                animationFrame.vertices[v].color = color;
                currentVertices = animationFrame.vertices;
                currentEdges = animationFrame.edges;
                animations.push(animationFrame);
            }
        }
        return animations
    }

    createAnimationFrame(vertices, edges){
        const newVertices = [];
        vertices.forEach((v) => newVertices.push(v.copyVertex()))
        const newEdges = [];
        edges.forEach((e) => newEdges.push(e.copyEdge()))
        return {vertices: newVertices, edges: newEdges};
    }
}

/**
 * distance between two points (Vertex or Force)
 * @param v1 the first point
 * @param v2 the secont point
 * @param is3D is the network three dimensional?
 */
function distance(v1, v2, is3D){
    var dist;
    if (is3D) {dist = Math.sqrt(
        Math.pow((v1.x - v2.x), 2)
        + Math.pow((v1.y - v2.y), 2)
        + Math.pow((v1.z-v2.z),2))
    } else{
        dist = Math.sqrt(
            Math.pow((v1.x - v2.x), 2)
            + Math.pow((v1.y - v2.y), 2))
    }
    return dist === 0? 0.00000000000000000001: dist;

}

export default Kruskal;