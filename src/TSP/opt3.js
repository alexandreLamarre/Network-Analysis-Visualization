export function opt3(vertices, edges, dimension){

}

function reverse_segment_if_better(tour, i, j, k){
  // const A,B,C,D,E,F = tour[i-1], tour[i], tour[j-1], tour[j], tour[k-1], tour[k % len(tour)];
  //
  // const d0 = distance(A, B) + distance(C, D) + distance(E, F);
  // const d1 = distance(A, C) + distance(B, D) + distance(E, F);
  // const d2 = distance(A, B) + distance(C, E) + distance(D, F);
  // const d3 = distance(A, D) + distance(E, B) + distance(C, F);
  // const d4 = distance(F, B) + distance(C, D) + distance(E, A);
  //
  // if (d0 > d1){
  //       tour[i:j] = reversed(tour[i:j])
  //       return -d0 + d1
  // } else if (d0 > d2){
  //       tour[j:k] = reversed(tour[j:k])
  //       return -d0 + d2
  // } else if (d0 > d4){
  //       tour[i:k] = reversed(tour[i:k])
  //       return -d0 + d4
  // } else if (d0 > d3):{
  //       tmp = tour[j:k] + tour[i:j]
  //       tour[i:k] = tmp
  //       return -d0 + d3
  // }
  // return 0;
}

function distance(v1,v2){

}
