import AbstractLayoutAlgorithm from "./AbstractLayoutAlgorithm";
import Force from "../../../datatypes/Force.js"
import AlgorithmSettingObject from "../AlgorithmSetting";

class ForceAtlasLinLog extends AbstractLayoutAlgorithm{
    constructor(){
        super("Force Atlas Lin-Log");



        this.iterations = AlgorithmSettingObject.newRangeSetting(
            "Maximum iterations",
            100,
            300,
            1,
            100
        )


        this.kr = AlgorithmSettingObject.newRangeSetting(
            "Force of Repulsion",
            0.01,
            20,
            0.1,
            10)

        this.ks = AlgorithmSettingObject.newRangeSetting(
            "System Angular Swing",
            0.1,
            1,
            0.1,
            0.1
        )

        this.gravity = AlgorithmSettingObject.newCheckBoxSetting(
            "Gravitational Force",
            false)

        this.kg = AlgorithmSettingObject.newRangeSetting(
            "Force of Gravity",
            0.1,
            20,
            0.1,
            10
        )

        this.tau = AlgorithmSettingObject.newRangeSetting(
            "Angular Speed Tolerance",
            0.1,
            2,
            0.1,
            0.1
        )

        this.ksmax = AlgorithmSettingObject.newRangeSetting(
            "Angular swing cap",
            1,
            20,
            0.1,
            10,
        )

        this.dissaudeHub= AlgorithmSettingObject.newCheckBoxSetting(
            "Dissuade Hubs",
            true,
        )

        this.settings.push([
            this.iterations,
            this.kr,this.gravity,
            this.kg,
            this.tau,
            this.ks,
            this.ksmax,
            this.dissaudeHub]);
    }

    /**
     * gets the settings of the force atlas 2 algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    async getAnimations(vertices, edges, is3D){
        const animations = [];
        let t = 1;
        let scalingFactor = [];
        let previousForces = [];
        let currentVertices = this.createAnimationFrame(vertices);
        animations.push(currentVertices);
        scalingFactor.push([0,0,0,1,1,1])


        for(let i = 0; i < vertices.length; i++){
            previousForces.push(new Force(0,0,0));
        }



        while(t < this.iterations.obj.value){
            let forceList = [];

            //CALCULATE REPULSIVE FORCES
            for(let i = 0; i < vertices.length; i++){
                let f = new Force(0, 0, 0);

                for(let j = 0; j < vertices.length; j++){
                    if(i !== j){
                        const repulseForce = this.frepulse(currentVertices[i], currentVertices[j], is3D);
                        f.addVector(repulseForce);
                    }
                }
                forceList.push(f);
            }

            //CALCULATE ATTRACTIVE FORCES
            for(let i = 0; i < edges.length; i++){
                const e = edges[i];
                const attractiveForce = this.fattract(currentVertices[e.start], currentVertices[e.end], is3D);
                let attractiveForceOpp;
                if(!is3D) attractiveForceOpp = [-attractiveForce[0], -attractiveForce[1]];
                if(is3D) attractiveForceOpp = [-attractiveForce[0], -attractiveForce[1], -attractiveForce[2]]
                forceList[e.start].addVector(attractiveForce);
                forceList[e.end].addVector(attractiveForceOpp); //have to add the vector in other direction for it to be additive
            }

            //CALCULATE GRAVITY FORCES
            if(this.gravity.obj.value){
                let center = [];
                let centerForce = [0, 0];
                if(!is3D){
                    center = t === 1? [1/2, 1/2] : [1/2 * (1/scalingFactor[t-2][3]), 1/2 * (1/scalingFactor[t-2][4])];
                    centerForce = new Force(center[0], center[1])
                } else{
                    center = t === 1? [1/3, 1/3, 1/3] : [
                        1/3 * (1/scalingFactor[t-2][3]),
                        1/3 * (1/scalingFactor[t-2][4]),
                        1/3 * (1/scalingFactor[t-2][5])
                    ];
                    centerForce = new Force(center[0], center[1], center[2]);
                }

                for(let i = 0; i < vertices.length; i++){
                    const gravityForce = this.fgravity(currentVertices[i], centerForce, is3D);
                    forceList[i].addVector(gravityForce)
                }
            }

            //update global speed
            let sG = 0;
            let traG = 0;
            let swgG = 0;
            let minX = Infinity; let minY = Infinity; let minZ = Infinity;
            let maxX = -Infinity; let maxY = -Infinity; let maxZ = -Infinity;
            let fN = 0;
            for(let i = 0; i < forceList.length; i++){
                const origin = new Force(0, 0, 0);
                const combinedForce = new Force(
                    forceList[i].x + previousForces[i].x,
                    forceList[i].y + previousForces[i].y,
                    forceList[i].z + previousForces[i].z);
                const traN = distance(combinedForce, origin, is3D)/2;
                traG += (vertices[i].degree + 1) * traN
                const directionForce = new Force(
                    forceList[i].x - previousForces[i].x,
                    forceList[i].y - previousForces[i].y,
                    forceList[i].z - previousForces[i].z);
                const swgN = distance(directionForce, origin, is3D);
                swgG += (vertices[i].degree + 1) * swgN;
                sG += traN/swgN
            }


            let sN = 0;
            currentVertices = this.createAnimationFrame(currentVertices);
            for(let i = 0; i < vertices.length; i++){
                //find direction of forces
                const origin = new Force(0, 0, 0);

                //calculate temperatures
                const directionForce = new Force(
                    forceList[i].x - previousForces[i].x,
                    forceList[i].y - previousForces[i].y,
                    forceList[i].z - previousForces[i].z
                )
                const swgN = distance(directionForce, origin, is3D);
                sN = Math.min((this.ks.obj.value*sG)/(1 + sG * Math.sqrt(swgN)),
                    this.ksmax.obj.value/distance(forceList[i], origin, is3D));
                currentVertices[i].x += sN*forceList[i].x;
                currentVertices[i].y += sN*forceList[i].y;
                currentVertices[i].z += sN*forceList[i].z;

                //update previous forces
                previousForces[i] = forceList[i];

                //update constants for scaling factor
                minX = Math.min(minX, currentVertices[i].x); minY = Math.min(minY, currentVertices[i].y);
                minZ = Math.min(minZ, currentVertices[i].z);

                maxX = Math.max(maxX, currentVertices[i].x); maxY = Math.max(maxY, currentVertices[i].y);
                maxZ = Math.max(maxZ, currentVertices[i].z);
            }
            animations.push(currentVertices);
            scalingFactor.push([-minX, -minY, -minZ, 1/(maxX-minX), 1/(maxY-minY), 1/(maxZ-minZ)]);
            t += 1;
        }

        //Rescale all the animations within the frame
        for(let i = 0; i < animations.length; i++){
            for(let j = 0; j < animations[i].length; j ++){
                animations[i][j].x = (animations[i][j].x + scalingFactor[i][0])*scalingFactor[i][3];
                animations[i][j].y = (animations[i][j].y + scalingFactor[i][1])*scalingFactor[i][4];
                animations[i][j].z = (animations[i][j].z + scalingFactor[i][2])*scalingFactor[i][5];
            }
        }



        return animations;
    }

    /**
     * Calculates the repulsive forces between two vertices in the Force Atlas algorithm
     * @param x
     * @param y
     * @param is3D
     * @returns {number[]}
     */
    frepulse(x, y, is3D){
        let dist = distance(x, y, is3D);
        let unitvector = unitVector(y,x, is3D);

        if(is3D){
            return [unitvector[0]*this.kr.obj.value*(((x.degree+1)*(y.degree+1))/dist),
                unitvector[1]*this.kr.obj.value*(((x.degree+1)*(y.degree+1))/dist),
                unitvector[2]*this.kr.obj.value*(((x.degree+1)*(y.degree+1))/dist)
            ];
        }
        return [unitvector[0]*this.kr.obj.value*(((x.degree+1)*(y.degree+1))/dist),
            unitvector[1]*this.kr.obj.value*(((x.degree+1)*(y.degree+1))/dist)];
    }

