
export function prim(vertices, edges, dimension, color){
  var coloring = color;
  if(coloring === null || coloring === undefined) coloring = "rgb(255,0,0)";

  //construct adjacency matrix
  const adj = [];
  for(let i = 0; i <vertices.length; i ++){
    const adj_row = [];
    for(let j = 0; j < vertices.length; j++){
      adj_row.push(0);
    }
    adj.push(adj_row);
  }

  for(let e =0; e < edges.length; e++){
    adj[edges[e].start][edges[e].end] = e;
    adj[edges[e].end][edges[e].start] = e;
  }

  var vertexQueue = [];
  for(let i = 0; i < vertices.length; i++){
    vertexQueue.push({key: Infinity, parent: null, vertex: i})
  }

  const A = [];
  const color_animations = [];
  while(vertexQueue.length !== 0){
    var u;
    [u,vertexQueue] = pop(vertexQueue);
    if(!(u.vertex in A)){
      color_animations.push({vIndex: u.vertex, color: coloring});
      if(u.parent !== null){
        color_animations.push({eIndex: adj[u.vertex][u.parent], color:coloring, alpha: 0.4});
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
