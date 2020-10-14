export function misraGries(vertices, edges, initial_color, end_color){

  //create copies of input
  const copy_input = createFrame(vertices, edges)
  const current_vertices = copy_input.vertices;
  const current_edges = copy_input.edges;

  const uncolored_edges = copyEdges(edges);
  const incident_colors = createEmptyColors(vertices);
  const incident_vertices = createIncidentVertexList(vertices, edges);
  const edge_colors = createEdgeColors(edges);
  const animations = [];
  var colorsUsed = [];

  const num_colors = find_max_degree(vertices)+2;
  console.log("num_colors", num_colors);
  const gradient = createColorGradient(initial_color, end_color, num_colors);
  console.log("gradient", gradient);


  while(uncolored_edges.length > 0){
    const edge = uncolored_edges.pop();
    const u = edge.start;
    const v = edge.end;
    const [max_fan, fan_colors] = getMaxFan(u,v, incident_colors, incident_vertices, edge_colors);
    // console.log("max_fan", max_fan);
    // console.log("max_fan colors", fan_colors);

    const u_adjacent_colors = incident_colors[u];
    const fan_end_adjacent_colors = incident_colors[max_fan[max_fan.length-1]];


    const u_free_color = pickColor(u_adjacent_colors, gradient);
    fan_end_adjacent_colors.push(u_free_color);
    const fan_end_free_color = pickColor(fan_end_adjacent_colors, gradient);

    invertPath(u_free_color, fan_end_free_color, u, incident_colors, incident_vertices, edge_colors);
    for(let i = 0; i < fan_colors.length; i++){
      if(fan_colors[i] === fan_end_free_color) fan_colors[i] = u_free_color;
    }

    const w = findFreeColorToRotate(max_fan, fan_colors, u_free_color,
                fan_end_free_color, incident_vertices, edge_colors);
    const sub_fan = max_fan.slice(0,max_fan.indexOf(w)+1);

    for(let i = 0; i < sub_fan.length-1; i++){
      const vertex = sub_fan[i]
      const next_vertex = max_fan[max_fan.indexOf(sub_fan[i])+1];
      edge_colors[[u,vertex]] = edge_colors[[u,next_vertex]];
      edge_colors[[vertex, u]] = edge_colors[[next_vertex,u]];
    }
    edge_colors[[u,w]] = fan_end_free_color;
    edge_colors[[w,u]] = fan_end_free_color;
    incident_colors[u].push(fan_end_free_color);
    incident_colors[w].push(fan_end_free_color);
    for(let i = 0; i < edges.length; i++){
      var color = edge_colors[[current_edges[i].start, current_edges[i].end]];
      if(color !== []) color = rgb_to_str(color);
      else {color = current_edges[i].color}
      current_edges[i].color = color;
      current_edges[i].alpha = 0.4;
    }
    animations.push(createFrame(vertices, current_edges));

  }


  animations.push(createFrame(vertices, current_edges));
  return animations;
}

function rgb_to_str(color){
  return "rgb("+color[0]+","+color[1]+","+color[2]+")";
}

function createFrame(vertices, edges){
  const new_vertices = [];
  const new_edges = [];

  for(let i = 0; i < vertices.length; i++){
    new_vertices.push(vertices[i].copy_vertex());
  }

  for(let j = 0; j < edges.length; j++){
    new_edges.push(edges[j].copy_edge());
  }

  return {vertices: new_vertices, edges: new_edges};
}

function copyEdges(edges){
  const new_edges = [];
  for(let i = 0; i < edges.length; i++){
    new_edges.push(edges[i].copy_edge());
  }
  return new_edges;
}

function createEmptyColors(vertices){
  const colors = [];
  for(let i = 0; i < vertices.length; i++){
    colors.push([]);
  }
  return colors;
}

function createEdgeColors(edges){
  const edge_list = {};
  for(let i = 0; i < edges.length; i++){
    const e = edges[i];
    edge_list[[e.start,e.end]] = [];
    edge_list[[e.end, e.start]] = [];
  }
  return edge_list;
}

function find_max_degree(vertices){
  var max_degree = -Infinity;
  for(let i = 0; i < vertices.length; i++){
    max_degree = Math.max(max_degree, vertices[i].degree);
  }
  return max_degree;
}

function getMaxFan(center_vertex, other_vertex, incident_colors, incident_vertices, edge_colors){
  var fan_options = incident_vertices[center_vertex].slice();
  const other_vertex_index = fan_options.indexOf(other_vertex);
  fan_options = fan_options.slice(0, other_vertex_index).concat(fan_options.slice(other_vertex_index+1));
  var fan = [other_vertex];
  var fan_colors = [];
  var last_added = other_vertex;
  var maximal = fan_options.length === 0;


  while(!maximal){
    maximal = true;
    var bad_colors = incident_colors[last_added];
    for(let i = 0; i < fan_options.length; i++){
      const vertex = fan_options[i];
      var acceptable_color = true;
      for(let j = 0; j < bad_colors; j++){
        if(edge_colors[[last_added, vertex]] === bad_colors[j] ||
                  edge_colors[[vertex, last_added]] === bad_colors[j]){
                    acceptable_color = false;
                    break;
                  }
      }

      if(acceptable_color === true){
        fan.push(vertex);
        const color = edge_colors[[center_vertex, vertex]]
        if(color.length !== 0) fan_colors.push(color);
        // console.log(fan_colors);
        const remove_index = fan_options.indexOf(vertex);
        fan_options = fan_options.slice(0, remove_index).concat(fan_options.slice(remove_index+1));
        last_added = vertex;
        maximal = false;
        break;
      }
    }
  }
  return [fan, fan_colors];

}

