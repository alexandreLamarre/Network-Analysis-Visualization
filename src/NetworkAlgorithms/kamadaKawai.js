export function kamadaKawai(vertices,edges, graph_distancex, graph_distancey, iterations){
  //relevant constants

  const L0 = (graph_distancex+graph_distancey)/2;
  const L = 2;
  const K = 1;
  const epsilon = 1;

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

  let maxdM = Infinity;
  const partials_list = [];
  for(let i = 0; i < vertices.length; i++){
    partials_list.push([0,0]);
  }

  while(maxdM > epsilon){
    for(let i = 0; i < vertices.length; i ++){
      for(let j = 0; j < vertices.length; j ++){
        if(i !== j){
          partials_list[i][0] += adj[i][j] * (new_vertices[i][0] - new_vertices[j][0] - (ideal_length*(new_vertices[i][0] - new_vertices[j][0]))/distance(new_vertices[i],new_vertices[j]));
          partials_list[i][1] += adj[i][j] * (new_vertices[i][1] - new_vertices[j][1] - (ideal_length*(new_vertices[i][1] - new_vertices[j][1]))/distance(new_vertices[i],new_vertices[j]));
        }
      }
    }
    const dM = [];
    for(let i = 0; i < vertices.length; i ++){
      const dist = distance(partials_list[i], [0,0]);
      dM.push(dist);
    }
    maxdM = Math.max(...dM);
    const index = dM.indexOf(maxdM);
    while(maxdM > epsilon){
      var d2Ed2x = 0;
      var d2Ed2y = 0;
      var d2Edxdy = 0;
      var d2Edydx = 0;
      var dEdx = 0;
      var dEdy = 0;
      var dx = 0;
      var dy = 0;
      for(let i = 0; i < vertices.length; i++){
        if(i !== index){
          d2Ed2x += adj[index][i] * (new_vertices[index][0] - new_vertices[i][0] - (ideal_length*Math.pow(new_vertices[index][0] - new_vertices[i][0],2))/Math.pow(distance(new_vertices[index],new_vertices[i]), 3));
          d2Ed2y += adj[index][i] * (new_vertices[index][1] - new_vertices[i][1] - (ideal_length*Math.pow(new_vertices[index][1] - new_vertices[i][1],2))/Math.pow(distance(new_vertices[index],new_vertices[i]),3));
          d2Edxdy += adj[index][i] * (ideal_length*(new_vertices[index][0]-new_vertices[i][0])*(new_vertices[index][1] - new_vertices[i][1]))/(Math.pow(distance(new_vertices[index], new_vertices[i]),3));
          d2Edydx += adj[index][i] * (ideal_length*(new_vertices[index][0]-new_vertices[i][0])*(new_vertices[index][1] - new_vertices[i][1]))/(Math.pow(distance(new_vertices[index], new_vertices[i]),3));
          dEdx += adj[index][i] * (new_vertices[index][0] - new_vertices[i][0] - (ideal_length*(new_vertices[index][0] - new_vertices[i][0]))/distance(new_vertices[index],new_vertices[i]));
          dEdy += adj[index][i] * (new_vertices[index][1] - new_vertices[i][1] - (ideal_length*(new_vertices[index][1] - new_vertices[i][1]))/distance(new_vertices[index],new_vertices[i]));
        }
      }
      dx = (-dEdx -d2Edxdy*(-dEdy/d2Edydx))/(d2Ed2x - (d2Edxdy*d2Ed2y)/d2Edydx)
      dy = (-d2Ed2y*dx - dEdy)/(d2Edydx)
      new_vertices[index][0] = new_vertices[index][0] + dx;
      new_vertices[index][1] = new_vertices[index][1] + dy;
      var new_dEdx = 0;
      var new_dEdy = 0;
      for(let i = 0; i < vertices.length; i++){
        if(i !== index){
          new_dEdx += adj[index][i] * (new_vertices[index][0] - new_vertices[i][0] - (ideal_length*(new_vertices[index][0] - new_vertices[i][0]))/distance(new_vertices[index],new_vertices[i]));
          new_dEdy += adj[index][i] * (new_vertices[index][1] - new_vertices[i][1] - (ideal_length*(new_vertices[index][1] - new_vertices[i][1]))/distance(new_vertices[index],new_vertices[i]));
        }
      }
      maxdM = distance([new_dEdx, new_dEdy], [0,0]);
      dM[index] = distance([new_dEdx,new_dEdy], [0,0]);
      break;
    }
  }
  return new_vertices;
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

function distance(x,y){
  return  Math.sqrt(Math.pow((x[0] - y[0]), 2) + Math.pow((x[1] - y[1]), 2));
}
