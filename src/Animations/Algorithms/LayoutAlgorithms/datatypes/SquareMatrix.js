var assert = require('assert');

class SquareMatrix{
  constructor(array2d){
    assert(array2d.length === array2d[0].length)
    this.container = array2d;
  }

  lMultiply(vector){
    assert(vector.length === this.container.length, "vector " + vector.toString()+
              "vector dimension "+vector.length.toString()+"versus matrix " + this.container.toString() +
              "of dimension "+ this.container.length);
    const return_vector = [];
    for(let i = 0; i < vector.length; i++){
      var value = 0;
      for(let j = 0; j < vector.length; j++){
        value += vector[j]*this.container[j][i];
      }
      return_vector.push(value);
    }
    return return_vector;
  }

  rMultiply(vector){
    assert(vector.length === this.container.length, "vector " + vector.toString()+
              "vector dimension "+vector.length.toString()+"versus matrix " + this.container.toString() +
              "of dimension "+ this.container.length);
    const return_vector = [];
    for(let i = 0; i < vector.length; i++){
      var value = 0;
      for(let j = 0; j < vector.length; j++){
        value += this.container[i][j]*vector[j]
      }
      return_vector.push(value);
    }
    return return_vector;
  }

  matrixMultiply(other){
    assert(other.container.length === this.container.length, "matrix " +
        this.container.toString() + " other matrix " + other.container.toString());
    const new_mat = [];
    for(let i = 0; i < this.container.length; i++){
      const new_row = [];
      for(let j = 0; j < this.container.length; j++){
        const row = this.getRow(i);
        const col = other.getColumn(j);
        const value = dotProduct(row, col);
        new_row.push(value);
      }
      new_mat.push(new_row);
    }
    return new_mat;
  }

  getMatrix(){
    return this.container;
  }

  getRow(i){
    assert(i < this.container.length, "matrix dimension "
                + this.container.length.toString()+ ", access index " + i.toString());
    const return_vector = [];
    for(let j = 0; j < this.container.length; j++){
      return_vector.push(this.container[i][j]);
    }
    return return_vector;
  }

  getColumn(i){
    assert(i < this.container.length, "matrix dimension "
                + this.container.length.toString()+ ", access index " + i.toString());
    const return_vector = [];
    for(let j = 0; j < this.container.length; j++){
      return_vector.push(this.container[j][i]);
    }
    return return_vector;
  }
}

export default SquareMatrix;

function dotProduct(v1,v2){
  var sum = 0;
  for(let i = 0; i < v1.length; i ++){
    sum += v1[i]*v2[i];
  }
  return sum
}
