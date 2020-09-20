var ka = 1;
var kr = 1;
var kg = 10;
var ks = 0.1;
var tau = 0.1;
var ksmax = 10;
//============================ REMEMBER TO ADD NO OVERLAP SETTING ==========================
export function forceAtlasLinLog(vertices,edges, graph_distancex, graph_distancey, iterations, degreeArray,crep, gravity, gravityType, gravityStrength, speedTolerance, speedCap, overlappingNodes ){

  // Algorithm constants
  const kIter = iterations === undefined? 100: iterations;
  const W = graph_distancex -6;
  const L = graph_distancey -6;
  kr = crep === undefined? 1: crep; //constant scaling force of repulsion
  kg = gravityStrength === undefined? 100: 10*gravityStrength;
  tau = speedTolerance === undefined? 0.1: speedTolerance;
  ksmax = speedCap === undefined? 10: speedCap;
  console.log(kr);


  console.log(gravity, gravityType, gravityStrength, speedTolerance, speedCap, overlappingNodes)
  //copying input
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
  //set up loop variables
  // console.log(degreeArray);
  let t = 1;
  let animations = [];
  let scaling_factor = [];
  let temperature = (1/10)*W;
  let previous_forces = [];
  for(let i = 0; i < new_vertices.length; i++){
    previous_forces.push([0,0]);
  }
  //calculate forces
  while(t< kIter){
    let force_list = [];

    //calculate repulsive forces
    for(let i = 0; i < new_vertices.length; i ++){
      let f = [0,0];
      // if(t === 1)console.log("vertex", i)
      for(let j = 0; j < new_vertices.length; j ++){
        if(i!== j){
          var unitvector = unitVector(new_vertices[j].slice(), new_vertices[i].slice());
          const repulse_force = frepulse(new_vertices[i].slice(), new_vertices[j].slice(), degreeArray[i], degreeArray[j]);
          // if(i === 0 && t == 2) console.log(unitvector);
          // if(i === 0 && t == 2) console.log(repulse_force);
          f[0] += (unitvector[0])*repulse_force;
          f[1] += (unitvector[1])*repulse_force;
          // if(t === 1) console.log(repulse_force);
        }
      }
      if(degreeArray[i] === 0 && t===1) {
        // console.log("postion",new_vertices[i])
        // console.log("current repulsive force", f)
      }
      // if(t === 1) console.log(f);
      force_list.push(f);
    }

    //calculate attractive forces
    for(let i = 0; i < new_edges.length; i ++){
      const e = new_edges[i];
      if(e[0] === e[1]) console.log("Error: vertex connects to itself");
      const unitvector = unitVector(new_vertices[e[0]], new_vertices[e[1]]);
      const attractive_force = fattract(new_vertices[e[0]], new_vertices[e[1]], degreeArray[e[0]]);
      // if(t === 2) console.log(unitvector);
      // if(t === 2) console.log(attractive_force);
      force_list[e[0]][0] += ((unitvector[0])*attractive_force);
      force_list[e[0]][1] += ((unitvector[1])*attractive_force);
      force_list[e[1]][0] += (-(unitvector[0])*attractive_force);
      force_list[e[1]][1] += (-(unitvector[1])*attractive_force);
    }


    // calculate forces of gravity
    if(gravity === true){
      const center = (t === 1)? [W/2, L/2]: [(W/2) * 1/(scaling_factor[t-2][2]), (L/2) * 1/(scaling_factor[t-2][3])]
      for(let i = 0; i < new_vertices.length; i ++){
        const unitvector = unitVector(center,vertices[i]);
        const gravity_force = gravityType === "Normal"?fgravity(new_vertices[i], degreeArray[i]): fgravityStrong(new_vertices[i], degreeArray[i], center);
        // if(t === 1) console.log(gravity_force);
        force_list[i][0] += unitvector[0]*gravity_force;
        force_list[i][1] += unitvector[1]*gravity_force;
      }
    }

    //update positions
    const iter_animations = [];
    var minX = Infinity;
    var minY = Infinity;
    var maxX = 0;
    var maxY = 0;
    var maxForce = 0;

    //update global speed
    var sG = 0;
    var traG = 0;
    var swgG = 0;
    for(let i = 0; i < force_list.length; i++){
      const traN = distance([force_list[i][0]+previous_forces[i][0], force_list[i][1]+previous_forces[i][1]], [0,0])/2
      // if(t === 1) console.log("traN",traN)
      traG += (degreeArray[i]+1) * traN;
      // if(t === 1) console.log("traG",traG)
      const swgN = distance([force_list[i][0] - previous_forces[i][0], force_list[i][1] - previous_forces[i][1]], [0,0])
      // if(t === 1) console.log("swgN",swgN)
      swgG += (degreeArray[i]+1)*swgN;
      // if(t === 1) console.log("swgG",swgG)
    }
    sG = tau*(traG/swgG);
    // console.log("sG",sG);

    var sN = 0;
    for(let i = 0; i < new_vertices.length; i++){
      //find direction of forces
      const unitvector = unitVector(force_list[i], [0,0])
      const xi = unitvector[0];
      const yi = unitvector[1];
      //calculate temperatures
      const swgN = distance([force_list[i][0] - previous_forces[i][0], force_list[i][1] - previous_forces[i][1]], [0,0])
      sN = Math.min((ks*sG)/(1+sG*Math.sqrt(swgN)),ksmax/distance(force_list[i], [0,0]));
      // console.log("sN", sN);
      let new_x = new_vertices[i][0] + sN*force_list[i][0]
      let new_y = new_vertices[i][1] + sN*force_list[i][1]
      new_vertices[i][0] = new_x;
      new_vertices[i][1] = new_y;


      //update previous forces
      previous_forces[i] = force_list[i];

      //constants for scaling factor
      minX = Math.min(minX, new_vertices[i][0]);
      minY = Math.min(minY, new_vertices[i][1]);
      maxX = new_vertices[i][0]> maxX? new_vertices[i][0]: maxX;
      maxY = new_vertices[i][1] > maxY? new_vertices[i][1]: maxY;
      //add animations
      iter_animations.push(new_vertices[i].slice());
    }
    scaling_factor.push([Math.min(minX,0), Math.min(minY,0), Math.min(W/(Math.abs(minX)+maxX),1), Math.min(L/(Math.abs(minY)+maxY),1)]);
    animations.push(iter_animations);
    t+=1;
  }

  //Scale all the animations within the frame
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
  //Algorithm
}

function frepulse(x,y, degreeX, degreeY){
  var dist = distance(x,y);
  if(dist === 0) dist = 0.00000000000000000001;
  return kr*(((degreeX+1)*(degreeY+1))/dist);

}

function fattract(x,y){
  var dist = distance(x,y);
  if(dist === 0) dist = 0.00000000000000000001;

  return Math.log(1+dist);
}

function fattractDissuade(x,y,degreeX){
  var dist = distance(x,y);
  if(dist === 0) dist = 0.00000000000000000001;
  return Math.log(1+dist)/(degreeX+1)
}


function fgravity(x, degreeX){
  return kg*(degreeX+1);
}

function fgravityStrong(x,degreeX, center){
  var dist_center = distance(x,center);
  if(dist_center === 0) dist_center = 0.00000000000000000001
  return kg*(degreeX+1)
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
  var dist = distance(x,y);
  if(dist === 0) dist = 0.00000000000000000001;
  return [new_x/dist, new_y/dist];
}
