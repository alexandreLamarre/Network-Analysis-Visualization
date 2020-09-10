var lx =0;
var ly = 0;
var C= 20;
var K = 0.01; //OPTIMAL DISTANCE
var tol = 0.01; //TOLERANCE


export function fruchtermanReingold(vertices,edges,graph_distancex, graph_distancey, iterations, forces, optimaldist, tolerance){
  lx = graph_distancex;
  ly = graph_distancey;
  const kIter = iterations === undefined ? 300: iterations;
  C = forces === undefined? 30: forces;
  K = optimaldist === undefined?0.1: optimaldist;
  tol = tolerance === undefined? 0.01: tolerance;

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
  let converged = false;
  let step = iterations;

  while(t<kIter && !converged){
    let force_list = [];
    for(let i = 0; i < new_vertices.length; i++){
        let f = [0,0];
        for(let k = 0; k < edges.length; k++){
          if(i === edges[k][0] && i !== edges[k][1]){
            // Calculate fattract
            const attractForce = fattract(new_vertices[i], new_vertices[edges[k][1]])
            f[0] += attractForce[0];
            f[1] += attractForce[1];
          }
          if(i === edges[k][1] && i !== edges[k][0]){
            //calculate fattract
            const attractForce = fattract(new_vertices[i], new_vertices[edges[k][0]])
            f[0] += attractForce[0];
            f[1] += attractForce[1];
          }
        }

        for(let j = 0; j < new_vertices.length; j ++){
          if(i !== j){
            //calculate frepulse
            const repulseForce = frepulse(new_vertices[i], new_vertices[j]);
            f[0] += repulseForce[0];
            f[1] += repulseForce[1];
          }
        }
        force_list.push(f);
        //if(distance(new, previous) < epsilon * tol) converged = true
    }
    // end for
    const iteration_animation = [];
    let max_dist = 0;
    for(let i = 0; i < new_vertices.length; i++){
      let new_x = vertices[i][0] + step* force_list[i][0]/distance([0,0], force_list[i]);
      let new_y = vertices[i][1] + step* force_list[i][0]/ distance([0,0], force_list[i]);
      const old_vertices = new_vertices[i].slice();
      if(new_x < 0 && new_y < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([0,0], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x < 0 && new_y > graph_distancey-6){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([0,graph_distancey-6], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x > graph_distancex-6 && new_y < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([graph_distancex-6,0], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x > graph_distancex-6 && new_y >graph_distancey -6){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([graph_distancex-6,graph_distancey-6], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([0,new_y], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_y < 0){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([new_x,0], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_x +6 > graph_distancex){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([graph_distancex-6,new_y], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      else if(new_y + 6 > graph_distancey){
        const overFlowDist = distance([new_x,new_y], old_vertices);
        const wantedDistance = distance([new_x,graph_distancey-6], old_vertices);
        new_x = (wantedDistance/overFlowDist) * (new_x - old_vertices[0]);
        new_y = (wantedDistance/overFlowDist) * (new_y - old_vertices[1]);
      }
      new_vertices[i][0] = new_x;
      new_vertices[i][1] = new_y;
      iteration_animation.push(new_vertices[i].slice());
      const changedist = distance(new_vertices[i], old_vertices);
      max_dist = max_dist > changedist? max_dist: changedist;
    }
    step = step*0.95
    if(max_dist< K*tol){
      converged = true
    }
    animations.push(iteration_animation);
    t += 1;
  }
  //end while
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
  const unitV = unitVector(x,y);
  return [((-C*Math.pow(K,2))/dist)*unitV[0], ((-C*Math.pow(K,2))/dist)*unitV[1]];
}

function fattract(x,y){
  const dist2 = Math.pow(distance(x,y),2);
  const unitV = unitVector(x,y);

  return [(dist2/K)*unitV[0],
          (dist2/K)*unitV[1]];
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

function nodeMass(v){
  return 1/(1+(v)/2);
}
