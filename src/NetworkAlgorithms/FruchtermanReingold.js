import Force from "../datatypes/Force";
import Vertex from "../datatypes/Vertex";
var C= 1;
var K = 0.01; //OPTIMAL DISTANCE
var ITERATIONS = 300;

export function fruchtermanReingold(vertices,edges,graph_distancex, graph_distancey, iterations, settings){
  const W = graph_distancex -6;
  const L = graph_distancey -6;
  const kIter = iterations;
  ITERATIONS = kIter;
  const coolingtype = settings.tempHeuristic;
  const tempHeuristic = settings.tempHeuristic;
  C = 1;
  K = C* Math.sqrt((W)*(L)/(vertices.length));
  const epsilon = settings.eps;

  // console.log(settings);


  let t = 1;
  let animations = [];
  let temperature = (1/10)*W * settings.cTemp;
  let temperature_list = [];
  let previousAngle = [];
  let scaling_factor = [];
  if(coolingtype === "Directional"){
    for(let i = 0; i < vertices.length; i ++){
      temperature_list.push(temperature);
    }
  }
  const initial_temperature = temperature;

  while(t<kIter){
    let force_list = [];
    //calculate repulsive forces
    for(let i = 0; i < vertices.length; i ++){
      let f = new Force(0,0);
      for(let j = 0; j < vertices.length; j ++){
        if(i!== j){
          const delta = distance(vertices[i], vertices[j]);
          const calcs = frepulse(vertices[i], vertices[j], delta);
          // var delta = distance(vertices[i], vertices[j]);
          // var unitvector = unitVector(vertices[j], vertices[i])
          f.addVector(calcs);
        }
      }
      force_list.push(f);
    }
    //calculate attractive forces
    for(let i = 0; i < edges.length; i++){
      const e = edges[i];
      if(e.start === e.end) console.log("well fuck");
      const delta = distance(vertices[e.start], vertices[e.end]);
      const calcs = fattract(vertices[e.start], vertices[e.end], delta);
      const ncalcs = [-calcs[0], -calcs[1]]

      force_list[e.end].addVector(calcs);
      force_list[e.start].addVector(ncalcs);
    }
    //update positions
    const iter_animations = [];
    var minX = Infinity;
    var minY = Infinity;
    var maxX = 0;
    var maxY = 0;
    var maxForce = 0;
    const origin = new Vertex(0,0);

    for(let i = 0; i < vertices.length; i++){
      const unitvector = unitVector(force_list[i], origin)
      const unitForce = new Force(unitvector[0], unitvector[1])
      unitForce.setX(unitForce.x*Math.min(temperature, Math.abs(force_list[i].x)));
      unitForce.setY(unitForce.y*Math.min(temperature, Math.abs(force_list[i].y)))

      vertices[i].add(unitForce);

      //UPDATE CONVERGENCE
      // if(i == 1){
      //   maxForce = distance([new_x,new_y], old_vertices);
      // }
      // else{
      //   maxForce = distance([new_x,new_y], old_vertices) > maxForce? distance([new_x,new_y], old_vertices): maxForce;
      // }


      minX =  minX = Math.min(minX, vertices[i].x)
      minY = Math.min(minY, vertices[i].y);
      maxX = vertices[i].x > maxX? vertices[i].x:maxX;
      maxY = vertices[i].y > maxY? vertices[i].y:maxY;

      iter_animations.push([vertices[i].x, vertices[i].y])
    }
    //update scaling factors, animations and particle temperature
    scaling_factor.push([-minX,-minY, W/(-minX+maxX), L/(-minY+maxY)]);
    animations.push(iter_animations);

    if(tempHeuristic !== "Directional")temperature = cool(temperature, tempHeuristic, initial_temperature);
    t+= 1;
    // if(maxForce < epsilon) break;
  }
  const iter_animations = [];

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
    minX = Math.min(vertices[i].x, minX);
    minY = Math.min(vertices[i].y, minY);
    maxX = vertices[i].x > maxX? vertices[i].x:maxX;
    maxY = vertices[i].y > maxY? vertices[i].y:maxY;
  }
  // maxX = Math.max(W, maxX);
  // maxY = Math.max(L, maxY);
  for(let i = 0; i <vertices.length; i ++){
    vertices[i].x = (vertices[i].x + (-minX)) * W/(-minX+maxX);
    vertices[i].y = (vertices[i].y + (-minY)) * L/(-minY+maxY);
  }
  // console.log(vertices);
  return [vertices, animations];
}

function frepulse(v1,v2, delta){
  const unitvector = unitVector(v1,v2)

  return [((Math.pow(K,2))/delta)*unitvector[0], ((Math.pow(K,2))/delta)*unitvector[1]];
}

function fattract(v1,v2,delta){
  const unitvector = unitVector(v1,v2);

  return [unitvector[0]*(Math.pow(delta,2))/K, unitvector[1]*(Math.pow(delta,2))/K];
}

function distance(v1,v2){
  // console.log(x,y);
  var distX = Math.pow((v1.x - v2.x), 2);
  var distY = Math.pow((v1.y - v2.y), 2);
  if(distX + distY === 0) distX = 0.00000000000000000001

  return  Math.sqrt((distX + distY));
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

function cool(t, tempHeuristic, initial_temperature){
  if(tempHeuristic === "Linear"){
    return t - initial_temperature/ITERATIONS
  }
  if(tempHeuristic === "Logarithmic"){
    return 0.90*t
  }
  if(tempHeuristic === "Directional"){
    return t
  }
  return t
}

function findAngle(x,y){
  const angle = Math.atan((y[1] - x[1])/(y[0] - x[0]));
  return angle === undefined? 0: angle
}
