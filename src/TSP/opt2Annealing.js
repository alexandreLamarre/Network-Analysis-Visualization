import Edge from "../datatypes/Edge";
const MAX_SIMULATIONS = 150;
var I = -1;
var K = -1;

export function opt2Annealing(vertices, edges, dimension, startColor, endColor, temperature, minTemperature, maxTemperature, acceptance){
  const path = [];
  var better_solution = false
  const gradient = createColorGradient(endColor, startColor, 10);
  var selected_index = (temperature/maxTemperature)*(gradient.length-1);
  selected_index = Math.floor(selected_index);
  const selected_color = rgb_to_str(gradient[selected_index]);


  var root = edges[0].start;
  path.push(root);

  for(let i = 1; i< edges.length; i++){
    path.push(edges[i].start);
  }
  path.push(root);
  // console.log("original path", path);
  const dist = calculate_distance_path(path, vertices, dimension);
  for(let n = 0; n< MAX_SIMULATIONS; n++){
    var new_path = [];
    new_path.push(root);
    var i = Math.floor(Math.random()*(path.length-2))+1;
    var k = Math.floor(Math.random()*(path.length-2))+1;
    if(i > k){ //swap
      var temp = i;
      i = k;
      k = temp;
    }
    for(let m = 0; m < i; m++){
      new_path.push(path[m+1]);
    }

    for(let m = k-1; m>i-1; m--){
      new_path.push(path[m+1]);
    }

    for(let m = k; m < path.length-1; m++){
      new_path.push(path[m+1])
    }
    var new_dist = calculate_distance_path(new_path, vertices, dimension);
    const accepted = Math.random();
    if(new_dist < dist || accepted < temperature*acceptance) better_solution = true;
    if(better_solution === true) {
      I = i;
      K = k;
      break
    };
  }
  // console.log("better solution", better_solution);
  if(better_solution === false) new_path = path;
  var new_edges = [];
  for(let i = 0; i < path.length-1; i++){
    const e = edges[i].copy_edge();
    e.start = new_path[i];
    e.end = new_path[i+1];
    new_edges.push(e);
    if(i === I || i === K) {
      new_edges[i].setColor(selected_color);
      new_edges[i].setAlpha(0.7);
    }
  }
  return [new_edges, better_solution];

}


function calculate_distance_path(path, vertices, dimension){
  var total_dist = 0;
  for(let i = 0; i < path.length-1; i++){
    total_dist += distance(vertices[path[i]], vertices[path[i+1]], dimension);
  }
  return total_dist;
}

function distance(v1, v2, dimension){
  var dist;
  if(dimension === 2) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2);
  if(dimension === 3) dist = Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2) + Math.pow(v1.z-v2.z,2);
  if(dist === 0) dist = 0.00000000000000000001;
  return Math.sqrt(dist);
}

function swap(u,v){
  const temp = u;
  u = v;
  v = temp;
}

function try2OptSwap(path, vertices, i, k, dimension, dist){
  var changed = false;
  const new_path = [];
  var root = path[0];
  new_path.push(root);
  for(let n = 0; n < i; n++){
    new_path.push(path[n+1]);
  }
  for(let n = k+i; n > i; n++){
    new_path.push(path[n+1]);
  }
  new_path.push(root);
  const new_dist = calculate_distance_path(new_path, vertices, dimension);
  if(new_dist< dist) return [new_path, true]
  else{ return [path, false]};
}


function rgb_to_str(color){
  return "rgb("+color[0]+","+color[1]+","+color[2]+")";
}

function createColorGradient(startColor, endColor, maxDegree){
  // console.log("inside color gradient", startColor, endColor, maxDegree);
  var [startHue, startSaturation, startLightness] = rgb_to_hsl(startColor);
  var [endHue, endSaturation, endLightness] = rgb_to_hsl(endColor);

  // console.log(startHue, startSaturation, startLightness);
  // console.log(endHue, endSaturation, endLightness);
  var incrementHue = (endHue-startHue)/maxDegree;

  const gradient = [];

  for(let i = 0; i < maxDegree; i++){
    const newHue = startHue+(incrementHue*i)%360;
    const [red,green,blue] = hsl_to_rgb((startHue+incrementHue*i)%360, startSaturation,
                                            startLightness)
    gradient.push([Math.abs(red%256), Math.abs(green%256), Math.abs(blue%256)]);
    // console.log(gradient[i]);
  }
  return gradient;
}

function rgb_to_hsl(rgbColor){
  var red = rgbColor[0]/255;
  var green = rgbColor[1]/255;
  var blue = rgbColor[2]/255;
  var Cmax = Math.max(...[red,green,blue]);
  var Cmin = Math.min(...[red,green,blue]);
  var delta = Cmax-Cmin;


  var hue = calculate_hue(delta, Cmax, red, green, blue)%360;
  var lightness = (Cmax+Cmin)/2;
  var saturation = delta === 0? 0: delta/(1-Math.abs(2*lightness-1));

  return [hue, saturation, lightness];
}

function hsl_to_rgb(hue, saturation, lightness){
  const C = (1 - Math.abs(2*lightness-1))*saturation
  const X = C * (1 - Math.abs(hue/60)%2 -1);
  const m = lightness - C/2;
  const [R_prime, G_prime, B_prime] = check_degrees(hue, C, X);
  return [((R_prime+m)*255)%256, ((G_prime + m)* 255)%256, ((B_prime+m) * 255)%256];
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


function calculate_hue(delta, Cmax, red, green, blue){
  if(delta === 0) return 0;
  if(Cmax === red) return 60*(((green-blue)/delta)%6);
  if(Cmax === green) return 60*((blue-red)/delta+2);
  if(Cmax === blue) return 60*((red- green)/delta + 4);
}
