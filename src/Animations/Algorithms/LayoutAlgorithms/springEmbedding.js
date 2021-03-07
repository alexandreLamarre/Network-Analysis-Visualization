import AbstractLayoutAlgorithm from "./AbstractLayoutAlgorithm.js"
import {fruchtermanReingold} from "../../../NetworkAlgorithms/FruchtermanReingold";
import AlgorithmSettings from "../AlgorithmSettings";
import AlgorithmSettingObject from "../AlgorithmSetting";
import Force from "./datatypes/Force.js"
import Vertex from "./datatypes/Vertex.js"
import Edge from "./datatypes/Edge.js"

const ITERATIONS = 100;

class SpringEmbedding extends AbstractLayoutAlgorithm{
    constructor(){
        super("Spring Embedding")
        //declare all of the algorithm settings

        const forceOfAttraction = AlgorithmSettingObject.newRangeSetting(
            "Force of attraction",
            0.1,
            2,
            0.1,
            2
        )
        const forceOfRepulsion = AlgorithmSettingObject.newRangeSetting(
            "Fore of repulsion",
            0.1,
            2,
            0.1,
            1
        )
        const epsilon = AlgorithmSettingObject.newRangeSetting(
            "Convergence bound",
            0.001,
            3,
            0.001,
            0.1,
        )
        const forceToAreaScaling = AlgorithmSettingObject.newRangeSetting(
            "Force to area scaling",
            0,
            100,
            0.1,
            0
        )
        const distanceType = AlgorithmSettingObject.newOptionSetting(
            "Distance type",
            ["Graph theoretic", "Continuous"],
            "Continuous"
            )
        this.forceOfAttraction = forceOfAttraction
        this.forceOfRepulsion = forceOfRepulsion
        this.epsilon = epsilon
        this.forceToAreaScaling = forceToAreaScaling
        this.distanceType = distanceType
        this.settings.push(forceOfAttraction)

        this.settings.push(forceOfRepulsion)
        this.settings.push(epsilon)
        // this.settings.push(forceToAreaScaling)
        this.settings.push(distanceType)
        this.setRequiredProperty(null)
    }

    /** gets the settings of the spring embedding algorithm**/
    getSettings(){
        return this.settings
    }

