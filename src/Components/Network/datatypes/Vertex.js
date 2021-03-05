class Vertex {
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    if(this.z === undefined) this.z = null;
    this.degree = 0;
    this.size = 3;
    this.color = "rgb(0,255,255)";
  }

  add(other){
    this.x += other.x;
    this.y += other.y;
    if(this.z !== null) this.z += other.z;
  }

  /*In case we need to set specific coordinates, but we shouldn't have to */

  setX(x){
    this.x = x;
  }

  setY(y){
    this.y = y;
  }

  setZ(z){
    this.z = z;
  }

  increment_degree(){
    this.degree += 1;
  }

  setSize(size){
    this.size = size;
  }

  setColor(color){
    this.color = color;
  }

  setVector(vector){
    this.setX(vector[0]);
    this.setY(vector[1]);
    if(vector[2] !== undefined && this.z !== null){
      this.setZ(vector[2]);
    }
  }

  copy_vertex(){
    const v = new Vertex(this.x, this.y, this.z);
    v.color = this.color;
    v.degree = this.degree;
    v.size = this.size;
    return v;
  }

  toCSV(){
    var row = "vertex,";
    row += this.x.toString()+",";
    row += this.y.toString()+",";
    if(this.z === null) row += " ,";
    else{ row += this.z.toString()+","};
    row += this.degree.toString() + ",";
    row+= this.size.toString() + ",";
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

export default Vertex;
