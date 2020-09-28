class UnionSets{
  constructor(){
    this.contents = [];
    this.representative = null;
  }

  add(el){
    if(this.contents.length === 0){
      this.representative = el;
      this.contents.push(el);
    }
  }

  setRepresentative(v){
    this.representative = v;
  }

  getRepresentative(){
    return this.representative;
  }

  union(other){
    this.setRepresentative(other.getRepresentative);
  }

}

export default UnionSets;
