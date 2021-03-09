import AbstractMinimumSpanningTreeAlgorithm from "./AbstractMinimumSpanningTreeAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";

class Prim extends AbstractMinimumSpanningTreeAlgorithm{
    constructor(){
        super("Prim MST");

        this.color = AlgorithmSettingObject.newColorSetting("Color", "#ff0000")
        this.settings.push([this.color]);
    }

    /**
     * gets the settings of the Prim minimum spanning tree algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    /**
     * Gets the animations for Prims's minimum spanning tree algorithm
     * @param vertices
     * @param edges
     * @param is3D
     * @returns {[]}
     */
    async getAnimations(vertices, edges, is3D){
        //setup initial animation variables
        const color = this.color.obj.value;

        const adj = this.createAdjacencyMatrix(vertices, edges)
        // assign edge index to adjacency values
        for(let e =0; e < edges.length; e++){
            adj[edges[e].start][edges[e].end] = e;
            adj[edges[e].end][edges[e].start] = e;
        }
        const animations = [];
        const firstFrame = this.createAnimationFrame(vertices, edges);
        animations.push(firstFrame);
        let currentVertices = firstFrame.vertices;
        let currentEdges = firstFrame.edges;

        var vertexQueue = [];
        vertices.forEach((v, index) => vertexQueue.push({key: Infinity, parent: null, vertex: index}));

        const explored = [];
        while(vertexQueue.length !== 0){
            let u;
            [u, vertexQueue] = pop(vertexQueue);
            if(!(u.vertex in explored)){
                const animationFrame = this.createAnimationFrame(currentVertices, currentEdges);
                animationFrame.vertices[u.vertex].color = color;
                animations.push(animationFrame)
                currentVertices = animationFrame.vertices;
                currentEdges = animationFrame.edges;
                if(u.parent !== null){
                    const animationFrame2 = this.createAnimationFrame(currentVertices, currentEdges);
                    animationFrame2.edges[adj[u.vertex][u.parent]].color = color
                    if(!is3D) animationFrame2.edges[adj[u.vertex][u.parent]].alpha = 0.4;
                    animations.push(animationFrame2)
                    currentVertices = animationFrame2.vertices;
                    currentEdges = animationFrame2.edges;
                }
            }

            for(let i = 0; i < adj[u.vertex].length; i ++){
                if(adj[u.vertex][i] !== 0){
                    for(let k = 0; k < vertexQueue.length; k++){
                        if(vertexQueue[k].vertex === i &&
                            distance(vertices[u.vertex], vertices[vertexQueue[k].vertex], is3D) < vertexQueue[k].key){
                            vertexQueue[k].key = distance(vertices[u.vertex], vertices[vertexQueue[k].vertex], is3D);
                            vertexQueue[k].parent = u.vertex;
                        }
                    }
                }
            }
            if(vertexQueue.length !== 2) vertexQueue.sort(function(v1, v2) {return v1.key - v2.key});
        }

        return animations;

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
 * Pop the value at index 0 of an array then update its contents appropriately
 * @param array
 * @returns {(*|*[])[]} the popped element, modified array
 */
function pop(array){
    const poppedValue = array[0];
    if(array.length > 1)array = array.slice(1);
    else if(array.length === 1) array = [];
    return [poppedValue,array]
}

/**
 * distance between two points (Vertex or Force)
 * @param v1 the first point
 * @param v2 the secont point
 * @param is3D is the vertex data three dimensional?
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

export default Prim;