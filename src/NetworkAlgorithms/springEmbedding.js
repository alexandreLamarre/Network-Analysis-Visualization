import Force from "../datatypes/Force";

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

  let t = 1;
  let animations = [];
  let scaling_factor = [];

  while(t<K){
    let force_list = [];
    for(let i =0; i < vertices.length; i++){
      let f = new Force(0,0); // should be two dimensional
      let vert_connected = []; //represents vertices we should not repulse later
      // CALCULATE ATTRACTION FORCES
      for(let j = 0; j < edges.length; j++){
        if(i === edges[j].start && i !== edges[j].end){
          const calcs = fattract(vertices[edges[j].start], vertices[edges[j].end], distType);
          f.addVector(calcs)
          vert_connected.push(edges[j].end);
        }
        if(i === edges[j].end && i !== edges[j].start){
          const calcs = fattract(vertices[edges[j].end], vertices[edges[j].start], distType)
          f.addVector(calcs)
          vert_connected.push(edges[j].start);
        }
      }
      //CALCULATE REPULSIVE FORCES
      for(let j =0; j < vertices.length; j++){
        if(i === j ) continue;
        let connected = false;
        for(let k = 0; k < vert_connected.length; k++){
          if(j === vert_connected[k]) connected = true;
        }
        if(!connected){
          const calcs = frepulse(vertices[i], vertices[j]);
          f.addVector(calcs)
        }
      }
      force_list.push(f)
    }


    //UPDATE POSITIONS
    const iteration_animation = [];
    var maxF = 0;
    var minX = Infinity;
    var minY = Infinity;
    var maxX = 0;
    var maxY = 0;

    for(let i = 0; i < vertices.length; i++){
      force_list[i].scale(delta);
      vertices[i].add(force_list[i]);

      //update scaling_factor
      minX =  minX = Math.min(minX, vertices[i].x)
      minY = Math.min(minY, vertices[i].y);
      maxX = vertices[i].x > maxX? vertices[i].x:maxX;
      maxY = vertices[i].y > maxY? vertices[i].y:maxY;
      //update animations
      iteration_animation.push([vertices[i].x, vertices[i].y]);
    }
    scaling_factor.push([-minX, -minY, W/((-minX)+maxX), L/((-minY)+maxY)])


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
  console.log(animations);

  var minX = Infinity;
  var minY = Infinity;
  var maxX = 0;
  var maxY = 0;
  for(let i = 0; i < vertices.length; i ++){
    minX = Math.min(vertices[i].x, minX);
    minY = Math.min(vertices[i].y, minY);
    maxX = vertices[i].x > maxX? vertices[i].x:maxX;
    maxY = vertices[i].x > maxY? vertices[i].y:maxY;
  }
  minX = Math.min(minX, 0);
  minY = Math.min(minY, 0);
  for(let i = 0; i <vertices.length; i ++){
    vertices[i].x = (vertices[i].x + Math.abs(minX)) * Math.min(1,(W/(Math.max(maxX,W)+Math.abs(minX))));
    vertices[i].y = (vertices[i].y + Math.abs(minY)) * Math.min(1,(L/(Math.max(maxY,L) + Math.abs(minY))));
  }
  return [vertices, animations];
}




function frepulse(v1,v2){
  var dist = distance(v2,v1);
  if(dist === 0) dist = 0.00000000000000000001;
  const unitV = unitVector(v2,v1);
  return [(CREP*unitV[0])/Math.sqrt(dist) , (CREP*unitV[1])/Math.sqrt(dist)];

}

function fattract(v1,v2, distanceType){
  var dist = distanceType === 1? distance(v1,v2): 1;
  if(dist === 0) dist = 0.00000000000000000001;
  const unitV = unitVector(v1,v2);

  return [CSPRING* Math.log(dist/(lx)) * unitV[0],
          CSPRING* Math.log(dist/(ly)) * unitV[1]];
}

function distance(v1,v2){
  return  Math.sqrt(Math.pow((v1.x - v2.x), 2) + Math.pow((v1.y - v2.y), 2));
}

/**
* UnitVector from X to Y
*/
function unitVector(v1,v2){
  const new_x = v2.x - v1.x;
  const new_y = v2.y - v1.y;
  const dist = distance(v1,v2);
  return [new_x/dist, new_y/dist];
}
