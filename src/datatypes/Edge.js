class Edge{
  /*
  Colors are in rgba format
  */
  constructor(start, end, color, weight){
    this.start = start;
    this.end = end;
    this.weight = weight;
    if(this.weight === undefined || this.weight === null) this.weight = 1;
    this.color = color;
    if(this.color === undefined || color ===null) this.color = "rgb(0,0,0)";
    this.alpha = 0.1;
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
