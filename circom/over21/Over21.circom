pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";

template Over21() {

  signal input age;
  signal input ageLimit;
  signal output oldEnough;
  
  // 8 bits is plenty to store age
  component gt = GreaterThan(8);
  //gt.in[0] <== age;
  //gt.in[1] <== 21;
  //0 === gt.out;
  gt.in[0] <== ageLimit;
  gt.in[1] <== age;
  0 === gt.out;
  
  oldEnough <== gt.out;
}

component main = Over21();
