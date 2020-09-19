var kg = 10;

export function radialFlowDirected(vertices, edges, graph_distancex, graph_distancey, iterations, degreeArray){

  //IMPORTANT CONSTANTS
  const kIter = iterations;
  const W = graph_distancex;
  const L = graph_distancey;
  const center = [W/2, L/2];
  //COPY INPUTS
  let new_vertices = [];
  for(let i= 0; i < vertices.length; i++){
    new_vertices.push(vertices[i].slice());
  }
  let new_edges = [];
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


  while(t<kIter){
    let force_list = [];
    //calculate force of gravity towards center
    for(let i = 0; i < new_vertices.length; i ++){
      let f = [0,0];
      const unitvector = unitVector(new_vertices[i], center);
      const f_centerGravity = fgravityStrong(new_vertices[i],center, degreeArray[i]);
      f[0] += (unitVector[0])*f_centerGravity;
      f[1] += (unitVector[1])*f_centerGravity;
      force_list.push(f);
    }


    //
    const iter_animations = [];
    //update positions
    for(let i  = 0; i < new_vertices.length; i ++){
      let new_x = new_vertices[i][0] + force_list[i][0];
      let new_y = new_vertices[i][1] + force_list[i][1];

      new_vertices[i][0] = new_x;
      new_vertices[i][1] = new_y;
      iter_animations.push(new_vertices[i].slice());
    }
    t += 1;
  }

  return [new_vertices, animations]
}


function fgravityStrong(v, center, degree){
  var dist_center = distance(v, center);
  if(dist_center === 0) dist_center = 0.00000000000000000001;
  return kg*dist_center*degree;
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
