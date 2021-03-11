import AbstractEdgeColoringAlgorithm from "./AbstractEdgeColoringAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";
import PolarColorGradient from "../../../datatypes/ColorGradient/PolarColorGradient";
import LinearColorGradient from "../../../datatypes/ColorGradient/LinearColorGradient";

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
        this.setRequiredProperty("Connected")
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
        const initialColors = [];
        const initialAlpha = [];
        for(let i = 0; i < edges.length; i++){
            initialColors.push(edges[i].color);
            initialAlpha.push(edges[i].alpha);
        }
        const firstFrame = this.createAnimationFrame(edges);
        animations.push(firstFrame);

        let maxDegree = -Infinity;
        vertices.forEach((v) => {maxDegree = Math.max(v.degree, maxDegree)})
        const numColors = maxDegree + 1;
        const colorGradient = this.gradientType.obj.value === "Linear"?
            new LinearColorGradient(this.startColor.obj.value, this.endColor.obj.value, numColors):
            new PolarColorGradient(this.startColor.obj.value, this.endColor.obj.value, numColors);
        this.gradient = colorGradient

        //Pre-Calculate some arrays/lists so that check incident colors/needed colors/fan colors become constant time
        let incidentVertices = {}
        vertices.forEach((v,index) => incidentVertices[index] = []);
        edges.forEach((e) => {
            incidentVertices[e.start].push(e.end);
        });
        this.incidentVertices = incidentVertices;
        let incidentColors = {};

        for(const key in incidentVertices) {
            incidentColors[key] = [];
        }
        this.incidentColors = incidentColors;
        let edgeColors = {};
        edges.forEach((e) => {edgeColors[this.getIndex(e.start, e.end)] = null;})
        this.edgeColors = edgeColors;

        let currentEdges = firstFrame;
        let uncoloredEdges = this.createAnimationFrame(edges);

        uncoloredEdges.sort(function(a,b){
            const [a1, a2] = a.start< a.end? [a.start, a.end]: [a.end,a.start];
            const [b1, b2] = b.start < b.end? [b.start, b.end] : [b.end, b.start];
            return a1 - b1 !== 0?a1 - b1: a2-b2;
        })
        //ACTUAL ALGORITHM
        let iterations = 0;
        while(uncoloredEdges.length > 0){
            console.log("==================")
            iterations ++
            const e = uncoloredEdges.pop();
            const [u, v] = this.getIndex(e.start, e.end)

            let fan = this.createFan(u,v);
            console.log("fan",fan, "centered at", u)
            // let fanFreeColors = [];
            let fanColors = [];
            for(let i = 0; i < fan.length; i++){
                fanColors.push(this.edgeColors[this.getIndex(u, fan[i])])
                // fanFreeColors.push(this.getFreeColors(fan[i]))
            }
            console.log("fan colors", fanColors)
            // console.log("fan Free colors", fanFreeColors)

            let c = this.pickColor(u);
            let d = this.pickColor(fan[fan.length-1]);
            // console.log("color1", c, "color2", d);

            this.invertPath(u, c, d)

            const fanPrime = [fan[0]];
            for(let i = 1; i < fan.length; i++){
                const freeColors = this.getFreeColors(fan[i]);
                const index = this.getIndex(u, fanPrime[fanPrime.length-1])
                let shouldAdd = freeColors.includes(this.edgeColors[index]);

                if(shouldAdd) fanPrime.push(fan[i])

            }
            // console.log("subfan", fanPrime)
            this.rotateFan(fanPrime, u);
            console.log(this.edgeColors[this.getIndex(fanPrime[fanPrime.length-1], u)])
            this.edgeColors[this.getIndex(fanPrime[fanPrime.length-1], u)] = d;
            console.log("fanPrime last", fanPrime[fanPrime.length-1])
            // console.log("assigned", d, "to", this.getIndex(fanPrime[fanPrime.length-1], 0))

            //update animations edges
            const newEdges = this.createAnimationFrame(currentEdges)
            for(let i = 0; i < newEdges.length; i++){
                const index = this.getIndex(newEdges[i].start, newEdges[i].end);
                if(this.edgeColors[index] === null){
                    newEdges[i].color = initialColors[i];
                    newEdges[i].alpha = initialAlpha[i];
                } else{
                    newEdges[i].color = this.edgeColors[index]
                    newEdges[i].alpha = 0.5;
                }

            }

            animations.push(newEdges);
            currentEdges = newEdges
        }
        console.log(iterations)

        return animations;
    }


    invertPath(startVertex, c, d){
        if(c === d) return;

        let searching = true;
        let lastVertex = startVertex
        let currentVertex = startVertex;

        while(searching){
            searching = false;
            for(let i = 0; i < this.incidentVertices[currentVertex]; i++){
                const v = this.incidentVertices[currentVertex][i];
                if(v === lastVertex) continue;

                const index = this.getIndex(currentVertex, v);
                if(this.edgeColors[index] === c || this.edgeColors[index] === d){
                    this.switchColors(currentVertex, v, c, d);
                    searching = true;
                    lastVertex = currentVertex;
                    currentVertex = v;
                }
            }
        }
    }

    /**
     * Switches color c to color d and vice versa for an edge connecting vertex v1 and vertex v2
     * @param v1
     * @param v2
     * @param c
     * @param d
     */
    switchColors(v1, v2, c, d){
        const index = this.getIndex(v1, v2)
        let newColor = this.edgeColors[index];
        if(this.edgeColors[index] === c) {newColor = d}
        else if(this.edgeColors[index] === d){newColor = c}
        this.edgeColors[index] = newColor
    }

    /**
     * Creates a fan centered at center vertex, starting at uncolored startVertex
     * as defined by the Misra-Gries coloring algorithm
     * @param centerVertex
     * @param startVertex
     * @returns {[][]} the fan
     */
    createFan(centerVertex, startVertex){
        const fan = [];

        if(!this.isUncolored(centerVertex, startVertex)) throw new Error("unassigned edge should not have a color");
        fan.push(startVertex);

        const startIndex = this.incidentVertices[centerVertex].indexOf(startVertex);

        let incidentNotStart = this.incidentVertices[centerVertex].slice(0, startIndex).concat(
            this.incidentVertices[centerVertex].slice(startIndex+1)
        );

        let lastAdded = startVertex;
        let maximal = false;
        while(!maximal){
            maximal = true;
            const freeColors = this.getFreeColors(lastAdded);
            for(let i = 0; i < incidentNotStart.length; i++){
                const color = this.edgeColors[this.getIndex(centerVertex, incidentNotStart[i])]
                if(color === null){
                    // do nothing
                } else if(freeColors.includes(color)){
                    fan.push(incidentNotStart[i]);
                    lastAdded = incidentNotStart[i];
                    incidentNotStart = incidentNotStart.slice(0, i).concat(incidentNotStart.slice(i+1))
                    maximal = false;
                    break;
                }
            }
        }

        return fan
    }

    /**
     * Get free colors on a vertex
     * @param vertex
     * @returns {[]} free colors
     */
    getFreeColors(vertex){
        const incident = this.incidentVertices[vertex];
        const takenColors = [];
        const freeColors = [];
        for(let i = 0; i < incident.length; i++){
            const color = this.edgeColors[this.getIndex(vertex, incident[i])]
            if(color !== null) {
                // console.log("found taken color", color)
                takenColors.push(color)
            }
        }
        for(let i = 0; i < this.gradient.colorGradient.length; i++){
            const c = this.gradient.colorGradient[i];
            let valid = true;
            for(let j = 0; j < takenColors.length; j++){
                const d = takenColors[j];
                if(c === d){
                    valid = false;
                    break;
                }
            }
            if(valid) freeColors.push(c);
        }
        // console.log("resulting free colors", freeColors)
        return freeColors;
    }


    /**
     * Rotates the fan according to the misra gries algorithm
     * @param fan
     * @param centerVertex
     * @param edgeColors
     */
    rotateFan(fan, centerVertex){
        for(let i = 0; i < fan.length-1; i++){
            const curIndex = this.getIndex(centerVertex, fan[i]);
            const nextIndex = this.getIndex(centerVertex, fan[i+1]);
            console.log("assigned in fan", this.edgeColors[nextIndex], "to", curIndex)
            this.edgeColors[curIndex] = this.edgeColors[nextIndex];
        }
        this.edgeColors[this.getIndex(centerVertex, fan[fan.length-1])] = null
    }

    /**
     * Picks a color in the color gradient that is free on the vertex
     * @param vertex
     */
    pickColor(vertex){
        const freeColors = this.getFreeColors(vertex)
        if(freeColors.length === 0) throw new Error("no free colors on vertex", vertex);
        return freeColors[0];
    }


    /**
     * Checks if an edge is uncolored
     * @param coloredEdges
     * @param u
     * @param v
     */
    isUncolored(u, v){
        return this.edgeColors[this.getIndex(u,v)] === null;
    }

    /**
     * Returns sorted array of 2 edge endpoints
     * @param a
     * @param b
     * @returns {*[]}
     */
    getIndex(a, b){
        if(a < b){
            return [a, b]
        }
        return [b, a]
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