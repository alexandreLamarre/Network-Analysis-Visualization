class UnionSets{
  constructor(){
    this.contents = [];
    this.representative = null;
  }

  add(el){
    if(this.contents.length === 0) this.representative = el;
    this.contents.push(el);

  }

  push(contents){
    for(let i = 0; i < contents.length; i++){
      this.contents.push(contents[i]);
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
