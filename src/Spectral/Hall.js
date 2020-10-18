import SquareMatrix from "../datatypes/SquareMatrix";

export function hall(vertices,edges, graph_distancex, graph_distancey, iterations, degreeArray){
  //IMPORTANT CONSTANTS
  const adj = createAdjacencyMatrix(vertices, edges);

  console.log(adj);


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
  return new SquareMatrix(adj);
}
