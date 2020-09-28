class Edge{
  /*
  Colors are in rgba format
  */
  constructor(start, end, weight, color){
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
}

export default Edge;
