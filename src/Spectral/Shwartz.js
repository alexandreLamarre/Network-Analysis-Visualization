function schwartz(vertices, edges){
  const adj = createAdjacencyMatrix(vertices, edges);



}

function greedyVertexSplitting(vertices, adj){
  const nc = 0;
  const visited = [];
  const subgraphs = [];
  for(i = 0; i < vertices.length; i++){
    const newly_visited = getNeighbors(vertices, i, adj);
    if(!visited(newly_visited, visited)){
      nc += 1;
      subgraphs.push([i, ...newly_visited]);
      visited.push(i);
      for(let j = 0; j < newly_visited.length; j++){
        visited.push(newly_visited[j]);
      }
    }
    else{
      continue;
    }
  }

  //isolated vertices 
}


function createAdjacencyMatrix(v, e){
  const adj = [];
  for(let i = 0; i < v.length; i++){
    const adj_row = [];
    for(let j = 0; j < v.length; j++){
      adj_row.push(0);
    }
    adj.push(adj_row);
  }

  for(let i = 0; i < e.length; i ++){
    adj[e[i].start][e[i].end] = 1;
    adj[e[i].end][e[i].start] = 1;
  }
  return adj;
}

function getNeighbors(vertices, index, adj){
  const neighbors = [];
  for(let i = 0; i < vertices.length; i ++){
    if(adj[index][i] === 1) neighbors.push(i);
  }
  return neighbors;
}

function visited(to_check, visited){
  for(let i = 0; i < to_check; i ++){
    if(in_visited(to_check[i], visited)) return true;
  }
  return false;
}

function in_visited(el, visited){
  for(let i = 0; i < visited; i ++){
    if(el === visited[i]) return true;
  }
  return false;
}
