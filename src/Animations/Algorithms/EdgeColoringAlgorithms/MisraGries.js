import AbstractEdgeColoringAlgorithm from "./AbstractEdgeColoringAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";
import PolarColorGradient from "../../../datatypes/ColorGradient/PolarColorGradient";
import LinearColorGradient from "../../../datatypes/ColorGradient/LinearColorGradient";
import {Line} from "three";

class MisraGries extends AbstractEdgeColoringAlgorithm{
    constructor(){
        super("Misra-Gries Edge Coloring")

        this.gradientType = AlgorithmSettingObject.newOptionSetting(
            "Gradient ",
            ["Polar", "Linear"],
            "Polar");

        this.startColor = AlgorithmSettingObject.newColorSetting("Start Color", "#ff0000");
        this.endColor = AlgorithmSettingObject.newColorSetting("End Color", "#00ffff");

        this.settings.push([this.gradientType, this.startColor, this.endColor]);
        this.setRequiredProperty(null)
    }

    /**
     * gets the settings of the misra-gries algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    /**
     * Returns the animations for the misra gries algorithm given the vertices and edges of the network.
     * @param vertices
     * @param edges
     * @param is3D
     * @returns {[]}
     */
    async getAnimations(vertices, edges, is3D) {
        //setting up animation variables
        const animations = [];
        const firstFrame = this.createAnimationFrame(edges);
        animations.push(firstFrame);

        let maxDegree = -Infinity;
        vertices.forEach((v) => {maxDegree = Math.max(v.degree, maxDegree)})
        const numColors = maxDegree + 1;


        //Pre-Calculate some arrays so that check incident colors/needed colors/fan colors become constant time
        const adj = this.createAdjacencyMatrix(vertices, edges)
        edges.forEach((e) => {
            adj[e.start][e.end] = {colored: false, colors: []};
            adj[e.end][e.start] = {colored: false, colors: []};
        })
        let edgeColors = {}

        const colorGradient = this.gradientType.obj.value === "Linear"?
            new LinearColorGradient(this.startColor.obj.value, this.endColor.obj.value, numColors):
            new PolarColorGradient(this.startColor.obj.value, this.endColor.obj.value, numColors);

        let currentEdges = firstFrame;
        const uncoloredEdges = this.createAnimationFrame(edges);

        while(uncoloredEdges.length > 1){
            const e = uncoloredEdges.pop();
            const u = e.start;
            const v = e.end;
            const fan = this.createMaxFan(u, v, adj)

            //update animations edges
            const newEdges = this.createAnimationFrame(currentEdges)
            //update colors
            animations.push(newEdges);
            currentEdges = newEdges
        }


        return animations;

    }

    /**
     *
     * @param centerVertex
     * @param startVertex
     * @param adj
     */
    createMaxFan(centerVertex, startVertex, adj){
        const fan = [];
        let fanOptions = adj[centerVertex]
        fan.push(startVertex);
        let fanColors = [];
        let lastAdded = startVertex;
        let maximal = fanOptions.length === 0;
        while (!maximal){
            maximal = true;
        }
        return fan;
    }





    /**
     * Create an animation frame by copying the current "state" of the algorithms edges
     * @param edges
     * @returns {[]}
     */
    createAnimationFrame(edges){
        const res = [];
        edges.forEach((e) => {res.push(e.copyEdge())});
        return res;
    }
}

export default MisraGries