function spectralDrawing(vertices, edges, graph_distancex, graph_distancey, iterations, degreeArray){

  //IMPORTANT CONSTANTS
  const DIMENSION = 2;
  const epsilon = Math.pow(10, -7);

  //make copies of input
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

  //lAPLACIAN and DEGREE MATRIX
  const L = [];
  const D = [];
  for(let  i = 0; i < new_vertices.length; i ++){
    for(let j = 0; i < new_vertices.length; j ++){
      if(i === j) L.push(degreeArray[i]);
      else{L.push(0);}
      if(i === j) D.push(degreeArray[i]);
      else{D.push(0)};
    }
  }
  for(let e = 0; e < new_edges.length; e++){
    L[new_edges[e][0]][new_edges[e][1]] = -1;
    L[new_edges[e][1]][new_edges[e][0]] = -1;
  }
  // instantiate known eigenvalues/eigenvectors
  const lambda1 = 0;
  const v1 = [];
  for(let i = 0; i < new_vertices.length; i ++){
    v1.push(1);
  }

  const eigenvectors = [];
  eigenvectors.push(v1);


  //computing degree normalized eigenvectors v2 ... vk where k is DIMENSION
  for(let i = 2; i < DIMENSION + 1; i++){
    let new_vi = randomVector(new_vertices.length);
    normalize(new_vi);

    //Normalize against previous eigenvectors;
    for(let j = 1; j < i -1; i ++){
      new_vi = orthogonalize(new_vi, eigenvectors[j]);
    }
    // end Orthogonalization;

    //Now multiply by constants
    for(let j = 0; j <new_vertices.length; j++){
      new_vi[j] = 1/2 * (new_vi[j] + (degreeArray[i]*sumNeighborComponents(new_vi, L[i]))/(degreeArray[j])    )
    }
    //end multiply
    normalize(new_vi);
  }

}

function randomVector(size){
  const new_vector = [];
  for(let i = 0; i < size; i ++){
    new_vector.push(Math.random())
  }
  return new_vector;
}

function normalize(vector){
  const sum = vector.reduce(function(a,b){return a+ b});
  for(let i = 0; i < vector.length; i ++){
    vector[i] = vector[i]/sum
  }
}

function orthogonalize(u, v){

}

function sumNeighborComponents(vector, laplacian_i){
  const sum = 0;
  for(let k = 0; k < vector.length; k++){
    if(laplacian_i[k] === -1) sum += vector[k];
  }
  return sum;
}
