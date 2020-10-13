import UnionSets from "../datatypes/UnionSets";
import Vertex from "../datatypes/Vertex";
import Edge from "../datatypes/Edge";

var VERTICES = [];

export function kruskal(vertices, edges, dimension, color){
  //constants
  VERTICES = vertices; //used for soring edges
  const A = [];
  const coloring = rgb_to_str(color);
  const color_animations = [];

  const make_set = [];
  for(let i = 0; i < vertices.length; i++){
    make_set.push(i);
  }
  //first need to sort edges by increasing weight
  var sorted_edges = edges.sort(function(e1,e2){
    return distance(VERTICES[e1.start],VERTICES[e1.end],dimension) - distance(VERTICES[e2.start], VERTICES[e2.end],dimension);
  });

  const copy_input = createFrame(vertices, sorted_edges);
  const current_vertices = copy_input.vertices;
  const current_edges = copy_input.edges
  color_animations.push(createFrame(current_vertices, current_edges));

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
      current_vertices[u].color = coloring;
      current_edges[e].color = coloring;
      current_edges[e].alpha = 0.4;
      current_vertices[v].color = coloring;

      color_animations.push(createFrame(current_vertices, current_edges));
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

function rgb_to_str(color){
  return "rgb(" + color[0]+","+color[1]+","+color[2]+")";
}

function createFrame(vertices, edges){
  const new_vertices = [];
  for(let i = 0; i < vertices.length; i ++){
    new_vertices.push(vertices[i].copy_vertex());
  }
  const new_edges = [];
  for(let j = 0; j < edges.length; j++){
    new_edges.push(edges[j].copy_edge());
  }
  return {vertices: new_vertices, edges: new_edges};
}
