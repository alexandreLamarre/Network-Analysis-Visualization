export function opt2(path, root, max_simulations, vertices, dimension){
  // const original_dist = calculate_distance_path(path, vertices, dimension);
  // var return_path = path;
  // var changed = false;
  // var i = Math.floor(Math.random()*path.length-2)+1;
  // var k = Math.floor(Math.random()*path.length-2)+1;
  // if(i >= k) swap(i,k);
  // for(let n = 0; n < max_simulations; n++){
  //   [return_path, changed] = try2OptSwap(path,vertices,i,k, dimension, original_dist);
  //   if(changed === true) break;
  // }
  // console.log(return_path);
  // return return_path;
}

export function initial_random_cycle(vertices, edges){

  var root = 0;
  var initial_path = []

  //construct adjacency matrix
  const adj = []
  var available_vertices = [];
  for(let i = 0; i < vertices.length; i++){
    available_vertices.push(i);

  }


  root = pick_random_array(available_vertices);
  available_vertices = remove_from_array(available_vertices, root);

  initial_path.push(root);
  for(let i = 0; i < vertices.length -1; i++){
    const next_node = pick_random_array(available_vertices);
    available_vertices = remove_from_array(available_vertices, next_node);
    initial_path.push(next_node);
  }
  initial_path.push(root);

  return [initial_path, root];
}


function remove_from_array(array, index){
  return array.slice(0,index).concat(array.slice(index+1));
}

function pick_random_array(array){
  return array[Math.floor(Math.random()*array.length)];
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
