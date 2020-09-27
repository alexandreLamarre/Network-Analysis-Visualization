class Edge{
  /*
  Colors are in rgba format
  */
  constructor(start, end, color){
    this.start = start;
    this.end = end;
    if(color === undefined) this.color = "rgb(0,0,0)";
    else{ this.color = color;}
    this.alpha = 0.3;
  }

  setColor(color){
    this.color = color;
  }

  setAlpha(alpha){
    this.alpha = alpha;
  }
}

export default Edge;
