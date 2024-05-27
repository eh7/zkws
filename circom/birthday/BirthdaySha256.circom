pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/sha256/sha256.circom";

template BirthdaySha256(){
  component SHA = Sha256(8);
  signal input date[8];
  SHA.in <== date;

  signal output date_out[256];
  date_out <== SHA.out;
}

component main = BirthdaySha256();
