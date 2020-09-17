export function kamadaKawai(vertices,edges, graph_distancex, graph_distancey, iterations){
  //relevant constants

  const L0 = (graph_distancex+graph_distancey)/2;
  const L = 2;
  const K = 1;


  let new_vertices = [];
  for(let i= 0; i < vertices.length; i++){
    new_vertices.push(vertices[i].slice());
  }
  let new_edges = [];
  //make a copy of edges and copy references of new_vertices
  for(let i = 0; i < vertices.length; i++){
    for(let j = 0; j < vertices.length; j++){
      for(let k =0; k < edges.length; k++){
        if(i === edges[k][0] && j === edges[k][1]){
          new_edges.push([i,j]);
        }
      }
    }
  }
  //create adjacency matrix
  const adj = [];
  // const ideal_lengths = [];
  const force_list = [];
  for(let i = 0; i < vertices.length; i++){
    const adj_row = [];
    // const ideal_length_row = [];
    const force_list_row = [];
    for(let j = 0; j < vertices.length; j++){
      if(i == j) adj_row.push(0);
      if(i!== j) adj_row.push(Infinity);
      // ideal_length_row.push(0);
      force_list_row.push(0);
    }
    // ideal_lengths.push(ideal_length_row);
    force_list.push(force_list_row);
    adj.push(adj_row)
  }
  for(let i = 0; i< edges.length; i++){
    adj[new_edges[i][0]][new_edges[i][1]] = 1;
    adj[new_edges[i][1]][new_edges[i][0]] = 1;
  }
  const max_dij = FloydWarshallAlgo(adj);
  console.log(adj);

  //compute lij
  const ideal_length = L*L0/max_dij;
  console.log(ideal_length);

  //compute kij
  for(let i = 0; i < vertices.length; i++){
    for(let j = 0; j < vertices.length; j ++){
      if(i !== j){force_list[i][j] = K/(Math.pow(adj[i][j],2))};
    }
  }



  //compute Lij

  //compute kij


}

function FloydWarshallAlgo(adj){
  for(let k = 0; k < adj.length; k ++){
    for(let i = 0; i< adj.length; i++){
      for(let j = 0; j < adj.length; j++){
        if(adj[i][j] > adj[i][k] + adj[k][j]) {
          adj[i][j] = adj[i][k] + adj[k][j];
          adj[j][i] = adj[i][k] + adj[k][j];
        }
      }
    }
  }
  var maxRow = adj.map(function(row){return Math.max.apply(Math,row);});
  var max_d = Math.max.apply(null, maxRow);

  return max_d
}
