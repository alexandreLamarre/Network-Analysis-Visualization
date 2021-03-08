import AbstractLayoutAlgorithm from "./AbstractLayoutAlgorithm";
import Force from "../../../datatypes/Force.js"
import Vertex from "../../../datatypes/Vertex.js"
import AlgorithmSettingObject from "../AlgorithmSetting";
const ITERATIONS = 100;

/**
 *
 */
class FruchtermanReingold extends AbstractLayoutAlgorithm{
    constructor(){
        super("Fruchterman Reingold")
        this.area = 1

        //declare all algorithm settings

        this.epsilon = AlgorithmSettingObject.newRangeSetting(
            "Convergence Bound",
            0.01,
            1,
            0.01,
            0.5)

        this.cTemp = AlgorithmSettingObject.newRangeSetting(
            "Initial Temperature Scaling",
            1,
            3,
            0.1,
            2
        )

        this.tempHeuristic = AlgorithmSettingObject.newOptionSetting(
            "Temperature Heuristic",
            ["Linear", "Logarithmic", "Directional"],
            "Linear")


        this.settings.push([this.epsilon, this.cTemp, this.tempHeuristic]);

        this.setRequiredProperty(null)

    }

    /**
     * gets the settings of the fruchterman reingold algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    async getAnimations(vertices, edges, is3D){
        const K = ITERATIONS;
        const epsilon = this.epsilon.obj.value;
        this.area = Math.sqrt(1000/(vertices.length))

        let t = 1;
        let temperature = this.cTemp.obj.value
        const initialTemperature = temperature;
        let temperatureList = [];
        let previousAngles = [];
        let animations = [];
        let scalingFactor = [];

        animations.push(vertices);
        scalingFactor.push([0, 0, 0, 1, 1, 1]);

        //apply forces to all vertices on each iteration
        while(t < K){
            let forceList = [];

            //CALCULATE REPULSIVE FORCES
            for(let i = 0; i < vertices.length; i++){
                let f = new Force(0, 0, 0)

                for(let j = 0; j < vertices.length; j++){
                    if( i !== j){
                        const delta = distance(vertices[i], vertices[j], is3D);
                        const calcs = this.frepulse(vertices[i], vertices[j], delta, is3D)
                        f.addVector(calcs)
                    }
                }
                forceList.push(f)
            }


            //CALCULATE ATTRACTIVE FORCES
            for(let i = 0; i < edges.length; i++){
                const e = edges[i];
                if(e.start === e.end) console.warn("vertex connected to itself")
                const delta = distance(vertices[e.start], vertices[e.end], is3D);
                const calcs = this.fattract(vertices[e.start], vertices[e.end], delta, is3D)
                const ncalcs = [calcs[0]*-1, calcs[1]*-1, calcs[2]*-1]

                forceList[e.end].addVector(calcs);
                forceList[e.start].addVector(ncalcs);
            }


            //update positions
            const iterAnimations = [];
            var minX = Infinity; var minY = Infinity; var minZ = Infinity;
            var maxX = -Infinity; var maxY = -Infinity; var maxZ = -Infinity;
            var maxForce = -Infinity;
            const origin = new Vertex(0,0,0)

            for(let i = 0; i < vertices.length; i++){
                const forceNorm = distance(forceList[i], origin, is3D);
                const unitvector = unitVector(forceList[i], origin, is3D);
                const unitForce = new Force(unitvector[0], unitvector[1], unitvector[2]);
                unitForce.setX(unitForce.x * Math.min(temperature, Math.abs(forceList[i].x)))
                unitForce.setY(unitForce.y * Math.min(temperature, Math.abs(forceList[i].y)))
                unitForce.setZ(unitForce.z * Math.min(temperature, Math.abs(forceList[i].z)))

                iterAnimations.push(vertices[i].add(unitForce));
                minX = Math.min(minX, iterAnimations[i].x); minY = Math.min(minY, iterAnimations[i].y);
                minZ = Math.min(minZ, iterAnimations[i].z)
                maxX = Math.max(maxX, iterAnimations[i].x); maxY = Math.max(maxY, iterAnimations[i].y);
                maxZ = Math.max(maxZ, iterAnimations[i].z)
                maxForce = Math.max(forceNorm)
            }
            scalingFactor.push([-minX, -minY, -minZ, 1/(maxX -minX), 1/(maxY - minY), 1/(maxZ - minZ)]);
            animations.push(iterAnimations);
            vertices = animations[animations.length -1];
            temperature = this.cool(temperature,initialTemperature, K)
            t += 1
            if(maxForce < epsilon) {
                console.log("Convergence bound met")
                break;
            }
        }

        for(let i = 0; i < animations.length; i++){
            for(let j = 0; j < animations[i].length; j++){
                animations[i][j].x = (animations[i][j].x + scalingFactor[i][0]) * scalingFactor[i][3];
                animations[i][j].y = (animations[i][j].y + scalingFactor[i][1]) * scalingFactor[i][4];
                animations[i][j].z = (animations[i][j].z + scalingFactor[i][2]) * scalingFactor[i][5];
            }
        }



        return animations;
    }

    cool(temperature, initial, iterations){
        const heuristic  = this.tempHeuristic.obj.value;
        if(heuristic === "Linear"){
            return temperature - initial/iterations
        }
        if(heuristic === "Logarithmic"){
            return 0.90*temperature
        }
        if(heuristic === "Directinoal"){
            return temperature
        }
        return temperature
    }

    frepulse(v1, v2, delta, is3D){
        const unitvector = unitVector(v1, v2, is3D)

        return [((Math.pow(this.area,2))/delta)*unitvector[0],
            ((Math.pow(this.area,2))/delta)*unitvector[1],
            ((Math.pow(this.area,2))/delta)*unitvector[2] ]
    }

    fattract(v1, v2, delta, is3D){
        const unitvector = unitVector(v1, v2, is3D)

        return [unitvector[0]*(Math.pow(delta,2))/this.area,
            unitvector[1]*(Math.pow(delta,2))/this.area,
            unitvector[2]*(Math.pow(delta,2))/this.area];
    }
}

//helpers
/**
 * distance between two points (Vertex or Force)
 * @param v1 the first point
 * @param v2 the secont point
 * @param is3D is the data three dimensional?
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
 * @param is3D is the data three dimensional?
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

export default FruchtermanReingold