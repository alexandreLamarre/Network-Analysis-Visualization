/**
 * Edge: abstraction of connection between two nodes
 * @property start connection start point: index of start vertex in a vertex array
 * @property end connection endpoint: index of  vertex in a vertex array
 * @property weight weight value of an edge
 * @property directed indicates whether or not the edge is directed
 * @property color the color of the edge
 * @property alpha the alpha(transparency) of an edge
 * @property otherConnections additional (based on network type) connections
 */
class Edge{
  /**
   * Edge instantiation, requires start and end indices, with optional parameters.
   * @param start index of start vertex in vertex list
   * @param end index of end vertex in vertex list
   * @param params {color , weight, directed, connections} additional parameters for edge,
   * color: color string, weight: the weight value of the edge, directed: if the edge is directed,
   * connections: list of other connections of the edge in a hypergraph
   */
  constructor(start, end,  params){
    this.start = start;
    this.end = end;
    this.weight = 1
    this.directed = false
    this.otherConnections = []
    this.color = "rgb(0,0,0)"
    this.alpha = 0.1;

    //TODO: consider implementing type checking for params
    if (params !== undefined && params){
      if(params.weight !== undefined && params.weight) this.weight = params.weight;
      if(params.directed !== undefined && params.directed) this.directed = params.directed;
      if(params.connections !== undefined && params.connections) {
        this.otherConnections = params.connections
      }
      if(params.color !== undefined && params.color) this.color = params.color
    }
  }

  setColor(color){
    this.color = color;
  }

  setAlpha(alpha){
    this.alpha = alpha;
  }

  copyEdge(){
    const e = new Edge(this.start, this.end);
    for(const key in this){
      if(this.hasOwnProperty(key)){
        e[key] = this[key]
      }
    }
    return e;
  }

  toCSV(){
    var row = "edge,";
    row += this.start.toString() +",";
    row += this.end.toString() + ",";
    row += this.weight.toString() +",";
    row += this.alpha.toString() + ",";
    const color = this.color;
    const colors = color.split(",")
    colors[0] = colors[0].replace("rgb", "");
    colors[0] = colors[0].replace("(", "");
    colors[2] = colors[2].replace(")", "");
    row += colors[0] +",";
    row += colors[1] + ",";
    row += colors[2] + "\n";
    return row;
  }
}

export default Edge;
