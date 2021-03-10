import AbstractTSPAlgorithm from "./AbstractTSPAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";

class Opt3 extends AbstractTSPAlgorithm{
    constructor(){
        super("3-Opt")

        this.iterations = AlgorithmSettingObject.newRangeSetting(
            "Maximum Possible Swaps",
            100,
            10000,
            1,
            5000);

        this.simulations = AlgorithmSettingObject.newRangeSetting(
            "Attempts Per Iteration",
            100,
            200,
            1,
            100
        )

        this.selectedColor = AlgorithmSettingObject.newColorSetting(
            "Color",
            "#ff0000"
        )

        this.settings.push([this.iterations, this.simulations, this.selectedColor])
        this.setRequiredProperty("Cycle")
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
        //set up intial cycle definitions & first animation
        let path = [];
        const initialColors = [];
        const initialAlpha = [];
        let root = edges[0].start;
        initialColors.push(edges[0].color)
        initialAlpha.push(edges[0].alpha)
        firstFrameAnimation.push(edges[0].copyEdge())
        path.push(root)
        var I = -1;
        var K = -1;

        for(let i = 1; i < edges.length; i++){
            path.push(edges[i].start);
            initialColors.push(edges[i].color);
            initialAlpha.push(edges[i].alpha);
            firstFrameAnimation.push(edges[i].copyEdge())
        }
        path.push(root)
        animations.push(firstFrameAnimation);

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
                const values = this.reverseSegmentIfBetter(path, a, b, c, vertices, is3D);
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
                    const e = edges[i].copyEdge();
                    e.start = newPath[i];
                    e.end = newPath[i+1];
                    newEdges.push(e);
                    if(i ===  a || i === b || i === c){
                        newEdges[i].color = this.selectedColor.obj.value
                        newEdges[i].alpha = 0.5
                    } else{
                        newEdges[i].color = initialColors[i]
                        newEdges[i].alpha = initialAlpha[i];
                    }
                }
                animations.push(newEdges)
            }
        }
        //add one last animation where all the edges have their intial colors;
        const lastAnimationFrame = [];
        for(let i = 0; i < animations[animations.length-1].length; i++){
            lastAnimationFrame.push(animations[animations.length-1][i].copyEdge());
            lastAnimationFrame[i].color = initialColors[i];
            lastAnimationFrame[i].alpha = initialAlpha[i];
        }
        animations.push(lastAnimationFrame);

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
    reverseSegmentIfBetter(path, i, j, k, v, is3D){
        let newPath = [];
        const [A, B, C, D, E, F] = [path[i-1], path[i], path[j-1], path[j], path[k-1], path[k]]
        const d0 = distance(v[A], v[B], is3D) + distance(v[C], v[D], is3D) + distance(v[E], v[F], is3D);
        const d1 = distance(v[A], v[C], is3D) + distance(v[B], v[D], is3D) + distance(v[E], v[F], is3D);
        const d2 = distance(v[A], v[B], is3D) + distance(v[C], v[E], is3D) + distance(v[D], v[F], is3D);
        const d3 = distance(v[A], v[D], is3D) + distance(v[E], v[B], is3D) + distance(v[C], v[F], is3D);
        const d4 = distance(v[F], v[B], is3D) + distance(v[C], v[D], is3D) + distance(v[E], v[A], is3D);

        if(d0 > d1){
            //TODO bug
            newPath = this.reversedPath(path, i - 1, j -1);
            return [newPath, true];
        } else if (d0 > d2){
            //TODO bug
            newPath = this.reversedPath(path, j - 1, k - 1);
            return [newPath, true];
        } else if(d0 > d4){
            //TODO bug
            newPath = this.reversedPath(path, i - 1, k - 1);
            return [newPath, true];
        } else if(d0 > d3){
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

    calculateDistancePath(path, vertices, is3D){
        var totalDist = 0;
        for(let i = 0; i < path.length -1 ; i++){
            totalDist += distance(vertices[path[i]], vertices[path[i+1]], is3D)
        }
        return Math.sqrt(totalDist)
    }
}

function distance(v1, v2, is3D){
    let dist = 0;
    if(!is3D) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2);
    if(is3D) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2) + Math.pow(v1.z-v2.z,2);
    if(dist === 0) dist = 0.00000000000000000001;
    return dist
}

export default Opt3;