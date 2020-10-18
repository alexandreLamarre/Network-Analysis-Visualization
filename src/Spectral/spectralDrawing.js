import SquareMatrix from "../datatypes/SquareMatrix";

export function spectralDrawing(vertices, edges, W, H, dimension){

  // IMPORTANT CONSTANTS
  const epsilon = Math.pow(10, -7);
  const DIMENSION = dimension + 1;



  //Important matrices
  var A = []; //adjacency
  var D = []; //degree
  var Dinv = [];
  var L = []; //laplacian
  var IplusDinvA = [];

  for(let i = 0; i < vertices.length; i ++){
    const adj_row = [];
    const degree_row = [];
    const inverse_degree_row = [];
    const laplacian_row = [];
    for(let j = 0; j < vertices.length; j ++){
      adj_row.push(0);
      degree_row.push(0);
      inverse_degree_row.push(0);
      laplacian_row.push(0);
      if(i === j) {
        degree_row[i] = vertices[i].degree;
        inverse_degree_row[i] = 1/vertices[i].degree;
        laplacian_row[i] = vertices[i].degree;
      }
    }
    A.push(adj_row);
    D.push(degree_row);
    Dinv.push(inverse_degree_row);
    L.push(laplacian_row);
  }

  for(let i = 0; i < edges.length; i ++){
    A[edges[i].start][edges[i].end] = 1;
    A[edges[i].end][edges[i].start] = 1;
    L[edges[i].start][edges[i].end] = -1;
    L[edges[i].end][edges[i].start] = -1;
  }
  A = new SquareMatrix(A);
  L = new SquareMatrix(L);
  D = new SquareMatrix(D);
  Dinv = new SquareMatrix(Dinv);
  // console.log("A", A);
  // console.log("L", L);
  // console.log("D", D);
  // console.log("Dinv", Dinv);
  const intermediate_mat = Dinv.matrixMultiply(A);
  for(let i = 0; i < intermediate_mat.length; i ++){
    intermediate_mat[i][i] ++;
  };
  for(let i = 0; i < intermediate_mat.length; i++){
    for(let j = 0; j < intermediate_mat.length; j++){
      intermediate_mat[i][j] *= 1/2;
    }
  }
  var C = new SquareMatrix(intermediate_mat);
  console.log("C", C);


  // instantiate known eigenvalues/eigenvectors
  const lambda1 = 0;
  const v1 = [];
  for(let i = 0; i < vertices.length; i ++){
    v1.push(1);
  }

  const eigenvectors = [];
  eigenvectors.push(v1);
  // console.log("initial eigenvectors", eigenvectors);

  //computing degree normalized eigenvectors v2 ... vk where k is DIMENSION
  for(let i = 2; i < DIMENSION+1; i++){
    // console.log("=======================ITERATION", i-1, "======================================")
    let new_vi_vector = randomVector(vertices.length);
    normalize(new_vi_vector);

    //Normalize against previous eigenvectors;
    let new_vi = new_vi_vector;
    //
    for(let j = 0; j < i -1; j ++){
      new_vi = orthogonalize(new_vi, eigenvectors[j], D);
    }
    new_vi_vector = C.lMultiply(new_vi);
    normalize(new_vi_vector);

    var iterations = 0;
    // const theta = Math.acos(dotProduct(new_vi, new_vi_vector))
    while(dotProduct(new_vi_vector, new_vi) < 1- epsilon){
      console.log("iterating");
      new_vi = C.lMultiply(new_vi_vector);
      normalize(new_vi);
      iterations ++;
      if(iterations > 100) break;
    }


    eigenvectors.push(new_vi);
  }
  // console.log(eigenvectors);
  var minX = Infinity;
  var maxX = -Infinity;
  var minY = Infinity;
  var maxY = -Infinity;
  var minZ = Infinity;
  var maxZ = -Infinity;
  for(let i = 0; i < eigenvectors[0].length; i++){
    minX = Math.min(eigenvectors[1][i], minX);
    maxX = Math.max(eigenvectors[1][i], maxX);
    minY = Math.min(eigenvectors[2][i], minY);
    maxY = Math.max(eigenvectors[2][i], maxY);
    if(eigenvectors[3] !== undefined){
      minZ = Math.min(eigenvectors[3][i], minZ);
      maxZ = Math.max(eigenvectors[3][i], maxZ);
    }
  }



  const animations = [];
  for(let i = 0; i < eigenvectors[1].length; i++){
    const animations_iter = [];
    for(let j = 0; j < vertices.length; j++){
      const x = vertices[j].x;
      const y = vertices[j].y;
      const z = vertices[j].z;
      if(j <= i) animations_iter.push([(eigenvectors[1][j] -minX)*(W-5)/(-minX+maxX),y,z])
      else {animations_iter.push([x,y,z])}
    }
    animations.push(animations_iter);
  }

  for(let i = 0; i < eigenvectors[2].length; i++){
    const animations_iter = [];
    for(let j = 0; j < vertices.length; j++){
      const x = vertices[j].x;
      const y = vertices[j].y;
      const z = vertices[j].z;
      if(j <= i) animations_iter.push([
        (eigenvectors[1][j] -minX)*(W-5)/(-minX+maxX),
        (eigenvectors[2][j] -minY)*(H-5)/(-minY+maxY),z
      ]);
      else{animations_iter.push([
        (eigenvectors[1][j] -minX)*(W-5)/(-minX+maxX), y,z
      ])}
    }
    animations.push(animations_iter);
  }
  if(eigenvectors[3] !== undefined){
    for(let i = 0; i < eigenvectors[2].length; i++){
      const animations_iter = [];
      for(let j = 0; j < vertices.length; j++){
        const x = vertices[j].x;
        const y = vertices[j].y;
        const z = vertices[j].z;
        if(j <= i) animations_iter.push([
          (eigenvectors[1][j] -minX)*(W-5)/(-minX+maxX),
          (eigenvectors[2][j] -minY)*(H-5)/(-minY+maxY),
          (eigenvectors[3][j] -minZ)*(H-5)/(-minZ+maxZ)
        ]);
        else{animations_iter.push([
          (eigenvectors[1][j] -minX)*(W-5)/(-minX+maxX),
          (eigenvectors[2][j] -minY)*(H-5)/(-minY+maxY), z ])}
      }
      animations.push(animations_iter);
    }
  }
  // new_vertices[i].x = (eigenvectors[1][i] -minX)*(W-5)/(-minX+maxX);
  // new_vertices[i].y = (eigenvectors[2][i] -minY)*(H-5)/(-minY+maxY);
  return [eigenvectors, animations];
}
//
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

function norm(vector){
  var sum = 0;
  for(let i = 0; i < vector.length; i++){
    sum += Math.pow(vector[i], vector.length);
  }
  return Math.pow(sum, -vector.length);
}

function orthogonalize(u, v, D){
  // console.log("orthogonalize inputs",u,v,D);
  const numeratorDtimesUj = D.rMultiply(v)
  const numerator = dotProduct(u, numeratorDtimesUj);
  const denominator = dotProduct(v, numeratorDtimesUj);
  const new_vector = [];
  for(let i = 0; i < u.length; i++){
    new_vector.push(u[i] - v[i]*(numerator/denominator));
  }
  return new_vector;

  // const numerator = dotProduct(vectorTimesMatrix(u,D), v);
  // const denominator = dotProduct(vectorTimesMatrix(v,D), u);
  // console.log("num/denum", numerator, denominator);
  // for(let i = 0; i < u.length; i++){
  //   u[i] = u[i] - u[i]*(numerator/denominator);
  // }
}


function dotProduct(v1,v2){
  var sum = 0;
  for(let i = 0; i < v1.length; i ++){
    sum += v1[i]*v2[i];
  }
  return sum
}
