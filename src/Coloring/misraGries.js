export function misraGries(vertices, edges, initial_color, end_color){
  // calculate max degree
  var max_degree = -Infinity;
  for(let i = 0; i < vertices.length; i ++){
    max_degree = Math.max(max_degree, vertices[i].degree);
  }

  const adj = createAdjacencyMatrix(vertices, edges)

  var num_colors = max_degree + 1;

  var colors = createColorGradient(initial_color, end_color, num_colors);

  let U = edges.slice();

  while(U.length !== 0){

  }
}

function createColorGradient(color1, color2, num_colors){
  const new_colors = [];
  for(let i = num_colors; i > 0; i--){
    const red = color2[0] - color1[0];
    const green = color2[1] - color1[1];
    const blue = color2[2] - color1[2];
    new_colors.push([color1+red/i, color1+green/i, color1+ blue/i]);
  }
  return new_colors;
}


function maximalFan(vertex, adj){
  const fans = [];
  for(let i = 0; adj.length; i ++){
    if(adj[vertex][i] === 1) fans.push(i);
  }
  return fans;
}

function createAdjacencyMatrix(v, e){
  const adj = [];
  for(let i = 0; i < v.length; i++){
    const adj_row = [];
    for(let j = 0; j < v.length; j++){
      adj_row.push(0);
    }
    adj.push(adj_row);
  }

  for(let i = 0; i < e.length; i ++){
    adj[edges[i].start][edges[i].end] = 1;
    adj[edges[i].end][edges[i].start] = 1;
  }
  return adj;
}
