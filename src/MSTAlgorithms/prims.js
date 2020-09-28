

export function prims(vertices, edges, color){

  var coloring = color
  if(color ===null || color === undefined)?"rgb(255,0,0)": coloring = color
  //construct adjacency matrix:
  const adj = [];
  const unvisited = [];
  for(let i = 0; i < vertices.length; i++){
    const adj_row = [];
    for(let j = 0; j < vertices.length; j ++){
      adj_row.push(0)
    }
    adj.push(adj_row);
    unvisited.push(i);
  }

  for(let e =0; e< edges.length; e++){
    adj[e.start][e.end] = 1;
    adj[e.end][e.start] = 1;
  }

  //pick random vertex
  const start_vertex = Math.floor(Math.random()*vertices.length);
  unvisited[start_vertex] = false;


  //first animation
  var visited = [];
  visited.push(start_vertex);
  const color_animation = []
  color_animation.push({vIndex: start_index, color:coloring})

  while(all(unvisited) !== false){
    for(let i = 0; i < visited; i++){
      for(let j = 0; j < adj[i].length; j++){
        if(adj[visited[i]][j] === 1 && j in unvisited){
          visited.push(j);
          unvisited[j] = false;

          color_animation.push({vIndex: j, eIndex: visited[i], color:coloring});
        }
      }
    }
  }

}

function removeFromArray(array, index){
  if(array.length === 1) return [];
  return visited.slice(0,index).concat(visited.slice(index+1, array.length));
}
