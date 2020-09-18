var C= 1;
var K = 0.01; //OPTIMAL DISTANCE
var ITERATIONS = 300;

export function fruchtermanReingold(vertices,edges,graph_distancex, graph_distancey, iterations, coolingtype, tempScale, eps){
  const W = graph_distancex -6;
  const L = graph_distancey -6;
  const kIter = iterations === undefined ? 300: iterations;
  ITERATIONS = kIter;
  const tempHeuristic = coolingtype === undefined? "Linear": coolingtype;
  C = 0.00000001;
  K = C* Math.sqrt((W)*(L)/(vertices.length));
  const epsilon = eps;
  // tol = tolerance === undefined? 0.01: tolerance;
  // console.log("K", K);

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
  // console.log("new_vertices", new_vertices);
  // console.log("new_edges", new_edges);
  let t = 1;
  let animations = [];
  let temperature = (1/10)*W * tempScale;
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
    for(let i = 0; i < new_vertices.length; i ++){
      let f = [0,0];
      for(let j = 0; j < new_vertices.length; j ++){
        if(i!== j){
          var delta = distance(new_vertices[i], new_vertices[j]);
          var unitvector = unitVector(new_vertices[i], new_vertices[j])
          f[0] += (unitvector[0]) * frepulse(delta);
          f[1] +=  (unitvector[1]) * frepulse(delta);
        }
      }
      force_list.push(f);
    }
    //calculate attractive forces
    for(let i = 0; i < new_edges.length; i++){
      const e = new_edges[i];
      if(e[0] === e[1]) console.log("well fuck");
      const delta = distance(new_vertices[e[0]], new_vertices[e[1]]);
      const unitvector = unitVector(new_vertices[e[0]], new_vertices[e[1]]);
      force_list[e[0]][0] += ((unitvector[0])*fattract(delta));
      force_list[e[0]][1] += ((unitvector[1])*fattract(delta));
      force_list[e[1]][0] += ((unitvector[0])*fattract(delta));
      force_list[e[1]][1] += ((unitvector[1])*fattract(delta));
    }
    //update positions
    const iter_animations = [];
    var minX = Infinity;
    var minY = Infinity;
    var maxX = 0;
    var maxY = 0;
    var maxForce = 0;

    for(let i = 0; i < new_vertices.length; i++){
      const unitvector = unitVector(force_list[i], [0,0])
      const xi = unitvector[0];
      const yi = unitvector[1];
      const old_vertices = new_vertices[i].slice();

      let new_x = new_vertices[i][0] +xi*Math.min(temperature, Math.abs(force_list[i][0]))
      let new_y =  new_vertices[i][1] + yi*Math.min(temperature, Math.abs(force_list[i][1]))

      if(i == 1){
        maxForce = distance([new_x,new_y], old_vertices);
      }
      else{
        maxForce = distance([new_x,new_y], old_vertices) > maxForce? distance([new_x,new_y], old_vertices): maxForce;
      }


      new_vertices[i][0] = new_x;
      new_vertices[i][1] = new_y;

      minX =  minX = Math.min(minX, new_vertices[i][0])
      minY = Math.min(minY, new_vertices[i][1]);
      maxX = new_vertices[i][0] > maxX? new_vertices[i][0]:maxX;
      maxY = new_vertices[i][1] > maxY? new_vertices[i][1]:maxY;

      iter_animations.push(new_vertices[i].slice())
    }
    //update scaling factors, animations and particle temperature
    scaling_factor.push([Math.min(minX,0), Math.min(minY,0), Math.min(W/(Math.abs(minX)+maxX),1), Math.min(L/(Math.abs(minY)+maxY),1)])
    animations.push(iter_animations);
    if(tempHeuristic !== "Directional")temperature = cool(temperature, tempHeuristic, initial_temperature);
    // if(tempHeuristic === "Directional"){
    //   temperature_list[i] = cool(temperature_list[i], )
    // }
    t+= 1;
    if(maxForce < epsilon) break;
  }
  const iter_animations = [];

  for(let i = 0; i < animations.length; i++){
    for(let j = 0; j < animations[i].length; j ++){
      animations[i][j][0] = (animations[i][j][0] + Math.abs(scaling_factor[i][0]))*scaling_factor[i][2];
      animations[i][j][1] = (animations[i][j][1] + Math.abs(scaling_factor[i][1]))*scaling_factor[i][3];
    }
  }
  var minX = Infinity;
  var minY = Infinity;
  var maxX = 0;
  var maxY = 0;
  for(let i = 0; i < vertices.length; i ++){
    minX = Math.min(new_vertices[i][0], minX);
    minY = Math.min(new_vertices[i][1], minY);
    maxX = Math.max(new_vertices[i][0], maxX);
    maxY = Math.max(new_vertices[i][1], maxY);
  }
  for(let i = 0; i <vertices.length; i ++){
    new_vertices[i][0] = (new_vertices[i][0] + Math.abs(minX)) * (W/(maxX+Math.abs(minX)));
    new_vertices[i][1] = (new_vertices[i][1] + Math.abs(minY)) * (L/(maxY + Math.abs(minY)));
  }
  return [new_vertices, animations];
}

function frepulse(z){
  return -(Math.pow(K,2))/z
}

function fattract(z){
  return (Math.pow(z,2))/K
}

function distance(x,y){
  // console.log(x,y);
  var distX = Math.pow((x[0] - y[0]), 2);
  var distY = Math.pow((x[1] - y[1]), 2);
  if(distX + distY === 0) distX = 0.00000000000000000001

  return  Math.sqrt((distX + distY));
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
