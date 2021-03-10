import AbstractTSPAlgorithm from "./AbstractTSPAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";
import LinearColorGradient from "../../../datatypes/ColorGradient/LinearColorGradient";
import PolarColorGradient from "../../../datatypes/ColorGradient/PolarColorGradient";

class Opt2Annealing extends AbstractTSPAlgorithm{
    constructor(){
        super("2-Opt Simulated Annealing")

        this.iterations = AlgorithmSettingObject.newRangeSetting(
            "Maximum Possible Swaps",
            100,
            10000,
            1,
            5025);

        this.simulations = AlgorithmSettingObject.newRangeSetting(
            "Attempts Per Iteration",
            100,
            200,
            1,
            100
        )

        this.initialTemperature = AlgorithmSettingObject.newRangeSetting(
            "Initial System Temperature",
            50,
            200,
            1,
            100
        )

        this.coolingHeuristic = AlgorithmSettingObject.newOptionSetting(
            "Temperature Cooling Heuristic",
            ["Linear", "Exponential"],
            "Exponential"
            )



        this.temperatureGradient = AlgorithmSettingObject.newOptionSetting(
            "Temperature Color Gradient",
            ["Polar", "Linear"],
            "Linear");

        this.gradientSegments = AlgorithmSettingObject.newRangeSetting(
            "Color Gradient Segments",
            5,
            30,
            1,
            10);

        this.temperatureStartColor = AlgorithmSettingObject.newColorSetting(
            "Temperature Hot Color",
            "#ff0000"
        );

        this.temperatureEndColor = AlgorithmSettingObject.newColorSetting(
            "Temperature Cold Color",
            "#0000ff"
        )

        this.settings.push([
            this.iterations,
            this.simulations,
            this.coolingHeuristic,
            this.initialTemperature,
            this.temperatureGradient,
            this.gradientSegments,
            this.temperatureStartColor,
            this.temperatureEndColor]);

        this.setRequiredProperty("Cycle")
        this.ACCEPTANCE = 0.0001;
    }

    /**
     * returns the settings of the Opt-2 algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    /**
     *
     * @param vertices
     * @param edges
     * @param is3D
     * @returns {[]}
     */
    async getAnimations(vertices, edges, is3D){
        //set up animations
        const animations = [];
        const firstFrameAnimation = [];
        const colorGradient = this.temperatureGradient.obj.value === "Linear"?
            new LinearColorGradient(
                this.temperatureStartColor.obj.value,
                this.temperatureEndColor.obj.value,
                this.gradientSegments.obj.value):
            new PolarColorGradient(
                this.temperatureStartColor.obj.value,
                this.temperatureEndColor.obj.value,
                this.gradientSegments.obj.value);

        //set up intial cycle definitions & first animation
        let temperature = this.initialTemperature.obj.value;
        let path = [];
        let currentEdges = edges;
        let betterSolution = false;
        let root = edges[0].start;
        firstFrameAnimation.push(edges[0].copyEdge())
        path.push(root)
        var I = -1;
        var K = -1;


        for(let i = 1; i < edges.length; i++){
            path.push(edges[i].start);
            firstFrameAnimation.push(edges[i].copyEdge())
        }
        path.push(root)
        animations.push(firstFrameAnimation);

        for(let j = 0; j < this.iterations.obj.value; j++){
            //try and perform a swap that improves the below distance
            for(let n = 0; n < this.simulations.obj.value; n++){


                var i = Math.floor(Math.random() *(path.length -2)) + 1;
                var k = Math.floor(Math.random() * (path.length - 2)) + 1;


                if(i > k){ //we swap the values just to make switching paths easier later
                    const temp = i;
                    i = k;
                    k = temp;
                }

                const [A, B, C, D] = [path[i], path[i+1], path[k], path[k+1]]
                const v = vertices;
                let dist = distance(v[A], v[B], is3D) + distance(v[C], v[D], is3D);
                let newDist = distance(v[A], v[C], is3D) + distance(v[B], v[D], is3D);



                const accepted = Math.random()
                if(newDist < dist || accepted < temperature* this.ACCEPTANCE) {
                    let newPath = [];
                    newPath.push(root);
                    for(let m = 0; m < i; m ++){

                        newPath.push(path[m+1]);
                    }

                    for(let m = k- 1; m > i -1; m--){
                        newPath.push(path[m+1]);
                    }

                    for(let m = k; m < path.length -1; m++){
                        newPath.push(path[m+1])
                    }
                    dist = newDist
                    betterSolution = true;
                    path = newPath
                    I = i;
                    K = k;
                    break;
                }

            }
            if(betterSolution) {
                const newEdges = [];
                for(let i = 0; i < path.length - 1; i++){
                    const e = currentEdges[i].copyEdge();
                    e.start = path[i];
                    e.end = path[i+1];
                    newEdges.push(e);
                    if(i === I || i === K){
                        let degree = (this.initialTemperature.obj.value - temperature)/(this.initialTemperature.obj.value)
                        degree = Math.floor(degree * this.gradientSegments.obj.value)
                        newEdges[i].color = colorGradient.getColorGradientColor({degree: degree}, 0)
                        newEdges[i].alpha = 0.5
                    }
                }
                animations.push(newEdges)
                temperature = this.cool(temperature, j)
                currentEdges = newEdges;

            }
        }

        return animations;
    }

    /**
     * Applies the cooling heuristic to the temperature based on the user selected cooling heuristic
     * @param temperature
     * @param i the iteration of the algorithm we are on
     * @returns {*}
     */
    cool(temperature,  i){
        if(this.coolingHeuristic.obj.value === "Linear"){
            return this.initialTemperature.obj.value * (this.iterations.obj.value - i)/(this.iterations.obj.value)
        } else if(this.coolingHeuristic.obj.value === "Exponential"){
            return 0.996 * temperature;
        }
        return temperature
    }

    calculateDistancePath(path, vertices, is3D){
        var totalDist = 0;
        for(let i = 0; i < path.length -1 ; i++){
            totalDist += distance(vertices[path[i]], vertices[path[i+1]], is3D)
        }
        return Math.sqrt(totalDist)
    }

    copyAllEdges(edges){
        const res = [];
        edges.forEach((e) => res.push(e.copyEdge()))
        return res;
    }
}

function distance(v1, v2, is3D){
    let dist = 0;
    if(!is3D) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2);
    if(is3D) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2) + Math.pow(v1.z-v2.z,2);
    if(dist === 0) dist = 0.00000000000000000001;
    return dist
}

export default Opt2Annealing;