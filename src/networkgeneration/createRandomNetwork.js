import Vertex from "../datatypes/Vertex";
import Edge from "../datatypes/Edge";

export default function createRandomNetwork(maxWidth, maxHeight, numV, numE, conn, randomType){
  let connected = conn === undefined? "False": conn;
  let seed = randomType === undefined? "random": randomType;
  const maxDegree = numV-1;
  let maxEdges = Math.floor((maxDegree*numV)/2)
  const maxEdgesValue = maxEdges;
  let vertices = [];
  let available_vertices = [];
  const center = [maxWidth/2, maxHeight/2];
  const radius = (maxHeight/2)*0.90;

  //create random points on canvas
  for(let i = 0; i < numV; i ++){
    var point = [0,0]
    if(seed === "random" || seed === "cycle") point = createRandomPos(maxWidth, maxHeight);
    if(seed === "randomcircle") point = createRandomPosCircle(center, radius);
    vertices.push( new Vertex(point[0], point[1]));
    available_vertices.push(i);
  }
  let edges = [];
  if(!(seed === "cycle")){
    let already_connected = new Map();
    let remainingEdges = numE;
    if(connected === "True"){
      let unvisited = [];
      for(var i = 0; i < numV; i++){
        unvisited.push(i);
      }
      let visited = [];
      var vIndex1 = pickRandomVertex(unvisited);
      var v1 = unvisited[vIndex1];
      visited.push(v1);
      unvisited = removeFromArray(unvisited, vIndex1);

      var visited_num = 1;
      while(visited_num < numV){
        var vIndex2 = pickRandomVertex(unvisited)
        var v2 = unvisited[vIndex2];
        visited.push(v2); //add to visited
        edges.push( new Edge(v1,v2));
        vertices[v1].increment_degree();
        vertices[v2].increment_degree();
        remainingEdges --;
        maxEdges --;
        const indexTo = v1 + 1000* v2; // works as long as numV < 1000
        const indexFrom = v2+ 1000*v1;
        already_connected.set(indexTo, true);
        already_connected.set(indexFrom, true);
        //remove from unvisited
        unvisited = removeFromArray(unvisited, vIndex2);
        //reset v1
        vIndex1 = pickRandomVertex(visited);
        v1 = visited[vIndex1];
        visited_num ++;
      }
    }
    while(remainingEdges > 0 && maxEdges > 0 && available_vertices.length > 1){
      const [random1, random2] = connectRandomVertices(available_vertices.slice());
      if(random1 === random2) console.log("unexpected");
      if(random1 === undefined) console.log("unexpected undefiend 1");
      if(random2 === undefined) console.log("unexpected undefined 2");
      // console.log("rem:", remainingEdges, "max", maxEdges);
      const indexTo = random1+1000*random2; // as long as numV < 1000 this works
      const indexFrom = random2+1000*random1;
      if(already_connected.get(indexTo) === undefined ){
        edges.push(new Edge(random1, random2));
        vertices[random1].increment_degree();
        vertices[random2].increment_degree();
        if(vertices[random1].degree > maxDegree) available_vertices.splice(random1, 1);
        if(vertices[random2].degree > maxDegree) available_vertices.splice(random2, 1);
        already_connected.set(indexTo, true);
        already_connected.set(indexFrom, true);
        remainingEdges --;
        maxEdges --;
        }
      }
  }
  else{
    //seed = cycle
    var [path,root] = initial_random_cycle(vertices);
    for(let i = 0; i < path.length-1; i++){
      edges.push(new Edge(path[i], path[i+1]));
    }
  }
  return [vertices,edges];
}

function createRandomPos(maxWidth, maxHeight){
  return [Math.random()*(maxWidth+1-3), Math.random()*(maxHeight+1-3)];
}

function createRandomPosCircle(center,radius){
  const randomAngle = Math.random()*(2*Math.PI);
  return [center[0] + radius*Math.cos(randomAngle), center[1]+radius*Math.sin(randomAngle)];
}

function connectRandomVertices(vertices){
  var random1 = vertices[Math.floor(Math.random()*vertices.length)];
  vertices.splice(random1,1);
  var random2 = vertices[Math.floor(Math.random()*vertices.length)];

  return [random1, random2];
}

function pickRandomVertex(array){
  return Math.floor(Math.random()*array.length)
}

function removeFromArray(array, index){
  return array.slice(0,index).concat(array.slice(index+1))
}

function initial_random_cycle(vertices){

  var root = 0;
  var initial_path = []

  //construct adjacency matrix
  const adj = []
  var available_vertices = [];
  for(let i = 0; i < vertices.length; i++){
    available_vertices.push(i);

  }


  root = pick_random_array(available_vertices);
  available_vertices = remove_from_array(available_vertices, root);

  initial_path.push(root);
  for(let i = 0; i < vertices.length -1; i++){
    const next_node = pick_random_array(available_vertices);
    available_vertices = remove_from_array(available_vertices, next_node);
    initial_path.push(next_node);
  }
  initial_path.push(root);

  return [initial_path, root];
}

function remove_from_array(array, item){
  var index  = array.indexOf(item)
  return array.slice(0,index).concat(array.slice(index+1));
}

function pick_random_array(array){
  return array[Math.floor(Math.random()*array.length)];
}
