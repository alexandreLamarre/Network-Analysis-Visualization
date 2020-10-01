import Edge from "../datatypes/Edge";
const MAX_SIMULATIONS = 1000;
var I = -1;
var K = -1;

export function opt2(vertices, edges, dimension){
  const path = [];
  var better_solution = false

  var root = edges[0].start;
  path.push(root);

  for(let i = 1; i< edges.length; i++){
    path.push(edges[i].start);
  }
  path.push(root);
  // console.log("original path", path);
  const dist = calculate_distance_path(path, vertices, dimension);
  for(let n = 0; n< MAX_SIMULATIONS; n++){
    var new_path = [];
    new_path.push(root);
    var i = Math.floor(Math.random()*(path.length-2))+1;
    var k = Math.floor(Math.random()*(path.length-2))+1;
    if(i > k){ //swap
      var temp = i;
      i = k;
      k = temp;
    }
    for(let m = 0; m < i; m++){
      new_path.push(path[m+1]);
    }


    for(let m = k-1; m>i-1; m--){
      new_path.push(path[m+1]);
    }

    for(let m = k; m < path.length-1; m++){
      new_path.push(path[m+1])
    }
    var new_dist = calculate_distance_path(new_path, vertices, dimension);
    if(new_dist < dist) better_solution = true;
    if(better_solution === true) {
      I = i;
      K = k;
      break
    };
  }
  // console.log("better solution", better_solution);
  if(better_solution === false) new_path = path;
  var new_edges = [];
  for(let i = 0; i < path.length-1; i++){
    new_edges.push(new Edge(new_path[i], new_path[i+1]))
    if(i === I || i === K) {
      new_edges[i].setColor("rgb(255,0,0)");
      new_edges[i].setAlpha(0.4);
    };
  }
  return [new_edges, better_solution];

}


function calculate_distance_path(path, vertices, dimension){
  var total_dist = 0;
  for(let i = 0; i < path.length-1; i++){
    total_dist += distance(vertices[path[i]], vertices[path[i+1]], dimension);
  }
  return total_dist;
}

function distance(v1, v2, dimension){
  var dist;
  if(dimension === 2) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2);
  if(dimension === 3) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2) + Math.pow(v1.z-v2.z,2);
  if(dist === 0) dist = 0.00000000000000000001;
  return Math.sqrt(dist);
}

function swap(u,v){
  const temp = u;
  u = v;
  v = temp;
}

function try2OptSwap(path, vertices, i, k, dimension, dist){
  var changed = false;
  const new_path = [];
  var root = path[0];
  new_path.push(root);
  for(let n = 0; n < i; n++){
    new_path.push(path[n+1]);
  }
  for(let n = k+i; n > i; n++){
    new_path.push(path[n+1]);
  }
  new_path.push(root);
  const new_dist = calculate_distance_path(new_path, vertices, dimension);
  if(new_dist< dist) return [new_path, true]
  else{ return [path, false]};
}
