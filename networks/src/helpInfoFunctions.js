
export default function getHelpInfo(attribute){
  var [title, info, open] = ["", "", true];
  if(attribute === "disconnected") [title, info] = getHelpDisconnected()
  if(attribute === "animation") [title, info] = getHelpAnimation()
  if(attribute === "edges") [title, info] = getHelpEdges()
  if(attribute === "vertices") [title, info] = getHelpVertices()
  if(attribute === "connectedness") [title, info] = getHelpConnectedness()
  if(attribute === "randomType") [title, info] = getHelpRandomType()
  if(attribute === "spring") [title, info] = getHelpSpring()
  if(attribute === "fruchtermanReingold") [title, info] = getHelpFruchtermanReingold()

  return [title, info, open];
}

function getHelpDisconnected(){
  const t = "Disconnected Subgraphs" ;
  const i = "Feature has not been released yet, it is in progress.";
  return [t,i];
}

function getHelpAnimation(){
  const t = "Animation Speed" ;
  const i = "Animation Speed controls the speed at which each iteration of the algorithm is shown.";
  return [t,i];
}


function getHelpEdges(){
  const t = "Edges" ;
  const i = "Edges controls the amount of edges the random network is generated with.";
  return [t,i];
}

function getHelpVertices(){
  const t = "Vertices" ;
  const i = "Vertices controls the amount of vertices the random network is generated with.";
  return [t,i];
}

function getHelpConnectedness(){
  const t = "Connectedness" ;
  const i = "This attribute controls whether or not there is a path between every vertex or not. Many layout algorithms operate under the assumption the network/graph is connected, but we have not assumed this by default for the sake of intllectual curiosity.";
  return [t,i];
}

function getHelpRandomType(){
  const t = "Network Generation : Random";
  const i = "Nothing here for now";
  return [t, i];
}

function getHelpSpring(){
  const t = "Basic Spring Embedding Algorithm";
  const i = "Based on Peter Eades 1984 paper: 'A graph drawing heuristic' <br/> Models the vertices as steel rings and edges as springs connecting the edges. Transforms the network layout problem into a dynamical system. " ;
  return [t, i];
}

function getHelpFruchtermanReingold(){
  const t = "Fruchterman Reingold Algorithm";
  const i = "Based on Fruchterman-Reingold 1991 paper. Models vertices-edges as a spring system, conceptually considers vertices as atomic nuclei.";
  return [t, i];
}
