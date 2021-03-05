class Force{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    if(this.z === undefined) this.z = null;
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

  addVector(vector){
    this.x += vector[0];
    this.y += vector[1];
    if(vector[2]!== undefined && this.z !== null){
      this.z += vector[2];
    }
  }

  scale(delta){
    this.setX(this.x*delta);
    this.setY(this.y*delta);
    if(this.z !== null){
      this.setZ(this.z*delta);
    }
  }
}


export default Force;
