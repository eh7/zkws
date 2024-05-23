pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";

template Test() {

  signal input in1;
  signal input in2;
  signal output out;
    
  out <== in1 * in2;
  //out <== in1 * 1;
}

component main = Test();
