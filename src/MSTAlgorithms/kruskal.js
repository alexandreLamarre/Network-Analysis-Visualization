import UnionSets from "../datatypes/UnionSets";

var VERTICES = [];

export function kruskal(vertices, edges, dimension){
  VERTICES = vertices;
  const A = [];
  const coloring = "rgb(255,0,0)";

  const make_set = [];
  for(let i = 0; i < vertices.length; i++){
    make_set.push(i);
  }

  var sorted_edges = edges.sort(function(e1,e2){
    return distance(VERTICES[e1.start],VERTICES[e1.end],dimension) - distance(VERTICES[e2.start], VERTICES[e2.end],dimension);
  });

  const color_animations = [];

  const trees = [];
  const tree_indices = [];
  for(let i = 0; i < vertices.length; i++){
    const u =  new UnionSets();
    u.add(i);
    trees.push(u);
    tree_indices.push(i);
  }

  for(let e= 0; e< sorted_edges.length; e++){
    const u = sorted_edges[e].start;
    const v = sorted_edges[e].end;


    if(tree_indices[u] !== tree_indices[v]){
      trees[tree_indices[u]].push(trees[tree_indices[v]].contents);
      const val = tree_indices[v];
      for(let i = 0; i < tree_indices.length; i++){
        if(tree_indices[i] === val){
          tree_indices[i] = tree_indices[u];
          trees[tree_indices[i]].contents = [];
        }
      }
      color_animations.push({vIndex: u, color: coloring, size: 4});
      color_animations.push({eIndex: e, color: coloring, alpha:0.4});
      color_animations.push({vIndex: v, color: coloring, size:4});
    }
  }

  return [color_animations, sorted_edges];
}

function distance(v1,v2,dim){
  var dist = null;
  if(dim === 2) dist = Math.sqrt(Math.pow(v1.x-v2.x, 2) + Math.pow(v1.y-v2.y,2));
  if(dim === 3) dist = Math.sqrt(Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y, 2) + Math.pow(v1.z-v2.z, 2));
  return dist === 0? 0.00000000000000000001: dist;
}
