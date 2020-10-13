import Vertex from "../datatypes/Vertex";
import Edge from "../datatypes/Edge";

export function prim(vertices, edges, dimension, color){
  //constants
  var coloring = rgb_to_str(color);
  if(coloring === null || coloring === undefined) coloring = "rgb(255,0,0)";
  const color_animations = [];

  //make copies of input
  const current_vertices = [];
  const current_edges = [];
  for(let i = 0; i < vertices.length; i++){
    const v = new Vertex(vertices[i].x, vertices[i].y, vertices[i].z);
    v.setColor(vertices[i].color);
    current_vertices.push(v);
  }
  for(let j = 0; j < edges.length; j++){
    const e = new Edge(edges[j].start, edges[j].end);
    e.setColor(edges[j].color);
    e.setAlpha(edges[j].alpha);
    current_edges.push(e);
  }
  color_animations.push(createFrame(current_vertices, current_edges)); //initial state

  //construct adjacency matrix
  const adj = [];
  for(let i = 0; i <vertices.length; i ++){
    const adj_row = [];
    for(let j = 0; j < vertices.length; j++){
      adj_row.push(0);
    }
    adj.push(adj_row);
  }
  // assign adjacency values
  for(let e =0; e < edges.length; e++){
    adj[edges[e].start][edges[e].end] = e;
    adj[edges[e].end][edges[e].start] = e;
  }

  var vertexQueue = [];
  for(let i = 0; i < vertices.length; i++){
    vertexQueue.push({key: Infinity, parent: null, vertex: i})
  }

  const A = [];

  while(vertexQueue.length !== 0){
    var u;
    [u,vertexQueue] = pop(vertexQueue);
    if(!(u.vertex in A)){
      current_vertices[u.vertex].color = coloring;
      color_animations.push(createFrame(current_vertices, current_edges))
      // color_animations.push({vIndex: u.vertex, color: coloring});
      if(u.parent !== null){
        current_edges[adj[u.vertex][u.parent]].color = coloring;
        current_edges[adj[u.vertex][u.parent]].alpha = 0.4;
        color_animations.push(createFrame(current_vertices, current_edges));
      }
    }


    for(let i = 0; i < adj[u.vertex].length; i ++){
      if(adj[u.vertex][i] !== 0){
          for(let k = 0; k < vertexQueue.length; k ++){
            if(vertexQueue[k].vertex === i && distance(vertices[u.vertex],
                                  vertices[vertexQueue[k].vertex], dimension) < vertexQueue[k].key){
                vertexQueue[k].key = distance(vertices[u.vertex],
                                    vertices[vertexQueue[k].vertex], dimension)
                vertexQueue[k].parent = u.vertex;
            }
          }
      }
    }
    //end for
    if(vertexQueue.length !== 2) vertexQueue.sort(function(v1,v2) {return v1.key - v2.key});

  }

  return color_animations;
}

function pop(array){
  const poppedValue = array[0];
  if(array.length > 1)array = array.slice(1);
  else if(array.length === 1) array = [];
  return [poppedValue,array]
}

function distance(v1,v2, dimension){
  var dist;
  if(dimension === 2) dist = Math.pow((v1.x-v2.x),2) + Math.pow((v1.y-v2.y),2);
  if(dimension === 3) dist =  Math.pow((v1.x-v2.x),2) + Math.pow((v1.y-v2.y),2)+ Math.pow((v1.z-v2.z),2);
  if(dist === 0) dist = 0.00000000000000000001;
  return Math.sqrt(dist);
}

function rgb_to_str(color){
  return "rgb("+color[0]+","+color[1]+","+color[2]+")";
}

function createFrame(vertices, edges){
  const new_vertices = [];
  for(let i = 0; i < vertices.length; i ++){
    const v = new Vertex(vertices[i].x, vertices[i].y, vertices[i].z);
    v.setColor(vertices[i].color);
    new_vertices.push(v);
  }
  const new_edges = [];
  for(let j = 0; j < edges.length; j++){
    const e = new Edge(edges[j].start, edges[j].end);
    e.setColor(edges[j].color);
    e.setAlpha(edges[j].alpha);
    new_edges.push(e);
  }
  return {vertices: new_vertices, edges: new_edges};
}
