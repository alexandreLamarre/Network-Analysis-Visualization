import AbstractLayoutAlgorithm from "./AbstractLayoutAlgorithm";
import SquareMatrix from "../../../datatypes/SquareMatrix";
import AlgorithmSettingObject from "../AlgorithmSetting";

class GeneralizedEigenvector extends AbstractLayoutAlgorithm{
    constructor(){
        super("Generalized Eigenvector")

        this.iterations = AlgorithmSettingObject.newRangeSetting(
            "Convergence iterations",
            50,
            200,
            1,
            100);
        this.settings.push([this.iterations])
        this.setRequiredProperty(null)
    }

    /**
     * gets the settings of the fruchterman reingold algorithm
     * @returns {AlgorithmSettings}
     */
    getSettings(){
        return this.settings
    }

    /**
     * Get the animations for a generalized eigenvector layout algorithm
     * @param vertices
     * @param edges
     * @param is3D
     * @returns {Promise<[]>}
     */
    async getAnimations(vertices, edges, is3D){
        const epsilon = Math.pow(10, -7);
        const dimension = is3D? 4: 3; // 1-index network data for clarity (makes the linear algebra less confusing)

        //import matrices
        let A = []; //adjacency
        let D = []; //degree
        let Dinv = []; // degree inverse
        let L = []; //laplacian

        //Pre-compute important matrices
        for(let i = 0; i < vertices.length; i++){
            const adjRow = [];
            const degreeRow = [];
            const inverseDegreeRow = [];
            const laplacianRow = [];
            for(let j = 0; j < vertices.length; j++){
                adjRow.push(0);
                degreeRow.push(0);
                inverseDegreeRow.push(0);
                laplacianRow.push(0);
                if(i === j){
                    degreeRow[i] = vertices[i].degree;
                    inverseDegreeRow[i] = 1/vertices[i].degree;
                    laplacianRow[i] = vertices[i].degree;
                }
            }
            A.push(adjRow);
            D.push(degreeRow);
            Dinv.push(inverseDegreeRow);
            L.push(laplacianRow);
        }

        for(let i = 0; i < edges.length; i++){
            A[edges[i].start][edges[i].end] = 1;
            A[edges[i].end][edges[i].start] = 1;
            L[edges[i].start][edges[i].end] = -1;
            L[edges[i].end][edges[i].start] = -1;
        }
        A = new SquareMatrix(A);
        L = new SquareMatrix(L);
        D = new SquareMatrix(D);
        Dinv = new SquareMatrix(Dinv);

        const intermediateMat = Dinv.matrixMultiply(A);
        for(let i = 0; i < intermediateMat.length; i++){
            intermediateMat[i][i]++;
        }
        for(let i = 0; i < intermediateMat.length; i++){
            for(let j = 0; j < intermediateMat.length; j++){
                intermediateMat[i][j] *= 1/2;
            }
        }
        let C = new SquareMatrix(intermediateMat);
        //end of matrix precomputation

        //instantiate default eigenvector
        const eigenvectors = [];
        const v1 = [];
        vertices.forEach(() => v1.push(1));
        eigenvectors.push(v1);

        //computing degree normalized eigenvectors v2 ... vk where k is data dimension + 1
        for(let i = 2; i < dimension+1; i++){
            let newViVector = randomVector(vertices.length);
            normalize(newViVector);

            //Normalize against previous eigenvectors;
            let newVi = newViVector;
            //
            for(let j = 0; j < i -1; j ++){
                newVi = orthogonalize(newVi, eigenvectors[j], D);
            }
            newViVector = C.lMultiply(newVi);
            normalize(newViVector);

            var iterations = 0;
            while(dotProduct(newViVector, newVi) < 1- epsilon){
                newVi = C.lMultiply(newViVector);
                normalize(newVi);
                iterations ++;
                if(iterations > this.iterations.obj.value) break;
            }
            eigenvectors.push(newVi)
        }
        //even though the vectors are normalized, we have to rescale them to be in the range 0, 1
        for(let dim =1; dim < dimension; dim++){
            let min = Infinity;
            let max = -Infinity;
            for(let k = 0; k < eigenvectors[dim].length; k++){
                min = Math.min(eigenvectors[dim][k], min);
                max = Math.max(eigenvectors[dim][k], max);
            }
            console.log("Minimum found", min)
            for(let k = 0; k < eigenvectors[dim].length; k++){
                eigenvectors[dim][k] = (eigenvectors[dim][k] - min)/(max-min)

            }
        }

        const animations = [];
        const firstFrame = this.createAnimationFrame(vertices);
        animations.push(firstFrame);
        let currentVertices = vertices
        for(let dim = 1; dim < dimension; dim++){
            for(let k = 0; k < eigenvectors[dim].length; k++){
                const frame = this.createAnimationFrame(currentVertices);
                for(let j = 0; j < vertices.length; j++){
                    if(dim === 1)frame[k].x = eigenvectors[dim][k]
                    if(dim === 2)frame[k].y = eigenvectors[dim][k]
                    if(is3D && dim === 3) frame[k].z = eigenvectors[dim][k]

                }
                animations.push(frame);
                currentVertices = frame;
            }
        }
        return animations;

    }

    createAnimationFrame(vertices){
        const res = [];
        vertices.forEach((v) => {res.push(v.copyVertex())});
        return res;
    }
}

export default GeneralizedEigenvector;

/**
 * Generates a vector with random values between 0 and 1
 * @param size the size of the random vector to generate
 * @returns {[]} the random vector
 */
function randomVector(size){
    const newVector = [];
    for(let i = 0; i < size; i ++){
        newVector.push(Math.random())
    }
    return newVector;
}

/**
 * Normalize a vector in place
 * @param vector returns a normalized vector
 */
function normalize(vector){
    let sum = vector.reduce(function(a,b){return a+ Math.pow(b,2)});
    sum = Math.sqrt(sum)
    for(let i = 0; i < vector.length; i ++){
        vector[i] = vector[i]/sum
    }
}

/**
 * Orthogonalize one vector with respect to another under the degree matrix transformation
 * @param u vector to orthogonalize
 * @param v vector to orthogonalize against
 * @param D the degree matrix of the network
 * @returns {[]} the orthogonalized vector
 */
function orthogonalize(u, v, D){
    const numeratorDtimesUj = D.rMultiply(v)
    const numerator = dotProduct(u, numeratorDtimesUj);
    const denominator = dotProduct(v, numeratorDtimesUj);
    const newVector = [];
    for(let i = 0; i < u.length; i++){
        newVector.push(u[i] - v[i]*(numerator/denominator));
    }
    return newVector;

}

/**
 * returns the dotProduct of two vectors v1 and v2
 * @param v1
 * @param v2
 * @returns {number} dot product result
 */
function dotProduct(v1,v2){
    var sum = 0;
    for(let i = 0; i < v1.length; i ++){
        sum += v1[i]*v2[i];
    }
    return sum
}