function createIncidentVertexList(v,e){
  const adj = createAdjacencyMatrix(v,e);

  const adjacent_vertices = [];
  for(let i = 0; i < adj.length; i++){
    const row = [];
    for(let j = 0; j < adj[i].length; j++){
      if(adj[i][j] === 1) row.push(j);
    }
    adjacent_vertices.push(row);
  }
  return adjacent_vertices;
}

function createAdjacencyMatrix(vertices, edges){
  const adj = [];
  for(let i = 0; i < vertices.length; i++){
    const adj_row = [];
    for(let j = 0; j < vertices.length; j++){
      adj_row.push(0);
    }
    adj.push(adj_row);
  }

  for(let e = 0; e < edges.length; e ++){
    adj[edges[e].start][edges[e].end] = 1;
    adj[edges[e].end][edges[e].start] = 1;
  }
  return adj;
}

function pickColor(taken_colors, gradient){
  for(let i = 0; i < gradient.length; i++){
    var different = true;
    for(let j = 0; j < taken_colors.length; j++){
      if(gradient[i] === taken_colors[j]) {
        different = false;
        break;
      }
    }
    if(different === true) return gradient[i];
  }
  return [];
}

function invertPath(color1, color2, start, incident_colors, incident_vertices, edge_colors){
  var current_vertex = start;
  var last_vertex = start;
  var is_more_path = true;

  while(is_more_path === true){
    is_more_path = false;
    for(let i = 0; i < incident_vertices[i].length; i ++){
      const v = incident_vertices[i];
      if(v !== last_vertex && (edge_colors[current_vertex,v] === color1 ||
                                      edge_colors[current_vertex,v] === color2)){
        switchColor(current_vertex, v, color1, color2, edge_colors, incident_colors);
        is_more_path = true;
        last_vertex = current_vertex;
        current_vertex = v;
        break;
      }
    }
  }
}

function switchColor(vertex1, vertex2, color1, color2, edge_colors, incident_colors){
  if(edge_colors[[vertex1, vertex2]] === color1){
    edge_colors[vertex1,vertex2] = color2;
    edge_colors[vertex2,vertex1] = color2;
    incident_colors[incident_colors[vertex1].indexOf(color1)] = color2;
    incident_colors[incident_colors[vertex2].indexOf(color1)] = color2;
  }
  else if(edge_colors[[vertex1, vertex2]] === color2){
    edge_colors[vertex1,vertex2] = color1;
    edge_colors[vertex2,vertex1] = color1;
    incident_colors[incident_colors[vertex1].indexOf(color2)] = color1;
    incident_colors[incident_colors[vertex2].indexOf(color2)] = color1;
  }
}


function createColorGradient(color1, color2, num_colors){
  // console.log(color1, color2);
  const saturation = 0.5;
  const lightness = 0.7;
  const hue = 0;
  const uniform_factor = 360/num_colors;
  // console.log(red,green,blue);
  const new_colors = [];
  for(let i = 0; i < num_colors; i++){
    const new_hue = hue + (uniform_factor*i)%360;
    new_colors.push(convertHSLtoRGB(new_hue, saturation, lightness));
    // new_colors.push([color2[0]+red*(i/num_colors-1), color2[1]+green*(i/num_colors-1), color2[2]+ blue*(i/num_colors-1)]);
  }

  return new_colors;
}


function convertHSLtoRGB(hue, saturation, lightness){
  const C = (1 - Math.abs(2*lightness-1))*saturation
  const X = C * (1 - Math.abs(hue/60)%2 -1);
  const m = lightness - C/2;
  const [R_prime, G_prime, B_prime] = check_degrees(hue, C, X);
  return [(R_prime+m)*255, (G_prime + m)* 255, (B_prime+m) * 255];
}
//
function check_degrees(hue, C, X){
  if((hue >= 0 && hue < 60) || hue == 360) return [C,X,0];
  if(hue >= 60 && hue < 120 ) return [X,C,0];
  if(hue >= 120 && hue < 180 ) return [0, C, X];
  if(hue >= 180 && hue < 240 ) return [0, X, C];
  if(hue >= 240 && hue < 300 ) return [X, 0, C];
  if(hue >= 300 && hue < 360 ) return [C, 0, X];
  return [0,0,0];
}

function findFreeColorToRotate(max_fan, fan_colors, color, fan_end_free_color, incident_vertices, edge_colors){
  var different = true;
  for(let i = 0; i < fan_colors.length; i++){
    if(color === fan_colors[i]){
      different = false
    }
  }
  if(different === true) return max_fan[max_fan.length-1];
  for(let i = 0; i < max_fan.length; i++){
    var is_free = true;
    const v1 = max_fan[i]
    for(let j = 0; j < incident_vertices[v1]; j++){
      const v2 = incident_vertices[v1][j];
      if(edge_colors[[v1,v2]] === fan_end_free_color){
        is_free = false;
        break;
      }
    }
    if(is_free === true) return v1;
  }
}
