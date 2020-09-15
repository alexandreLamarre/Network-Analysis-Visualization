
export default function getHelpInfo(attribute){
  var [title, info, details, open] = ["", "", "", true];
  if(attribute === "disconnected") [title, details,info] = getHelpDisconnected()
  if(attribute === "animation") [title, details, info] = getHelpAnimation()
  if(attribute === "edges") [title, details, info] = getHelpEdges()
  if(attribute === "vertices") [title,details, info] = getHelpVertices()
  if(attribute === "connectedness") [title,details, info] = getHelpConnectedness()
  if(attribute === "randomType") [title, details, info] = getHelpRandomType()
  if(attribute === "spring") [title, details, info] = getHelpSpring()
  if(attribute === "fruchtermanReingold") [title, details, info] = getHelpFruchtermanReingold()
  if(attribute === "cspring") [title,details, info] = getHelpCspring()
  if(attribute === "crep") [title,details, info] = getHelpCrep()
  if(attribute === "eps") [title,details, info] = getHelpEpsilon()
  if(attribute === "delta") [title,details, info] = getHelpDelta()
  if(attribute === "forceArea") [title, details, info] = getHelpForceArea()
  if(attribute === "distanceType") [title,details, info] = getHelpDistanceType()
  if(attribute === "cTemp") [title, details, info] = getHelpCtemp()
  if(attribute === "tempHeuristic") [title, details, info] = getHelpTempHeuristic()
  if(attribute === "collision") [title, details, info] = getHelpCollision()
  if(attribute === "Layout") [title, details, info] = getHelpLayout()

  return [title, info, details, open];
}

function getHelpLayout(){
  const t = "Layout Type" ;
  const i = "Choose whether or not to display the network within a square or a rectangle that stretches to fit the browser window";
  const d = "None.";
  return [t,d,i];
}

function getHelpDisconnected(){
  const t = "Disconnected Subgraphs" ;
  const i = "Feature has not been released yet, it is in progress.";
  const d = "Feature has not been released yet, it is in progress.";
  return [t,d,i];
}

function getHelpAnimation(){
  const t = "Animation Speed" ;
  const i = "Animation Speed controls the speed at which each iteration of the algorithm is shown.";
  const d = "The algorithms, by default, run at 100 algorithm iterations, which means the total animation time will be between 2 seconds and 15seconds."
  return [t,d,i];
}


function getHelpEdges(){
  const t = "Edges" ;
  const i = "Edges are represented by a line connecting two red squares(vertices). In general, it represents an abstract relationship between two vertices. The slider controls the total amount of edges present in the network.";
  const d = "The maximum and minimum edges are a function of the total number of vertices. Given the number of Vertices |V|, the maximum number of edges is (|V|^2-|V|)/2, while the minimum number of edges is given by the formula |V| -1 if we force the graph to be connected. Otherwise the minimum number of edges is set to 20."
  return [t,d,i];
}

function getHelpVertices(){
  const t = "Vertices" ;
  const i = "Vertices are represented by the red squares in the network. In general, vertices represent important data points, and are sometimes given informative labels. The slider controls the total number of vertices present in the network.";
  const d = "The minimum amount of vertices is 4, while the maximum amount is 200. Many network layout algorithms only generalize to networks of 50 - 200 vertices."
  return [t,d,i];
}

function getHelpConnectedness(){
  const t = "Connectedness" ;
  const i = "A network is connected if there is a path between every vertex. In other words, the network is connected if we can travel along the edges of a network from any one vertex to any other. This slider controls whether we want to guarantee the network is connected or not.";
  const d = "Many layout algorithms oeprate under the assumption that the starting network is connected, and their authors suggest processing the layouts of disconnected network by running the algorithms on each disconnected network individually."
  return [t,d,i];
}

function getHelpRandomType(){
  const t = "Network Generation : Random";
  const i = "This random generation algorithm begins by selecting random positions within the frame for all vertices, then assigns edges to random vertices until the specified number of edges or the maximum number of edges is reached.";
  const d = "Many layout algorithms require a preproccessing step for 'optimal' aesthetic layouts. In general, they scale the frame as a function of the number of vertices and the potential forces acting on these vertices, to guarantee the vertices will be able to arrange themselves in a close to optimal symmetrical layout. However, this preprocessing step has been ommited because the visualizer dynamically assigns the number of vertices of the network and the potential forces of the system."
  return [t, d,i];
}

function getHelpSpring(){
  const t = "Basic Spring Embedding Algorithm";
  const i = "Models a network as a dynamical system where vertices are treated as rings and edges are treated as springs between vertices. Forces of attraction act between vertices connected by edges, and forces of repulsion act between vertices that are not directly connected." ;
  const d = "The goal of this algorithm is to provide an aesthetic network layout. Strengths: Preserves initial and inherent network symmetry. Limitations: Algorithm is affected heavily by the initial network layout and the overall dynamical sysyem is chaotic. Additionaly, the layout produced is not guaranteed to be space filling. Runtime complexity: O(|V|^2), where |V| is the number of vertices. Space complexity: O(|V| + |E|)"
  return [t,d, i];
}

