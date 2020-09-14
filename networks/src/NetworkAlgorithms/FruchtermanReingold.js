var lx =0;
var ly = 0;
var C= 1;
var K = 0.01; //OPTIMAL DISTANCE
var tol = 0.01; //TOLERANCE
var ITERATIONS = 300;

export function fruchtermanReingold(vertices,edges,graph_distancex, graph_distancey, iterations, coolingtype, tempScale){
  const W = graph_distancex -6;
  const L = graph_distancey -6;
  const kIter = iterations === undefined ? 300: iterations;
  ITERATIONS = kIter;
  const tempHeuristic = coolingtype === undefined? "Linear": coolingtype;
  C = 0.00000001;
  K = C* Math.sqrt((W)*(L)/(vertices.length));
  // tol = tolerance === undefined? 0.01: tolerance;
  console.log("K", K);

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
      // if(t===1) console.log("forcelist",force_list[e[0]]);
      // if(t===1) console.log("forcelist",force_list[e[1]])
    }
    // console.log(force_list);
    //update positions
    const iter_animations = [];
    for(let i = 0; i < new_vertices.length; i++){
      // console.log(force_list[i]);
      const unitvector = unitVector(force_list[i], [0,0])
      const xi = unitvector[0];
      const yi = unitvector[1];
      // if(t===1)console.log("unitvector:", unitvector);
      // if(t===1)console.log(new_vertices[i][0] + unitvector[0]);
      // if(t===1)console.log(new_vertices[i][1] + unitvector[1]);
      let new_x = new_vertices[i][0] +xi*Math.min(temperature, Math.abs(force_list[i][0]))//*Math.min(force_list[i][0], temperature));
      let new_y =  new_vertices[i][1] + yi*Math.min(temperature, Math.abs(force_list[i][1])) //*Math.min(force_list[i][1], temperature));
      // new_x = Math.min(W/2, Math.max(-W/2,new_x));
      // new_y = Math.min(L/2, Math.max(-L/2, new_y));
      const old_vertices = new_vertices[i].slice();
      const x0 = old_vertices[0];
      const y0 = old_vertices[1];
      while(new_x < 0 || new_y < 0 || new_x > W || new_y > L){
        console.log(new_x,new_y);
        const x1 = new_x;
        const y1 = new_y;
        if(new_x < 0){
          new_x = -(x1);
          new_y = (y1)
        }
        else if(new_y < 0){
          new_x = (x1);
          new_y = -(y1);
        }
        else if(new_x > W){
          new_x = W -(x1-W);
          new_y = (y1);
        }
        else if(new_y > L){
          new_x = (x1);
          new_y = L - (y1-L);
        }
      }

      new_vertices[i][0] = new_x;
      new_vertices[i][1] = new_y;
      iter_animations.push(new_vertices[i].slice())
    }

    animations.push(iter_animations);

    temperature = cool(temperature, tempHeuristic, initial_temperature);
    console.log(temperature);
    t+= 1;
  }


  return [new_vertices, animations];
}

function frepulse(z){
  return (Math.pow(K,2))/z
}

function fattract(z){
  return (Math.pow(z,2))/K
}

function distance(x,y){
  // console.log(x,y);
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

function reflectionVector(x,y,theta){
  const reflection_matrix = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), -Math.cos(theta)]];
  return [reflection_matrix[0][0]*x + reflection_matrix[0][1]*x, reflection_matrix[1][0]*y + reflection_matrix[1][1]*y]
}
