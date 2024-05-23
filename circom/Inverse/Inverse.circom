template Inverse() {
  signal input in;
  signal output out;
  signal inv;
  signal iszero;
 
  inv <- in!=0 ? 1/in : 0;
  iszero <== -in*inv + 1;
  in*iszero === 0;
  out <== (1 - iszero)*inv;
}
 
component main = Inverse();
