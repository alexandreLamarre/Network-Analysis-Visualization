var CREP = 20;
var CSPRING = 20;
var lx = 0;
var ly = 0;
/**
* Basic spring embedding algorithm
*/
export function springEmbedding(vertices,edges,graph_distancex, graph_distancey, iterations, threshold, constant, cspring, crep){
  // relevant constants for spring embedding
  lx = graph_distancex;
  ly = graph_distancey;
  const K = iterations === undefined ? 300: iterations;
  const epsilon = threshold === undefined? 0.1: threshold;
  const delta = constant === undefined? 1.5: constant;
  CREP = cspring === undefined? 20: cspring;
  CSPRING = crep === undefined? 20: crep;

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
          new_edges.push(new_vertices[i].slice(),new_vertices[j].slice());
        }
      }
    }
  }

  let t = 1;
  let maxFvt = Infinity;
  let animations = [];
  let previous = [];

  while(t<K && maxFvt > epsilon){
    let force_list = [];
    for(let i =0; i < new_vertices.length; i++){
      let f = [0,0]; // should be two dimensional
      let vert_connected = []; //represents vertices we should not repulse later
      for(let j = 0; j < new_edges.length; j++){
        //vertices should attract
        if(i === new_edges[j][0] && i !== new_edges[j][1]){
          const calcs = fattract(new_vertices[new_edges[j][0]], new_vertices[new_edges[j][1]]);
          // console.log(calcs);
          f[0] += calcs[0]; // should be two dimensional
          f[1] += calcs[1];
          vert_connected.push(new_edges[j][1]);
        }
        //vertices should attract
        if(i === new_edges[j][1] && i !== new_edges[j][0]){
          const calcs = fattract(new_vertices[new_edges[j][0]], new_vertices[new_edges[j][1]])
          f[0] += calcs[0]; // should be two dimensional
          f[1] += calcs[1];
          vert_connected.push(new_edges[j][0]);
        }
      }
      for(let j =0; j < new_vertices.length; j++){
        if(i === j ) continue;
        let connected = false;
        for(let k = 0; k < vert_connected.length; k++){
          if(j === vert_connected[k]) connected = true;
        }
        // vertices should repluse one another
        if(!connected){
          const calcs = frepulse(new_vertices[i], new_vertices[j]);
          f[0] += calcs[0];// should be two dimensional
          f[1] += calcs[1];
        }
      }
      force_list.push(f)
    }
    const iteration_animation = [];

    for(let i = 0; i < new_vertices.length; i++){
      let new_x = new_vertices[i][0] + delta*force_list[i][0];
      let new_y = new_vertices[i][1] + delta*force_list[i][1];
      const old_vertices = new_vertices[i].slice();
      if(new_x < 0 && new_y < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([0,0], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x < 0 && new_y > graph_distancey-6){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([0,graph_distancey-6], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x > graph_distancex-6 && new_y < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([graph_distancex-6,0], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x > graph_distancex-6 && new_y >graph_distancey -6){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([graph_distancex-6,graph_distancey-6], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([0,new_y], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_y < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([new_x,0], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x +6 > graph_distancex){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([graph_distancex-6,new_y], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_y + 6 > graph_distancey){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([new_x,graph_distancey-6], old_vertices);
        // console.log("overflow:",overFlowDist);
        // console.log("wanted", wantedDistance);
        // console.log("ratio:" , wantedDistance/overFlowDist);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      new_vertices[i][0] = new_x//(new_x > graph_distancex-3)? (graph_distancex-3): ((new_x-3) < 0)? 0: (new_x-3); // should be two dimensional
      new_vertices[i][1] = new_y//(new_y > graph_distancey-3)? (graph_distancey-3): ((new_y -3)< 0)? 0: (new_y-3);
      iteration_animation.push(new_vertices[i].slice());
      const max_dist = distance(force_list[i], [0,0]);
      if(maxFvt === Infinity){
        maxFvt = max_dist;
      }
      else{
        maxFvt = maxFvt > max_dist? maxFvt: max_dist;
      }
    }
    animations.push(iteration_animation);
    t += 1
  }
  // animations.push(new_vertices.slice());
  const iteration_animation = [];
  for(let i = 0; i < new_vertices.length; i ++){
    if(new_vertices[i][0] < 0) new_vertices[i][0] = 0;
    if(new_vertices[i][1] < 0)new_vertices[i][1] = 0;
    if(new_vertices[i][0] > graph_distancex -6) new_vertices[i][0] = graph_distancex-6;
    if(new_vertices[i][1] > graph_distancey - 6) new_vertices[i][1] = graph_distancey-6;
    iteration_animation.push(new_vertices[i].slice())
  }
  animations.push(iteration_animation);
  return [new_vertices, animations];
}

function frepulse(x,y){
  const dist = distance(x,y);
  if(dist === 0){
     console.log("error");
     console.log(x);
     console.log(y);
   }
  const unitV = unitVector(x,y);
  return [(unitV[0]*CREP)/dist, (unitV[1]*CREP)/dist];

}

function fattract(x,y){
  const dist = distance(x,y);
  const unitV = unitVector(x,y);

  return [CSPRING* (Math.log(distance(x,y))/(lx))* unitV[0],
          CSPRING* (Math.log(distance(x,y))/(ly))*unitV[1]];
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

function calcAngle(x,y){
  return Math.atan2((y[1] - y[0]),(x[1]-x[0]))
}
