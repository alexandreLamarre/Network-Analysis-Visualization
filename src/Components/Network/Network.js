import {NewDefaultNetworkSettings} from "./NetworkSettings";
import Vertex from "./datatypes/Vertex";
import Edge from "../../datatypes/Edge";
/**
 * Network is a class that handles the implementation of a network:
 *   - network settings
 *      - network generation
 *      - network properties
 *   - network data
 */

class Network{
    constructor(settings, isThreeDimensional){
        this.isThreeDimensional = isThreeDimensional
        this.networkSettings = settings

        // TODO assign these values based on parsing network settings
        this.numV = 200
        this.numE = 400
        this.randomType = "random"
        this.networkProperties = {}
        this.networkProperties.cycle = false
        this.networkProperties.connected = false
        const [vertices, edges] = this.createRandomNetwork()

        this.vertices = vertices
        this.edges = edges
    }

    /**
     * Creates a random network with 2/3 dimensional vertices and edges with position values between 0 and 1
     */
    createRandomNetwork(){
        const maxDegree = this.numV - 1
        var maxEdges = Math.floor(maxDegree*this.numV/2)
        const vertices = []
        let availableVertices = [] //used for determining edge assignment
        //create random points from 0 to 1
        for(let i = 0; i < this.numV; i++){
            if (this.randomType === "random"){
                if (this.isThreeDimensional){
                    vertices.push(new Vertex(Math.random(), Math.random(), Math.random()))
                } else{
                   vertices.push(new Vertex(Math.random(), Math.random()))
                }
            }
            availableVertices.push(i)
        }
        const edges = []
        if (!this.networkProperties.cycle){
            let already_connected = new Map();
            let remainingEdges = this.numE;

            if (this.networkProperties.connected){
                //connect the network before assigning remaining edges
            }

            // assign remaining edges to network
            while(remainingEdges > 0 && maxEdges > 0 && availableVertices.length > 1){
                const [random1, random2] = connectRandomVertices(availableVertices.slice())
                if(random1 === random2) throw new Error("Randomly selected values in network generation were the same")
                if(random1 === undefined) throw new Error("Randomly selected value 1 in network generation was undefined ")
                if(random2 === undefined) throw new Error("Randomly selected value 2 in network generation was undefined ")

                const indexTo = random1+1000*random2; // as long as numV < 1000 this works
                const indexFrom = random2+1000*random1;
                if(already_connected.get(indexTo) === undefined ){
                    edges.push(new Edge(random1, random2));
                    vertices[random1].increment_degree();
                    vertices[random2].increment_degree();
                    if(vertices[random1].degree > maxDegree) availableVertices.splice(random1, 1);
                    if(vertices[random2].degree > maxDegree) availableVertices.splice(random2, 1);
                    already_connected.set(indexTo, true);
                    already_connected.set(indexFrom, true);
                    remainingEdges --;
                    maxEdges --;
                }
            }
        }
        return [vertices, edges];
    }
}

function parseNetworkPropertiesFromSettings(){

}

function connectRandomVertices(vertices){
    var random1 = vertices[Math.floor(Math.random()*vertices.length)];
    vertices.splice(random1,1);
    var random2 = vertices[Math.floor(Math.random()*vertices.length)];
    return [random1, random2];
}

export default Network