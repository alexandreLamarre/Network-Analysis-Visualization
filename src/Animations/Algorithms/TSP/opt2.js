import AbstractTSPAlgorithm from "./AbstractTSPAlgorithm";
import AlgorithmSettingObject from "../AlgorithmSetting";

class Opt2 extends AbstractTSPAlgorithm{
    constructor(){
        super("2-Opt")

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
        let betterSolution = false;
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
            for(let n = 0; n < this.simulations.obj.value; n++){
                //select two random enpoints
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

                if(newDist < dist) {
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
                    const e = edges[i].copyEdge();
                    e.start = path[i];
                    e.end = path[i+1];
                    newEdges.push(e);
                    if(i === I || i === K){
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
            console.log(animations[animations.length -1])
            lastAnimationFrame.push(animations[animations.length-1][i].copyEdge());
            lastAnimationFrame[i].color = initialColors[i];
            lastAnimationFrame[i].alpha = initialAlpha[i];
        }
        animations.push(lastAnimationFrame);

        return animations;
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

export default Opt2;