function getHelpFruchtermanReingold(){
  const t = "Fruchterman Reingold Algorithm";
  const i = "Models a netowrk as a dynamical system where vertices are concpetually treated as atomic nuclei and edges are treated as springs between vertices. Forces of attraction act between vertices connected by edges and forces of repulsion act between all vertices.";
  const d = "The goal of this algorithm is to provide an aesthetic network layout. Strengths: preserves inherent network symmetry, space-filling, temperature heuristic helps find more optimal layouts. Limitations: Algorithm is heavily affected by the initial network layout, it produces suboptimal layouts for bounded frames without pre-processing, and the overall dynamical system modelled is chaotic.  Runtime complexity O(|V^2|), where |V| is the number of vertices. Space complexity: O(|V|+|E|)"
  return [t, d,i];
}

function getHelpCspring(){
  const t = "Force of Attraction";
  const i = "The Force of Attraction is a force that exerts itself between two vertices connected by an edge. It represents the force of the edge, modelled as a spring, acting on the two vertices. The slider controls the  rate at which it attracts ";
  const d = "The force is a function of the distance z, given by f(z) = C* log(z/C2) where C is a constant that is scaled by this slider, and C2 is the force to area scaling constant"
  return [t, d,i];
}
function getHelpCrep(){
  const t = "Force of Repulsion";
  const i = "The Force of Repulsion is a force that exerts itself only between vertices that are not directly connected by an edge. It represents a 'ring' around a vertex which should not have any non-connected vertices. The slider controls the rate at which these two vertices are repulsed from one another";
  const d = "This force is a function of the distance z between two vertices, given by f(z) = C/sqrt(z) where C is the constant that represents the rate of repulsion controlled by this slider."
  return [t, d,i];
}
function getHelpEpsilon(){
  const t = "Convergence Bound";
  const i = "The Convergence Bound represents a measure by which we can evaluate the 'optimal' distance between vertices as well as the 'optimal' layout. A larger bound is less constraining on the layout, whereas a smaller bound is more constraining on the layout. ";
  const d = "The convergence bound terminates the algorithm if after any iteration, the maximum force exerted on vertices is smaller than the convergence bound."
  return [t, d,i];
}
function getHelpDelta(){
  const t = "Rate of Convergence";
  const i = "Scales the rate at which both forces exert themselves. Controls how quickly the algorithm should approach an 'optimal' layout.";
  const d = "None"
  return [t, d,i];
}
function getHelpForceArea(){
  const t = "Force to Area Scaling";
  const i = "Controls the scaling of the force of attraction as a function of the area, a higher force to area scaling will attempt to scale the layout to the whole frame, while a smaller force will attemp to scale the layout concentrically.";
  const d = "This attribute seems to be especially useful when the force of attraction is consider as a function of the graph theoretic distance between two vertices."
  return [t, d,i];
}
function getHelpDistanceType(){
  const t = "Distance Type";
  const i = "Choose how to evaluate the distance between two vertices in the force of attraction. 'Continuous' distance evaluates the distance between vertices as their distance in the frame, while 'Graph-theoretic' distance evaluates the distance between vertices as the longest path between two vertices.";
  const d = "Graph-theoretic distance is a constant force of attraction between vertices. It has been shown that considering the graph theoretic distance of only adjacent vertices (the ones directly connected by an edge) is roughly equivalent to considering the graph-theoretic distance of every vertex pair. This algorthm implementation only considers adjacent vertices for performance optimization."
  return [t, d,i];
}
function getHelpCtemp(){
  const t = "Temperature Scaling";
  const i = "In the Fruchterman-Reingold Algorithm, temperature scales the forces in the dynamical system. A higher temperature forces the particles (vertices) to move quickly and a lower temperature slows down the movement of the particles(vertices)";
  const d = "None"
  return [t, d,i];
}
function getHelpTempHeuristic(){
  const t = "Temperature Heuristic";
  const i = "Temperature heuristic controls the type of temperature cooling the system undergoes.";
  const d = "A logarithm temperature cooling heuristic cools the temperature with the following function: f(temp) = 0.90*temp. A linear temperature cooling heuristic cools the temperature with the following function f(temp) = temp - (initial_temperature)/100"
  return [t, d,i];
}
function getHelpCollision(){
  const t = "Collision Type";
  const i = "Collision Type affects how particles handle border collisions";
  const d = "Inelastic means the particles movement and acceleration will be stopped upon collision with the border. Elastic collision means the particle will bounce back from the boundary, preserving the angle of collision. Orthogonal means upon collision with the border, the remaining force will be projected onto the border of the frame perpendicularly."
  return [t, d,i];
}
