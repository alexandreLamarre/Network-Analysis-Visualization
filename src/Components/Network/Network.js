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
    /**
     * Make a new network datatype to be shared by App and all its descendants,
     * without having to be tied to an asynchronous react state
     * @param settings NetworkSettings object provided by app when it is mounted
     * @param isThreeDimensional boolean indicating whether the data should be 2D (false) or 3D (true)
     */
    constructor(settings, isThreeDimensional){
        this.isThreeDimensional = isThreeDimensional
        this.settings = settings

        this.edgeInitialColor = "rgb(41,150,150)" // only for 3D edges, or when color gradient is selected for network
        this.createRandomNetwork()
        this.shouldUpdate = false //this attribute handles whether or not a change to the loaded network attributes
                                // should result in a redraw for 3D networks (only used to improve performance)

    }

    set3D(bool){
        this.isThreeDimensional = bool
    }

    /**
     * @returns whether or not a new random network should be assigned
     */
    shouldReset(){
        return this.settings.shouldReset
    }

    /**
     * Creates a random network with 2/3 dimensional vertices and edges with position values between 0 and 1
     * based on the network settings currently assigned to this network
     */
    createRandomNetwork(){
        const maxDegree = this.settings.numV - 1
        var maxEdges = Math.floor(maxDegree*this.settings.numV/2)
        const vertices = []
        let availableVertices = [] //used for determining edge assignment
        //create random points from 0 to 1
        for(let i = 0; i < this.settings.numV; i++){
            if (this.isThreeDimensional){
                vertices.push(new Vertex(Math.random(), Math.random(), Math.random()))
            } else{
               vertices.push(new Vertex(Math.random(), Math.random()))
            }
            availableVertices.push(i)
        }


        const edges = []
        if (!this.settings.properties.Cycle){
            let already_connected = new Map();
            let remainingEdges = this.settings.numE;

            if (this.settings.properties.Connected){
                //connect the network before assigning remaining edges
                let unvisited = []
                for(let i = 0; i < this.settings.numV; i++){
                    unvisited.push(i)
                }
                let visited = []
                var vIndex1 = pickRandomVertex(unvisited)
                var v1 = unvisited[vIndex1]
                visited.push(v1)
                unvisited = removeFromArray(unvisited, vIndex1)
                var visitedNum = 1;
                while(visitedNum < this.settings.numV) {
                    var vIndex2 = pickRandomVertex(unvisited)
                    var v2 = unvisited[vIndex2]
                    visited.push(v2)
                    edges.push(new Edge(v1, v2))
                    if (this.isThreeDimensional) edges[edges.length - 1].color = this.edgeInitialColor
                    vertices[v1].increment_degree()
                    vertices[v2].increment_degree()
                    remainingEdges--;
                    maxEdges--;
                    const indexTo = v1 + 1000 * v2 //works as long as numV < 1000
                    const indexFrom = v2 + 1000 * v1;
                    already_connected.set(indexTo, true)
                    already_connected.set(indexFrom, true)
                    unvisited = removeFromArray(unvisited, vIndex2)
                    vIndex1 = pickRandomVertex(visited)
                    v1 = visited[vIndex1]
                    visitedNum++
                }
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
                    if (this.isThreeDimensional){
                        edges[edges.length-1].color = this.edgeInitialColor
                    }
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
        else{
            var [path, root] = initialRandomCycle(vertices);
            for(let i = 0; i < path.length -1; i++){
                const e = new Edge(path[i], path[i+1])
                if (this.isThreeDimensional) e.color = this.edgeInitialColor
                edges.push(e)
            }

            for(let i = 0; i < vertices.length; i++){
                vertices[i].degree = 2
            }
        }
        this.settings.shouldReset = false
        this.vertices = vertices
        this.edges = edges
    }
}

//helpers
/**
 * Returns a valid index of an array, used for picking vertex indices at random
 * @param array the array to measure
 * @returns {number} the random index
 */
function pickRandomVertex(array){
    return Math.floor(Math.random()*array.length)
}

/**
 * picks a random element from an array
 * @param array the array we want to get a random element from
 * @returns {*} a random element of array
 */
function pickFromRandomArray(array){
    return array[Math.floor(Math.random()*array.length)];
}

/**
 * removes the element at specified index in the array
 * @param array the array we want to remove from
 * @param index the index we want to remove
 * @returns {*} the array resulting from removal of item at index index
 */
function removeFromArray(array, index){
    return array.slice(0, index).concat(array.slice(index+1))
}

/**
 * removes the specified item in the array
 * @param array the array we want to remove from
 * @param item the item we want to remove
 * @returns {*} the array with item item removed
 */
function removeSpecificFromArray(array, item){
    var index = array.indexOf(item)
    return array.slice(0, index).concat(array.slice(index+ 1))
}

/**
 * Constructs a random hamiltionian path from a set of vertices
 * @param vertices the vertices of the network
 * @returns {([]|*|number)[]} the initial path / root of the the path
 */
function initialRandomCycle(vertices){
    var root = 0;
    var initialPath = []
    //construct adjacency matrix
    const adj = []
    var availableVertices = [];
    for(let i = 0; i < vertices.length; i++){
        availableVertices.push(i);
    }
    root = pickFromRandomArray(availableVertices);
    availableVertices = removeSpecificFromArray(availableVertices, root);

    initialPath.push(root);
    for(let i = 0; i < vertices.length -1; i++){
        const next_node = pickFromRandomArray(availableVertices);
        availableVertices = removeSpecificFromArray(availableVertices, next_node);
        initialPath.push(next_node);
    }
    initialPath.push(root);
    return [initialPath, root];
}


function connectRandomVertices(vertices){
    var random1 = vertices[Math.floor(Math.random()*vertices.length)];
    vertices.splice(random1,1);
    var random2 = vertices[Math.floor(Math.random()*vertices.length)];
    return [random1, random2];
}

export default Network