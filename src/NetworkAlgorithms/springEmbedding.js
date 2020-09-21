var CREP = 20;
var CSPRING = 20;
var lx = 0;
var ly = 0;
/**
* Basic spring embedding algorithm
*/
export function springEmbedding(vertices,edges,graph_distancex, graph_distancey, iterations, threshold, constant, cspring, crep, forceAreaPercentage, distanceType){
  // relevant constants for spring embedding
  const W = graph_distancex -6;
  const L = graph_distancey -6;
  lx = 1 + ((Math.sqrt(W)/2-1)*forceAreaPercentage)/100;
  ly = 1 + ((Math.sqrt(L)/2-1)*forceAreaPercentage)/100;
  const K = iterations === undefined ? 300: iterations;
  const epsilon = threshold === undefined? 0.1: threshold;
  const delta = constant === undefined? 1.5: constant;
  CREP = cspring === undefined? 20: cspring;
  CSPRING = crep === undefined? 20: crep;
  const distType = distanceType;
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


  let t = 1;
  let animations = [];
  let scaling_factor = [];

  while(t<K){
    let force_list = [];
    let fvt = [];
    for(let i =0; i < new_vertices.length; i++){
      let f = [0,0]; // should be two dimensional
      let vert_connected = []; //represents vertices we should not repulse later
      // CALCULATE ATTRACTION FORCES
      for(let j = 0; j < new_edges.length; j++){
        if(i === new_edges[j][0] && i !== new_edges[j][1]){
          const calcs = fattract(new_vertices[new_edges[j][0]], new_vertices[new_edges[j][1]], distType);
          f[0] += calcs[0];
          f[1] += calcs[1];
          vert_connected.push(new_edges[j][1]);
        }
        if(i === new_edges[j][1] && i !== new_edges[j][0]){
          const calcs = fattract(new_vertices[new_edges[j][1]], new_vertices[new_edges[j][0]], distType)
          f[0] += calcs[0];
          f[1] += calcs[1];
          vert_connected.push(new_edges[j][0]);
        }
      }
      //CALCULATE REPULSIVE FORCES
      for(let j =0; j < new_vertices.length; j++){
        if(i === j ) continue;
        let connected = false;
        for(let k = 0; k < vert_connected.length; k++){
          if(j === vert_connected[k]) connected = true;
        }
        if(!connected){
          const calcs = frepulse(new_vertices[i], new_vertices[j]);
          f[0] += calcs[0];
          f[1] += calcs[1];
        }
      }
      force_list.push(f)
      fvt.push(distance([0,0], f));
    }


    //UPDATE POSITIONS
    const iteration_animation = [];
    var maxF = 0;
    var minX = Infinity;
    var minY = Infinity;
    var maxX = 0;
    var maxY = 0;

    for(let i = 0; i < new_vertices.length; i++){
      let new_x = new_vertices[i][0] + delta*force_list[i][0];
      let new_y = new_vertices[i][1] + delta*force_list[i][1];
      const old_vertices = new_vertices[i].slice();
      new_vertices[i][0] = new_x
      new_vertices[i][1] = new_y

      //Update max forces for convergence bound
      const curF = distance([new_x,new_y], old_vertices);
      if(i === 1) maxF = curF;
      else maxF = maxF > curF? maxF: curF;

      //update scaling_factor
      minX =  minX = Math.min(minX, new_vertices[i][0])
      minY = Math.min(minY, new_vertices[i][1]);
      maxX = new_vertices[i][0] > maxX? new_vertices[i][0]:maxX;
      maxY = new_vertices[i][1] > maxY? new_vertices[i][1]:maxY;
      //update animations
      iteration_animation.push(new_vertices[i].slice());
    }
    scaling_factor.push([-minX, -minY, W/((-minX)+maxX), L/((-minY)+maxY)])


    if(maxF < epsilon) break;
    animations.push(iteration_animation);
    t += 1
  }

  //scale animations properly without affecting computations
  for(let i = 0; i < animations.length; i++){
    for(let j = 0; j < animations[i].length; j ++){
      animations[i][j][0] = (animations[i][j][0] + scaling_factor[i][0])*scaling_factor[i][2];
      animations[i][j][1] = (animations[i][j][1] + scaling_factor[i][1])*scaling_factor[i][3];
    }
  }

  var minX = Infinity;
  var minY = Infinity;
  var maxX = 0;
  var maxY = 0;
  for(let i = 0; i < vertices.length; i ++){
    minX = Math.min(new_vertices[i][0], minX);
    minY = Math.min(new_vertices[i][1], minY);
    maxX = new_vertices[i][0] > maxX? new_vertices[i][0]:maxX;
    maxY = new_vertices[i][1] > maxY? new_vertices[i][1]:maxY;
  }
  minX = Math.min(minX, 0);
  minY = Math.min(minY, 0);
  for(let i = 0; i <vertices.length; i ++){
    new_vertices[i][0] = (new_vertices[i][0] + Math.abs(minX)) * Math.min(1,(W/(Math.max(maxX,W)+Math.abs(minX))));
    new_vertices[i][1] = (new_vertices[i][1] + Math.abs(minY)) * Math.min(1,(L/(Math.max(maxY,L) + Math.abs(minY))));
  }


  return [new_vertices, animations];
}





function frepulse(x,y){
  var dist = distance(y,x);
  if(dist === 0) dist = 0.00000000000000000001;
  const unitV = unitVector(y,x);
  return [(CREP*unitV[0])/Math.sqrt(dist) , (CREP*unitV[1])/Math.sqrt(dist)];

}

function fattract(x,y, distanceType){
  var dist = distanceType === 1? distance(x,y): 1;
  if(dist === 0) dist = 0.00000000000000000001;
  const unitV = unitVector(x,y);

  return [CSPRING* Math.log(dist/(lx)) * unitV[0],
          CSPRING* Math.log(dist/(ly)) * unitV[1]];
}

function distance(x,y){
  return  Math.sqrt(Math.pow((x[0] - y[0]), 2) + Math.pow((x[1] - y[1]), 2));
}

/**
* UnitVector from X to Y
*/
function unitVector(x,y){
  const new_x = y[0] - x[0];
  const new_y = y[1] - x[1];
  const dist = distance(x,y);
  return [new_x/dist, new_y/dist];
}
