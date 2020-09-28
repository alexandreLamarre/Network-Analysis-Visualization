import UnionSets from "../datatypes/UnionSets";

var VERTICES = [];

export function kruskal(vertices, edges){
  VERTICES = vertices;
  const A = [];
  const coloring = "rgb(255,0,0)";

  const make_set = [];
  for(let i = 0; i < vertices.length; i++){
    make_set.push(i);
  }

  var sorted_edges = edges.sort(function(e1,e2){
    return distance(VERTICES[e1.start],VERTICES[e1.end]) - distance(VERTICES[e2.start], VERTICES[e2.end]);
  });

  const color_animations = [];

  const trees = [];
  for(let i = 0; i < vertices.length; i++){
    const u =  new UnionSets();
    u.add(i);
    trees.push(u);
  }

  for(let e= 0; e< sorted_edges.length; e++){
    console.log(distance(vertices[sorted_edges[e].start], vertices[sorted_edges[e].end]));
    const u = sorted_edges[e].start;
    const v = sorted_edges[e].end;
    if(trees[u].representative !== trees[v].representative){
      trees[u].union(trees[v]);
      color_animations.push({vIndex: u, color: coloring, size: 4});
      color_animations.push({eIndex: e, color: coloring, alpha:0.4});
      color_animations.push({vIndex: v, color: coloring, size:4});
    }
  }



  console.log("done")
  console.log(sorted_edges);
  return [color_animations, sorted_edges];
}

function distance(v1,v2){
  const dist = Math.sqrt(Math.pow(v1.x-v2.x, 2) + Math.pow(v1.y-v2.y,2))
  return dist === 0? 0.00000000000000000001: dist;
}
