import Force from "../datatypes/Force";

var CREP = 20;
var CSPRING = 20;
var lx = 0;
var ly = 0;
/**
* Basic spring embedding algorithm
*/
export function springEmbedding3D(vertices,edges,graph_distancex, graph_distancey, iterations, settings){
  // relevant constants for spring embedding
  const W = graph_distancex -6;
  const L = graph_distancey -6;
  lx = 1 + ((Math.sqrt(W)/2-1)*settings.areascaling)/100;
  ly = 1 + ((Math.sqrt(L)/2-1)*settings.areascaling)/100;
  const K = iterations;

  const epsilon = settings.eps;
  const delta = settings.delta;
  CREP = settings.kr;
  CSPRING = settings.ka;
  const distType = settings.distanceType;

  console.log(settings);

  let t = 1;
  let animations = [];
  let scaling_factor = [];

  while(t<K){
    let force_list = [];
    for(let i =0; i < vertices.length; i++){
      let f = new Force(0,0,0);
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
    var minZ = Infinity;
    var maxX = 0;
    var maxY = 0;
    var maxZ = 0;

    for(let i = 0; i < vertices.length; i++){
      force_list[i].scale(delta);
      vertices[i].add(force_list[i]);

      //update scaling_factor
      minX =  minX = Math.min(minX, vertices[i].x)
      minY = Math.min(minY, vertices[i].y);
      minZ = Math.min(minZ, vertices[i].z);
      maxX = vertices[i].x > maxX? vertices[i].x:maxX;
      maxY = vertices[i].y > maxY? vertices[i].y:maxY;
      maxZ = vertices[i].z > maxZ? vertices[i].z: maxZ;
      //update animations
      iteration_animation.push([vertices[i].x, vertices[i].y, vertices[i].z]);
    }
    scaling_factor.push([-minX, -minY, -minZ, W/((-minX)+maxX), L/((-minY)+maxY), L/((-minZ)+maxZ)])


    animations.push(iteration_animation);
    t += 1
  }
  //scale animations properly without affecting computations
  for(let i = 0; i < animations.length; i++){
    for(let j = 0; j < animations[i].length; j ++){
      animations[i][j][0] = (animations[i][j][0] + scaling_factor[i][0])*scaling_factor[i][3];
      animations[i][j][1] = (animations[i][j][1] + scaling_factor[i][1])*scaling_factor[i][4];
      animations[i][j][2] = (animations[i][j][2] + scaling_factor[i][2])*scaling_factor[i][5];
    }
  }

  var minX = Infinity;
  var minY = Infinity;
  var minZ = Infinity;
  var maxX = 0;
  var maxY = 0;
  var mazZ = 0;
  for(let i = 0; i < vertices.length; i ++){
    minX = Math.min(vertices[i].x, minX);
    minY = Math.min(vertices[i].y, minY);
    minZ = Math.min(vertices[i].z, minZ);
    maxX = vertices[i].x > maxX? vertices[i].x:maxX;
    maxY = vertices[i].x > maxY? vertices[i].y:maxY;
    maxZ = vertices[i].z > maxZ? vertices[i].z: maxZ;
  }

  for(let i = 0; i <vertices.length; i ++){
    vertices[i].x = (vertices[i].x + -minX) * (W/(-minX+maxX));
    vertices[i].y = (vertices[i].y + -minY) * (L/(-minY+maxY));
    vertices[i].z = (vertices[i].z + -minZ) * (L/(-minZ+maxZ))
  }
  return [vertices, animations];
}




function frepulse(v1,v2){
  var dist = distance(v2,v1);
  const unitV = unitVector(v2,v1);
  return [(CREP*unitV[0])/Math.sqrt(dist) , (CREP*unitV[1])/Math.sqrt(dist),
                      (CREP*unitV[2])/Math.sqrt(dist)];

}

function fattract(v1,v2, distanceType){
  var dist = distance(v1,v2);
  const unitV = unitVector(v1,v2);

  return [CSPRING* Math.log(dist/(lx)) * unitV[0],
          CSPRING* Math.log(dist/(ly)) * unitV[1],
          CSPRING* Math.log(dist/(ly)) * unitV[2]];
}

function distance(v1,v2){
  const dist = Math.sqrt(Math.pow((v1.x - v2.x), 2) + Math.pow((v1.y - v2.y), 2) + Math.pow((v1.z-v2.z),2))
  return dist === 0? 0.00000000000000000001: dist;
}

/**
* UnitVector from X to Y
*/
function unitVector(v1,v2){
  const new_x = v2.x - v1.x;
  const new_y = v2.y - v1.y;
  const new_z = v2.z - v1.z;
  const dist = distance(v1,v2);
  return [new_x/dist, new_y/dist, new_z/dist];
}
