import AbstractVertexColoringAlgorithm from "./AbstractVertexColoringAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";
import LinearColorGradient from "../../../datatypes/ColorGradient/LinearColorGradient";
import PolarColorGradient from "../../../datatypes/ColorGradient/PolarColorGradient";

class GreedyVertexColoring extends AbstractVertexColoringAlgorithm{
    constructor(){
        super("Greedy Vertex Coloring")

        this.gradientType = AlgorithmSettingObject.newOptionSetting(
            "Color Gradient Type",
            ["Polar", "linear"],
            "Polar")

        this.startColor = AlgorithmSettingObject.newColorSetting("Start Color", "#ff0000")

        this.endColor = AlgorithmSettingObject.newColorSetting("End Color", "#00ffff");

        this.settings.push([this.gradientType, this.startColor, this.endColor]);
        this.setRequiredProperty(null);
    }

    /**
     * returns the settings of the Opt-2 algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    /**
     * Greedy vertex coloring assigns the first color possible that isnt directly adjacent to it
     * @param vertices
     * @param edges
     * @param is3D
     * @returns {[]} animations of greedy vertex algorithm
     */
    async getAnimations(vertices, edges, is3D){
        const animations = [];
        const initialVertices = this.createAnimationFrame(vertices) //create copy of network vertices
        animations.push(initialVertices)

        let maxDegree = -Infinity;
        let minDegree = Infinity;
        const assignedColors = new Array(vertices.length).fill(-1);

        for(let i = 0; i < vertices.length; i ++){
            maxDegree = Math.max(maxDegree, vertices[i].degree);
            minDegree = Math.min(minDegree, vertices[i].degree);
        }
        const numColors = maxDegree - minDegree + 1;
        const adj = this.createAdjacencyMatrix(vertices, edges);
        const colors = this.gradientType.obj.type === "Linear"?
            new LinearColorGradient(this.startColor.obj.value, this.endColor.obj.value, numColors):
            new PolarColorGradient(this.startColor.obj.value, this.endColor.obj.value, numColors);

        let currentVertices = initialVertices;

        for(let i = 0; i < vertices.length; i++){
            const neighbors = this.getNeighbors(vertices, i, adj);
            const availableColors = this.getAvailableColors(assignedColors, neighbors, colors);
            const newColor = availableColors[0]
            currentVertices = this.createAnimationFrame(currentVertices, i, newColor);
            assignedColors[i] = newColor
            animations.push(currentVertices);
        }

        return animations;
    }

    /**
     * Creates an animation frame of the current network by copying all its vertices and assigning a color if possible
     * @param vertices the vertices to copy
     * @param updateIndex vertex to update
     * @param color the color string value to set
     * @returns {Vertex[]}
     */
    createAnimationFrame(vertices, updateIndex, color){
        const res = [];
        for(let i = 0; i < vertices.length; i++){
            res.push(vertices[i].copyVertex());
            if(i === updateIndex){
                res[res.length -1].color = color
            }
        }
        return res;
    }

    /**
     * Creates a Network's adjacency matrix from its vertices and edges
     * @param v vertices
     * @param e edges
     * @returns {Number[][]} the adjacency matrix of the network
     */
    createAdjacencyMatrix(v, e){
        const adj = [];
        for(let i = 0; i < v.length; i++){
            const adj_row = [];
            for(let j = 0; j < v.length; j++){
                adj_row.push(0);
            }
            adj.push(adj_row);
        }

        for(let i = 0; i < e.length; i ++){
            adj[e[i].start][e[i].end] = 1;
            adj[e[i].end][e[i].start] = 1;
        }
        return adj;
    }

    getAvailableColors(assignedColors, neighbors, colors){
        const allColors = [];
        const availableColors = [];

        neighbors.forEach((neighbor) => {
            if(assignedColors[neighbor] !== -1) {
                allColors.push(assignedColors[neighbor]);
            }
        });

        colors.colorGradient.forEach((gradientColor) => {
            if(!checkColorIn(gradientColor, allColors)) availableColors.push(gradientColor)
        });

        return availableColors;
    }

    /**
     * Gets the neighbors of vertex of index index
     * @param vertices the vertices of the network
     * @param index the index of the vertex whose neighbors we want to find
     * @param adj the adjacency matrix of the network
     * @returns neighbor vertices
     */
    getNeighbors(vertices, index, adj){
        const neighbors = [];
        for(let i = 0; i < vertices.length; i ++){
            if(adj[index][i] === 1) neighbors.push(i);
        }
        return neighbors;
    }
}

/**
 * Checks whether or not provided color in the provided color list
 * @param color
 * @param colorList
 * @returns {boolean} color is in color list
 */
function checkColorIn(color, colorList){
    for(let i = 0; i < colorList.length; i++){
        if(color === colorList[i]) return true
    }
    return false
}

export default GreedyVertexColoring;