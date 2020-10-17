import Vertex from "../datatypes/Vertex";
import Edge from "../datatypes/Edge";

export default function createRandomNetwork(maxWidth, maxHeight, numV, numE, conn, randomType, startColors, endColors, resize, minsize, maxsize){
  let connected = conn === undefined? "False": conn;
  let seed = randomType === undefined? "random": randomType;
  // console.log("startColors:", startColors);
  // console.log("endColors:", endColors);
  // console.log("resize", resize);
  // console.log("minsize", minsize);
  // console.log("maxsize", maxsize);
  const maxDegree = numV-1;
  let maxEdges = Math.floor((maxDegree*numV)/2)
  const maxEdgesValue = maxEdges;
  let vertices = [];
  let available_vertices = [];
  const center = [maxWidth/2, maxHeight/2];
  const radius = (maxHeight/2)*0.90;

  //create random points on canvas
  for(let i = 0; i < numV; i ++){
    var point = [0,0]
    if(seed === "random" || seed === "cycle") point = createRandomPos(maxWidth, maxHeight);
    if(seed === "randomcircle") point = createRandomPosCircle(center, radius);
    vertices.push( new Vertex(point[0], point[1]));
    available_vertices.push(i);
  }
  let edges = [];
  if(!(seed === "cycle")){
    let already_connected = new Map();
    let remainingEdges = numE;
    if(connected === "True"){
      let unvisited = [];
      for(var i = 0; i < numV; i++){
        unvisited.push(i);
      }
      let visited = [];
      var vIndex1 = pickRandomVertex(unvisited);
      var v1 = unvisited[vIndex1];
      visited.push(v1);
      unvisited = removeFromArray(unvisited, vIndex1);

      var visited_num = 1;
      while(visited_num < numV){
        var vIndex2 = pickRandomVertex(unvisited)
        var v2 = unvisited[vIndex2];
        visited.push(v2); //add to visited
        edges.push( new Edge(v1,v2));
        vertices[v1].increment_degree();
        vertices[v2].increment_degree();
        remainingEdges --;
        maxEdges --;
        const indexTo = v1 + 1000* v2; // works as long as numV < 1000
        const indexFrom = v2+ 1000*v1;
        already_connected.set(indexTo, true);
        already_connected.set(indexFrom, true);
        //remove from unvisited
        unvisited = removeFromArray(unvisited, vIndex2);
        //reset v1
        vIndex1 = pickRandomVertex(visited);
        v1 = visited[vIndex1];
        visited_num ++;
      }
    }
    while(remainingEdges > 0 && maxEdges > 0 && available_vertices.length > 1){
      const [random1, random2] = connectRandomVertices(available_vertices.slice());
      if(random1 === random2) console.log("unexpected");
      if(random1 === undefined) console.log("unexpected undefiend 1");
      if(random2 === undefined) console.log("unexpected undefined 2");
      // console.log("rem:", remainingEdges, "max", maxEdges);
      const indexTo = random1+1000*random2; // as long as numV < 1000 this works
      const indexFrom = random2+1000*random1;
      if(already_connected.get(indexTo) === undefined ){
        edges.push(new Edge(random1, random2));
        vertices[random1].increment_degree();
        vertices[random2].increment_degree();
        if(vertices[random1].degree > maxDegree) available_vertices.splice(random1, 1);
        if(vertices[random2].degree > maxDegree) available_vertices.splice(random2, 1);
        already_connected.set(indexTo, true);
        already_connected.set(indexFrom, true);
        remainingEdges --;
        maxEdges --;
        }
      }
  }
  else{
    //seed = cycle
    var [path,root] = initial_random_cycle(vertices);
    for(let i = 0; i < path.length-1; i++){
      const e = new Edge(path[i], path[i+1])
      e.setAlpha(0.2);
      edges.push(e);
    }
    for(let i = 0; i < vertices.length; i ++){
      vertices[i].degree = 2;
    }
  }


  var max_degree = find_max_degree(vertices);
  // console.log("max_degree", max_degree);
  var shouldRecolor = !(sameColor(startColors, endColors));
  // console.log(shouldRecolor);
  var colorGradient;
  if(shouldRecolor === true) var colorGradient = createColorGradient(startColors, endColors, max_degree);
  // console.log(colorGradient);
  if(resize === true || shouldRecolor === true){
  for(let i = 0; i < vertices.length; i++){
      if(resize === true) vertices[i].size = assign_size(vertices[i].degree, max_degree, minsize, maxsize);
      if(shouldRecolor === true) vertices[i].color = assign_color(vertices[i].degree, max_degree, colorGradient);
      // console.log(vertices[i].size)
      // console.log(vertices[i].color);
    }
  }

  return [vertices,edges];
}

function createRandomPos(maxWidth, maxHeight){
  return [Math.random()*(maxWidth+1-3), Math.random()*(maxHeight+1-3)];
}

function createRandomPosCircle(center,radius){
  const randomAngle = Math.random()*(2*Math.PI);
  return [center[0] + radius*Math.cos(randomAngle), center[1]+radius*Math.sin(randomAngle)];
}

function connectRandomVertices(vertices){
  var random1 = vertices[Math.floor(Math.random()*vertices.length)];
  vertices.splice(random1,1);
  var random2 = vertices[Math.floor(Math.random()*vertices.length)];

  return [random1, random2];
}

function pickRandomVertex(array){
  return Math.floor(Math.random()*array.length)
}

function removeFromArray(array, index){
  return array.slice(0,index).concat(array.slice(index+1))
}

function initial_random_cycle(vertices){

  var root = 0;
  var initial_path = []

  //construct adjacency matrix
  const adj = []
  var available_vertices = [];
  for(let i = 0; i < vertices.length; i++){
    available_vertices.push(i);

  }


  root = pick_random_array(available_vertices);
  available_vertices = remove_from_array(available_vertices, root);

  initial_path.push(root);
  for(let i = 0; i < vertices.length -1; i++){
    const next_node = pick_random_array(available_vertices);
    available_vertices = remove_from_array(available_vertices, next_node);
    initial_path.push(next_node);
  }
  initial_path.push(root);

  return [initial_path, root];
}

function remove_from_array(array, item){
  var index  = array.indexOf(item)
  return array.slice(0,index).concat(array.slice(index+1));
}

function pick_random_array(array){
  return array[Math.floor(Math.random()*array.length)];
}

function find_max_degree(vertices){
  var max_degree = -Infinity;
  for(let i = 0; i < vertices.length; i++){
    max_degree = Math.max(vertices[i].degree, max_degree);
  }
  return max_degree;
}

function assign_size(degree, max_degree, minsize, maxsize){
  //min degree is 1 or 0
  return minsize +(maxsize - minsize)*(degree/max_degree)
}

function assign_color(degree, max_degree, gradient){

  var selection = gradient[Math.floor((degree/max_degree) * (gradient.length-1))]

  return rgb_to_str(selection)
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

function calculate_hue(delta, Cmax, red, green, blue){
  if(delta === 0) return 0;
  if(Cmax === red) return 60*(((green-blue)/delta)%6);
  if(Cmax === green) return 60*((blue-red)/delta+2);
  if(Cmax === blue) return 60*((red- green)/delta + 4);
}

function rgb_to_str(color){
  return "rgb(" + color[0] + "," + color[1] + "," + color[2]+")";
}

/*
Input is RGB colors in 3d array
*/
function sameColor(startColor, endColor){
  if(startColor[0] === endColor[0] && startColor[1] === endColor[1] && startColor[2] === endColor[2]) return true;
  return false;
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
