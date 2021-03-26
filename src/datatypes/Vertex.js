/**
 * Vertex: abstraction of a datapoint in a network
 * @property x the x position in object space [0,1)
 * @property y the y position in object space [0,1)
 * @property z the z position in object space [0,1)
 * @property label the (optional) strings to describe vertex data
 * @property degree number of incident edges
 * @property size size of a node in view space
 * @property color color of a node
 */
class Vertex {
  /**
   * Vertex instantiation, requires x,y,z coordinates, with the possibility of optional parameters.
   * @param x the x position in object space [0,1)
   * @param y the y position in object space [0,1)
   * @param z the z position in object space [0,1)
   * @param params {label} label: the array of string labels that describe the data
   */
  constructor(x, y, z, params){
    this.x = x;
    this.y = y;
    this.z = z;
    this.label = null;
    if(this.z === undefined) this.z = null;
    this.degree = 0;
    this.size = 3;
    this.color = "rgb(0,255,255)";

    if(params !== undefined && params){
      if(params.label !== undefined && params.label) this.label = params.label
    }
  }

  /**
   * Returns a copied vertex that has the coords object added to it
   * @param coords an object with x,y,z property are numbers
   */
  add(coords){
    if(!coords.hasOwnProperty("x"))throw new Error("coords argument must have an 'x' property to add it to a vertex")
    if(!coords.hasOwnProperty("y")) throw new Error("coords argument must have an 'y' property to add it to a vertex")
    if(!coords.hasOwnProperty("z")) throw new Error("coords argument must have a 'z' property to add it to a vertex")
    const v = this.copyVertex()
    v.x += coords.x
    v.y += coords.y
    if(v.z !== null && coords.z !== null) v.z += coords.z
    return v
  }



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

  copyVertex(){
    const v = new Vertex(this.x, this.y, this.z);
    for(const key in this){
      if(this.hasOwnProperty(key)){
        v[key] = this[key]
      }
    }
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
