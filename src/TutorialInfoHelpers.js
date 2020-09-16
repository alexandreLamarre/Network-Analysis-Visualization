export default function getPageInfo(page){
  var info = ""
  if(page === 1) info = getPage1();
  if(page === 2) info = getPage2();
  if(page === 3) info = getPage3();
  if(page === 4) info = getPage4();
  if(page === 5) info = getPage5();
  if(page === 6) info = getPage6();
  if(page === 7) info = getPage7();
  if(page === 8) info = getPage8();
  if(page === 9) info = getPage9();
  return info;
}

function getPage1(){
  const info = "A network is typically thought of as a system of \
  interconnected things. <br><br> In Computer Science, we tend to analyze\
  large amounts of data and the relationships between said data. <br><br> \
  Indeed, networks provide an intuitive and efficient way to model large\
  amounts of related data. <br><br> We can represent data by Nodes: <br> <br> And \
  relationships between data as Edges: <br>";
  return info;
}

function getPage2(){
  const info = 'Structures and properties of Networks can tell us almost \
  everything we would want to know about the data we are analyzing. <br><br> \
  For example, optimizing a network can lead to a "divide and conquer" style approach \
  to solving the problems the data represents. <br> Representing a large amount of data as \
  smaller amounts that can be computed individually is just one application \
  of networks. <br> <br> In fact, networks have important applications in fields from \
  Machine Learning to Cyber Security.'
  return info;
}

function getPage3(){
  const info = 'There are a lot of different types of networks algorithms, all of\
  them fulfilling an important role in network analysis. <br><br> However, Network Layout Algorithms\
  stand at the core of important network algorithms as they are able to visualize <br>  networks \
  and optimize desireable properties of networks. <br><br> Network Layout Algorithms typically\
  optimize the following: <br> - Minimize edge crossings, that is, edges should intersect as little as possible <br> - Uniform edge lengths\
   <br> - Related nodes are drawn together <br> - Loosely related nodes are \
   drawn further apart'
  return info;
}
function getPage4(){
  const info = 'If computers were to optimize a network layout using specific criteria \
  they would do so in exponential time, meaning that solving large problems would scale exponentially. <br><br> \
  For example, optimizing a network of several million nodes would take with the most efficient\
  straighforward algorithms around 3500 hours, or just over 145 days. <br><br> In practice, it turns out\
  network layout algorithms do a good job of optimizing desireable properties of a\
  network. While the optimization is not perfect, <br> it is pretty close to perfect and is many times faster. <br> \
  <br> For comparison, optimizing a network of several million nodes using a network layout algorithm \
  would take less than a day. <br><br> Network layout algorithms also allow us, as humans, \
  to quickly identify properties of networks, potentially saving a huge amount of subsequent \
  computation time.';
  return info;
}
function getPage5(){
  const info = '';
  return info;
}
function getPage6(){
  const info = '';
  return info;
}
function getPage7(){
  const info = '';
  return info;
}
function getPage8(){
  const info = '';
  return info;
}

function getPage9(){
    const info = '';
    return info;
}