    /**
     * Performs the spring embedding algorithm on a set of vertices and edges
     */
    getAnimations(vertices, edges, is3D){
        const K = ITERATIONS;
        const distType = this.distanceType.obj.value;
        const delta = 0.1

        let t = 1;
        let animations = [];
        let scaling_factor = []; //the animations will sometimes push vertices x,y, z
                    // outside of the range (0,1) so we need to rescale every iteration of the animation once it is done
        // animations.push(vertices);
        // scaling_factor.push([0, 0, 0, 1, 1, 1])
        //apply forces to all vertices on each iteration
        while(t < K){
            let forceList = [];
            for(let i = 0; i < vertices.length; i++){
                let f = new Force(0, 0);
                let verticesConnected = [];

                //CALCULATE FORCES OF ATTRACTION
                for(let j = 0; j < edges.length; j++){

                    if(i === edges[j].start && i !== edges[j].end){
                        const calcs = this.fattract(
                            vertices[edges[j].start],
                            vertices[edges[j].end], is3D);
                        f.addVector(calcs);
                        verticesConnected.push(edges[j].end)
                    }

                    if(i === edges[j].end && i !== edges[j].start){
                        const calcs = this.fattract(vertices[edges[j].end],
                            vertices[edges[j].start], is3D);
                        f.addVector(calcs)
                        verticesConnected.push(edges[j].start);
                    }
                }

                //CALCULATE REPULSIVE FORCES
                for(let j = 0; j < vertices.length; j++){
                    if (i === j) continue;
                    let connected = false;
                    for (let k = 0; k < verticesConnected.length; k++){
                        if (j === verticesConnected[k]) {
                            connected = true;
                            break;
                        }
                    }
                    if(!connected){
                        const calcs = this.frepulse(
                            vertices[i],
                            vertices[j],
                            is3D)
                        f.addVector(calcs)
                    }
                }
                forceList.push(f)
            }


            //now apply these forces
            const iterationAnimations = [];
            var maxF = -Infinity;
            var minX = Infinity,minY = Infinity,minZ = Infinity
            var maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

            for(let i = 0; i < vertices.length; i++){
                forceList[i].scale(delta)
                const fNorm = distance(forceList[i], new Force(0, 0, 0), is3D)
                maxF = Math.max(maxF, fNorm)
                iterationAnimations.push(new Vertex(
                    vertices[i].x + forceList[i].x,
                    vertices[i].y +forceList[i].y,
                    vertices[i].z+ forceList[i].z))

                minX = Math.min(minX, iterationAnimations[i].x); maxX = Math.max(maxX, iterationAnimations[i].x);
                minY = Math.min(minY, iterationAnimations[i].y); maxY = Math.max(maxY, iterationAnimations[i].y);
                minZ = Math.min(minZ, iterationAnimations[i].z); maxZ = Math.max(maxZ, iterationAnimations[i].z);
            }
            //rescale to (0, 1)
            scaling_factor.push([-minX, -minY, -minZ, 1/((-minX) + maxX), 1/((-minY)+maxY), 1/((-minZ)+maxZ)]);
            animations.push(iterationAnimations);
            vertices = iterationAnimations;
            t += 1;

            //check convergence bound to see if we need to stop the algorithm early:
            if(maxF < this.epsilon)break;

        } //end of iterations loop
        //scaling animations properly without affecting computations
        for(let i = 0; i < animations.length; i++){
            for(let j = 0; j < animations[i].length; j++){

                animations[i][j].x = (animations[i][j].x + scaling_factor[i][0])*scaling_factor[i][3];
                animations[i][j].y = (animations[i][j].y + scaling_factor[i][1])*scaling_factor[i][4];
                animations[i][j].z = (animations[i][j].z + scaling_factor[i][2])*scaling_factor[i][5];
            }
        }
        return animations

    }

    fattract(v1,v2, is3D){
        var dist = distance(v1,v2, is3D);
        const unitV = unitVector(v1,v2, is3D);
        if (is3D){
            return [this.forceOfAttraction.obj.value* Math.log(dist) * unitV[0],
            this.forceOfAttraction.obj.value* Math.log(dist) * unitV[1],
            this.forceOfAttraction.obj.value* Math.log(dist) * unitV[2]];
        }
        return [this.forceOfAttraction.obj.value* Math.log(dist) * unitV[0],
            this.forceOfAttraction.obj.value* Math.log(dist) * unitV[1]]
    }

    frepulse(v1,v2, is3D){
        var dist = distance(v2,v1, is3D);
        const unitV = unitVector(v2,v1, is3D);
        if (is3D){
            return [(this.forceOfRepulsion.obj.value*unitV[0])/Math.sqrt(dist) ,
                (this.forceOfRepulsion.obj.value*unitV[1])/Math.sqrt(dist),
                (this.forceOfRepulsion.obj.value*unitV[2])/Math.sqrt(dist)];
        }
        return [(this.forceOfRepulsion.obj.value*unitV[0])/Math.sqrt(dist) ,
        (this.forceOfRepulsion.obj.value*unitV[1])/Math.sqrt(dist)]

    }

}

//helpers
/**
 * distance between two points (Vertex or Force)
 * @param v1 the first point
 * @param v2 the secont point
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

/**
 * returns the unit vector from v1 to v2
 * @param v1 the start point
 * @param v2 the end point
 * @returns {number[]} the unit vector
 */
function unitVector(v1,v2, is3D){
    const new_x = v2.x - v1.x;
    const new_y = v2.y - v1.y;

    const dist = distance(v1,v2, is3D);
    if(is3D){
        const new_z = v2.z - v1.z;
        return [new_x/dist, new_y/dist, new_z/dist];
    }

    return [new_x/dist, new_y/dist]
}


export default SpringEmbedding
