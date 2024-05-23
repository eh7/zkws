pragma circom 2.0.0;

template Inverse() {
  signal input in;
  signal output out;
  signal inv;

  inv <-- in!=0 ? 1/in : 0;
  out <== -in*inv +1;
  log(in); 
  log(inv); 
  //out <== inv;
}
 
component main = Inverse();
