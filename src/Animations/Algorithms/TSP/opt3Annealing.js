import AbstractTSPAlgorithm from "./AbstractTSPAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";
import LinearColorGradient from "../../../datatypes/ColorGradient/LinearColorGradient";
import PolarColorGradient from "../../../datatypes/ColorGradient/PolarColorGradient";

class Opt3Annealing extends AbstractTSPAlgorithm{
    constructor(){
        super("3-Opt Simulated Annealing")

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
        let temperature = this.initialTemperature.obj.value;
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

        //set up animations
        const animations = [];
        const firstFrameAnimation = [];
        //set up intial cycle definitions & first animation
        let path = [];

        let root = edges[0].start;

        firstFrameAnimation.push(edges[0].copyEdge())
        path.push(root)

        for(let i = 1; i < edges.length; i++){
            path.push(edges[i].start);
            firstFrameAnimation.push(edges[i].copyEdge())
        }

        path.push(root)
        animations.push(firstFrameAnimation);
        let currentEdges = firstFrameAnimation;
        for(let j = 0; j < this.iterations.obj.value; j++){
            //try and perform a swap that improves the below distance
            let newPath = [];
            let a; let b; let c; //v1, v2 and v3
            let betterSolution = false;

            for(let n = 0; n < this.simulations.obj.value; n++){
                a = Math.floor(Math.random()*(path.length-3))+2;
                b = Math.floor(Math.random()*(path.length-3))+2;
                c = Math.floor(Math.random()*(path.length-3))+2;

                [a,b,c] = [a,b,c].sort(function(a,b) {return a - b});
                const values = this.reverseSegmentIfBetter(path, a, b, c, vertices, is3D, temperature);
                newPath = values[0];
                betterSolution = values[1];
                if(betterSolution) {
                    path = newPath
                    break;
                }
            }

            if(betterSolution){
                const newEdges = [];
                for(let i = 0; i < path.length - 1; i++){
                    const e = currentEdges[i].copyEdge();
                    e.start = newPath[i];
                    e.end = newPath[i+1];
                    newEdges.push(e);
                    if(i ===  a || i === b || i === c){
                        let degree = (this.initialTemperature.obj.value - temperature)/(this.initialTemperature.obj.value)
                        degree = Math.floor(degree * this.gradientSegments.obj.value)
                        newEdges[i].color = colorGradient.getColorGradientColor({degree: degree}, 0)
                        newEdges[i].alpha = 0.5
                    }
                }
                animations.push(newEdges)
                currentEdges = newEdges
                temperature = this.cool(temperature, j)
            }
        }

        return animations;
    }

    /**
     * Checks the three end points and swap edges as necessary.
     * @param path the original path
     * @param i endpoint1
     * @param j endpoint2
     * @param k endpoint3
     * @param v network vertices
     * @param is3D is the network data three dimensional?
     * @returns {(*|boolean)[]|(*[]|boolean)[]} newPath, is better solution?
     */
    reverseSegmentIfBetter(path, i, j, k, v, is3D, temperature){
        let newPath = [];
        const [A, B, C, D, E, F] = [path[i-1], path[i], path[j-1], path[j], path[k-1], path[k]]
        const d0 = distance(v[A], v[B], is3D) + distance(v[C], v[D], is3D) + distance(v[E], v[F], is3D);
        const d1 = distance(v[A], v[C], is3D) + distance(v[B], v[D], is3D) + distance(v[E], v[F], is3D);
        const d2 = distance(v[A], v[B], is3D) + distance(v[C], v[E], is3D) + distance(v[D], v[F], is3D);
        const d3 = distance(v[A], v[D], is3D) + distance(v[E], v[B], is3D) + distance(v[C], v[F], is3D);
        const d4 = distance(v[F], v[B], is3D) + distance(v[C], v[D], is3D) + distance(v[E], v[A], is3D);
        const accepted = Math.random()
        if(d0 > d1 || accepted < temperature* this.ACCEPTANCE){
            newPath = this.reversedPath(path, i - 1, j -1);
            return [newPath, true];
        } else if (d0 > d2 || accepted < temperature* this.ACCEPTANCE){
            newPath = this.reversedPath(path, j - 1, k - 1);
            return [newPath, true];
        } else if(d0 > d4 || accepted < temperature* this.ACCEPTANCE){
            newPath = this.reversedPath(path, i - 1, k - 1);
            return [newPath, true];
        } else if(d0 > d3 || accepted < temperature* this.ACCEPTANCE){
            newPath = this.reversedPathThree(path, i, j, k);
            return [newPath, true];
        }
        return [path, false]
    }

    /**
     * Reverse cycle path between two endpoints
     * returns the reverse cycle
     * @param path the original cycle
     * @param a end point 1
     * @param b end point 2
     * @returns {[]}
     */
    reversedPath(path, a, b){
        const new_path = [];
        // console.log(path);
        var root = path[0];
        new_path.push(root);
        for(let i = 0; i< a; i++){
            new_path.push(path[i+1]);
        }
        for(let i = b-1; i > a-1; i--){
            new_path.push(path[i+1]);
        }
        for(let i = b; i < path.length-1; i++){
            new_path.push(path[i+1]);
        }
        // console.log(new_path);
        return new_path;
    }

    /**
     * reverse cycle path between three endpoints
     * returns the reversed cycle
     * @param path the original cycle
     * @param i end point 1
     * @param j end point 2
     * @param k end point 3
     * @returns {[]} reversed cycle
     */
    reversedPathThree(path, i, j, k){
        const newPath = [];
        let root = path[0];
        newPath.push(root);
        for(let n = 1; n < i; n++){
            newPath.push(path[n]);
        }
        for(let n = j; n < k; n++){
            newPath.push(path[n]);
        }
        for(let n = i; n< j; n++){
            newPath.push(path[n]);
        }
        for(let n = k; n < path.length; n++){
            newPath.push(path[n]);
        }
        return newPath;
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

export default Opt3Annealing;