    fattract(x, y, is3D){
        let dist = this.dissaudeHub?Math.log(1+distance(x, y, is3D))/(x.degree + 1): Math.log(distance(x,y, is3D));
        let unitvector = unitVector(x,y, is3D);

        if(is3D){
            return [unitvector[0] *dist, unitvector[1]*dist, unitvector[2]*dist];
        }
        return [unitvector[0] *dist, unitvector[1]*dist];
    }

    fgravity(v, center, is3D){
        let distCenter = distance(v,center, is3D);
        let unitvector = unitVector(v,center, is3D);

        if(is3D){
            return [unitvector[0]*this.kg.obj.value*(v.degree+1)*distCenter,
                unitvector[1]*this.kg.obj.value*(v.degree+1)*distCenter,
                unitvector[2]*this.kg.obj.value*(v.degree+1)*distCenter,
            ];
        }

        return [unitvector[0]*this.kg.obj.value*(v.degree+1)*distCenter,
            unitvector[1]*this.kg.obj.value*(v.degree+1)*distCenter];
    }

    /**
     * create a copy of the current vertices in the network
     * @param vertices
     * @returns {[]}
     */
    createAnimationFrame(vertices){
        const res = [];
        vertices.forEach((v) => {res.push(v.copyVertex())})
        return res
    }
}

/**
 * distance between two points (Vertex or Force)
 * @param v1 the first point
 * @param v2 the secont point
 * @param is3D is the data three dimensional?
 */
function distance(v1, v2, is3D){
    let dist;
    if (is3D) {dist = Math.sqrt(
        Math.pow((v1.x - v2.x), 2)
        + Math.pow((v1.y - v2.y), 2)
        + Math.pow((v1.z-v2.z),2))
    } else{
        dist = Math.sqrt(
            Math.pow((v1.x - v2.x), 2)
            + Math.pow((v1.y - v2.y), 2))
    }
    return dist === 0? 0.00000001: dist;

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

export default ForceAtlasLinLog;