# Network Analysis Visualization

The goal of the Network Analysis Visualization project is to provide an open source driven network algorithm visualizer, for the purpose of visualizing uncommon network analysis techniques and preprocessing algorithms.

[Link](https://alexandrelamarre.github.io/Network-Analysis-Visualization)

## Table of contents:

- [System Architecture](#System-Architecture)
- [Algorithms](#Algorithms)
- [Random Network Generation](#Random-Network-Generation)
- [Uploading Data](#Uploading-Data)
- [References](#References)
 
## System Architecture

The system design follows a monolithic architecture for a couple of reasons:
- To render the network data in the browser, we need to have a physical copy of the data
- To ensure the network data visualization is interactive, we need to update the data frequently
- To animate and propagate changes to the network data during the animations, we need to always update all network data in the algorithm and rendering software in
<35ms to maintain fluid data visualization.

Therefore any form of network latency (and also copying the data to send, and copying back the result data) could result in huge performance drops as well as result in increased costs to maintain any of the potential backend servers and databases needed to maintain such animation speeds.

The monolothic architecture comes with a couple of nasty draw backs: the client's hardware and browser is responsible for the performance of the app and it is difficult to decouple the application code. To combat these drawbacks, network data is capped and design patterns are used to decouple the code as much as possible.

Here is an overview of the application structure, which follows a Model-View-Controller design pattern (for obvious reasons):

![](https://github.com/alexandreLamarre/Network-Analysis-Visualization/blob/master/NAV%20schema.png)

Here is an overview of how the network data is handled in the model:

![](https://github.com/alexandreLamarre/Network-Analysis-Visualization/blob/master/NAV%20network%20data%20schema.png)

Here is an overview of how the animation logic and algorithms are handled in the model:

![](https://github.com/alexandreLamarre/Network-Analysis-Visualization/blob/master/NAV%20animator%20schema.png)


## Algorithms

- [Force Directed](#Force-Directed)
- [Spectral Layout](#Spectral-Layout)
- [Minimum Spanning Tree](#Minimum-Spanning-Tree)
- [Travelling Salesperson (TSP)](#Travelling-Salesperson)
- [Edge Coloring](#Edge-Coloring)
- [Vertex Coloring](#Vertex-Coloring)


### Force Directed  
[Back To Top](#network-algorithm-visualization)

Force directed layout algorithms are a class of Algorithms that model a Network based on a <b> dynamical system </b>. Dynamical systems describe a set
of forces acting on a set of Objects. In this case, the objects being acted upon by forces are the vertices of the network. Each Algorithm defines its own set of 
forces and heuristics to accompany those forces. The goal of these algorithms is to find a layout with minimal total potential energy. In other words,
the algorithms try to find a layout of vertices that reduces the stress of the forces on the network - layouts that achieve a state of equilibrium.

The qualities we generally attribute to these equilibirum states are: 
 - Preserving the original sense of symmetry of the network
 - Clustering related vertices
 - Distancing unrelated or poorly related vertices
 - Minimizing Edge crossings

In essence, the goal is to produce an aesthetic layout of a network in order to better analyze its properties. Curiously, researchers have often noticed (specifically in Spectral graph theory and probabilistic analysis of graphs) that such aesthetic network layouts also seem to "generally optimize" other attributes of the network, such as average path distance, vertex coloring selections, and many other properties of interest despite a concrete mathematical proof to justify these observations.

<b> Fields of Application:</b> Software Engineering, Telecommunications Traffic, Computational Biology, Social Network Analysis, Cartography, Linguistics

#### Basic Spring Embedding
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/SpringEmbeddingStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/SpringEmbeddingResult.png)

**Time Complexity**: `O(|V^2|)` for each iteration, 100 iterations recommended.
**Space Complexity**: `O(1)`

The Basic Spring Embedding algorithm, originally proposed by Eades, <b>models the set of forces between vertices as springs</b>; the edges are the springs that connect vertices and their tension/force is a function of the distance between vertices. Choosing a heuristic approach rather than a realisticspring model, Eades decides to scale the force of attraction of springs logarithmically. He also chooses to exert forces of repulsion between vertices that are not connected to each other.
He suggests a constant 100 iterations for convergence to an aesthetically 'optimal' layout.


Pros:
- Simple to implement and scale forces
- Efficient for small to medium Networks

Cons:
- Excessive iterations scale the layout poorly
- The optimal number of iterations has to be found through trial and error
- It is in general not space filling


**Settings**:
- Force of Attraction: Scales how much connected vertices are attracted to each other at each iteration
- Force of Repulsion: Scales how much disconnected vertices are repulsed by one another at each iteration
- Converge Bound: Dictates the minimum maximum displacement bound at which the algorithm should terminate
- Rate of Convergence: Scales both forces
- Force to Area Scaling: Scales the lay to fill space, useful only when scaling to graph theoretic distance
- Distance: Scales the forces of attraction based on continuous distance in the frame or graph theoretic distance

#### Fruchterman Reingold
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/FruchtermanReingoldStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/FruchtermanReingoldResult.png)

**Time Complexity**: `O(|V^2|)` for each iteration, `O(|V|)` iterations recommended.
**Space Complexity**: `O(1)`

The Fruchterman-Reingold algorithm, like the Basic Spring Embedding algorithm, models the forces between vertices as springs. However, the forces of attraction are scaled to the square of their distance. Another important improvement is that vertices are modelled as atomic nuclei exerting a small, but often important, repulsive force on all other vertices scaling to the inverse of their distance. Additionally, Fruchterman and Reingold implement a technique whose foundations seem to be based on simulated annealing, where forces are assigned an intial temperature which allows them to jump out of local equilibrium minima.

Pros:
- Still relatively simple to implement
- Efficient for small to medium Networks
- Space filling
- Symmetrical -- optimal equilibrium minima are often found
- Excessive iterations improve layout

Cons:
- Rapid convergence can sometimes lead to bad choices, depending on initial vertex temperature


**Settings**:
- Initial Temperature Scaling: Dictates how fast the particles should initially rearrange themselves. decreases at each iteration.
- Temperature Cooling: 
 - Logarithmic: decreases the temperature at an inversely linear rate, e.g. `temp = 0.9temp`.
 - Linear: decreases the temperature at a linear rate: e.g. `temp = temp - 0.01*initialtemp`.
 - Directional: decreases or increases the temperature based on the tendency of the particle. If it tends to go in the same direction, increase, otherwise decrease.
- Converge Bound: Dictates the minimum maximum displacement bound at which the algorithm should terminate


#### Force Atlas 2
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/ForceAtlas2Start.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/ForceAtlas2Result.png)

**Time Complexity**: `O(|V^2|)` for each iterations, `O(|V|)` iterations recommended
**Space Complexity**: `O(1)`

The Force Atlas 2 algorithm, is a non-theory/research based algorithm that attemps to utilize and optimize the best attributes and heuristics of other force directed algorithms.
It borrows the spring model from Eades, but implements the scaling and temperature improvements of Fruchterman-Reingold. In order to improve the temperature of vertices during the algorithm, the temperature is a function of the "swing" and trajectory of a vertex as the algorithm is running. If the vertex "swings" excessively, increase its temperature
to get out of the oscillating state it is in. If the vertex remains on the same trajectory, increase its temperature to allow it to escape the forces acting on it. If the vertexc trajectory oscillates back and forth - decrease the temperature because it might be near a local minima. Force Atlas 2 also includes heuristics that implement forces of gravity, all vertices will attract to the center of the frame (Can cause weird visual effects with dynamic network resizing which is what we implement in our visualizer). Force Atlas 2 also allows to scale forces of attraction to the size of the vertices so that they do not overlap. 

- Improvement over all previous algorithms
- Smoother layouts than Fruchterman Reingold, combined with hamiltonian cycles produces smooth shortest paths 
- Scalable to larger networks of about 50000 vertices

Cons:
- Networks of very polarizing degrees are sometimes difficult to analyze 


**Settings**:
- Force of Repulsion: Scales how much vertices are repulsed by one another at each iteration
- Gravity: Dictates whether or not the layout should be scaled to the center of the frame.
- Gravity Strength: strength of the foce of gravity 
- Tolerance: increases/decreases the speed of particles
- Temperature Cap: The maximum bound for initial vertex displacement 

#### Force Atlas 2 (LinLog)
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/FotceAtlas2LinLogStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/ForceAtlas2LinLogResult.png)

**Time Complexity**: `O(|V^2|)` for each iterations, `O(|V|)` iterations recommended
**Space Complexity**: `O(1)`

The only real difference between Force Atlas 2 and Force Atlas 2(linglog) is how the forces of attraction and repulsion are scaled. The forces of attraction are scaled logarithmically and the forces of repulsion are scaled linearly. Although the difference in implementation is simple, it targets different types of layouts. It clusters vertices that are related more strongly and will cluster nearby vertices that are not strongly related to anything to the nearest cluster.

Pros: 
- Complex networks of many varying degrees can be more easily analyzed by experts

Cons:
- Uniform degree networks are more difficult to analyze due to a circle-like spacing.


**Settings**:
- Force of Repulsion: Scales how much vertices are repulsed by one another at each iteration
- Gravity: Dictates whether or not the layout should be scaled to the center of the frame.
- Gravity Strength: strength of the foce of gravity 
- Tolerance: increases/decreases the speed of particles
- Temperature Cap: The maximum bound for initial vertex displacement 

### Spectral Layout
[Back To Top](#network-algorithm-visualization)

- [Hall's Algorithm](#halls-algorithm)
- [Schwarz Based Method](#Schwarz-Based-Method)
- [Generalize Eigenvector (Koren)](#generalized-eigenvector-koren)


Spectral Layout Algorithms use linear algebra relating to Spectral Theory to solve the problem of Network Layouts. In general, they use specific eigenvectors and eigenvalues derived from different matrix representations of the networks.


#### Generalized Eigenvector (Koren)
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/KorenStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/KorenEnd.png)

**Time Complexity**: `O(|V|*d*C)`, where d is the number of eigenvectors computed, and C is the number of iterations required to converge eigenvectors in the correct direction.
**Space Complexity**: `O(|V|*d)`


#### Schwarz Based Method
[Back To Top](#network-algorithm-visualization)

**In process of being implemented.**

### Minimum Spanning Tree
[Back To Top](#network-algorithm-visualization)

- [Kruskal](#Kruskal)
- [Prim](#Prim)

A Minimum Spanning Tree is a tree that consists of all the vertices of the graph/network that minimizes the edges distance/weights of the graph/network.

<b> Fields of Application :</b> Cluster Analysis, Computer Vision, Min-Max flow Network optimization, Convolutional Neural Networks, Circuit Designs
#### Kruskal
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/KruskalStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/KruskalEnd.png)

**Time Complexity**: `O(|E|log(|V|))`
**Space Complexity**: `O(1)`

Kruskal's algorithm is a greedy algorithm for finding a Minimum Spanning Tree. It constructs the tree from a forest of all vertices, where it selects the next edge that has minimal weight and is not already part of the forest and does not create a cycle within the forest. The algorithm terminates when the forest of vertices is completely connected.



**Settings**:
- Red: the amount of red color in the visualization of the minimum spanning tree
- Green: the amount of green color in the visualization of the minimum spanning tree
- Blue: the amount of blue color in the visualization of the minimum spanning tree

#### Prim
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/PrimStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/PrimResult.png)

**Time Complexity**: `O((|V|+|E|)*log(|V|))`
**Space Complexity**: `O(1)`

Prim's algorithm is a greedt algorithm for finding a Minimum Spanning Tree. It constructs a tree by starting at a random vertex and exploring the minimum weighed edge at each iteration, it adds this edge if it does not create a cycle in the already explored vertices.


**Settings**:
- Red: the amount of red color in the visualization of the minimum spanning tree
- Green: the amount of green color in the visualization of the minimum spanning tree
- Blue: the amount of blue color in the visualization of the minimum spanning tree

### Travelling Salesperson
[Back To Top](#network-algorithm-visualization)

The Travelling Salesperson problem tries to find the minimum distance/weighed path that traverses all vertices exactly once. Such a path that ends at the start vertex is called a Hamiltonian Cycle. The travelling salesperson problem is an NP-hard problem.

<b>Fields of Application:</b> Logistics, DNA sequencing, Computer Wiring, Scheduling, Routing, Network Communications

- [2-Opt](#2-Opt)
- [3-Opt](#3-Opt)
- [2-Opt Simulated Annealing](#2-Opt-Simulated-Annealing)

#### 2-Opt
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/2OptStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/2OptResult.png)

**Time Complexity**: `O(|V|^2)`
**Space Complexity**: `O(|V|)`

The 2-Opt algorithm is a simple and somewhat effective algorithm for finding the minimal hamiltonian cycle. It randomly switches 2 edges and checks if that has decreased the cycle length. If it has, it keeps those two edges swapped otherwise it looks for another two random edges to swap. It continues until it times out. 

Pros: 
- Simple Implementation

Cons: 
- Frequently poorly optimized solutions


**Settings**:
- Timeout: the amount of time the algorithm should run before terminating
- Red: the amount of red color in the visualization of swapped edges
- Green: the amount of green color in the visualization of swapped edges
- Blue: the amount of blue color in the visualization of swapped edges

#### 3-Opt
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/3OptStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/3OptResult.png)

**Time Complexity**: `O(|V|^2)`
**Space Complexity**: `O(|V|)`

The 3-Opt algorithm is another simple and somewhat effective algorithm for finding the minimal hamiltonian cycle. It randomly checks 3 edges, and swaps them as necessary if they reduce the cycle length. This algorithm prioritizes swapping 2 edges at a time, but if swapping 2 edges doesn't result in an improvement, the algorithm will try to swap all three.

Pros: 
- Still relatively simple, and better expected minima than 2-Opt

Cons: 
- Frequently poorly optimizated solutions, many cases to check at iteration


**Settings**:
- Timeout: the amount of time the algorithm should run before terminating
- Red: the amount of red color in the visualization of swapped edges
- Green: the amount of green color in the visualization of swapped edges
- Blue: the amount of blue color in the visualization of swapped edges

#### 2-Opt Simulated Annealing
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/SimulatedAnnealingStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/SimulatedAnnealingEnd.png)

**Time Complexity**: `O(|V|^2)`
**Space Complexity**: `O(|V|)`

A 2-Opt algorithm augmented with the use of simulated annealing. Simulated annealing uses an initial "temperature" which dictates the probability of accepting worse solutions when swapping 2 edges. This temperature decreases over time, according to some heuristic function, as the algorithm converges to the minima. In practice, simulated annealing and 2-opt produce the actual global minima for networks only for very small networks. 2-Opt and simulated annealing will often produce worse solutions than 2-opt on larger networks. Simulated annealing and 2 opt are better combined with the combined use of other heuristics and techniques.

Pros: 
- Always has a chance to find the optimal cycle in polynomial time.

Cons: 
- Typically worse solutions than 2-opt 

**Settings**:
- Timeout: the amount of time the algorithm should run before terminating
- Acceptance: probability of accpeting a worse solution at each inspection
- Initial Temperature: scales the acceptance probability based on temperature, temperature decreases as the algorithm progresses
- High Temperature Color:
 - Red: the amount of red color in the visualization of swapped edges when the temperature is high
 - Green: the amount of green color in the visualization of swapped edges when the temperature is high
 - Blue: the amount of blue color in the visualization of swapped edges when the temperature is high
- Lowe Temperature Color:
 - Red: the amount of red color in the visualization of swapped edges when the temperature is low
 - Green: the amount of green color in the visualization of swapped edges when the temperature is low
 - Blue: the amount of blue color in the visualization of swapped edges when the temperature is low

### Edge Coloring
[Back To Top](#network-algorithm-visualization)

Edge coloring describes the problem of assigning the minimum number of colors to vertices in the network such that no two edges that are incident to the same vertex share the same color. It is an NP-Hard problem in general.

- [Misra-Gries](#misra-gries)



#### Misra-Gries
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/MisraGriesStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/MisraGriesResult.png)

The Misra-Gries Algorithm is a greedy edge coloring algorithm that uses at most n+1 colors, where `n = |max degree|` over all vertices in the network. 

**Time Complexity**: `O(|V||E|)`
**Space Complexity**: `O(1)`

Pros: 
- Fast(polynomial time), and good approximations

Cons: 
- Suboptimal in the general case


### Vertex Coloring
[Back To Top](#network-algorithm-visualization)

- [Greedy Coloring](#Greedy-Coloring)

<b> Fields of Application :</b> Scheduling, Bandwidth Allocation, Register Allocation in compilers, Pattern Matching

Vertex Coloring describes the problem of assigning the minimum number of colors to vertices in the network such that no two adjacent(connected by an edge) vertices share the same color. It is an NP-hard problem in general. 

#### Greedy Coloring
[Back To Top](#network-algorithm-visualization)

![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/GreedyColoringStart.png) ![](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/src/Tutorial/images2D/GreedyColoringResult.png)

**Time Complexity**: `O(|V|^2+|E|)`
**Space Complexity**: `O(|V|)`

The greedy vertex coloring algorithm is a greedy algorithm for coloring the vertices of a graph. It uses at most n + 1 colors, where `n = |max degree|` over all vertices in the network.

Pros: 
- Fast (polynomial time) and typically good colorings.

Cons: 
- Suboptimal in general.


## Random Network Generation
[Back To Top](#network-algorithm-visualization)

- [Random](#Random)
- [Random Circle](#Random-Circle)
- [Random Sphere](#Random-Sphere)
- [Random Hamiltonian Cycle](#Random-Hamiltonian-Cycle)
- [Random Cluster](#Random-Cluster)

#### Random
[Back To Top](#network-algorithm-visualization)

Generates `(x,y)/(x,y,z)` positions of vertices in 2 or 3 dimensions, following a uniform distribution. If **force-connectedness** setting is enabled, edges are constructed by first finding a tree connecting all vertices then assigning all remaining edges in a randomly, following a uniform distribution.

#### Random Circle/Sphere
[Back To Top](#network-algorithm-visualization)

In two dimension generates `(radius, theta)` positions of vertices in 2 dimensions where radius is the radius of the desired circle (in practice `0.40*size of frame`) and theta is bounded by 0 and 2pi. If **force-connectedness** setting is enabled, edges are constructed by first finding a tree connecting all vertices then assigning all remaining edges in a randomly, following a uniform distribution.

In 3 dimensions generates `(z, phi, psi)` positions of vertices where phi and psi are bounded by 0 and 2pi and z is bounded by -1 to 1. It is recommended for the best distribution only a sphere that a gaussian distribution is used, however we use a uniform distribution as that is what javascript provides by default. If **force-connectedness** setting is enabled, edges are constructed by first finding a tree connecting all vertices then assigning all remaining edges in a randomly, following a uniform distribution.

#### Random Hamiltonian Cycle
[Back To Top](#network-algorithm-visualization)

Generates a random hamiltonian cycle. It first sets the number of edges to the number of vertices. Assigns a root, and non-deterministically constructs a path from the root to itself, following a uniform distribution without traversing a previously explored node (except the root, when all other nodes are explored).

#### Random Cluster
[Back To Top](#network-algorithm-visualization)

**Feature in Development.** Idea: generate, according to a clustering coefficient, groups of 3-cycles and then uniformly connect them with the remaining number of edges.

## Uploading Data
[Back To Top](#network-algorithm-visualization)

#### Format: .csv

Vertices and edges are specified in rows. Vertices are defined row by row before edges are defined. Edges are also specified row by row.

We specify a vertex in .csv format as follows:

`<string:"vertex">, <float:x-position>, <float:y-position>, <float: z-position>, <int: degree>, <int: size>, <int: red-color>, <int: green-color>, <int: blue-color>`

We specify an edge in .csv format as follows: 

`<string:"edge">, <int: start-vertex index>, <int: end-vertex index>, <float: weight>, <float: alpha>, <int: red-color>, <int: green-color>, <int: blue-color>`

We provide an example .csv file of a network [here](https://github.com/alexandreLamarre/Network-Algorithm-Visualization/blob/master/NetworkExample.csv).


## References 
[Back To Top](#network-algorithm-visualization)
The following references are ordered by date:
- Hall, Kenneth M. "An r-dimensional quadratic placement algorithm." Management science 17.3 (1970): 219-229.
- Eades, Peter. "A heuristic for graph drawing." Congressus numerantium 42 (1984): 149-160.
- Kamada, Tomihisa, and Satoru Kawai. "An algorithm for drawing general undirected graphs." Information processing letters 31.1 (1989): 7-15.
- Fruchterman, Thomas MJ, and Edward M. Reingold. "Graph drawing by force‐directed placement." Software: Practice and experience 21.11 (1991): 1129-1164.
- Koren, Yehuda. "Drawing graphs by eigenvectors: theory and practice." Computers & Mathematics with Applications 49.11-12 (2005): 1867-1888.

<!--This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

-->
