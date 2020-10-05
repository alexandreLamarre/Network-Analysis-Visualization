function spectralDrawing(vertices, edges, graph_distancex, graph_distancey, dimension){

  //IMPORTANT CONSTANTS
  // const epsilon = Math.pow(10, -7);
  // const DIMENSION = dimension + 1;
  //
  //
  //
  // //Important matrices
  // const A = []; //adjacency
  // const D = []; //degree
  // const L = []; //laplacian
  //
  // for(let i = 0; i < vertices.length; i ++){
  //   const adj_row = [];
  //   const degree_row = [];
  //   const laplacian_row = [];
  //   for(let j = 0; j < vertices.length; j ++){
  //     adj_row.push(0);
  //     degree_row.push(0);
  //     laplacian_row.push(0);
  //     if(i === j) degree_row[i] = vertices[i].degree;
  //   }
  //   A.push(adj_row);
  //   D.push(degree_row);
  //   L.push(laplacian_row);
  // }
  //
  // for(let i = 0; i < edges.length; i ++){
  //   A[edges[i].start][edges[i].end] = 1;
  //   A[edges[i].end][edges[i].start] = 1;
  //   L[edges[i].start][edges[i].end] = 1;
  //   L[edges[i].end][edges[i].start] = 1;
  // }
  //
  //
  // // instantiate known eigenvalues/eigenvectors
  // const lambda1 = 0;
  // const v1 = [];
  // for(let i = 0; i < vertices.length; i ++){
  //   v1.push(1);
  // }
  //
  // const eigenvectors = [];
  // eigenvectors.push(v1);
  //
  //
  // //computing degree normalized eigenvectors v2 ... vk where k is DIMENSION
  // for(let i = 2; i < DIMENSION + 1; i++){
  //   let new_vi_vector = randomVector(vertices.length);
  //   normalize(new_vi_vector);
  //
  //   //Normalize against previous eigenvectors;
  //   let new_vi = new_vi_vector;
  //
  //   for(let j = 0; j < i -1; i ++){
  //     new_vi = orthogonalize(new_vi, eigenvectors[j], D);
  //   }
  //   // end Orthogonalization;
  //   //Now multiply by constants 1/2(I + D^(-1)A)
  //   for(let j = 0; j <vertices.length; j++){
  //     new_vi_vector[j] = 1/2 * (new_vi[j] + sumNeighborComponents(new_vi, L[i])/D[j][j])
  //   }
  //   //end multiply
  //   normalize(new_vi_vector);
  //   eigenvectors.push(new_vi)
  //   // while(dotProduct(new_vi_vector, new_vi) < 1- epsilon){
  //   //   new_vi = new_vi_vector;
  //   // }
  // }
  // return eigenvectors;
}
// 
// function randomVector(size){
//   const new_vector = [];
//   for(let i = 0; i < size; i ++){
//     new_vector.push(Math.random())
//   }
//   return new_vector;
// }
//
// function normalize(vector){
//   const sum = vector.reduce(function(a,b){return a+ b});
//   for(let i = 0; i < vector.length; i ++){
//     vector[i] = vector[i]/sum
//   }
// }
//
// function orthogonalize(u, v, D){
//   const numerator = dotProduct(vectorTimesMatrix(u,D), v);
//   const denominator = dotProduct(vectorTimesMatrix(v,D), u);
//
//   for(let i = 0; i < u.length; i++){
//     u[i] = u[i] - u[j]*(numerator/denominator);
//   }
// }
//
// function sumNeighborComponents(vector, laplacian_i){
//   const sum = 0;
//   for(let k = 0; k < vector.length; k++){
//     if(laplacian_i[k] === -1) sum += vector[k];
//   }
//   return sum;
// }
//
// function vectorTimesMatrix(v, m){
//   const new_vector = [];
//   for(let  i = 0; i < m.length; i ++){
//     new_vector.push(dotProduct(v,getColumn(m,i)));
//   }
//   return new_vector;
//
// }
//
// function matrixTimesVector(m,v){
//   const new_vector = [];
//   for(let i = 0; i < m.length; i ++){
//     new_vector.push(dotProduct(getColumn(m,i),v))
//   }
//   return new_vector;
// }
//
// function dotProduct(v1,v2){
//   var sum = 0;
//   assert(v1.length === v2.length);
//   for(let i = 0; i < v1.length; i ++){
//     sum += v1[i]*v2[i];
//   }
//   return sum
// }
//
// function getColumn(matrix, index){
//   const new_vector = [];
//
//   for(let i = 0; i < matrix.length; i ++){
//     new_vector.push(matrix[i][index]);
//   }
//
//   return new_vector;
// }
