import Edge from "../datatypes/Edge";

var MAX_SIMULATIONS = 1000;

export function opt3(vertices, edges, dimension){
  const path = [];
  var root = edges[0].start;
  path.push(root);
  for(let i = 1; i < edges.length; i++){
    path.push(edges[i].start);
  }
  path.push(root);
  console.log(calculate_distance_path(path, vertices, dimension))
  var new_path = [];
  var a;
  var b;
  var c;
  for(let n = 0; n < MAX_SIMULATIONS; n++){
    var better_solution;
    a = Math.floor(Math.random()*(path.length-3))+2;
    b = Math.floor(Math.random()*(path.length-3))+2;
    c = Math.floor(Math.random()*(path.length-3))+2;
    // console.log(a,b,c);
    //make sure a,b,c are ordered correctly
    var array = [a,b,c];
    array.sort(function(a,b) {return a-b});
    a = array[0];
    b = array[1];
    c = array[2];
    // console.log(a,b,c)
    // console.log(better_solution)
    const values = reverse_segment_if_better(path, a, b, c, dimension, vertices);
    better_solution = values[1];
    new_path = values[0];
    // console.log(values);
    if(better_solution === true) break;

  }
  console.log(calculate_distance_path(new_path, vertices, dimension));
  const new_edges = [];

  for(let i = 0; i < new_path.length-1; i++){
    new_edges.push(new Edge(new_path[i], new_path[i+1]));
    if(dimension === 3) new_edges[i].setColor("#d3d3d3");
    if(i === a || i === b || i === c){
      new_edges[i].setColor("rgb(255,0,0)");
      new_edges[i].setAlpha(0.4);
    }
  }
  // console.log(new_edges);

  return [new_edges, better_solution]
}

function reverse_segment_if_better(path, i, j, k, dimension, vertices){
  var new_path = [];
  const [A,B,C,D,E,F] = [path[i-1], path[i], path[j-1], path[j], path[k-1], path[k]];
  // console.log(A,B,C,D,E,F);
  const d0 = distance(vertices[A], vertices[B], dimension) + distance(vertices[C], vertices[D], dimension) + distance(vertices[E], vertices[F], dimension);
  const d1 = distance(vertices[A], vertices[C], dimension) + distance(vertices[B], vertices[D], dimension) + distance(vertices[E], vertices[F], dimension);
  const d2 = distance(vertices[A], vertices[B], dimension) + distance(vertices[C], vertices[E], dimension) + distance(vertices[D], vertices[F], dimension);
  const d3 = distance(vertices[A], vertices[D], dimension) + distance(vertices[E], vertices[B], dimension) + distance(vertices[C], vertices[F], dimension);
  const d4 = distance(vertices[F], vertices[B], dimension) + distance(vertices[C], vertices[D], dimension) + distance(vertices[E], vertices[A], dimension);
  if(d0 > d1){
    // console.log("better");
    new_path =  reversed_path(path, i-1, j-1);
    console.log("d0-d1", calculate_distance_path(new_path, vertices, dimension));
    return [new_path, true];
  }
  else if(d0 > d2){
    // console.log("better");
    new_path =  reversed_path(path, j-1, k-1);
    console.log("d0-d2", calculate_distance_path(new_path, vertices, dimension));
    return [new_path, true];
  }
  else if(d0 > d4){
    // console.log("better");
    new_path =  reversed_path(path, i-1, k-1);
    console.log("d0-d4", calculate_distance_path(new_path, vertices, dimension));
    return [new_path,true];
  }
  else if(d0 > d3){
    // console.log("better");
    new_path =  reversed_path_three(path, i, j, k);
    console.log("three", calculate_distance_path(new_path, vertices, dimension));
    return  [new_path, true];
  }
  return  [path,false];

}

function distance(v1,v2, dimension){
  var dist;
  if(dimension === 2) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y,2);
  if(dimension === 3) dist =  Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y,2) + Math.pow(v1.z-v2.z, 2);
  if(dist === 0) dist = 0.0000000000000001;
  return Math.sqrt(dist);
}

function reversed_path(path, a, b){
  const new_path = [];
  // console.log(path);
  var root = path[0];
  new_path.push(root);
  for(let i = 0; i< a; i++){
    new_path.push(path[i+1]);
  }
  for(let i = b-1; i > a-1; i--){
    new_path.push(path[i+1]);
  }
  for(let i = b; i < path.length-1; i++){
    new_path.push(path[i+1]);
  }
  // console.log(new_path);
  return new_path;
}

function reversed_path_three(path, i, j, k){
  const new_path = [];
  var root = path[0];
  new_path.push(root);
  for(let n = 1; n < i; n++){
    new_path.push(path[n]);
  }

  for(let n = j; n < k; n++){
    new_path.push(path[n]);
  }

  for(let n = i; n< j; n++){
    new_path.push(path[n]);
  }

  for(let n = k; n < path.length; n++){
    new_path.push(path[n]);
  }

  return new_path;
}

function calculate_distance_path(path, vertices, dimension){
  var total_dist = 0;
  for(let i = 0; i < path.length-1; i++){
    total_dist += distance(vertices[path[i]], vertices[path[i+1]], dimension);
  }
  return total_dist;
}
