import Force from "../datatypes/Force"
var ka = 1;
var kr = 1;
var kg = 10;
var ks = 0.1;
var tau = 0.1;
var ksmax = 10;
//============================ REMEMBER TO ADD NO OVERLAP SETTING ==========================
export function forceAtlasLinLog(vertices,edges, graph_distancex, graph_distancey, iterations, settings ){

  // Algorithm constants
  const kIter = iterations;
  const W = graph_distancex -6;
  const L = graph_distancey -6;
  console.log(settings);
  kr = settings.fr;
  kg = settings.kg;
  tau = settings.tau;
  ksmax = settings.ksmax;


  //set up loop variables
  // console.log(degreeArray);
  let t = 1;
  let animations = [];
  let scaling_factor = [];
  let temperature = (1/10)*W;


  let previous_forces = [];
  for(let i = 0; i < vertices.length; i++){
    previous_forces.push(new Force(0,0));
  }
  //calculate forces
  while(t< kIter){
    let force_list = [];

    //calculate repulsive forces
    for(let i = 0; i < vertices.length; i ++){
      let f = new Force(0,0);
      // if(t === 1)console.log("vertex", i)
      for(let j = 0; j < vertices.length; j ++){
        if(i!== j){

          const repulse_force = frepulse(vertices[i], vertices[j]);
          f.addVector(repulse_force);
        }
      }
      force_list.push(f);
    }

    //calculate attractive forces
    for(let i = 0; i < edges.length; i ++){
      const e = edges[i];
      const attractive_force = fattract(vertices[e.start], vertices[e.end]);
      const attractive_force_opp = [-attractive_force[0], -attractive_force[1]]
      force_list[e.start].addVector(attractive_force);
      force_list[e.end].addVector(attractive_force_opp);
    }


    // calculate forces of gravity
    if(settings.gravity === true){
      console.log(settings.gravity);
      const center = (t === 1)? [W/2, L/2]: [(W/2) * 1/(scaling_factor[t-2][2]), (L/2) * 1/(scaling_factor[t-2][3])];
      const center_force = new Force(center[0], center[1]);

      for(let i = 0; i < vertices.length; i ++){
        const gravity_force = fgravity(vertices[i], center_force);
        // if(t === 1) console.log(gravity_force);
        force_list[i].addVector(gravity_force)
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
      const origin = new Force(0,0);
      const combined_force  = new Force(force_list[i].x + previous_forces[i].x, force_list[i].y + previous_forces[i].y);
      const traN = distance(combined_force, origin)/2
      traG += (vertices[i].x+1) * traN;
      const direction_force = new Force(force_list[i].x - previous_forces[i].x, force_list[i].y - previous_forces[i].y);
      const swgN = distance(direction_force, origin);
      swgG += (vertices[i].degree+1)*swgN;
    }
    sG = tau*(traG/swgG);
    // console.log("sG",sG);

    var sN = 0;
    for(let i = 0; i < vertices.length; i++){
      //find direction of forces
      const origin = new Force(0,0);
      const unitvector = unitVector(force_list[i], origin)
      //calculate temperatures
      const direction_force = new Force(force_list[i].x - previous_forces[i].x, force_list[i].y - previous_forces[i].y);
      const swgN = distance(direction_force, origin);
      sN = Math.min((ks*sG)/(1+sG*Math.sqrt(swgN)),ksmax/distance(force_list[i], origin));
      // console.log("sN", sN);
      vertices[i].setX(vertices[i].x + sN*force_list[i].x);
      vertices[i].setY(vertices[i].y + sN*force_list[i].y);

      //update previous forces
      previous_forces[i] = force_list[i];

      //constants for scaling factor
      minX = Math.min(minX, vertices[i].x);
      minY = Math.min(minY, vertices[i].y);
      maxX = vertices[i].x> maxX? vertices[i].x: maxX;
      maxY = vertices[i].y > maxY? vertices[i].y: maxY;
      //add animations
      iter_animations.push([vertices[i].x, vertices[i].y]);
    }
    scaling_factor.push([-minX,-minY, W/(-minX+maxX), L/(-minY+maxY)]);
    animations.push(iter_animations);
    t+=1;
  }

  //Scale all the animations within the frame
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
    maxX = Math.max(vertices[i].x, maxX);
    maxY = Math.max(vertices[i].y, maxY);
  }
  for(let i = 0; i <vertices.length; i ++){
    vertices[i].x = (vertices[i].x + (-minX)) * (W/(maxX+(-minX)));
    vertices[i].y = (vertices[i].y + (-minY)) * (L/(maxY + (-minY)));
  }

  return [vertices, animations];
  //Algorithm
}

function frepulse(x,y){
  var dist = distance(x,y);
  const unitvector = unitVector(y,x);
  return [unitvector[0]*kr*(((x.degree+1)*(y.degree+1))/dist),
            unitvector[1]*kr*(((x.degree+1)*(y.degree+1))/dist)];

}

function fattract(x,y){
  var dist = distance(x,y);
  const unitvector = unitVector(x,y);
  return [unitvector[0] *Math.log(1+dist), unitvector[1]*Math.log(1+dist)];
}

function fattractDissuade(x,y){
  var dist = distance(x,y);
  const unitvector = unitVector(x,y);
  return [unitvector[0]*Math.log(1+dist)/(x.degree+1), unitvector[1]*Math.log(1+dist)/(x.degree+1)]
}



function fgravity(v, center){
  var dist_center = distance(v,center);
  var unitvector = unitVector(v,center);
  return [unitvector[0]*kg*(v.degree+1)*dist_center, unitvector[1]*kg*(v.degree+1)*dist_center];
}

function distance(v1,v2){
  var dist = Math.pow(v1.x-v2.x,2) + Math.pow((v1.y-v2.y),2)
  if(dist === 0) dist = 0.00000000000000000001
  return  Math.sqrt(dist);
}

/**
* UnitVector from X to Y
*/
function unitVector(v1,v2){
  const new_x = v2.x - v1.x;
  const new_y = v2.y - v1.y;
  var dist = distance(v1,v2);
  return [new_x/dist, new_y/dist];
}
