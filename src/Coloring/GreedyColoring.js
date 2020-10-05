export function GreedyColoring(vertices, edges, initial_color, end_color){

  var max_degree = -Infinity;
  var assigned_colors = [];
  for(let i = 0; i < vertices.length; i ++){
    assigned_colors.push(-1);
    max_degree = Math.max(max_degree, vertices[i].degree);
  }
  const adj = createAdjacencyMatrix(vertices, edges);
  const animations = [];
  var num_colors = max_degree;
  // console.log("number of colors", num_colors);
  // console.log(initial_color, end_color);
  // console.log(num_colors);
  var colors = createColorGradient(initial_color, end_color, num_colors);
  // console.log("available colors", colors);
  for(let i = 0; i < vertices.length; i++){
    // console.log("iteration");
    const neighbors = getNeighbors(vertices, i, adj);
    // console.log(neighbors)
    const available_colors = getAvailableColors(assigned_colors, neighbors, colors);
    // console.log("available_colors", available_colors);
    const new_color = convertColor(available_colors[0]);
    // console.log(new_color)
    // console.log(animations);
    animations.push({vIndex: i, color: new_color});
    assigned_colors[i] = new_color;
  }

  return [vertices, animations];


}

function createColorGradient(color1, color2, num_colors){
  // console.log(color1, color2);
  const saturation = 0.5;
  const lightness = 0.7;
  const hue = 0;
  const uniform_factor = 360/num_colors;
  // console.log(red,green,blue);
  const new_colors = [];
  for(let i = 0; i < num_colors+1; i++){
    const new_hue = hue + (uniform_factor*i)%360;
    new_colors.push(convertHSLtoRGB(new_hue, saturation, lightness));
    // new_colors.push([color2[0]+red*(i/num_colors-1), color2[1]+green*(i/num_colors-1), color2[2]+ blue*(i/num_colors-1)]);
  }

  return new_colors;
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
    adj[e[i].start][e[i].end] = 1;
    adj[e[i].end][e[i].start] = 1;
  }
  return adj;
}

/*
Return index of vertices that are neighbors of v
*/
function getNeighbors(vertices, index, adj){
  const neighbors = [];
  for(let i = 0; i < vertices.length; i ++){
    if(adj[index][i] === 1) neighbors.push(i);
  }
  return neighbors;
}

function getAvailableColors(assigned_colors, neighbors, colors){
  const all_colors = [];
  const available_colors = [];
  for(let i = 0; i < neighbors.length; i++){
    // console.log(neighbors[i]);
    const color = assigned_colors[neighbors[i]];
    if(color !== -1) {
      // console.log(color);
      all_colors.push(colorConvert(color))};
  }
  // console.log("all colors",all_colors);
  for(let i = 0; i < colors.length; i++){
    if(!(checkColorIn(colors[i], all_colors))) available_colors.push(colors[i]);

  }

  return available_colors;
}

function convertColor(color){
  return "rgb("+color[0].toString()+","+color[1].toString()+","+color[2].toString()+")";
}

function checkColorIn(color, array){
  // console.log("CHECKING", color, array)
  for(let i = 0; i < array.length; i++){
    // console.log("ARRAY ENTRY", array[i])
    // console.log("COLOR", color);
    if(parseInt(array[i][0]) === parseInt(color[0]) && parseInt(array[i][1]) === parseInt(color[1])
                                      && parseInt(array[i][2]) === parseInt(color[2])) return true;
  }
  return false;
}

/*
rgb string to 3-array
*/
function colorConvert(color){
  const arr = color.split(",");
  // console.log(arr)
  var red = arr[0].split("(")
  // console.log(red[1]);
  red = parseFloat(red[1]);
  // console.log("red", red);
  const green = parseFloat(arr[1]);
  // console.log("green", green);
  const blue = parseFloat(arr[2]);
  // console.log("blue", blue);
  return [red,green,blue];
}

function convertHSLtoRGB(hue, saturation, lightness){
  const C = (1 - Math.abs(2*lightness-1))*saturation
  const X = C * (1 - Math.abs(hue/60)%2 -1);
  const m = lightness - C/2;
  const [R_prime, G_prime, B_prime] = check_degrees(hue, C, X);
  return [(R_prime+m)*255, (G_prime + m)* 255, (B_prime+m) * 255];
}

function check_degrees(hue, C, X){
  if((hue >= 0 && hue < 60) || hue == 360) return [C,X,0];
  if(hue >= 60 && hue < 120 ) return [X,C,0];
  if(hue >= 120 && hue < 180 ) return [0, C, X];
  if(hue >= 180 && hue < 240 ) return [0, X, C];
  if(hue >= 240 && hue < 300 ) return [X, 0, C];
  if(hue >= 300 && hue < 360 ) return [C, 0, X];
  return [0,0,0];
}
