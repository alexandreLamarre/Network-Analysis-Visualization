# Network Algorithm Visualization

The goal of the Network Algorithm Visualization, or NAV for short, is to be able to visualize important network layout algorithms with little to no 
knowledge about the inner workings of a network. Indeed, it should be used as an educational tool to help familiarize yourself with networks
and representation of data by networks. The app should also highlight the usefuleness and power of the heuristics used to create these amazing network 
layouts.

## Table of contents:

- [Algorithms](#Algorithms)
- [Random Network Generation](#Random-Generation)
- [General Settings](#General-Settings)
- [References](#References)


## Algorithms

- [Force Directed](#Force-Directed)
- [Spectral Layout](#Spectral-Layout)
- [Minimum Spanning Tree](#Minimum-Spanning-Tree)
- [Travelling Salesperson (TSP)](#Travelling-Salesperson)
- [Edge Coloring](#Edge-Coloring)
- [Vertex Coloring](#Vertex-Coloring)


### Force Directed

Force directed layout algorithms are a class of Algorithms that model a Network based on a <b> dynamical system </b>. Dynamical systems describe a set
of forces acting on a set of Objects. In this case, the objects being acted upon by forces are the vertices of the network. Each Algorithm defines its own set of 
forces and heuristics to accompany those forces. The goal of these algorithms is to find a layout with minimal total potential energy. In other words,
a layout of vertices that reduces the stress of the forces on the network: achive a state of equilibrium.

The ulterior motive of these equilibirum states is generally to: 
 - Preserve the original sense of symmetry of the network
 - Cluster related vertices
 - Distance unrelated or poorly related vertices
 - Minimize Edge crossings

In essence the goal, is to produce a aesthetic layout of a network to analyze its properties. Curiously, it has also been observed by many researchs
that these network layout algorithms also seem to "generally optimize" other attributes of the network, such as average path distance, vertex coloring selections
and many other properties of interest, despite a lack of theoretical knowledge.

<b> Fields of Application:</b> Software Engineering, Telecommunications Traffic, Computational Biology, Social Network Analysis, Cartography, Linguistics

#### Basic Spring Embedding

The Basic Spring Embedding algorithm, originally proposed by Eades, <b>models the set of forces between vertices as springs</b>; the edges are the springs that connect vertices and their tension/force is a function of the distance between vertices. Choosing a heuristic approach rather than a realisticspring model, Eades decides to scale the force of attraction of springs logarithmically. He also chooses to exert forces of repulsion between vertices that are not connected to each other.
He suggests a constant 100 iterations for convergence to an aesthetically 'optimal' layout.

Pros:
- Simple to implement and scale forces
- Efficient for small to medium Networks

Cons:
- Excessive iterations scale the layout poorly
- The optimal number of iterations has to be found through trial and error
- It is in general not space filling

#### Fruchterman Reingold

The Fruchterman-Reingold algorithm, like the Basic Spring Embedding algorithm, models the forces between vertices as springs. However, the forces of attraction are scaled to the square of their distance. Another important improvement is that vertices are modelled as atomic nuclei exerting a small, but often important, repulsive force on all other vertices scaling to the inverse of their distance. Additionally, Fruchterman and Reingold implement a technique whose foundations seem to be based on simulated annealing, where forces are assigned an intial temperature which allows them to jump out of local equilibrium minima.

Pros:
- Still relatively simple to implement
- Efficient for small to medium Networks
- Space filling
- Symmetrical -- optimal equilibrium minima are often found
- Excessive iterations improve layout

Cons:
- Rapid convergence can sometimes lead to bad choices, depending on initial vertex temperature


#### Force Atlas 2

The Force Atlas 2 algorithm, is a non-theory/research based algorithm that attemps to utilize and optimize the best attributes and heuristics of other force directed algorithms.
It borrows the spring model from Eades, but implements the scaling and temperature improvements of Fruchterman-Reingold. In order to improve the temperature of vertices during the algorithm, the temperature is a function of the "swing" and trajectory of a vertex as the algorithm is running. If the vertex "swings" excessively, increase its temperature
to get out of the oscillating state it is in. If the vertex remains on the same trajectory, increase its temperature to allow it to escape the forces acting on it. If the vertexc trajectory oscillates back and forth - decrease the temperature because it might be near a local minima. Force Atlas 2 also includes heuristics that implement forces of gravity, all vertices will attract to the center of the frame (Can cause weird visual effects with dynamic network resizing which is what we implement in our visualizer). Force Atlas 2 also allows to scale forces of attraction to the size of the vertices so that they do not overlap. 

Pros:
- Improvement over all previous algorithms
- Smoother layouts than Fruchterman Reingold, combined with hamiltonian cycles produces smooth shortest paths 
- Scalable to larger networks of about 50000 vertices

Cons:
- Networks of very polarizing degrees are sometimes difficult to analyze 


### Force Atlas 2 (LinLog)

The only real difference between Force Atlas 2 and Force Atlas 2(linglog) is how the forces of attraction and repulsion are scaled. The forces of attraction are scaled logarithmically and the forces of repulsion are scaled linearly. Although the difference in implementation is simple, it targets different types of layouts. It clusters vertices that are related more strongly and will cluster nearby vertices that are not strongly related to anything to the nearest cluster.

Pros: 
- Complex networks of many varying degrees can be more easily analyzed by experts

Cons:
- Uniform degree networks are more difficult to analyze due to a circle-like spacing.

### Spectral Layout

- [Hall's Algorithm]()
- [Schwarz Based Method]()
- [Generalize Eigenvector (Koren)]()

#### Hall's Algorithm

#### Schwarz Based Method

#### Generalized Eigenvector (Koren)


### Minimum Spanning Tree

- [Kruskal]()
- [Prim]()

#### Kruskal

#### Prim


### Travelling Salesperson

- [2-Opt]()
- [3-Opt]()
- [2-Opt Simulated Annealing]()

#### 2-Opt

#### 3-Opt

#### 2-Opt Simulated Annealing

### Edge Coloring
- [Mista-Gries]()

#### Misra-Gries

### Vertex Coloring
- [Greedy Coloring]()

#### Greedy Coloring

## Random Network Generation

- [Random](#Random)
- [Random Circle/Sphere](#Random-Circle/Sphere)
- [Random Hamiltonian Cycle](#Random-Hamiltonian-Cycle)
- [Random Cluster](#Random-Cluster)

#### Random

#### Random Circle/Sphere

#### Random Hamiltonian Cycle

#### Random Cluster


## References 
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
